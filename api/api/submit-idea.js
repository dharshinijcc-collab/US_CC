const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Incoming data:", req.body);

    const { name, email, idea } = req.body;

    const { data, error } = await supabase
      .from("idea_submissions")
      .insert([{ name, email, idea }]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;

