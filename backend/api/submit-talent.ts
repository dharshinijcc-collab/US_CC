import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import { resend, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL } from '../services/email';
import crypto from 'crypto';

export async function submitTalentHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    let firstName = '';
    let email = '';
    let interest = '';
    let linkedin = '';
    let resumeUrl = '';

    // Support both multipart/form-data and application/json
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      firstName = (formData.get('firstName') as string || '').trim();
      email = (formData.get('email') as string || '').trim();
      interest = (formData.get('interest') as string || '').trim();
      linkedin = (formData.get('linkedin') as string || '').trim();
      
      const resumeFile = formData.get('resume') as File | null;
      if (resumeFile && resumeFile.size > 0) {
        try {
          const arrayBuffer = await resumeFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const ext = resumeFile.name.split('.').pop() || 'pdf';
          const uniqueName = `${crypto.randomUUID()}.${ext}`;

          const { error: uploadError } = await supabaseAdmin.storage
            .from('resumes')
            .upload(uniqueName, buffer, {
              contentType: resumeFile.type || 'application/pdf',
              upsert: true
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabaseAdmin.storage
              .from('resumes')
              .getPublicUrl(uniqueName);
            resumeUrl = publicUrlData?.publicUrl || '';
          } else {
            console.error('Supabase Storage upload error:', uploadError);
          }
        } catch (storageErr) {
          console.error('Error handling resume upload:', storageErr);
        }
      }
    } else {
      const data = await req.json();
      firstName = (data.firstName || '').trim();
      email = (data.email || '').trim();
      interest = (data.interest || '').trim();
      linkedin = (data.linkedin || '').trim();
    }

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    const interestVal = (interest || 'engineer').trim();
    const finalInterest = interestVal.toLowerCase() === 'engineering' ? 'engineer' : interestVal;

    // 1. Insert into Supabase talent_pool table
    const { error } = await supabaseAdmin
      .from('talent_pool')
      .insert([{
        full_name: firstName,
        email: email,
        interest_area: finalInterest,
        linkedin_url: linkedin,
        resume_url: resumeUrl
      }]);

    if (error) {
      console.error('Supabase error inserting talent:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 1.1 Insert into unified submissions table
    try {
      await supabaseAdmin
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
    } catch (subErr) {
      console.error('Failed to log talent form in unified submissions:', subErr);
    }

    // 2. Send confirmation email to user
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        reply_to: TEAM_NOTIFICATION_EMAIL,
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
    } catch (emailError) {
      console.error('Failed to send talent confirmation email:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Talent application submitted!' });
  } catch (err: any) {
    console.error('submit-talent API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
