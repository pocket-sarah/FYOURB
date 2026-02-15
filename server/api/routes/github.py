
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time
from services.github_scraper import GitHubScraper
from services.database import db
from services.scanner import LeakScanner

router = APIRouter(prefix="/github")

class ScrapeRequest(BaseModel):
    repo_owner: str
    repo_name: str

@router.post("/scrape")
async def scrape_github_repo(request_data: ScrapeRequest, request: Request):
    app_state = request.app.state
    scraper = GitHubScraper() # Instantiate on demand, token will be read from env

    try:
        # Perform scraping
        scrape_results = scraper.scrape_repository(request_data.repo_owner, request_data.repo_name)

        if "error" in scrape_results:
            db.log_event("GITHUB_SCRAPE_ERROR", scrape_results["error"], {"repo": f"{request_data.repo_owner}/{request_data.repo_name}"})
            return JSONResponse(status_code=400, content={"success": False, "message": scrape_results["error"]})

        # Log the scraping event
        log_message = f"GitHub repository '{request_data.repo_owner}/{request_data.repo_name}' scraped."
        db.log_event("GITHUB_SCRAPE_SUCCESS", log_message, scrape_results)

        # Scan scraped content for potential leaks
        scanner = LeakScanner()
        # Convert relevant parts of scrape_results to string for scanning
        content_to_scan = ""
        for commit in scrape_results.get("recent_commits", []):
            content_to_scan += commit.get("message", "") + " "
        
        # Add issue titles to scan content
        for issue in scrape_results.get("recent_issues", []):
            content_to_scan += issue.get("title", "") + " "

        leak_results = scanner.scan_text_for_keys(content_to_scan)
        
        db.log_event("GITHUB_SCAN_RESULT", "Scraped content scanned for leaks.", {"repo": f"{request_data.repo_owner}/{request_data.repo_name}", "leaks": leak_results})

        # AUTO-ROTATION TRIGGER
        auto_rotate_status = "no_keys_found"
        added_keys_count = 0
        
        if leak_results.get("unique_keys"):
            # Prepare the keys for the rotation service logic
            detected_keys_payload = []
            for key in leak_results["unique_keys"]:
                # Try to find which part of results it came from for logging
                source_hint = "scraped_content"
                detected_keys_payload.append({"key": key, "source": source_hint})
            
            # Execute actual rotation/injection
            added_keys_count = app_state.ai.add_keys(leak_results["unique_keys"])
            auto_rotate_status = "rotation_triggered" if added_keys_count > 0 else "keys_already_in_pool"
            
            db.log_event("AUTO_ROTATION_TRIGGER", f"Auto-rotation engaged for {request_data.repo_owner}/{request_data.repo_name}", {
                "keys_found": len(leak_results["unique_keys"]),
                "keys_added": added_keys_count
            })

        return {
            "success": True, 
            "data": scrape_results, 
            "leak_scan_results": leak_results,
            "auto_rotate": {
                "status": auto_rotate_status,
                "added_count": added_keys_count,
                "total_pool_size": len(app_state.ai.clients)
            }
        }

    except Exception as e:
        error_message = f"An unexpected error occurred during GitHub scraping: {str(e)}"
        db.log_event("GITHUB_SCRAPE_CRITICAL_ERROR", error_message, {"repo": f"{request_data.repo_owner}/{request_data.repo_name}"})
        return JSONResponse(status_code=500, content={"success": False, "message": error_message})
