
export type TransferStage = 'sending' | 'completed' | 'error';
// Added 'error', 'pending_list', 'manage', and 'manage_contacts' to ETransferView to fix mapping issues
export type ETransferView = 'landing' | 'main' | 'contact_picker' | 'account_picker' | 'add_contact' | 'add_warning' | 'add_security' | 'confirm_summary' | 'processing' | 'success' | 'error' | 'pending_list' | 'manage' | 'manage_contacts';
