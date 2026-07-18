'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, BookOpen, Layers, Briefcase, HelpCircle, LogOut,
  Search, X, Check, AlertTriangle, Sliders, Settings, Inbox, Save
} from 'lucide-react';
import type { TeamMember } from '@/types/team.types';
import { API_URL } from '@/services/api';

// ── Types ──────────────────────────────────────────────────────────────────────
import type { TabType, FAQ, OpenPosition, Milestone, PartnerProduct } from './types/admin.types';

// ── Shared Design System ───────────────────────────────────────────────────────
import { ds } from './ds';

// ── Sub-components ─────────────────────────────────────────────────────────────
import SidebarButton from './components/SidebarButton';
import PeopleTab from './tabs/PeopleTab';
import FaqsTab from './tabs/FaqsTab';
import CareersTab from './tabs/CareersTab';
import MilestonesTab from './tabs/MilestonesTab';
import PartnerProductsTab from './tabs/PartnerProductsTab';
import ToolConfigTab from './tabs/ToolConfigTab';
import TeamMemberModal from './modals/TeamMemberModal';
import FaqModal from './modals/FaqModal';
import JobModal from './modals/JobModal';
import MilestoneModal from './modals/MilestoneModal';
import ProductModal from './modals/ProductModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SubmissionManagement from '@/components/pages/admin/SubmissionManagement';
import GlobalSearchResults from './components/GlobalSearchResults';

