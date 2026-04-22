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
    const { firstName, workEmail, company, serviceInterest, projectStage, message } = body;

    // Validate required fields
    if (!firstName || !workEmail || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          first_name: firstName.trim(),
          work_email: workEmail.trim(),
          company: company?.trim() || '',
          service_interest: serviceInterest || 'Idea Validation',
          project_stage: projectStage || 'Discovery',
          message: message.trim(),
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
        from: 'Crestcode <noreply@crestcode.com>',
        to: 'hello@crestcode.com',
        subject: `New Contact: ${firstName} - ${serviceInterest}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${workEmail}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Service Interest:</strong> ${serviceInterest}</p>
          <p><strong>Project Stage:</strong> ${projectStage}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'Crestcode <noreply@crestcode.com>',
        to: workEmail,
        subject: 'Thank you for contacting Crestcode',
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${firstName},</p>
          <p>We've received your message and our team will review it within 24 hours.</p>
          <p><strong>Your inquiry:</strong> ${serviceInterest}</p>
          <p>We'll get back to you soon!</p>
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
        message: 'Contact form submitted successfully',
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
