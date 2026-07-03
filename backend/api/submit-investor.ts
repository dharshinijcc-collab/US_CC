import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL } from '../services/email';

export async function submitInvestorHandler(req: NextRequest) {
  try {
    const data = await req.json();
    const fullName = (data.fullName || '').trim();
    const email = (data.email || '').trim();
    const expertise = (data.expertise || '').trim();
    const preferredRoles = data.preferredRoles || [];
    const background = (data.background || '').trim();

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    // 1. Insert into Supabase investor_submissions table
    const { error } = await supabaseAdmin
      .from('investor_submissions')
      .insert([{
        full_name: fullName,
        email: email,
        expertise: expertise,
        preferred_roles: preferredRoles,
        background: background
      }]);

    if (error) {
      console.error('Supabase error inserting investor:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Send confirmation email to user
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        reply_to: TEAM_NOTIFICATION_EMAIL,
        subject: 'Application Received - CrestCode Investor Circle',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #005AE2; text-align: center;">CrestCode Investor Circle</h2>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi ${fullName},</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for submitting your application to join the CrestCode Investor Circle.</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6;">We have successfully received your investor profile details. Our investment relations team will review your application and contact you directly if there is alignment.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send investor confirmation email:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Investor application submitted!' });
  } catch (err: any) {
    console.error('submit-investor API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
