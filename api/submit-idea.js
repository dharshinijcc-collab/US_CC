const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, email, businessName, password } = req.body;
    
    // Validate input
    if (!idea || idea.trim().length < 10) {
      return res.status(400).json({ error: 'Idea must be at least 10 characters' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('idea_submissions')
      .insert([
        {
          idea: idea.trim(),
          email: email.trim(),
          business_name: businessName?.trim() || '',
          password: password || '', // In production, hash this or use Supabase Auth
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to store submission' });
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Crestcode <contact@cctps.com>',
        to: process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com',
        reply_to: email,
        subject: 'New Idea Submission',
        html: `
          <h2>New Idea Submission</h2>
          <p><strong>Idea:</strong> ${idea}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Business Name:</strong> ${businessName || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Crestcode <contact@crestcodeproductstudio.com>',
        to: email,
        reply_to: process.env.REPLY_TO_EMAIL || process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com',
        subject: 'Idea Submission Received',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #005AE2; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">CRESTCODE</h1>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B;">Product Studio</span>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Hi Founder,</h2>
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
      console.error('Confirmation email error:', emailError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Idea submitted successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