export default function AdminDashboardPage() {
  const router = useRouter();
  const routerPushRef = React.useRef(router.push);
  React.useEffect(() => { routerPushRef.current = router.push; });

  // Intercept fetch to add Authorization header
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const token = localStorage.getItem('admin-token');
      if (token) {
        init = init || {};
        const headers = new Headers(init.headers || {});
        if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
        init.headers = headers;
      }
      return originalFetch(input, init);
    };
    return () => { window.fetch = originalFetch; };
  }, []);

  // ── Core State ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>('people');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // ── Database State ────────────────────────────────────────────────────────────
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [partnerProducts, setPartnerProducts] = useState<PartnerProduct[]>([]);
  const [toolConfigs, setToolConfigs] = useState<any>({ idea_validator: null, build_estimator: null });

  // ── People State ──────────────────────────────────────────────────────────────
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleCategoryFilter, setPeopleCategoryFilter] = useState<'ALL' | 'Founder' | 'Partner' | 'Team Member' | 'Advisor'>('ALL');
  const [peopleSortField, setPeopleSortField] = useState<'name' | 'display_order'>('display_order');
  const [peopleSortOrder, setPeopleSortOrder] = useState<'asc' | 'desc'>('asc');
  const [peopleSubTab, setPeopleSubTab] = useState<'core' | 'advisors'>('core');
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // ── FAQ State ─────────────────────────────────────────────────────────────────
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('ALL');

  // ── Careers State ─────────────────────────────────────────────────────────────
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<OpenPosition> | null>(null);
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('ALL');

  // ── Milestones State ──────────────────────────────────────────────────────────
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);

  // ── Partner Products State ────────────────────────────────────────────────────
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<PartnerProduct> | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // ── Delete Confirm State ──────────────────────────────────────────────────────
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; permanent: boolean } | null>(null);

  // ── Global Search State ───────────────────────────────────────────────────────
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('Dtoken') || '';
    let targetUrl = url;
    if (url.startsWith('/api/')) {
      const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      targetUrl = apiBase + url.slice(4);
    }
    return fetch(targetUrl, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
  };

  // ── Auth & Data Init ──────────────────────────────────────────────────────────
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await authFetch('/api/auth/check');
        if (!authRes.ok) { routerPushRef.current('/admin/login'); return; }
        const authJson = await authRes.json();
        if (!authJson.authenticated) { routerPushRef.current('/admin/login'); return; }
        setUser({ email: authJson.user?.email || 'admin@crestcode.com' });

        const [contentRes, teamRes, toolConfigRes, faqsRes, positionsRes, milestonesRes, productsRes] = await Promise.all([
          authFetch('/api/content'), authFetch('/api/team?all=true'), authFetch('/api/tool-config'),
          authFetch('/api/faqs?all=true'), authFetch('/api/open-positions?all=true'),
          authFetch('/api/milestones'), authFetch('/api/partner-products?all=true')
        ]);

        const [contentJson, teamJson, toolConfigJson, faqsJson, positionsJson, milestonesJson, productsJson] = await Promise.all([
          contentRes.json(), teamRes.json(), toolConfigRes.json(),
          faqsRes.json(), positionsRes.json(), milestonesRes.json(), productsRes.json()
        ]);

        if (contentJson.status === 'success') setContentConfig(contentJson.payload);
        setTeam(teamJson.payload || []);
        setFaqs(faqsJson.payload || []);
        setOpenPositions(positionsJson.payload || []);
        setMilestones(milestonesJson.payload || []);
        setPartnerProducts(productsJson.payload || []);
        if (toolConfigJson.status === 'success' && toolConfigJson.payload) setToolConfigs(toolConfigJson.payload);

        const urlParams = new URLSearchParams(window.location.search);
        const queryTab = urlParams.get('tab') as TabType;
        const editId = urlParams.get('edit');
        if (queryTab) {
          setActiveTab(queryTab);
          if (editId) {
            if (queryTab === 'people') { const m = (teamJson.payload || []).find((m: any) => m.id === editId); if (m) { setEditingMember(m); setTeamModalOpen(true); } }
            else if (queryTab === 'faqs') { const f = (faqsJson.payload || []).find((f: any) => f.id === editId); if (f) { setEditingFaq(f); setFaqModalOpen(true); } }
            else if (queryTab === 'open_positions') { const j = (positionsJson.payload || []).find((j: any) => j.id === editId); if (j) { setEditingJob(j); setJobModalOpen(true); } }
            else if (queryTab === 'milestones') { const ms = (milestonesJson.payload || []).find((ms: any) => ms.id === editId); if (ms) { setEditingMilestone(ms); setMilestoneModalOpen(true); } }
            else if (queryTab === 'partner_products') { const p = (productsJson.payload || []).find((p: any) => p.id === editId); if (p) { setEditingProduct(p); setProductModalOpen(true); } }
          }
        }
      } catch (err: any) {
        console.error('Dashboard init error:', err);
        routerPushRef.current('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const handleLogout = async () => {
    try { await authFetch('/api/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('admin-token');
    router.push('/admin/login');
  };

  // ── People Handlers ───────────────────────────────────────────────────────────
  const openAddMember = (cat: TeamMember['category']) => { setEditingMember({ name: '', role: '', bio: '', category: cat, display_order: team.filter(m => m.category === cat).length + 1, is_active: true, image_url: '' }); setTeamModalOpen(true); };
  const openEditMember = (m: TeamMember) => { setEditingMember({ ...m }); setTeamModalOpen(true); };

  const handleSaveMember = async () => {
    if (!editingMember?.name || !editingMember?.role || !editingMember?.category) { showToast('error', 'Name, Role, and Category are required.'); return; }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingMember.id;
      const res = await fetch(isEdit ? `/api/team?id=${editingMember.id}` : '/api/team', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingMember) });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/team?all=true'); const rj = await r.json(); setTeam(rj.payload || []);
        setTeamModalOpen(false); setEditingMember(null); setSaveStatus('idle'); showToast('success', isEdit ? 'Member updated!' : 'Member added!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Saving team member failed'); }
    } catch (e: any) { setSaveStatus('error'); showToast('error', e.message); }
  };

  const triggerDeleteMember = (id: string, name: string, permanent: boolean) => { setDeleteTarget({ id, name, permanent }); setDeleteConfirmOpen(true); };

  const handleConfirmDeleteMember = async () => {
    if (!deleteTarget) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/team?id=${deleteTarget.id}${deleteTarget.permanent ? '&permanent=true' : ''}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/team?all=true'); const rj = await r.json(); setTeam(rj.payload || []);
        setDeleteConfirmOpen(false); setDeleteTarget(null); setSaveStatus('idle');
        showToast('success', deleteTarget.permanent ? 'Member permanently deleted!' : 'Member deactivated!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Deletion failed'); }
    } catch (e: any) { setSaveStatus('error'); showToast('error', e.message); }
  };

  const handleToggleMemberActive = async (m: TeamMember) => {
    try {
      const updated = { ...m, is_active: !m.is_active };
      const res = await fetch(`/api/team?id=${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/team?all=true'); const rj = await r.json(); setTeam(rj.payload || []); showToast('success', updated.is_active ? 'Member reactivated!' : 'Member deactivated!'); }
    } catch (err: any) { showToast('error', err.message); }
  };

  const moveMemberOrder = async (m: TeamMember, dir: 'up' | 'down') => {
    const categoryMembers = team.filter(x => x.category === m.category).sort((a, b) => a.display_order - b.display_order);
    const idx = categoryMembers.findIndex(x => x.id === m.id);
    if (idx === -1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categoryMembers.length) return;
    const targetMember = categoryMembers[targetIdx];
    const tempOrder = m.display_order; m.display_order = targetMember.display_order; targetMember.display_order = tempOrder;
    setSaveStatus('saving');
    try {
      const res = await authFetch('/api/team/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates: [{ id: m.id, display_order: m.display_order }, { id: targetMember.id, display_order: targetMember.display_order }] }) });
      const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/team?all=true'); const rj = await r.json(); setTeam(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Display order updated!'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'File size exceeds 5MB limit'); return; }
    setImageUploading(true);
    const formData = new FormData(); formData.append('file', file);
    try {
      const res = await authFetch('/api/people/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.url) { setEditingMember({ ...editingMember, image_url: json.url }); showToast('success', 'Profile image uploaded!'); }
      else { showToast('error', json.error || 'Upload failed'); }
    } catch (err: any) { showToast('error', err.message); } finally { setImageUploading(false); }
  };

  // ── FAQ Handlers ──────────────────────────────────────────────────────────────
  const openAddFaq = () => { setEditingFaq({ category: 'engagement', question: '', answer: '', is_active: true }); setFaqModalOpen(true); };
  const openEditFaq = (faq: FAQ) => { setEditingFaq({ ...faq }); setFaqModalOpen(true); };

  const handleSaveFaq = async () => {
    if (!editingFaq?.category || !editingFaq?.question || !editingFaq?.answer) { showToast('error', 'Category, Question, and Answer are required.'); return; }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingFaq.id;
      const res = await fetch(isEdit ? `/api/faqs?id=${editingFaq.id}` : '/api/faqs', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingFaq) });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/faqs?all=true'); const rj = await r.json(); setFaqs(rj.payload || []);
        setFaqModalOpen(false); setEditingFaq(null); setSaveStatus('idle'); showToast('success', isEdit ? 'FAQ updated!' : 'FAQ created!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Saving FAQ failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ permanently?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' }); const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/faqs?all=true'); const rj = await r.json(); setFaqs(rj.payload || []); setSaveStatus('idle'); showToast('success', 'FAQ deleted!'); }
      else { setSaveStatus('error'); showToast('error', json.message || 'Deletion failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const moveFaqOrder = async (faq: FAQ, direction: 'up' | 'down') => {
    const idx = faqs.findIndex(f => f.id === faq.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;
    const swapFaq = faqs[targetIdx]; const orderA = faq.display_order; const orderB = swapFaq.display_order;
    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/faqs?id=${faq.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderB }) }),
        fetch(`/api/faqs?id=${swapFaq.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderA }) })
      ]);
      const r = await authFetch('/api/faqs?all=true'); const rj = await r.json(); setFaqs(rj.payload || []); setSaveStatus('idle'); showToast('success', 'FAQ order updated!');
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  // ── Careers Handlers ──────────────────────────────────────────────────────────
  const openAddJob = () => { setEditingJob({ title: '', location: 'Chennai, TN', type: 'Full Time', experience: '', category: 'Engineering', apply_link: 'mailto:careers@crestcode.usa', application_email: 'careers@crestcode.usa', is_active: true }); setJobModalOpen(true); };
  const openEditJob = (job: OpenPosition) => { setEditingJob({ ...job }); setJobModalOpen(true); };

  const handleSaveJob = async () => {
    if (!editingJob?.title || !editingJob?.experience || !editingJob?.category) { showToast('error', 'Title, Experience, and Category are required.'); return; }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingJob.id;
      const res = await fetch(isEdit ? `/api/open-positions?id=${editingJob.id}` : '/api/open-positions', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingJob) });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/open-positions?all=true'); const rj = await r.json(); setOpenPositions(rj.payload || []);
        setJobModalOpen(false); setEditingJob(null); setSaveStatus('idle'); showToast('success', isEdit ? 'Job updated!' : 'Job created!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Saving job failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job position permanently?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/open-positions?id=${id}`, { method: 'DELETE' }); const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/open-positions?all=true'); const rj = await r.json(); setOpenPositions(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Job deleted!'); }
      else { setSaveStatus('error'); showToast('error', json.message || 'Deletion failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const moveJobOrder = async (job: OpenPosition, direction: 'up' | 'down') => {
    const idx = openPositions.findIndex(j => j.id === job.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= openPositions.length) return;
    const swapJob = openPositions[targetIdx]; const orderA = job.display_order; const orderB = swapJob.display_order;
    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/open-positions?id=${job.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderB }) }),
        fetch(`/api/open-positions?id=${swapJob.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderA }) })
      ]);
      const r = await authFetch('/api/open-positions?all=true'); const rj = await r.json(); setOpenPositions(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Positions order updated!');
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  // ── Milestones Handlers ───────────────────────────────────────────────────────
  const openAddMilestone = () => { setEditingMilestone({ year: '', title: '', description: '', image_url: '' }); setMilestoneModalOpen(true); };
  const openEditMilestone = (m: Milestone) => { setEditingMilestone({ ...m }); setMilestoneModalOpen(true); };

  const handleSaveMilestone = async () => {
    if (!editingMilestone?.year || !editingMilestone?.title || !editingMilestone?.description) { showToast('error', 'Year, Title, and Description are required.'); return; }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingMilestone.id;
      const res = await fetch(isEdit ? `/api/milestones?id=${editingMilestone.id}` : '/api/milestones', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingMilestone) });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/milestones'); const rj = await r.json(); setMilestones(rj.payload || []);
        setMilestoneModalOpen(false); setEditingMilestone(null); setSaveStatus('idle'); showToast('success', isEdit ? 'Milestone updated!' : 'Milestone created!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Saving milestone failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/milestones?id=${id}`, { method: 'DELETE' }); const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/milestones'); const rj = await r.json(); setMilestones(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Milestone deleted!'); }
      else { setSaveStatus('error'); showToast('error', json.message || 'Deletion failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const moveMilestoneOrder = async (m: Milestone, direction: 'up' | 'down') => {
    const idx = milestones.findIndex(x => x.id === m.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= milestones.length) return;
    const swapMilestone = milestones[targetIdx]; const orderA = m.display_order; const orderB = swapMilestone.display_order;
    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/milestones?id=${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderB }) }),
        fetch(`/api/milestones?id=${swapMilestone.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderA }) })
      ]);
      const r = await authFetch('/api/milestones'); const rj = await r.json(); setMilestones(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Milestones order updated!');
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  // ── Partner Products Handlers ─────────────────────────────────────────────────
  const openAddProduct = () => { setEditingProduct({ name: '', status_type: 'live', status_text: 'Live', status_subtext: 'Web ready', tagline: '', subtitle: '', stat_value: '', stat_subtext: '', what_we_did: '', industry: '', duration: '', team_size: '', tech_stack: [], features: [], gallery_images: [], website_url: '', logo_url: '', is_active: true }); setProductModalOpen(true); };
  const openEditProduct = (prod: PartnerProduct) => { setEditingProduct({ ...prod }); setProductModalOpen(true); };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.tagline || !editingProduct?.subtitle || !editingProduct?.what_we_did) { showToast('error', 'Name, Tagline, Subtitle, and What We Did are required.'); return; }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingProduct.id;
      const res = await fetch(isEdit ? `/api/partner-products?id=${editingProduct.id}` : '/api/partner-products', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProduct) });
      const json = await res.json();
      if (json.status === 'success') {
        const r = await authFetch('/api/partner-products?all=true'); const rj = await r.json(); setPartnerProducts(rj.payload || []);
        setProductModalOpen(false); setEditingProduct(null); setSaveStatus('idle'); showToast('success', isEdit ? 'Product updated!' : 'Product created!');
      } else { setSaveStatus('error'); showToast('error', json.message || 'Saving product failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this partner product permanently?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/partner-products?id=${id}`, { method: 'DELETE' }); const json = await res.json();
      if (json.status === 'success') { const r = await authFetch('/api/partner-products?all=true'); const rj = await r.json(); setPartnerProducts(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Product deleted!'); }
      else { setSaveStatus('error'); showToast('error', json.message || 'Deletion failed'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const moveProductOrder = async (prod: PartnerProduct, direction: 'up' | 'down') => {
    const idx = partnerProducts.findIndex(p => p.id === prod.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= partnerProducts.length) return;
    const swapProd = partnerProducts[targetIdx]; const orderA = prod.display_order; const orderB = swapProd.display_order;
    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/partner-products?id=${prod.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderB }) }),
        fetch(`/api/partner-products?id=${swapProd.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: orderA }) })
      ]);
      const r = await authFetch('/api/partner-products?all=true'); const rj = await r.json(); setPartnerProducts(rj.payload || []); setSaveStatus('idle'); showToast('success', 'Products order updated!');
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };

  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0]; if (!file) return; setImageUploading(true);
    try {
      const formData = new FormData(); formData.append('file', file);
      const res = await authFetch('/api/portfolio/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.status === 'success' && json.url) { callback(json.url); showToast('success', 'Portfolio file uploaded!'); }
      else { showToast('error', json.error || 'Upload failed'); }
    } catch (err: any) { showToast('error', err.message); } finally { setImageUploading(false); }
  };

  // ── Tool Config Handlers ──────────────────────────────────────────────────────
  const updateToolConfig = (toolKey: string, section: string, field: string, val: any) => {
    const updated = { ...toolConfigs }; if (!updated[toolKey]) updated[toolKey] = {}; if (!updated[toolKey][section]) updated[toolKey][section] = {};
    updated[toolKey][section][field] = val; setToolConfigs(updated);
  };
  const updateToolConfigDeep = (toolKey: string, section: string, subSection: string, field: string, val: any) => {
    const updated = { ...toolConfigs }; if (!updated[toolKey]) updated[toolKey] = {}; if (!updated[toolKey][section]) updated[toolKey][section] = {}; if (!updated[toolKey][section][subSection]) updated[toolKey][section][subSection] = {};
    updated[toolKey][section][subSection][field] = val; setToolConfigs(updated);
  };
  const handleSaveToolConfig = async (toolKey: string) => {
    setSaveStatus('saving');
    try {
      const res = await authFetch('/api/tool-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: toolKey, config: toolConfigs[toolKey] }) });
      const json = await res.json();
      if (json.status === 'success') { setSaveStatus('idle'); showToast('success', `${toolKey === 'idea_validator' ? 'Idea Validator' : 'Build Time Estimator'} configuration saved!`); }
      else { setSaveStatus('error'); showToast('error', json.payload || 'Failed to update tool config'); }
    } catch (err: any) { setSaveStatus('error'); showToast('error', err.message); }
  };



  // ── Loading Screen ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#090D16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite', marginBottom: 20 }} />
        <p style={{ fontWeight: 600, color: '#94A3B8' }}>Loading CrestCode Admin...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <div style={ds.layout}>
        {/* ── Sidebar ── */}
        <aside style={ds.sidebar}>
          <div style={ds.sidebarHeader}>
            <div style={ds.logoBadge}>CC</div>
            <div>
              <div style={ds.sidebarTitle}>CrestCode Admin</div>
              <div style={ds.sidebarUser}>{user?.email}</div>
            </div>
          </div>
          <nav style={ds.nav}>
            <div style={ds.navDivider}>DATABASES</div>
            <SidebarButton active={activeTab === 'people'} icon={<Users size={18} />} label="People Management" onClick={() => setActiveTab('people')} />
            <SidebarButton active={activeTab === 'faqs'} icon={<HelpCircle size={18} />} label="FAQs CRUD" onClick={() => setActiveTab('faqs')} />
            <SidebarButton active={activeTab === 'open_positions'} icon={<Briefcase size={18} />} label="Open Positions" onClick={() => setActiveTab('open_positions')} />
            <SidebarButton active={activeTab === 'milestones'} icon={<BookOpen size={18} />} label="Timeline Milestones" onClick={() => setActiveTab('milestones')} />
            <SidebarButton active={activeTab === 'partner_products'} icon={<Layers size={18} />} label="Partner Products" onClick={() => setActiveTab('partner_products')} />
            <SidebarButton active={activeTab === 'submissions'} icon={<Inbox size={18} />} label="Submissions Management" onClick={() => setActiveTab('submissions')} />
            <div style={ds.navDivider}>SYSTEMS</div>
            <SidebarButton active={activeTab === 'tool_config'} icon={<Sliders size={18} />} label="Tool Configs" onClick={() => setActiveTab('tool_config')} />
          </nav>
          <div style={ds.sidebarFooter}>
            <button style={ds.logoutBtn} onClick={handleLogout}><LogOut size={16} /> Log Out</button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={ds.content}>
          <header style={ds.headerBar}>
            <h2 style={ds.tabTitle}>
              {activeTab === 'tool_config' ? 'SYSTEM TOOL CONFIGURATIONS' : activeTab === 'open_positions' ? 'OPEN POSITIONS' : activeTab === 'partner_products' ? 'PARTNER PRODUCTS' : `${activeTab.toUpperCase()} MANAGEMENT`}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, color: '#64748B' }} />
                <input type="text" placeholder="Search across all databases..." value={globalSearchKeyword} onChange={e => setGlobalSearchKeyword(e.target.value)} style={{ padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid #1E293B', background: '#090D16', color: '#F1F5F9', fontSize: 13, width: 240, outline: 'none' }} />
                {globalSearchKeyword && <button onClick={() => setGlobalSearchKeyword('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={14} /></button>}
              </div>
              {saveStatus !== 'idle' && (
                <span style={{ fontSize: 13, fontWeight: 600, color: saveStatus === 'success' ? '#34D399' : saveStatus === 'error' ? '#FCA5A5' : '#60A5FA', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {saveStatus === 'saving' && <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                  {saveMsg}
                </span>
              )}
            </div>
          </header>

          <div style={{ padding: '0 24px 24px 24px' }}>
            {/* Global Search Results */}
            {globalSearchKeyword && (
              <GlobalSearchResults
                globalSearchKeyword={globalSearchKeyword}
                setGlobalSearchKeyword={setGlobalSearchKeyword}
                team={team}
                faqs={faqs}
                openPositions={openPositions}
                milestones={milestones}
                partnerProducts={partnerProducts}
                setActiveTab={setActiveTab}
                openEditMember={openEditMember}
                openEditFaq={openEditFaq}
              />
            )}

            {/* ── Tab Content ── */}
            {!globalSearchKeyword && activeTab === 'people' && (
              <PeopleTab
                team={team} peopleSubTab={peopleSubTab} setPeopleSubTab={setPeopleSubTab}
                peopleSearch={peopleSearch} setPeopleSearch={setPeopleSearch}
                peopleCategoryFilter={peopleCategoryFilter} setPeopleCategoryFilter={setPeopleCategoryFilter}
                peopleSortField={peopleSortField} setPeopleSortField={setPeopleSortField}
                peopleSortOrder={peopleSortOrder} setPeopleSortOrder={setPeopleSortOrder}
                openAddMember={openAddMember} openEditMember={openEditMember}
                triggerDeleteMember={triggerDeleteMember} moveMemberOrder={moveMemberOrder}
                handleToggleMemberActive={handleToggleMemberActive}
              />
            )}
            {!globalSearchKeyword && activeTab === 'faqs' && (
              <FaqsTab faqs={faqs} faqSearch={faqSearch} setFaqSearch={setFaqSearch} faqCategoryFilter={faqCategoryFilter} setFaqCategoryFilter={setFaqCategoryFilter} openAddFaq={openAddFaq} openEditFaq={openEditFaq} handleDeleteFaq={handleDeleteFaq} moveFaqOrder={moveFaqOrder} />
            )}
            {!globalSearchKeyword && activeTab === 'open_positions' && (
              <CareersTab openPositions={openPositions} jobSearch={jobSearch} setJobSearch={setJobSearch} jobCategoryFilter={jobCategoryFilter} setJobCategoryFilter={setJobCategoryFilter} openAddJob={openAddJob} openEditJob={openEditJob} handleDeleteJob={handleDeleteJob} moveJobOrder={moveJobOrder} />
            )}
            {!globalSearchKeyword && activeTab === 'milestones' && (
              <MilestonesTab milestones={milestones} openAddMilestone={openAddMilestone} openEditMilestone={openEditMilestone} handleDeleteMilestone={handleDeleteMilestone} moveMilestoneOrder={moveMilestoneOrder} />
            )}
            {!globalSearchKeyword && activeTab === 'partner_products' && (
              <PartnerProductsTab partnerProducts={partnerProducts} openAddProduct={openAddProduct} openEditProduct={openEditProduct} handleDeleteProduct={handleDeleteProduct} moveProductOrder={moveProductOrder} />
            )}
            {!globalSearchKeyword && activeTab === 'tool_config' && (
              <ToolConfigTab toolConfigs={toolConfigs} updateToolConfig={updateToolConfig} updateToolConfigDeep={updateToolConfigDeep} handleSaveToolConfig={handleSaveToolConfig} ds={ds} />
            )}
            {!globalSearchKeyword && activeTab === 'submissions' && <SubmissionManagement />}
          </div>
        </main>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: toast.type === 'success' ? '#10B981' : '#EF4444', color: '#fff', padding: '12px 24px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}{toast.message}
        </div>
      )}

      {/* ── Modals ── */}
      {deleteConfirmOpen && deleteTarget && <DeleteConfirmModal deleteTarget={deleteTarget} onClose={() => setDeleteConfirmOpen(false)} onConfirm={handleConfirmDeleteMember} saveStatus={saveStatus} />}
      {teamModalOpen && editingMember && <TeamMemberModal editingMember={editingMember} setEditingMember={(m) => setEditingMember(m)} onClose={() => setTeamModalOpen(false)} onSave={handleSaveMember} saveStatus={saveStatus} imageUploading={imageUploading} handleAvatarUpload={handleAvatarUpload} />}
      {faqModalOpen && editingFaq && <FaqModal editingFaq={editingFaq} setEditingFaq={(f) => setEditingFaq(f)} onClose={() => setFaqModalOpen(false)} onSave={handleSaveFaq} saveStatus={saveStatus} />}
      {jobModalOpen && editingJob && <JobModal editingJob={editingJob} setEditingJob={(j) => setEditingJob(j)} onClose={() => setJobModalOpen(false)} onSave={handleSaveJob} saveStatus={saveStatus} />}
      {milestoneModalOpen && editingMilestone && <MilestoneModal editingMilestone={editingMilestone} setEditingMilestone={(m) => setEditingMilestone(m)} onClose={() => setMilestoneModalOpen(false)} onSave={handleSaveMilestone} saveStatus={saveStatus} />}
      {productModalOpen && editingProduct && <ProductModal editingProduct={editingProduct} setEditingProduct={(p) => setEditingProduct(p)} onClose={() => setProductModalOpen(false)} onSave={handleSaveProduct} saveStatus={saveStatus} imageUploading={imageUploading} handlePortfolioFileUpload={handlePortfolioFileUpload} ds={ds} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
