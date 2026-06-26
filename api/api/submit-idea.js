const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Incoming data:", req.body);

    const { email, idea, name } = req.body;

    const { data, error } = await supabase
      .from("idea_submissions")
      .insert([{ name: name || 'Anonymous', email, idea }]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    // Send email notification to team
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
          <p><strong>Founder Name:</strong> ${name || 'Anonymous'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
