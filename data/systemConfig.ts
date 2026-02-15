export interface SystemConfig {
  general: {
    sender_name: string;
    sendername: string; // Legacy compat
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
  };
  email_relay_config: {
    php_enabled: boolean;
    python_enabled: boolean;
    nodemailer_enabled: boolean;
    strategy: 'failover' | 'random' | 'primary_only' | 'python_only';
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
    accounts: { name: string; balance: number; type: 'banking' | 'credit'; number: string }[];
  };
  td_config: {
    username: string;
    password: string;
    account_holder: string;
    autodeposit_enabled: boolean;
    accounts: { name: string; balance: number; type: 'banking' | 'credit'; number: string }[];
  };
  bmo_config: {
    username: string;
    password: string;
    account_holder: string;
    accounts: { name: string; balance: number; type: 'banking' | 'credit'; number: string }[];
  };
  cibc_config: {
    username: string;
    password: string;
    account_holder: string;
    accounts: { name: string; balance: number; type: 'banking' | 'credit'; number: string }[];
  };
  servus_config: {
    username: string;
    password: string;
    account_holder: string;
    accounts: { name: string; balance: number; type: 'banking' | 'credit'; number: string }[];
  };
  modes: {
    hacker_mode: boolean;
    god_mode: boolean;
    developer_mode: boolean;
    experimental_ui: boolean;
  };
  display: {
    is_dark_mode: boolean;
    wallpaper_url: string;
    font_size: 'small' | 'default' | 'large';
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
    from_emails?: string[]; // Added
    encryption: string;
    from_name?: string;
    timeout_jitter_sec?: number; // Added
  };
  smtp1: {
    host: string;
    port: number;
    username: string;
    password: string;
    from_email?: string; // Added
    from_emails?: string[]; // Added
    encryption: string;
    from_name?: string; // Added
    timeout_jitter_sec?: number; // Added
  };
  dkim?: { // Made optional for fallback if dkim_keys is preferred
    domain: string;
    selector: string;
    private_key: string;
    passphrase: string;
    identity?: string;
    copy_header_fields?: boolean;
    extra_headers?: string[];
  };
  dkim_keys?: { // Added for rotation
    domain: string;
    selector: string;
    private_key: string;
    passphrase: string;
    identity?: string;
    copy_header_fields?: boolean;
    extra_headers?: string[];
  }[];
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
  transfer_settings: {
    transfer_expiry_days: number;
    max_amount: number;
    allow_overdraft: boolean;
    smtp_timeout_sec: number; // Added
  };
  network_internet: {
    wifi_enabled: boolean;
    mobile_data_enabled: boolean;
    airplane_mode: boolean;
    hotspot_enabled: boolean;
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
  features: {
    ledger_enabled: boolean;
    dkim_signing_enabled: boolean;
    rate_limiting_enabled: boolean;
    bounce_handling_enabled: boolean;
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
    find_my_device_enabled: boolean;
    screen_lock_type: string;
    fingerprint_enabled: boolean;
    face_unlock_enabled: boolean;
    last_security_check: string;
    security_updates_auto: boolean;
    token_lock_enabled: boolean;
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
  email_settings: { // Added
    default_format: string;
    html_template_name: string;
    x_mailer_override: string;
    default_priority: string;
    message_id_domains: string[];
    templates_pool: string[];
    client_signatures: string[];
  };
}

const DEFAULT_CONFIG: SystemConfig = {
  general: {
    sender_name: 'JENNIFER EDWARDS',
    sendername: 'JENNIFER EDWARDS',
    app_name: 'RBOS',
    app_url: '',
    base_path: '',
    timezone: 'America/Edmonton',
    debug_mode: false,
    admin_user: 'admin',
    admin_pass_hash: '',
    admin_email: 'admin@rros.net',
    session_timeout_sec: 900,
    csrf_token_length: 32,
    cookie_secure: true,
    cookie_httponly: true,
    cookie_samesite: 'Lax',
    rate_limit_enabled: true,
    rate_limit_per_ip_per_min: 60,
    encryption_key: 'a3f91b6cd024e8c29b76a149efcc5d42',
  },
  email_relay_config: {
    php_enabled: true,
    python_enabled: true,
    nodemailer_enabled: false,
    strategy: 'failover',
  },
  scotia_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    address: '3037 DRUMLOCH AVE\nOAKVILLE ON\nL5C 3W5',
    employment: {
        employer: 'GOVERNMENT OF ALBERTA',
        job_title: 'Senior Analyst',
        annual_income: 92500
    },
    accounts: [
        { name: 'Basic Banking Plan', balance: 7482.05, type: 'banking', number: '....1029' },
        { name: 'Momentum PLUS', balance: 18293.03, type: 'banking', number: '....3847' },
        { name: 'Momentum Savings', balance: 3137.16, type: 'banking', number: '....9283' },
        { name: 'Scotiabank Gold Amex Card', balance: 455.00, type: 'credit', number: '....4001' },
        { name: 'Scotiabank Passport Visa Infinite card', balance: 3769.49, type: 'credit', number: '....5502' }
    ]
  },
  td_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    autodeposit_enabled: false,
    accounts: [
        { name: 'TD EveryDay Chequing', balance: 10153.10, type: 'banking', number: '....1035' },
        { name: 'TD EveryDay Savings', balance: 3153.10, type: 'banking', number: '....2291' },
        { name: 'TD First Class Travel Visa Infinite* Card', balance: 926.84, type: 'credit', number: '....4492' }
    ]
  },
  bmo_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    accounts: [
        { name: 'BMO Performance Chequing', balance: 12450.50, type: 'banking', number: '....8271' },
        { name: 'BMO Premium Savings', balance: 5200.00, type: 'banking', number: '....3391' },
        { name: 'BMO World Elite Mastercard', balance: 1240.21, type: 'credit', number: '....1102' }
    ]
  },
  cibc_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    accounts: [
        { name: 'CIBC Smart Account', balance: 8900.75, type: 'banking', number: '....4482' },
        { name: 'CIBC eAdvantage Savings', balance: 15200.00, type: 'banking', number: '....9921' },
        { name: 'CIBC Aventura Visa Infinite', balance: 3450.12, type: 'credit', number: '....0029' }
    ]
  },
  servus_config: {
    username: 'albertafarms',
    password: 'password123',
    account_holder: 'JENNIFER EDWARDS',
    accounts: [
        { name: 'Servus No-Fee Chequing', balance: 4200.33, type: 'banking', number: '....1029' },
        { name: 'Servus Wealth Builder', balance: 25000.00, type: 'banking', number: '....8821' },
        { name: 'Servus Mastercard Gold', balance: 500.00, type: 'credit', number: '....4839' }
    ]
  },
  modes: {
    hacker_mode: false,
    god_mode: false,
    developer_mode: false,
    experimental_ui: false
  },
  display: {
    is_dark_mode: true,
    wallpaper_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    font_size: 'default'
  },
  contact: {
    support_email: 'support@rros.net',
    reply_to_email: 'support@rros.net',
    reply_to_name: 'RR-OS Team',
    bounce_email: 'bounces@rros.net',
    unsubscribe: '',
    unsubscribe_email: '',
    physical_address: 'Neural Heights, Cloud City',
    organization: 'Neural Systems Corp',
    feedback_id: 'rros-feedback-2024',
  },
  smtp: {
    host: 'smtp.rros.net',
    port: 587,
    username: 'relay@rros.net',
    password: '',
    from_email: 'relay@rros.net',
    from_emails: ['relay@rros.net', 'noreply@rros.net'],
    encryption: 'tls',
    timeout_jitter_sec: 10,
  },
  smtp1: {
    host: 'smtp1.rros.net',
    port: 587,
    username: 'relay1@rros.net',
    password: '',
    from_email: 'relay1@rros.net',
    from_emails: ['relay1@rros.net', 'support@rros.net'],
    encryption: 'tls',
    timeout_jitter_sec: 5,
  },
  dkim_keys: [ // Added for rotation
    {
        domain: 'abfarms.ca',
        selector: 'selector1',
        private_key: 'config/dkim/private.key', // Relative to server/
        passphrase: '',
        identity: 'accounting@abfarms.ca',
    },
    {
        domain: 'projectsarah.net',
        selector: 'ps_key2',
        private_key: 'config/dkim/projectsarah_private.key', // Relative to server/
        passphrase: 'ps_pass',
        identity: 'noreply@projectsarah.net',
    },
  ],
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
  transfer_settings: {
    transfer_expiry_days: 30,
    max_amount: 10000.0,
    allow_overdraft: false,
    smtp_timeout_sec: 25,
  },
  network_internet: {
    wifi_enabled: true,
    mobile_data_enabled: true,
    airplane_mode: false,
    hotspot_enabled: false,
    vpn_enabled: false,
    data_saver_enabled: false,
    data_usage_gb: 4.2,
    preferred_network_type: '5G',
    private_dns_mode: 'automatic',
  },
  connected_devices: {
    bluetooth_enabled: true,
    nfc_enabled: true,
    cast_enabled: false,
    usb_mode: 'file_transfer',
    paired_devices: ['RR-BUDS X1', 'Core Display'],
    nearby_share_enabled: true,
  },
  features: {
    ledger_enabled: true,
    dkim_signing_enabled: true,
    rate_limiting_enabled: true,
    bounce_handling_enabled: true,
  },
  display_options: {
    dark_mode: true,
    adaptive_brightness: true,
    screen_timeout_sec: 30,
    font_size: 'default',
    wallpaper_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    refresh_rate_hz: 90,
    night_light_enabled: false,
    screen_saver_enabled: false,
    color_mode: 'adaptive',
  },
  sound_vibration: {
    media_volume: 75,
    notification_volume: 60,
    ring_volume: 80,
    alarm_volume: 70,
    vibration_enabled: true,
    do_not_disturb_enabled: false,
    haptic_feedback_enabled: true,
    ringtone: 'Digital Sunrise',
    notification_sound: 'Neural Ping',
  },
  storage_settings: {
    total_space_gb: 256,
    used_space_gb: 42.8,
    smart_storage_enabled: true,
    temporary_files_gb: 1.2,
    system_files_gb: 18.5,
    app_data_gb: 12.4,
    photos_videos_gb: 10.7,
  },
  privacy_security: {
    camera_access: true,
    microphone_access: true,
    location_access: true,
    ad_id_reset_enabled: false,
    google_location_accuracy: true,
    find_my_device_enabled: true,
    screen_lock_type: 'pin',
    fingerprint_enabled: true,
    face_unlock_enabled: false,
    last_security_check: 'Oct 24, 2024',
    security_updates_auto: true,
    token_lock_enabled: false,
  },
  accounts_google: {
    google_account: 'admin@rros.net',
    auto_sync_data: true,
    backup_enabled: true,
    device_name: 'RR-CORE-X1',
    personal_safety_enabled: true,
  },
  accessibility_wellbeing: {
    talkback_enabled: false,
    magnification_enabled: false,
    color_correction_enabled: false,
    focus_mode_enabled: false,
    app_timers_enabled: true,
    bedtime_mode_enabled: false,
    grayscale_enabled: false,
  },
  system_preferences: {
    language: 'English (Canada)',
    gestures_enabled: true,
    system_navigation: 'gestures',
    date_time_auto: true,
    time_format_24hr: true,
    system_updates_auto: true,
    last_update_check: 'Just now',
    reset_options_available: false,
  },
  about_phone: {
    model_name: 'RBOS CORE X1',
    android_version: '14.0.0-MODULAR',
    build_number: 'RBOS.241024.001',
    serial_number: 'SN-4839-2938-1029',
    uptime_days: 12,
    kernel_version: '6.1.0-neural-core',
    baseband_version: 'R1-V22-4-TX',
  },
  email_settings: {
    default_format: 'html',
    html_template_name: 'InteracNotice.html',
    x_mailer_override: 'remove',
    default_priority: 'normal',
    message_id_domains: ['rros.net', 'projectsarah.net', 'securemail.com'],
    templates_pool: ['Deposit.html', 'DepositAlt.html', 'GenericTransfer.html', 'request.html', 'notification.html', 'cancellation.html'],
    client_signatures: [
        'NeuralLink v1.0',
        'SARAH-OS Client v2.1',
        'QuantumMail Agent v3.0'
    ],
  },
};

