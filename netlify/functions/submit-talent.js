const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { firstName, email, interest, linkedin } = body;

    // Validate required fields
    if (!firstName || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('talent_submissions')
      .insert([
        {
          full_name: firstName.trim(),
          email: email.trim(),
          interest: interest || 'General',
          linkedin_url: linkedin?.trim() || '',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to store submission' })
      };
    }

    // Send email notification to team
    try {
      await resend.emails.send({
        from: 'Crestcode Careers <noreply@crestcode.com>',
        to: 'hello@crestcode.com',
        subject: `New Talent Pool Entry: ${firstName} - ${interest}`,
        html: `
          <h2>New Talent Pool Submission</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <p><strong>LinkedIn:</strong> ${linkedin || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'Crestcode Careers <noreply@crestcode.com>',
        to: email,
        subject: 'Welcome to the Crestcode Talent Pool',
        html: `
          <h2>Thanks for joining our talent pool!</h2>
          <p>Hi ${firstName},</p>
          <p>We've received your interest in joining the Crestcode team as part of our <strong>${interest}</strong> department.</p>
          <p>While we may not have an immediate opening that matches your profile, we'll keep your information on file and reach out if a suitable opportunity arises.</p>
          <p>Stay tuned and keep building!</p>
          <p>Best regards,<br>The Crestcode Team</p>
        `
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Joined talent pool successfully',
        data: data[0]
      })
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
