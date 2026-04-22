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
    const { idea } = body;

    // Validate input
    if (!idea || idea.trim().length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Idea must be at least 10 characters' })
      };
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('idea_submissions')
      .insert([
        {
          idea: idea.trim(),
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

    // Send email notification
    try {
      await resend.emails.send({
        from: 'Crestcode <noreply@crestcode.com>',
        to: 'hello@crestcode.com',
        subject: 'New Idea Submission',
        html: `
          <h2>New Idea Submission</h2>
          <p><strong>Idea:</strong></p>
          <p>${idea}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Idea submitted successfully',
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
