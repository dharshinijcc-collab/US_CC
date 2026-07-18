'use client';
import React from 'react';
import { Search } from 'lucide-react';
import type { TeamMember } from '@/types/team.types';
import type { TabType, FAQ, OpenPosition, Milestone, PartnerProduct } from '../types/admin.types';
import { ds } from '../ds';

interface GlobalSearchResultsProps {
  globalSearchKeyword: string;
  setGlobalSearchKeyword: (v: string) => void;
  team: TeamMember[];
  faqs: FAQ[];
  openPositions: OpenPosition[];
  milestones: Milestone[];
  partnerProducts: PartnerProduct[];
  setActiveTab: (t: TabType) => void;
  openEditMember: (m: TeamMember) => void;
  openEditFaq: (f: FAQ) => void;
}

export default function GlobalSearchResults({
  globalSearchKeyword, setGlobalSearchKeyword,
  team, faqs, openPositions, milestones, partnerProducts,
  setActiveTab, openEditMember, openEditFaq
}: GlobalSearchResultsProps) {
  const kw = globalSearchKeyword.toLowerCase();
  const results = {
    team: team.filter(m => m.name.toLowerCase().includes(kw) || m.role.toLowerCase().includes(kw) || (m.bio && m.bio.toLowerCase().includes(kw))),
    faqs: faqs.filter(f => f.question.toLowerCase().includes(kw) || f.answer.toLowerCase().includes(kw) || f.category.toLowerCase().includes(kw)),
    jobs: openPositions.filter(j => j.title.toLowerCase().includes(kw) || j.experience.toLowerCase().includes(kw) || j.category.toLowerCase().includes(kw)),
    milestones: milestones.filter(m => m.year.toLowerCase().includes(kw) || m.title.toLowerCase().includes(kw) || m.description.toLowerCase().includes(kw)),
    products: partnerProducts.filter(p => p.name.toLowerCase().includes(kw) || p.tagline.toLowerCase().includes(kw) || p.subtitle.toLowerCase().includes(kw)),
  };

  const totalCount = results.team.length + results.faqs.length + results.jobs.length + results.milestones.length + results.products.length;

  return (
    <div style={ds.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ ...ds.cardTitle, margin: 0, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 8 }}><Search size={18} /> Global Search Results for "{globalSearchKeyword}"</h3>
        <button style={ds.cancelBtn} onClick={() => setGlobalSearchKeyword('')}>Clear Search</button>
      </div>
      {totalCount === 0 ? <div style={{ color: '#64748B', padding: 24, textAlign: 'center' }}>No matched records found.</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {results.team.length > 0 && (
            <div>
              <h4 style={{ color: '#94A3B8', borderBottom: '1px solid #1E293B', paddingBottom: 4, marginBottom: 10, fontSize: 14 }}>Team Members ({results.team.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.team.map(x => (
                  <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '10px 16px', borderRadius: 8 }}>
                    <div>
                      <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{x.name}</div>
                      <div style={{ color: '#64748B', fontSize: 12 }}>{x.role} • {x.category}</div>
                    </div>
                    <button style={ds.editBtn} onClick={() => { setActiveTab('people'); setGlobalSearchKeyword(''); openEditMember(x); }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {results.faqs.length > 0 && (
            <div>
              <h4 style={{ color: '#94A3B8', borderBottom: '1px solid #1E293B', paddingBottom: 4, marginBottom: 10, fontSize: 14 }}>FAQs ({results.faqs.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.faqs.map(x => (
                  <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '10px 16px', borderRadius: 8 }}>
                    <div>
                      <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{x.question}</div>
                      <div style={{ color: '#64748B', fontSize: 12 }}>Category: {x.category}</div>
                    </div>
                    <button style={ds.editBtn} onClick={() => { setActiveTab('faqs'); setGlobalSearchKeyword(''); openEditFaq(x); }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
