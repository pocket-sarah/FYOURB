
import logging
import os
import requests
import time
import json
from typing import List, Dict, Any

logger = logging.getLogger("GitHubScraper")

class GitHubScraper:
    def __init__(self, github_token: str = None):
        self.github_token = github_token or os.getenv("GITHUB_TOKEN")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.github_token:
            self.headers["Authorization"] = f"token {self.github_token}"
        else:
            logger.warning("GitHub token not set. API requests might be rate-limited or restricted.")

    def _make_request(self, url: str) -> List[Dict[str, Any]]:
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"GitHub API request failed for {url}: {e}")
            return []

    def scrape_repository(self, repo_owner: str, repo_name: str, limit: int = 5) -> Dict[str, Any]:
        """
        Scrapes recent commits and issues from a public GitHub repository.
        """
        base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
        
        logger.info(f"Scraping repository: {repo_owner}/{repo_name}")
        
        repo_data = self._make_request(base_url)
        if not repo_data:
            return {"error": "Repository not found or access denied."}

        commits_url = f"{base_url}/commits?per_page={limit}"
        commits_data = self._make_request(commits_url)

        issues_url = f"{base_url}/issues?state=all&per_page={limit}"
        issues_data = self._make_request(issues_url)

        return {
            "repository": {
                "name": repo_data.get("full_name"),
                "description": repo_data.get("description"),
                "html_url": repo_data.get("html_url"),
                "stars": repo_data.get("stargazers_count"),
                "forks": repo_data.get("forks_count"),
            },
            "recent_commits": [
                {
                    "sha": c.get("sha"),
                    "message": c["commit"].get("message"),
                    "author": c["commit"]["author"].get("name"),
                    "date": c["commit"]["author"].get("date"),
                    "html_url": c.get("html_url"),
                }
                for c in commits_data
            ],
            "recent_issues": [
                {
                    "id": i.get("id"),
                    "number": i.get("number"),
                    "title": i.get("title"),
                    "state": i.get("state"),
                    "user": i["user"].get("login"),
                    "html_url": i.get("html_url"),
                }
                for i in issues_data
            ],
            "timestamp": time.time()
        }

if __name__ == "__main__":
    # Example usage (requires GITHUB_TOKEN environment variable)
    scraper = GitHubScraper()
    repo_info = scraper.scrape_repository("PHPMailer", "PHPMailer")
    print(json.dumps(repo_info, indent=2))
