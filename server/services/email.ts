import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_dummy_key_for_build';

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is missing in environment variables. Using build fallback placeholder.');
}

export const resend = new Resend(resendApiKey);

export const FROM_EMAIL = process.env.FROM_EMAIL || 'Crestcode <contact@crestcodeproductstudio.com>';
export const TEAM_NOTIFICATION_EMAIL = process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com';
export const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'contact@cctps.com';
