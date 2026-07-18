'use client';

import React from 'react';
import { ClipboardList, Lightbulb } from 'lucide-react';
import type { Answers, EstimateResult } from '../types';
import {
  PRODUCT_TYPES,
  PLATFORM_OPTIONS,
  FEATURE_OPTIONS,
  AI_OPTIONS,
  INTEGRATION_OPTIONS,
  TEAM_OPTIONS
} from '../config';

interface SelectionsSummaryPanelProps {
  answers: Answers;
  estimate: EstimateResult;
  section: string;
}

export default function SelectionsSummaryPanel({ answers, estimate, section }: SelectionsSummaryPanelProps) {
  const productTypeLabel = (answers.productType ? (PRODUCT_TYPES.find(p => p.key === answers.productType)?.label || answers.productType) : '') || 'None';
  const platformLabels = answers.platforms.map(p => PLATFORM_OPTIONS.find(o => o.key === p)?.label || p).join(', ');
  const featureLabels = answers.features.map(f => FEATURE_OPTIONS.find(o => o.key === f)?.label || f);
  const aiLabels = answers.aiLevel.filter(l => l !== 'none').map(l => AI_OPTIONS.find(o => o.key === l)?.label || l);
  const integrationLabels = answers.integrations.map(i => INTEGRATION_OPTIONS.find(o => o.key === i)?.label || i);
  const teamPrefLabel = (answers.teamPref ? (TEAM_OPTIONS.find(t => t.key === answers.teamPref)?.label || answers.teamPref) : '') || 'None';

  const selectionsList: { label: string; value: string }[] = [
    { label: 'Product Type', value: productTypeLabel },
    { label: 'Selected Platforms', value: platformLabels || 'None' },
    { label: 'Selected Team Pref', value: teamPrefLabel || 'None' },
  ];
  if (featureLabels.length > 0) selectionsList.push({ label: 'Selected Features', value: featureLabels.join(', ') });
  if (aiLabels.length > 0) selectionsList.push({ label: 'AI Features', value: aiLabels.join(', ') });
  if (integrationLabels.length > 0) selectionsList.push({ label: 'Selected Integrations', value: integrationLabels.join(', ') });

  let analysisTitle = "Outcome Analysis";
  let analysisWhy: string[] = [];

  if (section === 'timeline') {
    analysisTitle = "How Selections Influenced Timeline";
    analysisWhy.push(`Building a ${productTypeLabel} establishes the base development screen count.`);
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Native mobile platforms add design and QA parity testing layers, scaling effort.");
    }
    if (answers.teamPref === 'solo') {
      analysisWhy.push("Solo developer pace multiplies timelines by 1.5x due to lack of parallel execution.");
    } else if (answers.teamPref === 'dedicated') {
      analysisWhy.push("Dedicated squad pace compresses timeline by 0.6x through parallel dev, design, and testing.");
    } else {
      analysisWhy.push("Standard small team pace implements standard 1.0x baseline velocity.");
    }
  } else if (section === 'complexity') {
    analysisTitle = "Technical Complexity Analysis";
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI integrations require pipeline orchestrations, prompt safety layers, and output validation.");
    }
    if (answers.features.includes('messaging') || answers.features.includes('collaboration')) {
      analysisWhy.push("Real-time collaborative features require state synchronization and WebSocket infrastructure.");
    }
    if (answers.integrations.includes('custom')) {
      analysisWhy.push("Custom APIs introduce technical uncertainties and require robust integration mapping.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Straightforward scope with standard CRUD operations and minimal complex third-party dependencies.");
    }
  } else if (section === 'team') {
    analysisTitle = "Recommended Roles Analysis";
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Mobile developer is recommended to ensure native OS integration and styling Parity.");
    }
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI Engineer recommended to configure LLM agents, prompts, and inference integrations.");
    }
    if (answers.integrations.length > 2 || answers.platforms.includes('api')) {
      analysisWhy.push("Integration Specialist recommended to coordinate secure API contracts and payloads.");
    }
    if (answers.teamPref === 'dedicated') {
      analysisWhy.push("Dedicated team adds QA Specialist to prevent regressions and handle automated testing.");
    } else {
      analysisWhy.push("Standard engineering roles cover all requested features without custom QA overhead.");
    }
  } else if (section === 'drivers') {
    analysisTitle = "Outcome Driver Mapping";
    if (answers.features.includes('payments')) {
      analysisWhy.push("Payment Processing: gateway integration, subscription webhooks, invoicing, and PCI audit compliance.");
    }
    if (answers.features.includes('messaging')) {
      analysisWhy.push("Real-time Messaging: Socket connections, notification fallbacks, and connection drops management.");
    }
    if (answers.features.includes('analytics')) {
      analysisWhy.push("Analytics Engine: aggregate querying, charting tools, and CSV/PDF report rendering.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Core product features, responsive frontend layouts, and database setup are the main drivers.");
    }
  } else if (section === 'roadmap') {
    analysisTitle = "Roadmap Phase Allocation";
    analysisWhy.push("Planning & Architecture: standard 15% allocation to specify API contracts and map databases.");
    analysisWhy.push("Core Development: 45% allocation focused on delivering high-value user stories.");
    if (answers.integrations.length > 0 || answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("Integrations & AI: 25% phase dedicated to securing third-party webhooks and training prompt models.");
    }
    analysisWhy.push("Testing & Launch: 15% phase to perform end-to-end regression testing and cloud setup.");
  } else if (section === 'risks') {
    analysisTitle = "Risk Drivers Connection";
    if (answers.teamPref === 'solo') {
      analysisWhy.push("Solo Developer: creates single-point-of-failure risk if developer gets ill or hits roadblocks.");
    }
    if (answers.integrations.includes('custom')) {
      analysisWhy.push("Custom APIs: third-party dependencies are prone to rate limits or API contract shifts.");
    }
    if (answers.platforms.includes('ios') && answers.platforms.includes('android')) {
      analysisWhy.push("Cross-Platform: QA overhead maintaining exact Parity across differing devices and operating systems.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Standard project parameters minimize high technical delivery risks.");
    }
  } else if (section === 'costs') {
    analysisTitle = "Ongoing Cost Allocation";
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI APIs: recurring pay-per-token API invocation costs (e.g. OpenAI/Anthropic).");
    }
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Developer Accounts: Apple/Google yearly registration and device testing fees.");
    }
    if (answers.integrations.length > 0) {
      analysisWhy.push("Third-party SaaS: monthly costs for subscription integration services (e.g. Stripe, SendGrid).");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Standard cloud hosting and database compute scale with user traffic.");
    }
  } else if (section === 'mvp') {
    analysisTitle = "MVP Prioritization Rules";
    analysisWhy.push("Core CRUD capability and user profiles are placed in V1 to establish functional value.");
    if (answers.features.includes('payments')) {
      analysisWhy.push("Billing and payments included in V1 to validate pricing and capture revenue immediately.");
    }
    if (answers.features.some(f => ['analytics', 'messaging', 'booking'].includes(f))) {
      analysisWhy.push("Complex reporting, peer messaging, and custom scheduling deferred to V2 to secure a launch.");
    }
  }

  return (
    <div className="rpt-sel-panel" style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ClipboardList size={14} color="#005AE2" />
            <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Selections</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectionsList.map((sel, idx) => (
              <div key={idx} style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{sel.label}: </span>
                <span style={{ color: '#475569' }}>{sel.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={14} color="#005AE2" />
            <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{analysisTitle}</h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {analysisWhy.map((why, idx) => (
              <li key={idx} style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>{why}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
