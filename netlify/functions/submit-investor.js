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
    const { fullName, email, expertise, preferredRoles, background } = body;

    // Validate required fields
    if (!fullName || !email || !background) {
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
      .from('investor_submissions')
      .insert([
        {
          full_name: fullName.trim(),
          email: email.trim(),
          expertise: expertise || 'Product Strategy',
          preferred_roles: preferredRoles || [],
          background: background.trim(),
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
        from: 'Crestcode Investors <noreply@crestcode.com>',
        to: 'ccproductstudio@gmail.com',
        subject: `New Investor Application: ${fullName}`,
        html: `
          <h2>New Operator-Investor Application</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Expertise:</strong> ${expertise}</p>
          <p><strong>Preferred Roles:</strong> ${Array.isArray(preferredRoles) ? preferredRoles.join(', ') : preferredRoles}</p>
          <p><strong>Background:</strong></p>
          <p>${background}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'Crestcode Investors <noreply@crestcode.com>',
        to: email,
        subject: 'Your Application to Crestcode Operator-Investor Network',
        html: `
          <h2>Thank you for your interest!</h2>
          <p>Hi ${fullName},</p>
          <p>We've received your application to join the Crestcode Operator-Investor network.</p>
          <p>Our team reviews all applications carefully to ensure a high-signal environment for our builders and investors. We will review your profile and reach out within 48 hours.</p>
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
        message: 'Investor application submitted successfully',
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
