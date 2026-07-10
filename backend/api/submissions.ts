import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL } from '../services/email';
import jwt from 'jsonwebtoken';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

// ── Auth Helper ──────────────────────────────────────────────
async function verifyAdminToken(req: NextRequest): Promise<string | null> {
  if (!G_SECRET_KEY) {
    console.error('Server configuration error: G_SECRET_KEY is missing');
    return null;
  }
  try {
    let token = req.cookies.get('admin-token')?.value || '';
    if (!token) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    if (!token) return null;
    const decoded = jwt.verify(token, G_SECRET_KEY) as any;
    if (!decoded || !decoded.email) return null;

    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('email')
      .eq('email', decoded.email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data.email;
  } catch (err) {
    return null;
  }
}

// ── GET Submissions (with search, filters, pagination) ────────
export async function getSubmissionsHandler(req: NextRequest) {
  try {
    const adminEmail = await verifyAdminToken(req);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get('formType') || 'all';
    const status = searchParams.get('status') || 'all';
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const fromOffset = (page - 1) * limit;
    const toOffset = fromOffset + limit - 1;

    let dbQuery = supabaseAdmin
      .from('submissions')
      .select('*', { count: 'exact' });

    if (formType !== 'all') {
      dbQuery = dbQuery.eq('form_type', formType);
    }
    if (status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);
    }

    // Sort by created_at desc
    dbQuery = dbQuery.order('created_at', { ascending: false }).range(fromOffset, toOffset);

    const { data, count, error } = await dbQuery;

    if (error) throw error;

    // Fetch Stats counts
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('submissions')
      .select('status, form_type');

    if (statsError) throw statsError;

    const stats = {
      total: statsData.length,
      new: statsData.filter(s => s.status === 'new').length,
      under_review: statsData.filter(s => s.status === 'under_review').length,
      need_info: statsData.filter(s => s.status === 'need_more_information').length,
      approved: statsData.filter(s => s.status === 'approved').length,
      rejected: statsData.filter(s => s.status === 'rejected').length,
      contacted: statsData.filter(s => s.status === 'contacted').length,
    };

    return NextResponse.json({
      status: 'success',
      payload: {
        submissions: data || [],
        count: count || 0,
        stats
      }
    });

  } catch (err: any) {
    console.error('getSubmissionsHandler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── GET Submission Details with notes & history timeline ─────
export async function getSubmissionDetailsHandler(req: NextRequest) {
  try {
    const adminEmail = await verifyAdminToken(req);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    // 1. Fetch submission
    const { data: submission, error: subErr } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (subErr) throw subErr;
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 2. Fetch notes
    const { data: notes, error: notesErr } = await supabaseAdmin
      .from('submission_notes')
      .select('*')
      .eq('submission_id', id)
      .order('created_at', { ascending: false });

    if (notesErr) throw notesErr;

    // 3. Fetch status history
    const { data: history, error: histErr } = await supabaseAdmin
      .from('submission_status_history')
      .select('*')
      .eq('submission_id', id)
      .order('changed_at', { ascending: false });

    if (histErr) throw histErr;

    return NextResponse.json({
      status: 'success',
      payload: {
        submission,
        notes: notes || [],
        history: history || []
      }
    });

  } catch (err: any) {
    console.error('getSubmissionDetailsHandler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── UPDATE Submission status, notes, or reviewer ─────────────
export async function updateSubmissionHandler(req: NextRequest) {
  try {
    const adminEmail = await verifyAdminToken(req);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id, status, assigned_reviewer, internal_notes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    // Get current state
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!current) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const prevStatus = current.status;
    const isStatusChanged = status && status !== prevStatus;

    // Update submission
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (status) updateData.status = status;
    if (assigned_reviewer !== undefined) updateData.assigned_reviewer = assigned_reviewer;
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes;

    const { error: updateErr } = await supabaseAdmin
      .from('submissions')
      .update(updateData)
      .eq('id', id);

    if (updateErr) throw updateErr;

    // Write history audit log if status changed
    if (isStatusChanged) {
      const { error: histErr } = await supabaseAdmin
        .from('submission_status_history')
        .insert([{
          submission_id: id,
          previous_status: prevStatus,
          current_status: status,
          changed_by: adminEmail,
          internal_notes: internal_notes || `Status transitioned from ${prevStatus} to ${status}`
        }]);

      if (histErr) throw histErr;

      // Trigger Workflow Email notification (Reusing existing templates infrastructure)
      await sendWorkflowEmail(current.email, current.name, current.form_type, prevStatus, status, internal_notes);
    }

    return NextResponse.json({
      status: 'success',
      payload: { message: 'Submission updated successfully!' }
    });

  } catch (err: any) {
    console.error('updateSubmissionHandler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── ADD Submission Note ──────────────────────────────────────
export async function addSubmissionNoteHandler(req: NextRequest) {
  try {
    const adminEmail = await verifyAdminToken(req);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { submission_id, note } = await req.json();

    if (!submission_id || !note) {
      return NextResponse.json({ error: 'Missing submission ID or note content' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('submission_notes')
      .insert([{
        submission_id,
        note,
        created_by: adminEmail
      }]);

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      payload: { message: 'Note added successfully!' }
    });

  } catch (err: any) {
    console.error('addSubmissionNoteHandler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Workflow Email Sender (Reusing branding & Resend setup) ──
async function sendWorkflowEmail(
  toEmail: string,
  name: string,
  formType: string,
  prevStatus: string,
  currentStatus: string,
  internalNotes?: string
) {
  try {
    let subject = '';
    let headline = '';
    let body = '';

    const displayFormType = formType.charAt(0).toUpperCase() + formType.slice(1);

    if (prevStatus === 'new' && currentStatus === 'under_review') {
      subject = `Your CrestCode submission is now Under Review`;
      headline = `We've started reviewing your details`;
      body = `Hi ${name}, our investment and venture builder team is actively reviewing your <strong>${displayFormType}</strong> details. We will reach back out to you within 1-2 business days with next steps.`;
    } 
    else if (prevStatus === 'under_review' && currentStatus === 'approved') {
      subject = `Good news! Your CrestCode submission has been Approved`;
      headline = `Submission Approved 🎉`;
      
      if (formType === 'idea') {
        body = `Hi ${name},<br/><br/>Congratulations! Our venture team has completed the evaluation of your startup idea. We see high potential and would love to schedule a briefing call to discuss backing your concept and building this out together.`;
      } else if (formType === 'talent') {
        body = `Hi ${name},<br/><br/>Thank you for submitting your application to join the team. Our talent acquisition specialists have approved your profile. We will reach out to you shortly to schedule an initial interview.`;
      } else {
        body = `Hi ${name},<br/><br/>Your <strong>${displayFormType}</strong> submission has been approved. A representative from our investor relations/operations division will connect with you shortly for next steps.`;
      }
    } 
    else if (prevStatus === 'under_review' && currentStatus === 'rejected') {
      subject = `Update regarding your CrestCode submission`;
      headline = `Review Decision`;
      body = `Hi ${name}, thank you for taking the time to share your details with CrestCode. After careful consideration, we have decided not to proceed at this stage. We appreciate your interest and wish you the best of luck in your endeavors.`;
    } 
    else if (currentStatus === 'need_more_information') {
      subject = `Action Required: More information needed for your CrestCode submission`;
      headline = `Additional Details Requested`;
      body = `Hi ${name}, our review team requires some additional details to complete the evaluation of your <strong>${displayFormType}</strong> submission. Please reply directly to this email or send details to contact@cctps.com.`;
    } 
    else if (currentStatus === 'contacted') {
      subject = `Following up on your CrestCode submission`;
      headline = `Let's Connect`;
      body = `Hi ${name}, we are following up on your recent <strong>${displayFormType}</strong> submission. Our team is excited to connect with you. Please let us know your availability for a brief call.`;
    }

    if (!subject) return; // No email for this transition

    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      reply_to: TEAM_NOTIFICATION_EMAIL,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #F1F5F9; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 11px; font-weight: 800; color: #005AE2; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">CRESTCODE WORKFLOW</span>
            <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">${headline}</h2>
          </div>
          
          <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px;">
            ${body}
          </p>

          ${internalNotes && currentStatus === 'need_more_information' ? `
            <div style="background: #F8FAFC; border-left: 4px solid #64748B; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <strong style="font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Notes / Instructions</strong>
              <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">${internalNotes}</p>
            </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated status update regarding your CrestCode account.</p>
        </div>
      `
    });

  } catch (err) {
    console.error('sendWorkflowEmail failed:', err);
  }
}
