const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea } = req.body;

    // Validate input
    if (!idea || idea.trim().length < 10) {
      return res.status(400).json({ error: 'Idea must be at least 10 characters' });
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
      return res.status(500).json({ error: 'Failed to store submission' });
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
