'use client';
import React from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, Search } from 'lucide-react';
import type { OpenPosition } from '../types/admin.types';
import { ds } from '../ds';

interface CareersTabProps {
  openPositions: OpenPosition[];
  jobSearch: string;
  setJobSearch: (v: string) => void;
  jobCategoryFilter: string;
  setJobCategoryFilter: (v: string) => void;
  openAddJob: () => void;
  openEditJob: (job: OpenPosition) => void;
  handleDeleteJob: (id: string) => void;
  moveJobOrder: (job: OpenPosition, direction: 'up' | 'down') => void;
}

export default function CareersTab({ openPositions, jobSearch, setJobSearch, jobCategoryFilter, setJobCategoryFilter, openAddJob, openEditJob, handleDeleteJob, moveJobOrder }: CareersTabProps) {
  const filtered = openPositions.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.experience.toLowerCase().includes(jobSearch.toLowerCase());
    const matchCat = jobCategoryFilter === 'ALL' || j.category === jobCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={ds.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={ds.cardTitle}>Manage Careers Open Positions</h3>
        <button style={ds.addButton} onClick={openAddJob}><Plus size={16} /> Add Position</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748B' }} />
          <input type="text" placeholder="Search positions..." value={jobSearch} onChange={e => setJobSearch(e.target.value)} style={{ ...ds.input, paddingLeft: 36 }} />
        </div>
        <select value={jobCategoryFilter} onChange={e => setJobCategoryFilter(e.target.value)} style={{ ...ds.input, width: 180 }}>
          <option value="ALL">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
        </select>
      </div>
      <div style={ds.tableContainer}>
        <table style={ds.table}>
          <thead>
            <tr>
              <th style={ds.th}>Title</th>
              <th style={ds.th}>Category</th>
              <th style={ds.th}>Location</th>
              <th style={ds.th}>Type</th>
              <th style={ds.th}>Experience</th>
              <th style={ds.th}>Status</th>
              <th style={ds.th}>Order</th>
              <th style={ds.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j, idx, arr) => (
              <tr key={j.id} style={ds.tr}>
                <td style={ds.td}><div style={{ fontWeight: 600, color: '#F1F5F9' }}>{j.title}</div><div style={{ fontSize: 11, color: '#38BDF8', marginTop: 2 }}>{j.apply_link}</div></td>
                <td style={ds.td}>{j.category}</td>
                <td style={ds.td}>{j.location}</td>
                <td style={ds.td}>{j.type}</td>
                <td style={ds.td}>{j.experience}</td>
                <td style={ds.td}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: j.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(100,116,139,0.1)', color: j.is_active ? '#34D399' : '#64748B' }}>{j.is_active ? 'Active' : 'Inactive'}</span></td>
                <td style={ds.td}><div style={{ display: 'flex', gap: 4 }}><button style={ds.orderBtn} onClick={() => moveJobOrder(j, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button><button style={ds.orderBtn} onClick={() => moveJobOrder(j, 'down')} disabled={idx === arr.length - 1}><ArrowDown size={14} /></button></div></td>
                <td style={ds.td}><div style={{ display: 'flex', gap: 8 }}><button style={ds.editBtn} onClick={() => openEditJob(j)}><Edit size={14} /></button><button style={ds.deleteBtn} onClick={() => handleDeleteJob(j.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
