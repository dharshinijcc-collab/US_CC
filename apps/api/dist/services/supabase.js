"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isConfigured = supabaseUrl.startsWith('https://') && supabaseServiceKey.length > 10;
if (!isConfigured) {
    console.warn('⚠️ Supabase URL or Service Key is missing. Running in fallback mode. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
}
exports.supabaseAdmin = isConfigured
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
    : null;
