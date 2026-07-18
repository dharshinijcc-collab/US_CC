'use client';

import React from 'react';
import { Sliders, Settings, Save } from 'lucide-react';

interface ToolConfigTabProps {
  toolConfigs: any;
  updateToolConfig: (toolKey: string, section: string, field: string, val: any) => void;
  updateToolConfigDeep: (toolKey: string, section: string, subSection: string, field: string, val: any) => void;
  handleSaveToolConfig: (toolKey: string) => void;
  ds: Record<string, React.CSSProperties>;
}

export default function ToolConfigTab({ toolConfigs, updateToolConfig, updateToolConfigDeep, handleSaveToolConfig, ds }: ToolConfigTabProps) {
  return (
    <div>

      {/* ── 1. Idea Validator Configuration ── */}
      {toolConfigs.idea_validator && (
        <div style={{ ...ds.card, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: 12, marginBottom: 20 }}>
            <h3 style={{ ...ds.cardTitle, margin: 0, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sliders size={18} /> 1. Idea Validator Tool Configuration
            </h3>
            <button style={{ ...ds.saveBtn, margin: 0, padding: '8px 16px', fontSize: 13 }} onClick={() => handleSaveToolConfig('idea_validator')}>
              <Save size={14} /> Save Idea Validator Config
            </button>
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>A. Startup Quality Score Weights (Must sum to 1.0)</h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Customer Demand', path: 'demand', def: 0.35 },
              { label: 'Competitive Moat', path: 'moat', def: 0.30 },
              { label: 'Technical Feasibility', path: 'technical', def: 0.20 },
              { label: 'Founder-Market Fit', path: 'founder', def: 0.15 },
            ].map(w => (
              <div key={w.path} style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                <label style={ds.formLabel}>{w.label}</label>
                <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.quality?.[w.path] ?? w.def} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'quality', w.path, parseFloat(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>B. Investor Readiness Score Weights (Must sum to 1.0)</h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Investor Appeal', path: 'appeal', def: 0.40 },
              { label: 'Market Timing', path: 'timing', def: 0.30 },
              { label: 'Founder-Market Fit', path: 'founder', def: 0.15 },
              { label: 'Customer Demand', path: 'demand', def: 0.15 },
            ].map(w => (
              <div key={w.path} style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                <label style={ds.formLabel}>{w.label}</label>
                <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.readiness?.[w.path] ?? w.def} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'readiness', w.path, parseFloat(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>C. Triage Bands & Scoring Adjustments</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
              <label style={ds.formLabel}>Strong Pass Cutoff (&gt;= Score)</label>
              <input type="number" step="0.1" style={ds.input} value={toolConfigs.idea_validator.triage_thresholds?.strong_pass ?? 7.5} onChange={e => updateToolConfig('idea_validator', 'triage_thresholds', 'strong_pass', parseFloat(e.target.value) || 0)} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
              <label style={ds.formLabel}>Not a Fit Cutoff (&lt; Score)</label>
              <input type="number" step="0.1" style={ds.input} value={toolConfigs.idea_validator.triage_thresholds?.needs_work ?? 4.5} onChange={e => updateToolConfig('idea_validator', 'triage_thresholds', 'needs_work', parseFloat(e.target.value) || 0)} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
              <label style={ds.formLabel}>Paying Customers Bonus</label>
              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.adjustments?.validation?.paying_customers ?? 1.5} onChange={e => updateToolConfigDeep('idea_validator', 'adjustments', 'validation', 'paying_customers', parseFloat(e.target.value) || 0)} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
              <label style={ds.formLabel}>No Validation Penalty</label>
              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.adjustments?.validation?.none ?? -1.5} onChange={e => updateToolConfigDeep('idea_validator', 'adjustments', 'validation', 'none', parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>D. Dynamic Factor Rule Modifiers</h4>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20, marginTop: -8 }}>Customize raw score additions/penalties for the deterministic rule engine.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {([
              { title: '1. Market Size / Opportunity', fields: [{ lbl: 'Large Addressable Market', key: 'Large Addressable Market', def: 2.0 }, { lbl: 'Targeting Mass Market', key: 'Targeting Mass Market', def: 3.0 }, { lbl: 'Medium Addressable Market', key: 'Medium Addressable Market', def: 1.0 }, { lbl: 'Small Addressable Market', key: 'Small Addressable Market', def: -2.0 }] },
              { title: '2. Customer Demand', fields: [{ lbl: 'Severe Customer Pain Point', key: 'Severe Customer Pain Point', def: 3.0 }, { lbl: 'Proven Demand via Paying Customers', key: 'Proven Demand via Paying Customers', def: 5.0 }, { lbl: 'Moderate Customer Pain Point', key: 'Moderate Customer Pain Point', def: 1.0 }, { lbl: 'Zero Validated Demand', key: 'Zero Validated Demand', def: -2.0 }] },
              { title: '3. Competitive Moat', fields: [{ lbl: 'Proprietary Data Accumulation Loop', key: 'Proprietary Data Accumulation Loop', def: 3.0 }, { lbl: 'Defensible Competitor Moat', key: 'Defensible Competitor Moat', def: 3.0 }, { lbl: 'Product is Easy to Clone', key: 'Product is Extremely Easy to Clone', def: -3.0 }, { lbl: 'No Moat / Low Defensibility', key: 'No Moat / Low Defensibility', def: -2.0 }] },
              { title: '4. Technical Feasibility', fields: [{ lbl: 'Simple MVP Development Path', key: 'Simple MVP Development Path', def: 2.0 }, { lbl: 'Launched MVP Stage', key: 'Launched MVP Stage', def: 4.0 }, { lbl: 'Complex Frontend/Backend MVP Scope', key: 'Complex Frontend/Backend MVP Scope', def: -1.0 }, { lbl: 'R&D Required', key: 'Basic R&D or Scientific Research Required', def: -3.0 }] },
              { title: '5. Founder Market Fit', fields: [{ lbl: 'Domain Expert Founders', key: 'Domain Expert Founder(s)', def: 3.0 }, { lbl: 'Deep Industry Experience', key: 'Deep Industry Experience', def: 2.0 }, { lbl: 'Zero Prior Domain Knowledge', key: 'Zero Prior Domain Knowledge', def: -2.0 }, { lbl: 'Zero Core Industry Experience', key: 'Zero Core Industry Experience', def: -1.0 }] },
              { title: '6. Investor Appeal', fields: [{ lbl: 'Subscription / Recurring Revenue', key: 'Subscription / Recurring Revenue', def: 2.0 }, { lbl: 'High Scalability Potential', key: 'High Scalability Potential', def: 2.0 }, { lbl: 'One-Time Revenue Model', key: 'One-Time Revenue Model', def: -1.0 }, { lbl: 'Low Scalability Potential', key: 'Low Scalability Potential', def: -1.0 }] },
              { title: '7. Market Timing', fields: [{ lbl: 'Fast-Growing Industry Segment', key: 'Fast-Growing Industry Segment', def: 3.0 }, { lbl: 'Strong "Why Now" Case', key: 'Strong "Why Now" Case', def: 3.0 }, { lbl: 'Declining Industry Core Growth', key: 'Declining Industry Core Growth', def: -3.0 }, { lbl: 'Weak "Why Now" Case', key: 'Weak "Why Now" Case', def: -2.0 }] },
            ] as { title: string; fields: { lbl: string; key: string; def: number }[] }[]).map(group => (
              <div key={group.title} style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>{group.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {group.fields.map(f => (
                    <div key={f.key} style={ds.formGroup}>
                      <label style={ds.formLabel}>{f.lbl}</label>
                      <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.[f.key] ?? f.def} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', f.key, parseFloat(e.target.value) || 0)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>E. Gemini AI Prompt Templates</h4>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Signal Extraction System Prompt</label>
            <textarea style={{ ...ds.textarea, fontFamily: 'monospace', fontSize: 12 }} rows={8} value={toolConfigs.idea_validator.prompt_templates?.signal_extraction || ''} onChange={e => updateToolConfig('idea_validator', 'prompt_templates', 'signal_extraction', e.target.value)} />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Narrative Generation System Prompt</label>
            <textarea style={{ ...ds.textarea, fontFamily: 'monospace', fontSize: 12 }} rows={8} value={toolConfigs.idea_validator.prompt_templates?.narrative_generation || ''} onChange={e => updateToolConfig('idea_validator', 'prompt_templates', 'narrative_generation', e.target.value)} />
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>F. Feature Flags</h4>
          <div style={{ display: 'flex', gap: 24, padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="flag-db" checked={toolConfigs.idea_validator.feature_flags?.use_mock_db ?? false} onChange={e => updateToolConfig('idea_validator', 'feature_flags', 'use_mock_db', e.target.checked)} />
              <label htmlFor="flag-db" style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Use Mock Database (FileSystem Cache)</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="flag-ai" checked={toolConfigs.idea_validator.feature_flags?.use_mock_ai ?? false} onChange={e => updateToolConfig('idea_validator', 'feature_flags', 'use_mock_ai', e.target.checked)} />
              <label htmlFor="flag-ai" style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Use Mock AI Generator (Keyword Matching)</label>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Build Time Estimator Configuration ── */}
      {toolConfigs.build_estimator && (
        <div style={ds.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: 12, marginBottom: 20 }}>
            <h3 style={{ ...ds.cardTitle, margin: 0, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Settings size={18} /> 2. Build Time Estimator Tool Configuration
            </h3>
            <button style={{ ...ds.saveBtn, margin: 0, padding: '8px 16px', fontSize: 13 }} onClick={() => handleSaveToolConfig('build_estimator')}>
              <Save size={14} /> Save Estimator Config
            </button>
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>A. Baseline Screen Counts per Product Type</h4>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.keys(toolConfigs.build_estimator.screen_counts || {}).map((prodKey) => (
              <div key={prodKey} style={{ ...ds.formGroup, flex: '1 1 120px' }}>
                <label style={{ ...ds.formLabel, textTransform: 'capitalize' }}>{prodKey.replace('_', ' ')}</label>
                <input type="number" style={ds.input} value={toolConfigs.build_estimator.screen_counts[prodKey] ?? 0} onChange={e => updateToolConfig('build_estimator', 'screen_counts', prodKey, parseInt(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>B. Platform Specific Screen Additions</h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ key: 'ios', label: 'iOS Mobile App', def: 8 }, { key: 'android_shared', label: 'Android App (Shared)', def: 4 }, { key: 'android_only', label: 'Android App (Standalone)', def: 8 }, { key: 'admin', label: 'Admin Panel', def: 5 }].map(p => (
              <div key={p.key} style={{ ...ds.formGroup, flex: 1, minWidth: 120 }}>
                <label style={ds.formLabel}>{p.label}</label>
                <input type="number" style={ds.input} value={toolConfigs.build_estimator.platform_additions?.[p.key] ?? p.def} onChange={e => updateToolConfig('build_estimator', 'platform_additions', p.key, parseInt(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>C. Team Preference Duration Multipliers</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ key: 'solo', label: 'Solo Developer', def: [1.5, 1.75] }, { key: 'small', label: 'Small Team 2–4', def: [1.0, 1.0] }, { key: 'dedicated', label: 'Dedicated Team', def: [0.6, 0.75] }].map(t => (
              <div key={t.key} style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
                <label style={ds.formLabel}>{t.label} (Min, Max)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.[t.key]?.[0] ?? t.def[0]} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', t.key, [parseFloat(e.target.value) || 0, toolConfigs.build_estimator.team_multipliers?.[t.key]?.[1] ?? t.def[1]])} />
                  <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.[t.key]?.[1] ?? t.def[1]} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', t.key, [toolConfigs.build_estimator.team_multipliers?.[t.key]?.[0] ?? t.def[0], parseFloat(e.target.value) || 0])} />
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>D. Complexity Thresholds (Weeks)</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ key: 'low', label: 'Low Complexity (Max Weeks)', def: 4 }, { key: 'medium', label: 'Medium Complexity (Max Weeks)', def: 12 }, { key: 'high', label: 'High Complexity (Max Weeks)', def: 24 }].map(c => (
              <div key={c.key} style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                <label style={ds.formLabel}>{c.label}</label>
                <input type="number" style={ds.input} value={toolConfigs.build_estimator.complexity_thresholds?.[c.key] ?? c.def} onChange={e => updateToolConfig('build_estimator', 'complexity_thresholds', c.key, parseInt(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>E. AI Level Screen Additions</h4>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ key: 'none', label: 'No AI', def: 0 }, { key: 'assistant', label: 'AI Assistant', def: 3 }, { key: 'report_gen', label: 'AI Report Generation', def: 5 }, { key: 'ocr', label: 'OCR / Doc Processing', def: 4 }, { key: 'ai_core', label: 'AI Core Product', def: 8 }].map(ai => (
              <div key={ai.key} style={{ ...ds.formGroup, flex: '1 1 140px' }}>
                <label style={{ ...ds.formLabel, textTransform: 'none' }}>{ai.label}</label>
                <input type="number" style={ds.input} value={toolConfigs.build_estimator.ai_additions?.[ai.key] ?? ai.def} onChange={e => updateToolConfig('build_estimator', 'ai_additions', ai.key, parseInt(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>F. Feature Screen Additions</h4>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'profiles', label: 'User Profiles', def: 2 }, { key: 'dashboard', label: 'Dashboard', def: 3 }, { key: 'analytics', label: 'Analytics', def: 4 }, { key: 'reporting', label: 'Reporting', def: 3 },
              { key: 'payments', label: 'Payments', def: 4 }, { key: 'booking', label: 'Booking System', def: 4 }, { key: 'search', label: 'Search', def: 2 }, { key: 'notifications', label: 'Notifications', def: 2 },
              { key: 'messaging', label: 'Messaging', def: 5 }, { key: 'file_uploads', label: 'File Uploads', def: 2 }, { key: 'roles', label: 'Multi-User Roles', def: 3 }, { key: 'collaboration', label: 'Team Collaboration', def: 5 },
            ].map(feat => (
              <div key={feat.key} style={{ ...ds.formGroup, flex: '1 1 140px' }}>
                <label style={{ ...ds.formLabel, textTransform: 'none' }}>{feat.label}</label>
                <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_additions?.[feat.key] ?? feat.def} onChange={e => updateToolConfig('build_estimator', 'feature_additions', feat.key, parseInt(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>G. Lead CTA Configuration</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
              <label style={ds.formLabel}>CTA Action Button URL</label>
              <input type="text" style={ds.input} value={toolConfigs.build_estimator.cta_values?.href || ''} onChange={e => updateToolConfig('build_estimator', 'cta_values', 'href', e.target.value)} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
              <label style={ds.formLabel}>CTA Action Button Text</label>
              <input type="text" style={ds.input} value={toolConfigs.build_estimator.cta_values?.text || ''} onChange={e => updateToolConfig('build_estimator', 'cta_values', 'text', e.target.value)} />
            </div>
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>H. Weeks Adjustments</h4>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            {[{ key: 'cofounder_bonus', label: 'Co-founder Bonus (weeks saved)', def: -2.0 }, { key: 'low_feasibility_penalty', label: 'Low Feasibility Penalty (weeks added)', def: 3.0 }, { key: 'mid_feasibility_penalty', label: 'Mid Feasibility Penalty (weeks added)', def: 1.0 }].map(w => (
              <div key={w.key} style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                <label style={ds.formLabel}>{w.label}</label>
                <input type="number" step="0.5" style={ds.input} value={toolConfigs.build_estimator.weeks_adjustments?.[w.key] ?? w.def} onChange={e => updateToolConfig('build_estimator', 'weeks_adjustments', w.key, parseFloat(e.target.value) || 0)} />
              </div>
            ))}
          </div>

          <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>I. Feature Count Tiers & Integration Settings</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>Feature Tiers & Additions</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={ds.formGroup}><label style={ds.formLabel}>Low Limit</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tiers?.low ?? 3} onChange={e => updateToolConfig('build_estimator', 'feature_tiers', 'low', parseInt(e.target.value) || 0)} /></div>
                <div style={ds.formGroup}><label style={ds.formLabel}>Medium Limit</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tiers?.medium ?? 7} onChange={e => updateToolConfig('build_estimator', 'feature_tiers', 'medium', parseInt(e.target.value) || 0)} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={ds.formGroup}><label style={ds.formLabel}>Low Addition</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.low ?? 0} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'low', parseInt(e.target.value) || 0)} /></div>
                <div style={ds.formGroup}><label style={ds.formLabel}>Medium Addition</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.medium ?? 2} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'medium', parseInt(e.target.value) || 0)} /></div>
                <div style={ds.formGroup}><label style={ds.formLabel}>High Addition</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.high ?? 5} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'high', parseInt(e.target.value) || 0)} /></div>
              </div>
            </div>
            <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>Integration Screen Additions</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={ds.formGroup}><label style={ds.formLabel}>Standard Integration</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.integration_additions?.standard ?? 2} onChange={e => updateToolConfig('build_estimator', 'integration_additions', 'standard', parseInt(e.target.value) || 0)} /></div>
                <div style={ds.formGroup}><label style={ds.formLabel}>Custom Integration</label><input type="number" style={ds.input} value={toolConfigs.build_estimator.integration_additions?.custom ?? 3} onChange={e => updateToolConfig('build_estimator', 'integration_additions', 'custom', parseInt(e.target.value) || 0)} /></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
