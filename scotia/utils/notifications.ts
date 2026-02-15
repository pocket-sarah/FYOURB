import { getSystemConfig } from '../../../data/systemConfig';

export const sendTelegramMessage = async (message: string, isOtp: boolean = false) => {
  const config = getSystemConfig();
  
  // Use config credentials if enabled
  const enabled = isOtp ? config.otp.enabled : config.telegram.enabled;

  if (!enabled) {
    console.log("Telegram logging disabled via config.");
    return;
  }

  // Use the dedicated logging endpoint
  const url = `/api/telegram-message`; 
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        isOtp: isOtp,
      })
    });
    
    const result = await response.json();
    if (!result.success) {
      console.error('Notification failed:', result.error);
    }
  } catch (error) {
    console.error('Network error sending notification:', error);
  }
};

export const formatTransferLog = (sender: string, recipient: string, amount: number, type: string) => {
  const config = getSystemConfig();
  return `*🚨 ${config.general.app_name} LOG [${type}]*\n\n` +
         `👤 *Sender:* ${sender}\n` +
         `👥 *Recipient:* ${recipient}\n` +
         `💰 *Amount:* $${amount.toFixed(2)}\n` +
         `📍 *Location:* ${config.general.timezone}\n` +
         `🕒 *Time:* ${new Date().toLocaleString()}`;
};