const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const Busboy = require('busboy');

// Initialize Supabase (service role key for storage uploads)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const RESUME_BUCKET = 'resumes';

/**
 * Parse multipart/form-data from a Netlify event using Busboy.
 * Returns { fields, file: { buffer, filename, mimetype } | null }
 */
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let file = null;

    const bb = Busboy({
      headers: { 'content-type': event.headers['content-type'] },
      limits: { fileSize: MAX_BYTES + 1 },
    });

    bb.on('field', (name, val) => { fields[name] = val; });

    bb.on('file', (name, stream, info) => {
      if (name !== 'resume') { stream.resume(); return; }
      const chunks = [];
      stream.on('data', (d) => chunks.push(d));
      stream.on('end', () => {
        file = { buffer: Buffer.concat(chunks), filename: info.filename, mimetype: info.mimeType };
      });
    });

    bb.on('finish', () => resolve({ fields, file }));
    bb.on('error', reject);

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '');
    bb.write(body);
    bb.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const contentType = event.headers['content-type'] || '';
    let firstName, email, interest, linkedin, resumeFile = null;

    if (contentType.includes('multipart/form-data')) {
      const parsed = await parseMultipart(event);
      ({ firstName, email, interest, linkedin } = parsed.fields);
      resumeFile = parsed.file;
    } else {
      const body = JSON.parse(event.body || '{}');
      ({ firstName, email, interest, linkedin } = body);
    }

    // Validate required fields
    if (!firstName || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    // Upload resume to Supabase Storage (if provided)
    let resume_url = null;
    if (resumeFile && resumeFile.buffer.length > 0) {
      if (!ALLOWED_MIME.includes(resumeFile.mimetype)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Only PDF, DOC, or DOCX files are allowed.' }) };
      }
      if (resumeFile.buffer.length > MAX_BYTES) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Resume file must be under 5 MB.' }) };
      }

      const ext = resumeFile.filename.split('.').pop().toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(uniqueName, resumeFile.buffer, {
          contentType: resumeFile.mimetype,
          upsert: true,
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        // Non-fatal: continue without resume URL
      } else {
        const { data: urlData } = supabase.storage
          .from(RESUME_BUCKET)
          .getPublicUrl(uniqueName);
        resume_url = urlData?.publicUrl || null;
      }
    }

    let interestVal = (interest || 'engineer').trim();
    if (interestVal.toLowerCase() === 'engineering') {
      interestVal = 'engineer';
    }

    // Store in Supabase DB
    const record = {
      full_name: firstName.trim(),
      email: email.trim(),
      interest_area: interestVal,
      linkedin_url: linkedin?.trim() || '',
      created_at: new Date().toISOString(),
    };
    if (resume_url) record.resume_url = resume_url;

    const { data, error: dbError } = await supabase
      .from('talent_pool')
      .insert([record])
      .select();

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to store submission' }) };
    }

    // Team notification email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Crestcode <contact@cctps.com>',
        to: process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com',
        reply_to: email,
        subject: `New Talent Submission: ${firstName} - ${interestVal}`,
        html: `
          <h2>New Talent Pool Submission</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${interestVal}</p>
          <p><strong>LinkedIn:</strong> ${linkedin || 'Not provided'}</p>
          ${resume_url ? `<p><strong>Resume:</strong> <a href="${resume_url}">Download</a></p>` : ''}
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (emailError) {
      console.error('Team email error:', emailError);
    }

    // Confirmation email to applicant
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Crestcode <contact@cctps.com>',
        to: email,
        reply_to: process.env.REPLY_TO_EMAIL || process.env.TEAM_NOTIFICATION_EMAIL || 'contact@cctps.com',
        subject: 'Welcome to the Crestcode Talent Pool',
        html: `
          <h2>Thanks for joining our talent pool!</h2>
          <p>Hi ${firstName},</p>
          <p>We've received your interest in joining the Crestcode team as part of our <strong>${interestVal}</strong> department.${resume_url ? ' Your resume has been received.' : ''}</p>
          <p>While we may not have an immediate opening that matches your profile, we'll keep your information on file and reach out if a suitable opportunity arises.</p>
          <p>Stay tuned and keep building!</p>
          <p>Best regards,<br>The Crestcode Team</p>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Joined talent pool successfully', data: data[0] }),
    };

  } catch (error) {
    console.error('Server error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
