'use client';
import React from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, X, Plus, Search, Filter } from 'lucide-react';
import type { TeamMember } from '@/types/team.types';
import { ds } from '../ds';

interface PeopleTabProps {
  team: TeamMember[];
  peopleSubTab: 'core' | 'advisors';
  setPeopleSubTab: (v: 'core' | 'advisors') => void;
  peopleSearch: string;
  setPeopleSearch: (v: string) => void;
  peopleCategoryFilter: 'ALL' | 'Founder' | 'Partner' | 'Team Member' | 'Advisor';
  setPeopleCategoryFilter: (v: any) => void;
  peopleSortField: 'name' | 'display_order';
  setPeopleSortField: (v: any) => void;
  peopleSortOrder: 'asc' | 'desc';
  setPeopleSortOrder: (fn: (prev: 'asc' | 'desc') => 'asc' | 'desc') => void;
  openAddMember: (cat: TeamMember['category']) => void;
  openEditMember: (m: TeamMember) => void;
  triggerDeleteMember: (id: string, name: string, permanent: boolean) => void;
  moveMemberOrder: (m: TeamMember, dir: 'up' | 'down') => void;
  handleToggleMemberActive: (m: TeamMember) => void;
}

export default function PeopleTab({
  team, peopleSubTab, setPeopleSubTab, peopleSearch, setPeopleSearch,
  peopleCategoryFilter, setPeopleCategoryFilter, peopleSortField, setPeopleSortField,
  peopleSortOrder, setPeopleSortOrder, openAddMember, openEditMember,
  triggerDeleteMember, moveMemberOrder, handleToggleMemberActive
}: PeopleTabProps) {
  const filteredTeam = team
    .filter(m => {
      if (peopleSubTab === 'core') { if (m.category === 'Advisor') return false; }
      else { if (m.category !== 'Advisor') return false; }
      const matchesSearch = m.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
        m.role.toLowerCase().includes(peopleSearch.toLowerCase()) ||
        (m.bio || '').toLowerCase().includes(peopleSearch.toLowerCase());
      const matchesCategory = peopleCategoryFilter === 'ALL' || m.category === peopleCategoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (peopleSortField === 'name') { comparison = a.name.localeCompare(b.name); }
      else { comparison = a.display_order - b.display_order; }
      return peopleSortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20, background: '#0B132B', padding: 20, borderRadius: 12, border: '1px solid #1C2541' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', background: '#1E293B', padding: 4, borderRadius: 8 }}>
            <button
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: peopleSubTab === 'core' ? '#3B82F6' : 'transparent', color: peopleSubTab === 'core' ? '#fff' : '#94A3B8' }}
              onClick={() => { setPeopleSubTab('core'); setPeopleCategoryFilter('ALL'); }}
            >Core Team</button>
            <button
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: peopleSubTab === 'advisors' ? '#3B82F6' : 'transparent', color: peopleSubTab === 'advisors' ? '#fff' : '#94A3B8' }}
              onClick={() => { setPeopleSubTab('advisors'); setPeopleCategoryFilter('ALL'); }}
            >Advisors</button>
          </div>
          <button style={{ ...ds.addButton, padding: '10px 18px', fontSize: 13 }} onClick={() => openAddMember(peopleSubTab === 'core' ? 'Team Member' : 'Advisor')}>
            <Plus size={16} /> Add New Person
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search by name, title, or bio..." style={{ ...ds.input, paddingLeft: 36, margin: 0 }} value={peopleSearch} onChange={e => setPeopleSearch(e.target.value)} />
          </div>
          {peopleSubTab === 'core' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} color="#64748B" />
              <select style={{ ...ds.input, margin: 0, minWidth: 140, padding: '6px 12px', fontSize: 13 }} value={peopleCategoryFilter} onChange={e => setPeopleCategoryFilter(e.target.value as any)}>
                <option value="ALL">All Categories</option>
                <option value="Founder">Founders</option>
                <option value="Partner">Partners</option>
                <option value="Team Member">Team Members</option>
              </select>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Sort By:</span>
            <select style={{ ...ds.input, margin: 0, minWidth: 120, padding: '6px 12px', fontSize: 13 }} value={peopleSortField} onChange={e => setPeopleSortField(e.target.value as any)}>
              <option value="display_order">Display Order</option>
              <option value="name">Name</option>
            </select>
            <button style={{ background: '#1E293B', border: 'none', borderRadius: 6, color: '#94A3B8', cursor: 'pointer', padding: 8 }} onClick={() => setPeopleSortOrder(o => o === 'asc' ? 'desc' : 'asc')}>
              {peopleSortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div style={ds.card}>
        <div style={ds.tableContainer}>
          <table style={ds.table}>
            <thead>
              <tr>
                <th style={{ ...ds.th, width: '10%' }}>Order</th>
                <th style={{ ...ds.th, width: '35%' }}>Person</th>
                <th style={{ ...ds.th, width: '25%' }}>Bio Summary</th>
                <th style={{ ...ds.th, width: '15%' }}>Active Status</th>
                <th style={{ ...ds.th, width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.length === 0 ? (
                <tr><td colSpan={5} style={{ ...ds.td, textAlign: 'center', padding: '40px 0', color: '#64748B' }}>No team members match the current filters.</td></tr>
              ) : (
                filteredTeam.map((m, idx, arr) => (
                  <tr key={m.id} style={ds.tr}>
                    <td style={ds.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button style={ds.orderBtn} onClick={() => moveMemberOrder(m, 'up')} disabled={idx === 0}><ArrowUp size={12} /></button>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#F1F5F9' }}>{m.display_order}</span>
                        <button style={ds.orderBtn} onClick={() => moveMemberOrder(m, 'down')} disabled={idx === arr.length - 1}><ArrowDown size={12} /></button>
                      </div>
                    </td>
                    <td style={ds.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: '#fff', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)' }}>
                          {m.image_url ? <img src={m.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9' }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>{m.role}</div>
                          <div style={{ fontSize: 9, color: '#475569', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{m.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={ds.td}>
                      <div style={{ fontSize: 12, color: '#94A3B8', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>
                        {m.bio || <span style={{ fontStyle: 'italic', color: '#475569' }}>No bio provided</span>}
                      </div>
                    </td>
                    <td style={ds.td}>
                      <button onClick={() => handleToggleMemberActive(m)} style={{ border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: m.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: m.is_active ? '#34D399' : '#FCA5A5' }}>
                        {m.is_active ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td style={ds.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={ds.editBtn} title="Edit" onClick={() => openEditMember(m)}><Edit size={14} /></button>
                        <button style={{ ...ds.editBtn, borderColor: 'rgba(239,68,68,0.2)', color: '#EF4444' }} title="Deactivate" onClick={() => triggerDeleteMember(m.id, m.name, false)}><X size={14} /></button>
                        <button style={ds.deleteBtn} title="Delete Permanently" onClick={() => triggerDeleteMember(m.id, m.name, true)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
