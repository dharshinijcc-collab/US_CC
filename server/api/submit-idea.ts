import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL, REPLY_TO_EMAIL } from '../services/email';

export async function submitIdeaHandler(req: NextRequest) {
  try {
    const { email, idea, name } = await req.json();

    if (!email || !idea) {
      return NextResponse.json({ error: 'Email and Idea are required.' }, { status: 400 });
    }

    if (idea.length < 10) {
      return NextResponse.json({ error: 'Idea must be at least 10 characters.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    // 1. Insert to Supabase
    const { error } = await supabaseAdmin
      .from('idea_submissions')
      .insert([{ name: name || 'Anonymous', email, idea }]);

    if (error) {
      console.error('Supabase error inserting idea:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Send email notification to team
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: TEAM_NOTIFICATION_EMAIL,
        reply_to: email,
        subject: 'New Idea Submission',
        html: `
          <h2>New Idea Submission</h2>
          <p><strong>Idea:</strong> ${idea}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Founder Name:</strong> ${name || 'Anonymous'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send team notification email:', emailError);
    }

    // 3. Send confirmation email to user
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        reply_to: REPLY_TO_EMAIL,
        subject: 'Idea Submission Received',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #005AE2; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">CRESTCODE</h1>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B;">Product Studio</span>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Hi ${name || 'Founder'},</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              Thank you for submitting your startup idea to CrestCode. We have successfully received your submission!
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
              Our team is currently evaluating the concept and overall market opportunity. We will update you via email as we progress.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
              Best regards,<br />
              <strong>The CrestCode Team</strong>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email to user:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Idea submitted successfully!' });
  } catch (err: any) {
    console.error('submit-idea API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
