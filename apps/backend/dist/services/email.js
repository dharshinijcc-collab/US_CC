"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLY_TO_EMAIL = exports.TEAM_NOTIFICATION_EMAIL = exports.FROM_EMAIL = exports.resend = void 0;
require("dotenv/config");
const resend_1 = require("resend");
const resendApiKey = process.env.RESEND_API_KEY || 're_dummy_key_for_build';
if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is missing in environment variables. Using build fallback placeholder.');
}
exports.resend = new resend_1.Resend(resendApiKey);
exports.FROM_EMAIL = process.env.FROM_EMAIL || 'Crestcode <contact@crestcodeproductstudio.com>';
exports.TEAM_NOTIFICATION_EMAIL = process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com';
exports.REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'contact@cctps.com';
