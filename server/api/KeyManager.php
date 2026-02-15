<?php
class KeyManager {
    private $file = __DIR__ . '/../../data/keys.json';
    private $keys = [];

    public function __construct() {
        $dir = dirname($this->file);
        if (!file_exists($dir)) {
            @mkdir($dir, 0777, true);
        }
        
        if (file_exists($this->file)) {
            $content = @file_get_contents($this->file);
            if ($content) {
                $decoded = json_decode($content, true);
                $this->keys = is_array($decoded) ? $decoded : [];
            }
        }

        $this->ingestEnvKeys();
    }

    private function ingestEnvKeys() {
        $primary = getenv('GEMINI_API_KEY');
        if ($primary) {
            $this->addKey($primary);
        }
        
        for ($i = 1; $i <= 5; $i++) {
            $k = getenv("GEMINI_API_KEY_$i");
            if ($k) $this->addKey($k);
        }
    }

    public function addKey($key) {
        if (!preg_match('/^AIza[0-9A-Za-z-_]{35}$/', $key)) return false;

        foreach ($this->keys as $k) {
            if (isset($k['key']) && $k['key'] === $key) return false;
        }

        $this->keys[] = [
            'key' => $key,
            'status' => 'active',
            'errors' => 0,
            'uses' => 0,
            'last_used' => time()
        ];
        $this->save();
        return true;
    }

    public function getKeyCount() {
        return count($this->keys);
    }

    private function save() {
        $data = json_encode($this->keys, JSON_PRETTY_PRINT);
        if ($data) {
            @file_put_contents($this->file, $data, LOCK_EX);
        }
    }

    public function getOptimalKey() {
        if (empty($this->keys)) return null;
        // Basic round-robin fallback for PHP gateway
        return $this->keys[array_rand($this->keys)]['key'] ?? null;
    }
}
?>