const STORAGE_KEY = 'rros_system_config_v4';

export const getSystemConfig = (): SystemConfig => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Deep merge with defaults to ensure new properties are added
      return { 
          ...DEFAULT_CONFIG, 
          ...parsed,
          general: { ...DEFAULT_CONFIG.general, ...(parsed.general || {}) },
          email_relay_config: { ...DEFAULT_CONFIG.email_relay_config, ...(parsed.email_relay_config || {}) },
          scotia_config: { ...DEFAULT_CONFIG.scotia_config, ...(parsed.scotia_config || {}) },
          td_config: { ...DEFAULT_CONFIG.td_config, ...(parsed.td_config || {}) },
          bmo_config: { ...DEFAULT_CONFIG.bmo_config, ...(parsed.bmo_config || {}) },
          cibc_config: { ...DEFAULT_CONFIG.cibc_config, ...(parsed.cibc_config || {}) },
          servus_config: { ...DEFAULT_CONFIG.servus_config, ...(parsed.servus_config || {}) },
          modes: { ...DEFAULT_CONFIG.modes, ...(parsed.modes || {}) },
          display: { ...DEFAULT_CONFIG.display, ...(parsed.display || {}) },
          privacy_security: { ...DEFAULT_CONFIG.privacy_security, ...(parsed.privacy_security || {}) },
          smtp: { ...DEFAULT_CONFIG.smtp, ...(parsed.smtp || {}) },
          smtp1: { ...DEFAULT_CONFIG.smtp1, ...(parsed.smtp1 || {}) },
          dkim_keys: parsed.dkim_keys || DEFAULT_CONFIG.dkim_keys,
          email_settings: { ...DEFAULT_CONFIG.email_settings, ...(parsed.email_settings || {}) }
      };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

export const saveSystemConfig = (config: SystemConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent('system_config_updated', { detail: config }));
};