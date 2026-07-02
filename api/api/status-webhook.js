const { Resend } = require('resend');

// Initialize Resend with key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

async function handler(req, res) {
  // Only allow POST requests (Supabase Webhooks send POST requests)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Supabase Webhook Triggered. Body:", req.body);

    const { record, old_record, type, table } = req.body;

    if (!record || !record.email) {
      console.log("No record or email found in webhook payload.");
      return res.json({ success: true, message: 'Skipped: No record or email' });
    }

    // Only send email if the status column has changed
    const oldStatus = old_record ? old_record.status : null;
    const newStatus = record.status;

    if (oldStatus === newStatus) {
      console.log(`Status unchanged (${newStatus}). Skipping email.`);
      return res.json({ success: true, message: 'Skipped: Status unchanged' });
    }

    console.log(`Status changed from "${oldStatus}" to "${newStatus}" for ${record.email}. Sending email...`);

    // Determine custom message based on the new status
    let statusDescription = 'Your venture project status has been updated. Our team is actively moving it forward.';
    let actionCTA = '';

    if (newStatus === 'Under Review') {
      statusDescription = 'Our product strategists and engineers are currently reviewing your idea and requirements to refine the scope.';
    } else if (newStatus === 'MVP Scoping') {
      statusDescription = 'We are now translating your requirements into a detailed MVP roadmap and technical specification sheet.';
    } else if (newStatus === 'Approved') {
      statusDescription = 'Excellent news! Your venture is approved for build phase. We are ready to begin development.';
      actionCTA = `
        <div style="margin: 24px 0;">
          <a href="https://crestcodeproductstudio.com/contact" style="background-color: #005AE2; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Schedule Kick-off Call</a>
        </div>
      `;
    } else if (newStatus === 'On Hold') {
      statusDescription = 'Your venture scoping is currently on hold. If you have any questions or updates, please reach out to us.';
    }

    // Send email to user
    const emailResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Crestcode <contact@crestcodeproductstudio.com>',
      to: record.email,
      subject: `Project Update: Status is now "${newStatus}"`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #005AE2; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">CRESTCODE</h1>
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B;">Product Studio</span>
          </div>
          
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Hello ${record.name || 'Founder'},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
            We wanted to update you on your venture request. The current status of your project has been updated:
          </p>

          <div style="background-color: #EFF6FF; border-left: 4px solid #005AE2; padding: 16px; margin: 20px 0; border-radius: 6px;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #005AE2; font-weight: 700; margin-bottom: 4px;">Current Status</div>
            <div style="font-size: 18px; font-weight: 800; color: #1E3A8A;">${newStatus}</div>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
            ${statusDescription}
          </p>

          ${actionCTA}

          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-top: 32px; margin-bottom: 0;">
            Best regards,<br />
            <strong>The CrestCode Team</strong>
          </p>
          
          <hr style="border: 0; border-top: 1px solid #F1F5F9; margin: 32px 0 16px 0;" />
          <p style="font-size: 11px; color: #94A3B8; text-align: center; margin: 0;">
            This is an automated update for your submission. Replying to this email will reach our support team directly.
          </p>
        </div>
      `
    });

    console.log("Email sent successfully. Result:", emailResult);
    res.json({ success: true, emailId: emailResult.id });

  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
