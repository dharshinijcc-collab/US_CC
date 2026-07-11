import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL } from '../services/email';

export async function submitContactHandler(req: NextRequest) {
  try {
    const data = await req.json();
    const firstName = (data.firstName || '').trim();
    const email = (data.workEmail || '').trim();
    const company = (data.company || '').trim();
    const service = (data.serviceInterest || '').trim();
    const stage = (data.projectStage || '').trim();
    const message = (data.message || '').trim();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    // 1. Insert into Supabase contact_inquiries table
    const { error } = await supabaseAdmin
      .from('contact_inquiries')
      .insert([{
        full_name: firstName,
        work_email: email,
        company_name: company,
        service_interest: service,
        project_stage: stage,
        message: message
      }]);

    if (error) {
      console.error('Supabase error inserting contact:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 1.1 Insert into unified submissions table
    try {
      await supabaseAdmin
        .from('submissions')
        .insert([{
          form_type: 'contact',
          name: firstName,
          email: email,
          company: company || null,
          payload: {
            service_interest: service,
            project_stage: stage,
            message: message
          }
        }]);
    } catch (subErr) {
      console.error('Failed to log contact form in unified submissions:', subErr);
    }

    // 2. Send confirmation email to user
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        reply_to: TEAM_NOTIFICATION_EMAIL,
        subject: 'Thank you for reaching out',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #020617;">
              Thanks for reaching out, ${firstName}!
            </h2>
            <p style="margin: 0 0 24px; color: #64748B; font-size: 15px; line-height: 1.6;">
              We've received your inquiry and our team is reviewing it now. We'll get back to you within <strong style="color:#005AE2;">1-2 business days</strong>.
            </p>

            <div style="background: #F0F7FF; border-left: 4px solid #005AE2; border-radius: 4px 12px 12px 4px; padding: 20px 24px; margin-bottom: 32px;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #005AE2; text-transform: uppercase; letter-spacing: 0.08em;">Your Submission</p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Company:</strong> ${company || 'Not specified'}</p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Service:</strong> ${service || 'Not specified'}</p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Stage:</strong> ${stage || 'Not specified'}</p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Message:</strong> ${message || 'Not specified'}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Contact form submitted!' });
  } catch (err: any) {
    console.error('submit-contact API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
