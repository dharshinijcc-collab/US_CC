import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { report } = await req.json();
    if (!report) {
      return NextResponse.json({ error: 'Missing report data' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isSupabaseConfigured = 
      supabaseUrl && 
      supabaseUrl.startsWith('http') && 
      supabaseServiceKey;

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: true, message: 'Mock submit successful' });
    }

    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
    const verdict =
      report.overall_score >= 7.5 ? 'Proceed' :
      report.overall_score >= 4.5 ? 'Needs Work' : 'High Risk';

    // 1. Save to dd_reports
    const { error: dbError } = await supabaseAdmin
      .from('dd_reports')
      .insert([{
        id: report.id,
        overall_score: report.overall_score,
        verdict,
        report_data: report,
        is_mock: report.is_mock || false
      }]);

    if (dbError) {
      console.error('⚠️ Failed to save to dd_reports:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Save to idea_submissions as a lead
    const answers = report.answers || {};
    const ideaText = report.ideaText || '';
    const { error: subError } = await supabaseAdmin
      .from('idea_submissions')
      .insert([{
        name: answers.contact_name || 'Anonymous',
        email: answers.contact_email || 'Anonymous',
        idea: ideaText || 'Anonymous',
        created_at: new Date().toISOString()
      }]);

    if (subError) {
      console.error('⚠️ Failed to save to idea_submissions:', subError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Submit API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
