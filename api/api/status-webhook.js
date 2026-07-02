const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase Admin with service role key (required to bypass RLS and perform updates)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function handler(req, res) {
  // Only allow POST requests (Supabase Webhooks send POST requests)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { record, old_record, type, table } = req.body;

    console.log(`[Status Webhook] Received webhook event. Type: ${type}, Table: ${table}`);

    // Guard: Only process UPDATE events on idea_submissions
    if (type !== 'UPDATE') {
      return res.json({ success: true, message: 'Ignored: Event is not an UPDATE' });
    }

    if (!record || !record.id || !record.email) {
      return res.json({ success: true, message: 'Ignored: Missing record details or email' });
    }

    const oldStatus = old_record ? old_record.status : null;
    const newStatus = record.status;
    const name = record.name || 'Founder';

    // 1. Guard: Only proceed if status actually changed
    if (oldStatus === newStatus) {
      console.log(`[Status Webhook] Status did not change (${newStatus}). Skipping.`);
      return res.json({ success: true, message: 'Skipped: Status unchanged' });
    }

    // 2. Guard: Prevent duplicate emails for the same status (Idempotency)
    if (record.notification_type === newStatus) {
      console.log(`[Status Webhook] Notification for "${newStatus}" already sent. Skipping.`);
      return res.json({ success: true, message: 'Skipped: Notification already sent' });
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
      return res.json({ success: true, message: 'Skipped: No valid transition matched' });
    }

    // 4. Send the email via Resend
    console.log(`[Status Webhook] Sending email to ${record.email} (Subject: "${emailSubject}")`);
    const emailResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Crestcode <contact@crestcodeproductstudio.com>',
      to: record.email,
      subject: emailSubject,
      html: emailHtml
    });

    console.log(`[Status Webhook] Resend API success. Email ID: ${emailResult.id}`);

    // 5. Log details back to Supabase to update metadata columns
    console.log(`[Status Webhook] Logging metadata back to Supabase for record ${record.id}`);
    const { error: dbError } = await supabase
      .from('idea_submissions')
      .update({
        status_updated_at: new Date().toISOString(),
        last_notification_sent: new Date().toISOString(),
        notification_type: newStatus
      })
      .eq('id', record.id);

    if (dbError) {
      console.error(`[Status Webhook] Supabase update logging error:`, dbError);
      return res.status(500).json({ error: dbError.message });
    }

    console.log(`[Status Webhook] Logging complete for record ${record.id}`);
    return res.json({ success: true, emailId: emailResult.id });

  } catch (err) {
    console.error("[Status Webhook] Webhook handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
