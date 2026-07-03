'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamMember, TeamMemberInput, TeamCategory } from '@/types/team';

const CATEGORIES: TeamCategory[] = ['Founder', 'Partner', 'Team Member', 'Advisor'];

const CATEGORY_COLORS: Record<TeamCategory, { bg: string; text: string }> = {
  Founder:       { bg: 'rgba(99,102,241,0.15)',  text: '#818CF8' },
  Partner:       { bg: 'rgba(16,185,129,0.15)',  text: '#34D399' },
  Advisor:       { bg: 'rgba(245,158,11,0.15)',  text: '#FBBF24' },
  'Team Member': { bg: 'rgba(0,90,226,0.15)',    text: '#60A5FA' },
};

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const EMPTY_FORM: TeamMemberInput = {
  name: '',
  role: '',
  bio: '',
  category: 'Team Member',
  display_order: 0,
  is_active: true,
};

// ── Which section each category belongs to ───────────────────
function isTeamSection(cat: TeamCategory) {
  return cat !== 'Advisor';
}

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken]           = useState<string | null>(null);
  const [authed, setAuthed]         = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [members, setMembers]   = useState<TeamMember[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const [panelOpen, setPanelOpen]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<TeamMemberInput>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [deleting, setDeleting]     = useState(false);

  // ── Auth ─────────────────────────────────────────────────
  useEffect(() => {
    const t = localStorage.getItem('admin-token');
    if (t) { setToken(t); setAuthed(true); }
    setAuthChecked(true);
  }, []);

  // ── Fetch all members (including inactive) ────────────────
  const fetchMembers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/team?all=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === 'success') {
        setMembers(json.payload || []);
      } else {
        setError(json.message || 'Failed to load team members');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (authed) fetchMembers(); }, [authed, fetchMembers]);

  // ── Panel helpers ─────────────────────────────────────────
  function openAdd(defaultCategory: TeamCategory) {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category: defaultCategory, display_order: members.length + 1 });
    setSaveError(null);
    setPanelOpen(true);
  }

  function openEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, bio: m.bio || '', category: m.category, display_order: m.display_order, is_active: m.is_active });
    setSaveError(null);
    setPanelOpen(true);
  }

  function closePanel() { setPanelOpen(false); setEditingId(null); setSaveError(null); }

  // ── Save ──────────────────────────────────────────────────
  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) { setSaveError('Name and Role are required.'); return; }
    setSaving(true); setSaveError(null);
    try {
      const url    = editingId ? `/api/team?id=${editingId}` : '/api/team';
      const method = editingId ? 'PUT' : 'POST';
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.status === 'success') { closePanel(); await fetchMembers(); }
      else setSaveError(json.message || 'Save failed');
    } catch (e: any) { setSaveError(e.message); }
    finally { setSaving(false); }
  }

  // ── Delete (soft) ─────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res  = await fetch(`/api/team?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.status === 'success') { setDeleteId(null); await fetchMembers(); }
    } catch (e: any) { setError(e.message); }
    finally { setDeleting(false); }
  }

  // ── Reactivate ────────────────────────────────────────────
  async function handleReactivate(m: TeamMember) {
    try {
      await fetch(`/api/team?id=${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ is_active: true }) });
      await fetchMembers();
    } catch {}
  }

  // ── Reorder ───────────────────────────────────────────────
  async function moveOrder(member: TeamMember, dir: 'up' | 'down') {
    const group  = [...members].filter(m => m.category === member.category).sort((a, b) => a.display_order - b.display_order);
    const idx    = group.findIndex(m => m.id === member.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= group.length) return;
    const a = group[idx], b = group[swapIdx];
    try {
      await fetch('/api/team/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ updates: [{ id: a.id, display_order: b.display_order }, { id: b.id, display_order: a.display_order }] }) });
      await fetchMembers();
    } catch {}
  }

  // ── Derived lists ─────────────────────────────────────────
  const teamSection    = [...members].filter(m =>  isTeamSection(m.category)).sort((a, b) => a.display_order - b.display_order);
  const advisorSection = [...members].filter(m => !isTeamSection(m.category)).sort((a, b) => a.display_order - b.display_order);

  // ── Auth gate — built-in login form ──────────────────────
  if (authChecked && !authed) {
    return <AdminLoginForm onSuccess={(t) => { setToken(t); setAuthed(true); }} />;
  }
  if (!authChecked) return null;

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={s.logoBadge}>CC</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.01em' }}>CrestCode Admin</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>Team Management Dashboard</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={s.btnGhost} onClick={() => router.push('/')}>← Back to Site</button>
            <button style={s.btnDanger} onClick={() => { localStorage.removeItem('admin-token'); router.push('/'); }}>Log Out</button>
          </div>
        </div>
      </header>

      <main style={s.main}>

        {/* Error */}
        {error && (
          <div style={s.errorBanner}>
            ⚠️ {error}
            <button style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchMembers}>Retry</button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* SECTION 1 — THE TEAM                                */}
        {/* Matches "The People Behind The Studio." on /about   */}
        {/* ════════════════════════════════════════════════════ */}
        <div style={s.sectionWrap}>
          <div style={s.sectionHead}>
            <div>
              <div style={s.sectionLabel}>SECTION 1 — THE TEAM</div>
              <h2 style={s.sectionTitle}>The People Behind The Studio.</h2>
              <p style={s.sectionSub}>Founders · Partners · Team Members &nbsp;·&nbsp; {teamSection.length} member{teamSection.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {teamSection.filter(m => m.is_active).length} active</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.btnAdd} onClick={() => openAdd('Team Member')}>+ Add Team Member</button>
            </div>
          </div>

          {loading ? <SkeletonGrid /> : (
            <div style={s.grid}>
              {teamSection.map((m, idx) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  idx={idx}
                  total={teamSection.length}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                  onReactivate={handleReactivate}
                  onMove={moveOrder}
                />
              ))}
              {teamSection.length === 0 && !loading && (
                <EmptyState label="No team members yet." onAdd={() => openAdd('Team Member')} />
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* ════════════════════════════════════════════════════ */}
        {/* SECTION 2 — ADVISORS                                */}
        {/* Matches "Expert Guidance Where It Matters Most." on /about */}
        {/* ════════════════════════════════════════════════════ */}
        <div style={s.sectionWrap}>
          <div style={s.sectionHead}>
            <div>
              <div style={{ ...s.sectionLabel, color: '#FBBF24' }}>SECTION 2 — ADVISORS</div>
              <h2 style={s.sectionTitle}>Expert Guidance Where It Matters Most.</h2>
              <p style={s.sectionSub}>Advisors &nbsp;·&nbsp; {advisorSection.length} advisor{advisorSection.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {advisorSection.filter(m => m.is_active).length} active</p>
            </div>
            <button style={{ ...s.btnAdd, background: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.25)' }} onClick={() => openAdd('Advisor')}>+ Add Advisor</button>
          </div>

          {loading ? <SkeletonGrid count={2} /> : (
            <div style={{ ...s.grid, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {advisorSection.map((m, idx) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  idx={idx}
                  total={advisorSection.length}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                  onReactivate={handleReactivate}
                  onMove={moveOrder}
                  horizontal
                />
              ))}
              {advisorSection.length === 0 && !loading && (
                <EmptyState label="No advisors yet." onAdd={() => openAdd('Advisor')} />
              )}
            </div>
          )}
        </div>

      </main>

      {/* ── Add / Edit Panel ── */}
      {panelOpen && (
        <div style={s.overlay} onClick={closePanel}>
          <aside style={s.panel} onClick={e => e.stopPropagation()}>
            <div style={s.panelHeader}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#F1F5F9' }}>
                {editingId ? 'Edit Member' : 'Add Member'}
              </h2>
              <button style={s.closeBtn} onClick={closePanel}>✕</button>
            </div>

            <div style={s.panelBody}>
              <Label>Full Name *</Label>
              <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jane Smith" />

              <Label>Role / Title *</Label>
              <input style={s.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Head of Design" />

              <Label>Category *</Label>
              <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as TeamCategory })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <Label>Bio</Label>
              <textarea style={{ ...s.input, height: 120, resize: 'vertical' as const }} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short biography..." />

              <Label>Display Order</Label>
              <input style={s.input} type="number" value={form.display_order ?? 0} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <Label style={{ margin: 0 }}>Active (visible on site)</Label>
                <button
                  style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', background: form.is_active ? '#2563EB' : '#334155', padding: 0 }}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                >
                  <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'transform 0.2s', transform: form.is_active ? 'translateX(20px)' : 'translateX(0)' }} />
                </button>
              </div>

              {saveError && <div style={s.saveError}>⚠️ {saveError}</div>}
            </div>

            <div style={s.panelFooter}>
              <button style={s.btnGhost} onClick={closePanel} disabled={saving}>Cancel</button>
              <button style={s.btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={s.confirmModal}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 8px' }}>Remove this member?</h3>
            <p style={{ color: '#94A3B8', marginBottom: 24, textAlign: 'center' as const, fontSize: 14 }}>
              They'll be hidden from the site. You can restore them any time.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={s.btnGhost} onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</button>
              <button style={s.btnDanger} onClick={() => handleDelete(deleteId)} disabled={deleting}>
                {deleting ? 'Removing…' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginTop: 14, ...style }}>
      {children}
    </span>
  );
}

function MemberCard({ member, idx, total, onEdit, onDelete, onReactivate, onMove, horizontal = false }: {
  member: TeamMember;
  idx: number;
  total: number;
  onEdit: (m: TeamMember) => void;
  onDelete: (id: string) => void;
  onReactivate: (m: TeamMember) => void;
  onMove: (m: TeamMember, dir: 'up' | 'down') => void;
  horizontal?: boolean;
}) {
  const catColor = CATEGORY_COLORS[member.category] || CATEGORY_COLORS['Team Member'];
  const isFirst  = idx === 0;
  const isLast   = idx === total - 1;

  return (
    <div style={{ ...s.card, opacity: member.is_active ? 1 : 0.55, flexDirection: horizontal ? 'row' : 'column', alignItems: horizontal ? 'flex-start' : 'flex-start', gap: horizontal ? 20 : 8 }}>
      {/* Order controls */}
      <div style={s.orderControls}>
        <button style={{ ...s.orderBtn, opacity: isFirst ? 0.25 : 1 }} onClick={() => onMove(member, 'up')} disabled={isFirst}>↑</button>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 700 }}>{member.display_order}</span>
        <button style={{ ...s.orderBtn, opacity: isLast ? 0.25 : 1 }} onClick={() => onMove(member, 'down')} disabled={isLast}>↓</button>
      </div>

      {/* Avatar */}
      <div style={s.avatar}>{getInitials(member.name)}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 6px', color: '#F1F5F9', letterSpacing: '-0.01em' }}>{member.name}</h3>
        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 100, background: catColor.bg, color: catColor.text, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 6 }}>
          {member.role}
        </span>
        <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{member.category}</div>
        {member.bio && (
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            {member.bio.length > 130 ? member.bio.slice(0, 130) + '…' : member.bio}
          </p>
        )}
        {!member.is_active && (
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#EF4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 100, marginTop: 8 }}>Inactive</span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button style={s.btnEdit}   onClick={() => onEdit(member)}>✏️ Edit</button>
          {member.is_active
            ? <button style={s.btnDel}  onClick={() => onDelete(member.id)}>🗑️ Remove</button>
            : <button style={s.btnRestore} onClick={() => onReactivate(member)}>↩ Restore</button>
          }
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div style={s.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...s.card, opacity: 0.35 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#334155', marginBottom: 12 }} />
          <div style={{ height: 14, width: '60%', background: '#334155', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 11, width: '35%', background: '#1e293b', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#1E293B', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.08)' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
      <p style={{ color: '#64748B', margin: '0 0 16px', fontSize: 14 }}>{label}</p>
      <button style={s.btnAdd} onClick={onAdd}>+ Add First</button>
    </div>
  );
}

// ── Admin Login Form ─────────────────────────────────────────
function AdminLoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const token = json.payload.token;
        localStorage.setItem('admin-token', token);
        onSuccess(token);
      } else {
        setError(json.payload || 'Invalid email or password');
      }
    } catch {
      setError('Connection error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 auto 16px', letterSpacing: '-0.02em' }}>CC</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Sign in to manage team members</p>
        </div>

        {/* Form card */}
        <form onSubmit={handleLogin} style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@crestcode.com"
              style={{ width: '100%', background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#F1F5F9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#F1F5F9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter',sans-serif" }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#FCA5A5', fontSize: 13, padding: '10px 14px', marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#1D4ED8' : '#2563EB', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', letterSpacing: '-0.01em' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#334155', marginTop: 20 }}>
          CrestCode · Admin access only
        </p>
      </div>
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  page:   { minHeight: '100vh', background: '#0F172A', fontFamily: "'Inter', sans-serif", color: '#F1F5F9' },
  header: { background: '#1E293B', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoBadge: { width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
  main:   { maxWidth: 1200, margin: '0 auto', padding: '40px 32px 80px' },
  sectionWrap: { marginBottom: 8 },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 },
  sectionLabel: { fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#60A5FA', textTransform: 'uppercase', marginBottom: 6 },
  sectionTitle: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#F1F5F9' },
  sectionSub:   { fontSize: 13, color: '#64748B', margin: 0 },
  divider: { height: 1, background: 'rgba(255,255,255,0.05)', margin: '40px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 },
  card: { background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', position: 'relative', transition: 'border-color 0.2s' },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', flexShrink: 0 },
  orderControls: { position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  orderBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, color: '#94A3B8', fontSize: 11, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  errorBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px', color: '#FCA5A5', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  btnPrimary: { background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnGhost:   { background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnDanger:  { background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnAdd:     { background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  btnEdit:    { flex: 1, background: 'rgba(37,99,235,0.1)', color: '#60A5FA', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnDel:     { flex: 1, background: 'rgba(239,68,68,0.08)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnRestore: { flex: 1, background: 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch' },
  panel:      { width: 480, maxWidth: '95vw', background: '#1E293B', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  panelHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  panelBody:  { flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column' },
  panelFooter:{ display: 'flex', gap: 12, padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  closeBtn:   { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94A3B8', width: 32, height: 32, cursor: 'pointer', fontSize: 14 },
  input:      { width: '100%', background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: '#F1F5F9', fontSize: 14, outline: 'none', fontFamily: "'Inter',sans-serif", boxSizing: 'border-box', marginTop: 5 },
  saveError:  { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#FCA5A5', fontSize: 12, padding: '10px 14px', marginTop: 12 },
  confirmModal:{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380, width: '90vw', margin: 'auto' },
  gate:       { minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  gateCard:   { background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 360 },
};
