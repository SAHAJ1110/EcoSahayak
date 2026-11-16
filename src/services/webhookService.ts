import { MakeWebhookPayload } from '../types';

const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
export const isWebhookConfigured = Boolean(
  webhookUrl &&
  webhookUrl !== 'https://hook.eu2.make.com/your-custom-webhook-hash' &&
  webhookUrl.includes('make.com')
);

export interface WebhookResult {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Dispatches complaint data to Make.com scenario webhook.
 * Connects directly to Google Sheets & Looker Studio pipeline.
 * Guaranteed non-blocking: network timeout or failure will NOT abort complaint submission.
 */
export async function sendComplaintToMakeWebhook(
  payload: MakeWebhookPayload
): Promise<WebhookResult> {
  const timestamp = new Date().toISOString();

  if (!isWebhookConfigured) {
    console.info(
      'Make.com webhook is not configured with a live URL. Simulation mode active for demonstration.',
      payload
    );
    return {
      success: true,
      message: 'Demo Mode: Complaint recorded locally and formatted for Google Sheets sync.',
      timestamp,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        dispatchedAt: timestamp,
        source: 'EcoSahayak Web Client v1.0',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully forwarded complaint to Make.com / Google Sheets automation.',
        timestamp,
      };
    } else {
      return {
        success: false,
        message: `Make.com returned HTTP ${response.status}. Complaint saved locally in database.`,
        timestamp,
      };
    }
  } catch (err: any) {
    console.warn('Webhook transmission error (saved in database safely):', err);
    return {
      success: false,
      message: 'External webhook offline or blocked by browser CORS. Ticket safely preserved.',
      timestamp,
    };
  }
}
