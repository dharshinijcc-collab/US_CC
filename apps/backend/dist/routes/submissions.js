"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = submissionsRoutes;
const supabase_1 = require("../services/supabase");
const email_1 = require("../services/email");
const auth_1 = require("../middleware/auth");
async function sendWorkflowEmail(toEmail, name, formType, prevStatus, currentStatus, internalNotes) {
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
            }
            else if (formType === 'talent') {
                body = `Hi ${name},<br/><br/>Thank you for submitting your application to join the team. Our talent acquisition specialists have approved your profile. We will reach out to you shortly to schedule an initial interview.`;
            }
            else {
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
        if (!subject)
            return; // No email for this transition
        await email_1.resend.emails.send({
            from: email_1.FROM_EMAIL,
            to: toEmail,
            reply_to: email_1.TEAM_NOTIFICATION_EMAIL,
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
    }
    catch (err) {
        console.error('sendWorkflowEmail failed:', err);
    }
}
async function submissionsRoutes(app) {
    // GET /submissions
    app.get('/submissions', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database not configured' });
            }
            const { formType = 'all', status = 'all', query = '', page = '1', limit = '10' } = request.query;
            const parsedPage = parseInt(page, 10);
            const parsedLimit = parseInt(limit, 10);
            const fromOffset = (parsedPage - 1) * parsedLimit;
            const toOffset = fromOffset + parsedLimit - 1;
            let dbQuery = supabase_1.supabaseAdmin.from('submissions').select('*', { count: 'exact' });
            if (formType !== 'all') {
                dbQuery = dbQuery.eq('form_type', formType);
            }
            if (status !== 'all') {
                dbQuery = dbQuery.eq('status', status);
            }
            if (query) {
                dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);
            }
            dbQuery = dbQuery.order('created_at', { ascending: false }).range(fromOffset, toOffset);
            const { data, count, error } = await dbQuery;
            if (error)
                throw error;
            const { data: statsData, error: statsError } = await supabase_1.supabaseAdmin
                .from('submissions')
                .select('status, form_type');
            if (statsError)
                throw statsError;
            const stats = {
                total: statsData.length,
                new: statsData.filter(s => s.status === 'new').length,
                under_review: statsData.filter(s => s.status === 'under_review').length,
                need_info: statsData.filter(s => s.status === 'need_more_information').length,
                approved: statsData.filter(s => s.status === 'approved').length,
                rejected: statsData.filter(s => s.status === 'rejected').length,
                contacted: statsData.filter(s => s.status === 'contacted').length,
            };
            return reply.send({
                status: 'success',
                payload: {
                    submissions: data || [],
                    count: count || 0,
                    stats
                }
            });
        }
        catch (err) {
            request.log.error(err, 'getSubmissionsHandler error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // GET /submissions/details
    app.get('/submissions/details', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database not configured' });
            }
            const { id } = request.query;
            if (!id) {
                return reply.status(400).send({ error: 'Missing submission ID' });
            }
            const { data: submission, error: subErr } = await supabase_1.supabaseAdmin
                .from('submissions')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (subErr)
                throw subErr;
            if (!submission) {
                return reply.status(404).send({ error: 'Submission not found' });
            }
            const { data: notes, error: notesErr } = await supabase_1.supabaseAdmin
                .from('submission_notes')
                .select('*')
                .eq('submission_id', id)
                .order('created_at', { ascending: false });
            if (notesErr)
                throw notesErr;
            const { data: history, error: histErr } = await supabase_1.supabaseAdmin
                .from('submission_status_history')
                .select('*')
                .eq('submission_id', id)
                .order('changed_at', { ascending: false });
            if (histErr)
                throw histErr;
            return reply.send({
                status: 'success',
                payload: {
                    submission,
                    notes: notes || [],
                    history: history || []
                }
            });
        }
        catch (err) {
            request.log.error(err, 'getSubmissionDetailsHandler error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /submissions/update
    app.post('/submissions/update', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database not configured' });
            }
            const { id, status, assigned_reviewer, internal_notes } = request.body;
            const adminEmail = request.user.email;
            if (!id) {
                return reply.status(400).send({ error: 'Missing submission ID' });
            }
            const { data: current, error: fetchErr } = await supabase_1.supabaseAdmin
                .from('submissions')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (fetchErr)
                throw fetchErr;
            if (!current) {
                return reply.status(404).send({ error: 'Submission not found' });
            }
            const prevStatus = current.status;
            const isStatusChanged = status && status !== prevStatus;
            const updateData = {
                updated_at: new Date().toISOString()
            };
            if (status)
                updateData.status = status;
            if (assigned_reviewer !== undefined)
                updateData.assigned_reviewer = assigned_reviewer;
            if (internal_notes !== undefined)
                updateData.internal_notes = internal_notes;
            const { error: updateErr } = await supabase_1.supabaseAdmin
                .from('submissions')
                .update(updateData)
                .eq('id', id);
            if (updateErr)
                throw updateErr;
            if (isStatusChanged) {
                const { error: histErr } = await supabase_1.supabaseAdmin
                    .from('submission_status_history')
                    .insert([{
                        submission_id: id,
                        previous_status: prevStatus,
                        current_status: status,
                        changed_by: adminEmail,
                        internal_notes: internal_notes || `Status transitioned from ${prevStatus} to ${status}`
                    }]);
                if (histErr)
                    throw histErr;
                await sendWorkflowEmail(current.email, current.name, current.form_type, prevStatus, status, internal_notes);
            }
            return reply.send({
                status: 'success',
                payload: { message: 'Submission updated successfully!' }
            });
        }
        catch (err) {
            request.log.error(err, 'updateSubmissionHandler error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /submissions/notes
    app.post('/submissions/notes', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database not configured' });
            }
            const { submission_id, note } = request.body;
            const adminEmail = request.user.email;
            if (!submission_id || !note) {
                return reply.status(400).send({ error: 'Missing submission ID or note content' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('submission_notes')
                .insert([{
                    submission_id,
                    note,
                    created_by: adminEmail
                }]);
            if (error)
                throw error;
            return reply.send({
                status: 'success',
                payload: { message: 'Note added successfully!' }
            });
        }
        catch (err) {
            request.log.error(err, 'addSubmissionNoteHandler error');
            return reply.status(500).send({ error: err.message });
        }
    });
}
