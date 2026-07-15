"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = submitRoutes;
const supabase_1 = require("../services/supabase");
const email_1 = require("../services/email");
const crypto_1 = __importDefault(require("crypto"));
async function submitRoutes(app) {
    // POST /submit-contact
    app.post('/submit-contact', async (request, reply) => {
        try {
            const data = request.body;
            const firstName = (data.firstName || '').trim();
            const email = (data.workEmail || '').trim();
            const company = (data.company || '').trim();
            const service = (data.serviceInterest || '').trim();
            const stage = (data.projectStage || '').trim();
            const message = (data.message || '').trim();
            if (!email || !firstName) {
                return reply.status(400).send({ error: 'Name and Email are required.' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            // 1. Insert into Supabase contact_inquiries table
            const { error } = await supabase_1.supabaseAdmin
                .from('contact_inquiries')
                .insert([{
                    full_name: firstName,
                    work_email: email,
                    company_name: company,
                    service_interest: service,
                    project_stage: stage,
                    message: message
                }]);
            if (error) {
                request.log.error(error, 'Supabase error inserting contact');
                return reply.status(500).send({ error: error.message });
            }
            // 1.1 Insert into unified submissions table
            try {
                await supabase_1.supabaseAdmin
                    .from('submissions')
                    .insert([{
                        form_type: 'contact',
                        name: firstName,
                        email: email,
                        company: company || null,
                        payload: {
                            service_interest: service,
                            project_stage: stage,
                            message: message
                        }
                    }]);
            }
            catch (subErr) {
                request.log.error(subErr, 'Failed to log contact form in unified submissions');
            }
            // 2. Send confirmation email to user
            try {
                await email_1.resend.emails.send({
                    from: email_1.FROM_EMAIL,
                    to: email,
                    reply_to: email_1.TEAM_NOTIFICATION_EMAIL,
                    subject: 'Thank you for reaching out',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #020617;">
                Thanks for reaching out, ${firstName}!
              </h2>
              <p style="margin: 0 0 24px; color: #64748B; font-size: 15px; line-height: 1.6;">
                We've received your inquiry and our team is reviewing it now. We'll get back to you within <strong style="color:#005AE2;">1-2 business days</strong>.
              </p>

              <div style="background: #F0F7FF; border-left: 4px solid #005AE2; border-radius: 4px 12px 12px 4px; padding: 20px 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #005AE2; text-transform: uppercase; letter-spacing: 0.08em;">Your Submission</p>
                <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Company:</strong> ${company || 'Not specified'}</p>
                <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Service:</strong> ${service || 'Not specified'}</p>
                <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Stage:</strong> ${stage || 'Not specified'}</p>
                <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Message:</strong> ${message || 'Not specified'}</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
            </div>
          `
                });
            }
            catch (emailError) {
                request.log.error(emailError, 'Failed to send contact confirmation email');
            }
            return reply.send({ success: true, message: 'Contact form submitted!' });
        }
        catch (err) {
            request.log.error(err, 'submit-contact API error');
            return reply.status(500).send({ error: 'Internal server error', details: err.message });
        }
    });
    // POST /submit-idea
    app.post('/submit-idea', async (request, reply) => {
        try {
            const body = request.body;
            const email = (body.email || '').trim();
            const idea = (body.idea || '').trim();
            const name = (body.name || '').trim();
            if (!email || !idea) {
                return reply.status(400).send({ error: 'Email and Idea are required.' });
            }
            if (idea.length < 10) {
                return reply.status(400).send({ error: 'Idea must be at least 10 characters.' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('idea_submissions')
                .insert([{ name: name || 'Anonymous', email, idea }]);
            if (error) {
                request.log.error(error, 'Supabase error inserting idea');
                return reply.status(500).send({ error: error.message });
            }
            // Send email notification to team
            try {
                await email_1.resend.emails.send({
                    from: email_1.FROM_EMAIL,
                    to: email_1.TEAM_NOTIFICATION_EMAIL,
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
            }
            catch (emailError) {
                request.log.error(emailError, 'Failed to send team notification email');
            }
            // Send confirmation email to user
            try {
                await email_1.resend.emails.send({
                    from: email_1.FROM_EMAIL,
                    to: email,
                    reply_to: email_1.REPLY_TO_EMAIL,
                    subject: 'Idea Submission Received',
                    html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #005AE2; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">CRESTCODE</h1>
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B;">Product Studio</span>
              </div>
              
              <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Hi ${name || 'Founder'},</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
                Thank you for submitting your startup idea to CrestCode. We have successfully received your submission!
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
                Our team is currently evaluating the concept and overall market opportunity. We will update you via email as we progress.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
                Best regards,<br />
                <strong>The CrestCode Team</strong>
              </p>
            </div>
          `
                });
            }
            catch (emailError) {
                request.log.error(emailError, 'Failed to send confirmation email to user');
            }
            return reply.send({ success: true, message: 'Idea submitted successfully!' });
        }
        catch (err) {
            request.log.error(err, 'submit-idea API error');
            return reply.status(500).send({ error: 'Internal server error', details: err.message });
        }
    });
    // POST /submit-investor
    app.post('/submit-investor', async (request, reply) => {
        try {
            const data = request.body;
            const fullName = (data.fullName || '').trim();
            const email = (data.email || '').trim();
            const expertise = (data.expertise || '').trim();
            const preferredRoles = data.preferredRoles || [];
            const background = (data.background || '').trim();
            if (!email || !fullName) {
                return reply.status(400).send({ error: 'Name and Email are required.' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('investor_submissions')
                .insert([{
                    full_name: fullName,
                    email: email,
                    expertise: expertise,
                    preferred_roles: preferredRoles,
                    background: background
                }]);
            if (error) {
                request.log.error(error, 'Supabase error inserting investor');
                return reply.status(500).send({ error: error.message });
            }
            try {
                await supabase_1.supabaseAdmin
                    .from('submissions')
                    .insert([{
                        form_type: 'investor',
                        name: fullName,
                        email: email,
                        company: null,
                        payload: {
                            expertise: expertise,
                            preferred_roles: preferredRoles,
                            background: background
                        }
                    }]);
            }
            catch (subErr) {
                request.log.error(subErr, 'Failed to log investor form in unified submissions');
            }
            try {
                await email_1.resend.emails.send({
                    from: email_1.FROM_EMAIL,
                    to: email,
                    reply_to: email_1.TEAM_NOTIFICATION_EMAIL,
                    subject: 'Application Received - CrestCode Investor Circle',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #005AE2; text-align: center;">CrestCode Investor Circle</h2>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi ${fullName},</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for submitting your application to join the CrestCode Investor Circle.</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">We have successfully received your investor profile details. Our investment relations team will review your application and contact you directly if there is alignment.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
            </div>
          `
                });
            }
            catch (emailError) {
                request.log.error(emailError, 'Failed to send investor confirmation email');
            }
            return reply.send({ success: true, message: 'Investor application submitted!' });
        }
        catch (err) {
            request.log.error(err, 'submit-investor API error');
            return reply.status(500).send({ error: 'Internal server error', details: err.message });
        }
    });
    // POST /submit-talent
    app.post('/submit-talent', async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            let firstName = '';
            let email = '';
            let interest = '';
            let linkedin = '';
            let resumeUrl = '';
            if (request.isMultipart()) {
                const parts = request.parts();
                for await (const part of parts) {
                    if (part.type === 'file') {
                        if (part.fieldname === 'resume') {
                            const buffer = await part.toBuffer();
                            if (buffer.length > 0) {
                                // Validate size (max 8MB)
                                if (buffer.length > 8 * 1024 * 1024) {
                                    return reply.status(400).send({ error: 'Resume file size exceeds 8MB limit' });
                                }
                                const ext = part.filename.split('.').pop() || 'pdf';
                                const uniqueName = `${crypto_1.default.randomUUID()}.${ext}`;
                                const { error: uploadError } = await supabase_1.supabaseAdmin.storage
                                    .from('resumes')
                                    .upload(uniqueName, buffer, {
                                    contentType: part.mimetype || 'application/pdf',
                                    upsert: true
                                });
                                if (!uploadError) {
                                    const { data: publicUrlData } = supabase_1.supabaseAdmin.storage
                                        .from('resumes')
                                        .getPublicUrl(uniqueName);
                                    resumeUrl = publicUrlData?.publicUrl || '';
                                }
                                else {
                                    request.log.error(uploadError, 'Supabase Storage upload error');
                                }
                            }
                        }
                    }
                    else {
                        if (part.fieldname === 'firstName')
                            firstName = part.value.trim();
                        if (part.fieldname === 'email')
                            email = part.value.trim();
                        if (part.fieldname === 'interest')
                            interest = part.value.trim();
                        if (part.fieldname === 'linkedin')
                            linkedin = part.value.trim();
                    }
                }
            }
            else {
                const body = request.body;
                firstName = (body.firstName || '').trim();
                email = (body.email || '').trim();
                interest = (body.interest || '').trim();
                linkedin = (body.linkedin || '').trim();
            }
            if (!email || !firstName) {
                return reply.status(400).send({ error: 'Name and Email are required.' });
            }
            const interestVal = (interest || 'engineer').trim();
            const finalInterest = interestVal.toLowerCase() === 'engineering' ? 'engineer' : interestVal;
            const { error } = await supabase_1.supabaseAdmin
                .from('talent_pool')
                .insert([{
                    full_name: firstName,
                    email: email,
                    interest_area: finalInterest,
                    linkedin_url: linkedin,
                    resume_url: resumeUrl
                }]);
            if (error) {
                request.log.error(error, 'Supabase error inserting talent');
                return reply.status(500).send({ error: error.message });
            }
            try {
                await supabase_1.supabaseAdmin
                    .from('submissions')
                    .insert([{
                        form_type: 'talent',
                        name: firstName,
                        email: email,
                        company: null,
                        payload: {
                            interest_area: finalInterest,
                            linkedin_url: linkedin,
                            resume_url: resumeUrl
                        }
                    }]);
            }
            catch (subErr) {
                request.log.error(subErr, 'Failed to log talent form in unified submissions');
            }
            try {
                await email_1.resend.emails.send({
                    from: email_1.FROM_EMAIL,
                    to: email,
                    reply_to: email_1.TEAM_NOTIFICATION_EMAIL,
                    subject: 'Application Received - CrestCode Talent Pool',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #005AE2; text-align: center;">CrestCode Talent Pool</h2>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for submitting your profile to join the CrestCode team as a <strong>${finalInterest}</strong>.</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">We have successfully received your information, and our talent team will review your application when opportunities matching your background open up.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
            </div>
          `
                });
            }
            catch (emailError) {
                request.log.error(emailError, 'Failed to send talent confirmation email');
            }
            return reply.send({ success: true, message: 'Talent application submitted!' });
        }
        catch (err) {
            request.log.error(err, 'submit-talent API error');
            return reply.status(500).send({ error: 'Internal server error', details: err.message });
        }
    });
}
