'use client';
import React from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, Search } from 'lucide-react';
import type { FAQ } from '../types/admin.types';
import { ds } from '../ds';

interface FaqsTabProps {
  faqs: FAQ[];
  faqSearch: string;
  setFaqSearch: (v: string) => void;
  faqCategoryFilter: string;
  setFaqCategoryFilter: (v: string) => void;
  openAddFaq: () => void;
  openEditFaq: (faq: FAQ) => void;
  handleDeleteFaq: (id: string) => void;
  moveFaqOrder: (faq: FAQ, direction: 'up' | 'down') => void;
}

export default function FaqsTab({ faqs, faqSearch, setFaqSearch, faqCategoryFilter, setFaqCategoryFilter, openAddFaq, openEditFaq, handleDeleteFaq, moveFaqOrder }: FaqsTabProps) {
  const filtered = faqs.filter(f => {
    const matchSearch = f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchCat = faqCategoryFilter === 'ALL' || f.category === faqCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={ds.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={ds.cardTitle}>Manage FAQs</h3>
        <button style={ds.addButton} onClick={openAddFaq}><Plus size={16} /> Add FAQ</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748B' }} />
          <input type="text" placeholder="Search FAQs..." value={faqSearch} onChange={e => setFaqSearch(e.target.value)} style={{ ...ds.input, paddingLeft: 36 }} />
        </div>
        <select value={faqCategoryFilter} onChange={e => setFaqCategoryFilter(e.target.value)} style={{ ...ds.input, width: 180 }}>
          <option value="ALL">All Categories</option>
          <option value="engagement">Engagement Model</option>
          <option value="product">Product & Scope</option>
          <option value="security">Security & IP</option>
        </select>
      </div>
      <div style={ds.tableContainer}>
        <table style={ds.table}>
          <thead>
            <tr>
              <th style={ds.th}>Question</th>
              <th style={ds.th}>Category</th>
              <th style={ds.th}>Status</th>
              <th style={ds.th}>Order</th>
              <th style={ds.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, idx, arr) => (
              <tr key={f.id} style={ds.tr}>
                <td style={ds.td}>
                  <div style={{ fontWeight: 600, color: '#F1F5F9' }}>{f.question}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{f.answer}</div>
                </td>
                <td style={ds.td}><span style={{ fontSize: 11, background: '#1E293B', padding: '2px 8px', borderRadius: 12, textTransform: 'capitalize', color: '#94A3B8' }}>{f.category}</span></td>
                <td style={ds.td}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: f.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(100,116,139,0.1)', color: f.is_active ? '#34D399' : '#64748B' }}>{f.is_active ? 'Active' : 'Inactive'}</span></td>
                <td style={ds.td}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={ds.orderBtn} onClick={() => moveFaqOrder(f, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                    <button style={ds.orderBtn} onClick={() => moveFaqOrder(f, 'down')} disabled={idx === arr.length - 1}><ArrowDown size={14} /></button>
                  </div>
                </td>
                <td style={ds.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={ds.editBtn} onClick={() => openEditFaq(f)}><Edit size={14} /></button>
                    <button style={ds.deleteBtn} onClick={() => handleDeleteFaq(f.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
