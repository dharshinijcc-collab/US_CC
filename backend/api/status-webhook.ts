import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL } from '../services/email';

export async function statusWebhookHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { record, old_record, type, table } = body;

    console.log(`[Status Webhook] Received webhook event. Type: ${type}, Table: ${table}`);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    // Guard: Only process UPDATE events on idea_submissions
    if (type !== 'UPDATE') {
      return NextResponse.json({ success: true, message: 'Ignored: Event is not an UPDATE' });
    }

    if (!record || !record.id || !record.email) {
      return NextResponse.json({ success: true, message: 'Ignored: Missing record details or email' });
    }

    const rawOldStatus = old_record ? old_record.status : null;
    const oldStatus = (!rawOldStatus) ? 'submitted' : rawOldStatus;
    const newStatus = record.status;
    const name = record.name || 'Founder';

    console.log(`[Status Webhook] Status changed detection. rawOldStatus: ${rawOldStatus}, oldStatus (normalized): ${oldStatus}, newStatus: ${newStatus}`);

    // 1. Guard: Only proceed if status actually changed
    if (rawOldStatus === newStatus) {
      console.log(`[Status Webhook] Status did not change (raw old: ${rawOldStatus} === new: ${newStatus}). Skipping.`);
      return NextResponse.json({ success: true, message: 'Skipped: Status unchanged' });
    }

    // 2. Guard: Prevent duplicate emails for the same status (Idempotency)
    if (record.notification_type === newStatus) {
      console.log(`[Status Webhook] Notification for "${newStatus}" already sent. Skipping.`);
      return NextResponse.json({ success: true, message: 'Skipped: Notification already sent' });
    }

    // 3. Define email templates based on transitions
    let emailSubject = '';
    let emailHtml = '';
    let isTransitionValid = false;

    // Transition A: submitted → under_review
    if (oldStatus === 'submitted' && newStatus === 'under_review') {
      isTransitionValid = true;
      emailSubject = 'Your Idea Is Under Review';
      emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0F172A;">Hi ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Thank you for submitting your idea.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Our team has started reviewing your submission and is currently evaluating the opportunity, market, and product potential.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            We'll keep you updated on the next steps.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
            Regards,<br />
            <strong>CrestCode Team</strong>
          </p>
        </div>
      `;
    }
    // Transition B: submitted / under_review → reviewed
    else if ((oldStatus === 'submitted' || oldStatus === 'under_review') && newStatus === 'reviewed') {
      isTransitionValid = true;
      emailSubject = 'Your Idea Has Been Reviewed';
      emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0F172A;">Hi ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Thank you for submitting your idea to CrestCode.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Our team has completed the initial review of your submission.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            We've evaluated the concept, market opportunity, and overall potential based on the information provided.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            If further discussion is required, a member of our team may reach out shortly.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            Thank you for sharing your vision with us.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
            Regards,<br />
            <strong>CrestCode Team</strong>
          </p>
        </div>
      `;
    }
    // Transition C: reviewed → accepted
    else if (oldStatus === 'reviewed' && newStatus === 'accepted') {
      isTransitionValid = true;
      emailSubject = 'Your Idea Has Been Selected For Further Discussion';
      emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0F172A;">Hi ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            We're pleased to inform you that your idea has been selected for further evaluation.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            We believe the concept shows potential and would like to explore next steps with you.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            A member of the CrestCode team will contact you shortly to schedule a discussion.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
            Regards,<br />
            <strong>CrestCode Team</strong>
          </p>
        </div>
      `;
    }
    // Transition D: reviewed → rejected
    else if (oldStatus === 'reviewed' && newStatus === 'rejected') {
      isTransitionValid = true;
      emailSubject = 'Update Regarding Your Submission';
      emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0F172A;">Hi ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Thank you for taking the time to share your idea with CrestCode.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            After careful review, we will not be moving forward with the submission at this time.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            We sincerely appreciate your interest and encourage you to continue developing your ideas and innovations.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            We wish you success in your journey.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
            Regards,<br />
            <strong>CrestCode Team</strong>
          </p>
        </div>
      `;
    }

    if (!isTransitionValid) {
      console.log(`[Status Webhook] No valid transition matched (${oldStatus} -> ${newStatus}). Skipping notification.`);
      return NextResponse.json({ success: true, message: 'Skipped: No valid transition matched' });
    }

    // 4. Send the email via Resend
    console.log(`[Status Webhook] Sending email to ${record.email} (Subject: "${emailSubject}")`);
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: record.email,
      subject: emailSubject,
      html: emailHtml
    });

    console.log(`[Status Webhook] Resend API success. Email ID: ${emailResult.data?.id}`);

    // 5. Log details back to Supabase to update metadata columns
    console.log(`[Status Webhook] Logging metadata back to Supabase for record ${record.id}`);
    const { error: dbError } = await supabaseAdmin
      .from('idea_submissions')
      .update({
        status_updated_at: new Date().toISOString(),
        last_notification_sent: new Date().toISOString(),
        notification_type: newStatus
      })
      .eq('id', record.id);

    if (dbError) {
      console.error(`[Status Webhook] Supabase update logging error:`, dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    console.log(`[Status Webhook] Logging complete for record ${record.id}`);
    return NextResponse.json({ success: true, emailId: emailResult.data?.id });

  } catch (err: any) {
    console.error("[Status Webhook] Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
