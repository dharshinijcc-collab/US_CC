'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, BookOpen, Layers, Users, Star, Handshake, Briefcase, HelpCircle,
  LogOut, Plus, Trash2, Edit, Save, ArrowUp, ArrowDown, Upload, X, Check, AlertTriangle, Search, Filter, Sliders, Settings,
  Inbox
} from 'lucide-react';
import type { TeamMember } from '@/types/team';
import SubmissionManagement from '@/components/admin/SubmissionManagement';

type TabType = 'people' | 'faqs' | 'open_positions' | 'milestones' | 'partner_products' | 'tool_config' | 'submissions';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_active: boolean;
  display_order: number;
}

interface OpenPosition {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  apply_link: string;
  application_email: string;
  is_active: boolean;
  display_order: number;
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image_url: string | null;
  display_order: number;
}

interface PartnerProduct {
  id: string;
  name: string;
  status_type: string;
  status_text: string;
  status_subtext: string | null;
  tagline: string;
  subtitle: string;
  stat_value: string;
  stat_subtext: string;
  what_we_did: string;
  industry: string;
  duration: string;
  team_size: string;
  tech_stack: string[];
  features: Array<{ text: string }>;
  gallery_images: string[];
  website_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('people');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Database models
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [partnerProducts, setPartnerProducts] = useState<PartnerProduct[]>([]);
  const [toolConfigs, setToolConfigs] = useState<any>({
    idea_validator: null,
    build_estimator: null
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // FAQs State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('ALL');

  // Careers State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<OpenPosition> | null>(null);
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('ALL');

  // Timeline Milestones State
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);

  // Partner Products State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<PartnerProduct> | null>(null);
  const [productSearch, setProductSearch] = useState('');



  // Global Search State
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');

  // People Filters & Search
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleCategoryFilter, setPeopleCategoryFilter] = useState<'ALL' | 'Founder' | 'Partner' | 'Team Member' | 'Advisor'>('ALL');
  const [peopleSortField, setPeopleSortField] = useState<'name' | 'display_order'>('display_order');
  const [peopleSortOrder, setPeopleSortOrder] = useState<'asc' | 'desc'>('asc');
  const [peopleSubTab, setPeopleSubTab] = useState<'core' | 'advisors'>('core');

  // Modals
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Deletion confirmation modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; permanent: boolean } | null>(null);



  // Toast Helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth & Session Check
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await fetch('/api/auth/check');
        const authJson = await authRes.json();
        if (!authJson.authenticated) {
          router.push('/admin/login');
          return;
        }
        setUser({ email: authJson.user?.email || 'admin@crestcode.com' });

        // Fetch configs, team, tool configs, FAQs, Positions, Milestones, Products
        const [contentRes, teamRes, toolConfigRes, faqsRes, positionsRes, milestonesRes, productsRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/team?all=true'),
          fetch('/api/tool-config'),
          fetch('/api/faqs?all=true'),
          fetch('/api/open-positions?all=true'),
          fetch('/api/milestones'),
          fetch('/api/partner-products?all=true')
        ]);

        const contentJson = await contentRes.json();
        const teamJson = await teamRes.json();
        const toolConfigJson = await toolConfigRes.json();
        const faqsJson = await faqsRes.json();
        const positionsJson = await positionsRes.json();
        const milestonesJson = await milestonesRes.json();
        const productsJson = await productsRes.json();

        if (contentJson.status === 'success') {
          setContentConfig(contentJson.payload);
        }
        setTeam(teamJson.payload || []);
        setFaqs(faqsJson.payload || []);
        setOpenPositions(positionsJson.payload || []);
        setMilestones(milestonesJson.payload || []);
        setPartnerProducts(productsJson.payload || []);

        if (toolConfigJson.status === 'success' && toolConfigJson.payload) {
          setToolConfigs(toolConfigJson.payload);
        }

        // Contextual edit loader from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const queryTab = urlParams.get('tab') as TabType;
        const editId = urlParams.get('edit');

        if (queryTab) {
          setActiveTab(queryTab);
          
          if (editId) {
            if (queryTab === 'people') {
              const matchedMember = (teamJson.payload || []).find((m: any) => m.id === editId);
              if (matchedMember) {
                setEditingMember(matchedMember);
                setTeamModalOpen(true);
              }
            } else if (queryTab === 'faqs') {
              const matchedFaq = (faqsJson.payload || []).find((f: any) => f.id === editId);
              if (matchedFaq) {
                setEditingFaq(matchedFaq);
                setFaqModalOpen(true);
              }
            } else if (queryTab === 'open_positions') {
              const matchedJob = (positionsJson.payload || []).find((j: any) => j.id === editId);
              if (matchedJob) {
                setEditingJob(matchedJob);
                setJobModalOpen(true);
              }
            } else if (queryTab === 'milestones') {
              const matchedMilestone = (milestonesJson.payload || []).find((m: any) => m.id === editId);
              if (matchedMilestone) {
                setEditingMilestone(matchedMilestone);
                setMilestoneModalOpen(true);
              }
            } else if (queryTab === 'partner_products') {
              const matchedProduct = (productsJson.payload || []).find((p: any) => p.id === editId);
              if (matchedProduct) {
                setEditingProduct(matchedProduct);
                setProductModalOpen(true);
              }
            }
          }
        }
      } catch (err: any) {
        console.error('Error initializing dashboard:', err);
        showToast('error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // ==========================================
  // SITE CONTENT HELPERS
  // ==========================================
  const updateContentField = (section: string, key: string, val: any) => {
    if (!contentConfig) return;
    const updated = { ...contentConfig };
    if (!updated[section]) updated[section] = {};
    updated[section][key] = val;
    setContentConfig(updated);
  };

  const updateContentNestedField = (section: string, category: string, index: number, key: string, val: any) => {
    if (!contentConfig) return;
    const updated = { ...contentConfig };
    if (!updated[section]) updated[section] = {};
    if (!updated[section][category]) updated[section][category] = [];
    if (updated[section][category][index]) {
      updated[section][category][index][key] = val;
    }
    setContentConfig(updated);
  };

  const handleSaveContent = async () => {
    if (!contentConfig) return;
    setSaveStatus('saving');
    setSaveMsg('Saving content...');
    try {
      const res = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentConfig),
      });
      const json = await res.json();
      if (json.status === 'success') {
        setSaveStatus('success');
        setSaveMsg('Changes saved!');
        showToast('success', 'Site content updated successfully!');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMsg(json.payload || 'Save failed');
        showToast('error', json.payload || 'Save failed');
      }
    } catch (e: any) {
      setSaveStatus('error');
      setSaveMsg(e.message);
      showToast('error', e.message);
    }
  };

  // ==========================================
  // PEOPLE MANAGEMENT METHODS
  // ==========================================
  const openAddMember = (cat: TeamMember['category']) => {
    setEditingMember({
      name: '',
      role: '',
      bio: '',
      category: cat,
      display_order: team.filter(m => m.category === cat).length + 1,
      is_active: true,
      image_url: ''
    });
    setTeamModalOpen(true);
  };

  const openEditMember = (m: TeamMember) => {
    setEditingMember({ ...m });
    setTeamModalOpen(true);
  };

  const handleSaveMember = async () => {
    if (!editingMember?.name || !editingMember?.role || !editingMember?.category) {
      showToast('error', 'Name, Role, and Category are required.');
      return;
    }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingMember.id;
      const url = isEdit ? `/api/team?id=${editingMember.id}` : '/api/team';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember),
      });
      const json = await res.json();
      if (json.status === 'success') {
        // Refresh team members immediately without page reload
        const refreshRes = await fetch('/api/team?all=true');
        const refreshJson = await refreshRes.json();
        setTeam(refreshJson.payload || []);

        setTeamModalOpen(false);
        setEditingMember(null);
        setSaveStatus('idle');
        showToast('success', isEdit ? 'Member updated!' : 'Member added!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Saving team member failed');
      }
    } catch (e: any) {
      setSaveStatus('error');
      showToast('error', e.message);
    }
  };

  const triggerDeleteMember = (id: string, name: string, permanent: boolean) => {
    setDeleteTarget({ id, name, permanent });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteMember = async () => {
    if (!deleteTarget) return;
    setSaveStatus('saving');
    try {
      const url = `/api/team?id=${deleteTarget.id}${deleteTarget.permanent ? '&permanent=true' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        // Refresh team members
        const refreshRes = await fetch('/api/team?all=true');
        const refreshJson = await refreshRes.json();
        setTeam(refreshJson.payload || []);

        setDeleteConfirmOpen(false);
        setDeleteTarget(null);
        setSaveStatus('idle');
        showToast('success', deleteTarget.permanent ? 'Member permanently deleted!' : 'Member deactivated!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Deletion failed');
      }
    } catch (e: any) {
      setSaveStatus('error');
      showToast('error', e.message);
    }
  };

  const handleToggleMemberActive = async (m: TeamMember) => {
    try {
      const updated = { ...m, is_active: !m.is_active };
      const res = await fetch(`/api/team?id=${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.status === 'success') {
        // Refresh team members
        const refreshRes = await fetch('/api/team?all=true');
        const refreshJson = await refreshRes.json();
        setTeam(refreshJson.payload || []);
        showToast('success', updated.is_active ? 'Member reactivated!' : 'Member deactivated!');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const moveMemberOrder = async (m: TeamMember, dir: 'up' | 'down') => {
    // Filter and sort the current list to find adjacent item
    const categoryMembers = team
      .filter(x => x.category === m.category)
      .sort((a, b) => a.display_order - b.display_order);

    const idx = categoryMembers.findIndex(x => x.id === m.id);
    if (idx === -1) return;

    let targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categoryMembers.length) return;

    const targetMember = categoryMembers[targetIdx];

    // Swap order values
    const tempOrder = m.display_order;
    m.display_order = targetMember.display_order;
    targetMember.display_order = tempOrder;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/team/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [
            { id: m.id, display_order: m.display_order },
            { id: targetMember.id, display_order: targetMember.display_order }
          ]
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        // Refresh team list
        const refreshRes = await fetch('/api/team?all=true');
        const refreshJson = await refreshRes.json();
        setTeam(refreshJson.payload || []);
        setSaveStatus('idle');
        showToast('success', 'Display order updated!');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File size exceeds 5MB limit');
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/people/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setEditingMember({ ...editingMember, image_url: json.url });
        showToast('success', 'Profile image uploaded to Supabase Storage!');
      } else {
        showToast('error', json.error || 'Upload failed');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // ==========================================
  // TOOL CONFIGURATION METHODS
  // ==========================================
  const updateToolConfig = (toolKey: string, section: string, field: string, val: any) => {
    const updated = { ...toolConfigs };
    if (!updated[toolKey]) updated[toolKey] = {};
    if (!updated[toolKey][section]) updated[toolKey][section] = {};
    updated[toolKey][section][field] = val;
    setToolConfigs(updated);
  };

  const updateToolConfigDeep = (toolKey: string, section: string, subSection: string, field: string, val: any) => {
    const updated = { ...toolConfigs };
    if (!updated[toolKey]) updated[toolKey] = {};
    if (!updated[toolKey][section]) updated[toolKey][section] = {};
    if (!updated[toolKey][section][subSection]) updated[toolKey][section][subSection] = {};
    updated[toolKey][section][subSection][field] = val;
    setToolConfigs(updated);
  };

  const handleSaveToolConfig = async (toolKey: string) => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/tool-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: toolKey,
          config: toolConfigs[toolKey]
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setSaveStatus('idle');
        showToast('success', `${toolKey === 'idea_validator' ? 'Idea Validator' : 'Build Time Estimator'} configuration saved! Changes take effect immediately.`);
      } else {
        setSaveStatus('error');
        showToast('error', json.payload || 'Failed to update tool config');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };


  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/portfolio/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.status === 'success' && json.url) {
        callback(json.url);
        showToast('success', 'Portfolio file uploaded successfully!');
      } else {
        showToast('error', json.error || 'Upload failed');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setImageUploading(false);
    }
  };



  // ==========================================
  // FAQ METHODS
  // ==========================================
  const openAddFaq = () => {
    setEditingFaq({ category: 'engagement', question: '', answer: '', is_active: true });
    setFaqModalOpen(true);
  };

  const openEditFaq = (faq: FAQ) => {
    setEditingFaq({ ...faq });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!editingFaq?.category || !editingFaq?.question || !editingFaq?.answer) {
      showToast('error', 'Category, Question, and Answer are required.');
      return;
    }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingFaq.id;
      const url = isEdit ? `/api/faqs?id=${editingFaq.id}` : '/api/faqs';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/faqs?all=true');
        const rJson = await refresh.json();
        setFaqs(rJson.payload || []);
        setFaqModalOpen(false);
        setEditingFaq(null);
        setSaveStatus('idle');
        showToast('success', isEdit ? 'FAQ updated!' : 'FAQ created!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Saving FAQ failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this FAQ?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/faqs?all=true');
        const rJson = await refresh.json();
        setFaqs(rJson.payload || []);
        setSaveStatus('idle');
        showToast('success', 'FAQ deleted!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Deletion failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const moveFaqOrder = async (faq: FAQ, direction: 'up' | 'down') => {
    const idx = faqs.findIndex(f => f.id === faq.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;

    const swapFaq = faqs[targetIdx];
    const orderA = faq.display_order;
    const orderB = swapFaq.display_order;

    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/faqs?id=${faq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderB })
        }),
        fetch(`/api/faqs?id=${swapFaq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderA })
        })
      ]);
      const refresh = await fetch('/api/faqs?all=true');
      const rJson = await refresh.json();
      setFaqs(rJson.payload || []);
      setSaveStatus('idle');
      showToast('success', 'FAQ order updated!');
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  // ==========================================
  // OPEN POSITIONS METHODS
  // ==========================================
  const openAddJob = () => {
    setEditingJob({ title: '', location: 'Chennai, TN', type: 'Full Time', experience: '', category: 'Engineering', apply_link: 'mailto:careers@crestcode.usa', application_email: 'careers@crestcode.usa', is_active: true });
    setJobModalOpen(true);
  };

  const openEditJob = (job: OpenPosition) => {
    setEditingJob({ ...job });
    setJobModalOpen(true);
  };

  const handleSaveJob = async () => {
    if (!editingJob?.title || !editingJob?.experience || !editingJob?.category) {
      showToast('error', 'Title, Experience, and Category are required.');
      return;
    }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingJob.id;
      const url = isEdit ? `/api/open-positions?id=${editingJob.id}` : '/api/open-positions';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/open-positions?all=true');
        const rJson = await refresh.json();
        setOpenPositions(rJson.payload || []);
        setJobModalOpen(false);
        setEditingJob(null);
        setSaveStatus('idle');
        showToast('success', isEdit ? 'Job position updated!' : 'Job position created!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Saving job failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this job position?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/open-positions?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/open-positions?all=true');
        const rJson = await refresh.json();
        setOpenPositions(rJson.payload || []);
        setSaveStatus('idle');
        showToast('success', 'Job position deleted!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Deletion failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const moveJobOrder = async (job: OpenPosition, direction: 'up' | 'down') => {
    const idx = openPositions.findIndex(j => j.id === job.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= openPositions.length) return;

    const swapJob = openPositions[targetIdx];
    const orderA = job.display_order;
    const orderB = swapJob.display_order;

    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/open-positions?id=${job.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderB })
        }),
        fetch(`/api/open-positions?id=${swapJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderA })
        })
      ]);
      const refresh = await fetch('/api/open-positions?all=true');
      const rJson = await refresh.json();
      setOpenPositions(rJson.payload || []);
      setSaveStatus('idle');
      showToast('success', 'Positions order updated!');
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  // ==========================================
  // TIMELINE MILESTONE METHODS
  // ==========================================
  const openAddMilestone = () => {
    setEditingMilestone({ year: '', title: '', description: '', image_url: '' });
    setMilestoneModalOpen(true);
  };

  const openEditMilestone = (m: Milestone) => {
    setEditingMilestone({ ...m });
    setMilestoneModalOpen(true);
  };

  const handleSaveMilestone = async () => {
    if (!editingMilestone?.year || !editingMilestone?.title || !editingMilestone?.description) {
      showToast('error', 'Year, Title, and Description are required.');
      return;
    }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingMilestone.id;
      const url = isEdit ? `/api/milestones?id=${editingMilestone.id}` : '/api/milestones';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMilestone),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/milestones');
        const rJson = await refresh.json();
        setMilestones(rJson.payload || []);
        setMilestoneModalOpen(false);
        setEditingMilestone(null);
        setSaveStatus('idle');
        showToast('success', isEdit ? 'Milestone timeline updated!' : 'Milestone timeline created!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Saving milestone failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline milestone?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/milestones?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/milestones');
        const rJson = await refresh.json();
        setMilestones(rJson.payload || []);
        setSaveStatus('idle');
        showToast('success', 'Milestone deleted!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Deletion failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const moveMilestoneOrder = async (m: Milestone, direction: 'up' | 'down') => {
    const idx = milestones.findIndex(x => x.id === m.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= milestones.length) return;

    const swapMilestone = milestones[targetIdx];
    const orderA = m.display_order;
    const orderB = swapMilestone.display_order;

    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/milestones?id=${m.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderB })
        }),
        fetch(`/api/milestones?id=${swapMilestone.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderA })
        })
      ]);
      const refresh = await fetch('/api/milestones');
      const rJson = await refresh.json();
      setMilestones(rJson.payload || []);
      setSaveStatus('idle');
      showToast('success', 'Milestones order updated!');
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  // ==========================================
  // PARTNER PRODUCTS METHODS
  // ==========================================
  const openAddProduct = () => {
    setEditingProduct({
      name: '', status_type: 'live', status_text: 'Live', status_subtext: 'Web ready',
      tagline: '', subtitle: '', stat_value: '', stat_subtext: '', what_we_did: '',
      industry: '', duration: '', team_size: '', tech_stack: [], features: [], gallery_images: [],
      website_url: '', logo_url: '', is_active: true
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (prod: PartnerProduct) => {
    setEditingProduct({ ...prod });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.tagline || !editingProduct?.subtitle || !editingProduct?.what_we_did) {
      showToast('error', 'Name, Tagline, Subtitle, and What We Did are required.');
      return;
    }
    setSaveStatus('saving');
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/partner-products?id=${editingProduct.id}` : '/api/partner-products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/partner-products?all=true');
        const rJson = await refresh.json();
        setPartnerProducts(rJson.payload || []);
        setProductModalOpen(false);
        setEditingProduct(null);
        setSaveStatus('idle');
        showToast('success', isEdit ? 'Partner product updated!' : 'Partner product created!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Saving product failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this partner product?')) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/partner-products?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 'success') {
        const refresh = await fetch('/api/partner-products?all=true');
        const rJson = await refresh.json();
        setPartnerProducts(rJson.payload || []);
        setSaveStatus('idle');
        showToast('success', 'Partner product deleted!');
      } else {
        setSaveStatus('error');
        showToast('error', json.message || 'Deletion failed');
      }
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const moveProductOrder = async (prod: PartnerProduct, direction: 'up' | 'down') => {
    const idx = partnerProducts.findIndex(p => p.id === prod.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= partnerProducts.length) return;

    const swapProd = partnerProducts[targetIdx];
    const orderA = prod.display_order;
    const orderB = swapProd.display_order;

    setSaveStatus('saving');
    try {
      await Promise.all([
        fetch(`/api/partner-products?id=${prod.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderB })
        }),
        fetch(`/api/partner-products?id=${swapProd.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: orderA })
        })
      ]);
      const refresh = await fetch('/api/partner-products?all=true');
      const rJson = await refresh.json();
      setPartnerProducts(rJson.payload || []);
      setSaveStatus('idle');
      showToast('success', 'Products order updated!');
    } catch (err: any) {
      setSaveStatus('error');
      showToast('error', err.message);
    }
  };

  const getGlobalSearchResults = () => {
    if (!globalSearchKeyword) return null;
    const kw = globalSearchKeyword.toLowerCase();

    const matchedTeam = team.filter(m => m.name.toLowerCase().includes(kw) || m.role.toLowerCase().includes(kw) || (m.bio && m.bio.toLowerCase().includes(kw)));
    const matchedFaqs = faqs.filter(f => f.question.toLowerCase().includes(kw) || f.answer.toLowerCase().includes(kw) || f.category.toLowerCase().includes(kw));
    const matchedJobs = openPositions.filter(j => j.title.toLowerCase().includes(kw) || j.experience.toLowerCase().includes(kw) || j.category.toLowerCase().includes(kw));
    const matchedMilestones = milestones.filter(m => m.year.toLowerCase().includes(kw) || m.title.toLowerCase().includes(kw) || m.description.toLowerCase().includes(kw));
    const matchedProducts = partnerProducts.filter(p => p.name.toLowerCase().includes(kw) || p.tagline.toLowerCase().includes(kw) || p.subtitle.toLowerCase().includes(kw));

    return {
      team: matchedTeam,
      faqs: matchedFaqs,
      jobs: matchedJobs,
      milestones: matchedMilestones,
      products: matchedProducts
    };
  };

  // Loading Screen
  if (loading) {
    return (
      <div style={{
        height: '100vh', background: '#090D16', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite', marginBottom: 20
        }} />
        <p style={{ fontWeight: 600, color: '#94A3B8' }}>Loading CrestCode Admin...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Filter and Sort Team Members for People Management Tab
  const filteredTeam = team
    .filter(m => {
      // Sub-tab partition
      if (peopleSubTab === 'core') {
        if (m.category === 'Advisor') return false;
      } else {
        if (m.category !== 'Advisor') return false;
      }

      // Search term
      const matchesSearch = m.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
                            m.role.toLowerCase().includes(peopleSearch.toLowerCase()) ||
                            (m.bio || '').toLowerCase().includes(peopleSearch.toLowerCase());

      // Dropdown category filter
      const matchesCategory = peopleCategoryFilter === 'ALL' || m.category === peopleCategoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (peopleSortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.display_order - b.display_order;
      }
      return peopleSortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <>
      <div style={ds.layout}>
        {/* Sidebar Nav */}
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
            <button style={ds.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main style={ds.content}>
          <header style={ds.headerBar}>
            <h2 style={ds.tabTitle}>
              {activeTab === 'tool_config' ? 'SYSTEM TOOL CONFIGURATIONS' : activeTab === 'open_positions' ? 'OPEN POSITIONS' : activeTab === 'partner_products' ? 'PARTNER PRODUCTS' : `${activeTab.toUpperCase()} MANAGEMENT`}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Global Search Bar */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Search across all databases..."
                  value={globalSearchKeyword}
                  onChange={e => setGlobalSearchKeyword(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    borderRadius: 8,
                    border: '1px solid #1E293B',
                    background: '#090D16',
                    color: '#F1F5F9',
                    fontSize: 13,
                    width: 240,
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
                {globalSearchKeyword && (
                  <button
                    onClick={() => setGlobalSearchKeyword('')}
                    style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {saveStatus !== 'idle' && (
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: saveStatus === 'success' ? '#34D399' : saveStatus === 'error' ? '#FCA5A5' : '#60A5FA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  {saveStatus === 'saving' && <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                  {saveMsg}
                </span>
              )}
            </div>
          </header>

          <div style={{ padding: '0 24px 24px 24px' }}>
            {/* GLOBAL SEARCH RESULTS PANEL */}
            {globalSearchKeyword && (
              <div style={ds.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ ...ds.cardTitle, margin: 0, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Search size={18} /> Global Search Results for "{globalSearchKeyword}"
                  </h3>
                  <button style={ds.cancelBtn} onClick={() => setGlobalSearchKeyword('')}>Clear Search</button>
                </div>

                {/* Display matched items */}
                {(() => {
                  const results = getGlobalSearchResults();
                  if (!results) return null;
                  const totalCount = results.team.length + results.faqs.length + results.jobs.length + results.milestones.length + results.products.length;

                  if (totalCount === 0) {
                    return <div style={{ color: '#64748B', padding: 24, textAlign: 'center' }}>No matched records found across database tables.</div>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {/* Matched Team */}
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
                                <button style={ds.editBtn} onClick={() => { setActiveTab('people'); setGlobalSearchKeyword(''); openEditMember(x); }}><Edit size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}



                      {/* Matched FAQs */}
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
                                <button style={ds.editBtn} onClick={() => { setActiveTab('faqs'); setGlobalSearchKeyword(''); openEditFaq(x); }}><Edit size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Jobs */}
                      {results.jobs.length > 0 && (
                        <div>
                          <h4 style={{ color: '#94A3B8', borderBottom: '1px solid #1E293B', paddingBottom: 4, marginBottom: 10, fontSize: 14 }}>Open Positions ({results.jobs.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {results.jobs.map(x => (
                              <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '10px 16px', borderRadius: 8 }}>
                                <div>
                                  <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{x.title}</div>
                                  <div style={{ color: '#64748B', fontSize: 12 }}>Category: {x.category} • Experience: {x.experience}</div>
                                </div>
                                <button style={ds.editBtn} onClick={() => { setActiveTab('open_positions'); setGlobalSearchKeyword(''); openEditJob(x); }}><Edit size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Milestones */}
                      {results.milestones.length > 0 && (
                        <div>
                          <h4 style={{ color: '#94A3B8', borderBottom: '1px solid #1E293B', paddingBottom: 4, marginBottom: 10, fontSize: 14 }}>Timeline Milestones ({results.milestones.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {results.milestones.map(x => (
                              <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '10px 16px', borderRadius: 8 }}>
                                <div>
                                  <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{x.year} - {x.title}</div>
                                  <div style={{ color: '#64748B', fontSize: 12 }}>{x.description.substring(0, 80)}...</div>
                                </div>
                                <button style={ds.editBtn} onClick={() => { setActiveTab('milestones'); setGlobalSearchKeyword(''); openEditMilestone(x); }}><Edit size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Products */}
                      {results.products.length > 0 && (
                        <div>
                          <h4 style={{ color: '#94A3B8', borderBottom: '1px solid #1E293B', paddingBottom: 4, marginBottom: 10, fontSize: 14 }}>Partner Products ({results.products.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {results.products.map(x => (
                              <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '10px 16px', borderRadius: 8 }}>
                                <div>
                                  <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{x.name}</div>
                                  <div style={{ color: '#64748B', fontSize: 12 }}>{x.tagline} • {x.subtitle}</div>
                                </div>
                                <button style={ds.editBtn} onClick={() => { setActiveTab('partner_products'); setGlobalSearchKeyword(''); openEditProduct(x); }}><Edit size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* REDESIGNED PEOPLE MANAGEMENT TAB */}
            {!globalSearchKeyword && activeTab === 'people' && (
              <div>
                {/* Search, Filter, Sort and Actions Toolbar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20, background: '#0B132B', padding: 20, borderRadius: 12, border: '1px solid #1C2541' }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* Sub tabs for Core Team vs Advisors */}
                    <div style={{ display: 'flex', background: '#1E293B', padding: 4, borderRadius: 8 }}>
                      <button
                        style={{
                          padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                          background: peopleSubTab === 'core' ? '#3B82F6' : 'transparent',
                          color: peopleSubTab === 'core' ? '#fff' : '#94A3B8'
                        }}
                        onClick={() => { setPeopleSubTab('core'); setPeopleCategoryFilter('ALL'); }}
                      >
                        Core Team
                      </button>
                      <button
                        style={{
                          padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                          background: peopleSubTab === 'advisors' ? '#3B82F6' : 'transparent',
                          color: peopleSubTab === 'advisors' ? '#fff' : '#94A3B8'
                        }}
                        onClick={() => { setPeopleSubTab('advisors'); setPeopleCategoryFilter('ALL'); }}
                      >
                        Advisors
                      </button>
                    </div>

                    <button
                      style={{ ...ds.addButton, padding: '10px 18px', fontSize: 13 }}
                      onClick={() => openAddMember(peopleSubTab === 'core' ? 'Team Member' : 'Advisor')}
                    >
                      <Plus size={16} /> Add New Person
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Bar */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                      <Search size={16} color="#64748B" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Search by name, title, or bio..."
                        style={{ ...ds.input, paddingLeft: 36, margin: 0 }}
                        value={peopleSearch}
                        onChange={e => setPeopleSearch(e.target.value)}
                      />
                    </div>

                    {/* Category Filter (only for Core Team) */}
                    {peopleSubTab === 'core' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={14} color="#64748B" />
                        <select
                          style={{ ...ds.input, margin: 0, minWidth: 140, padding: '6px 12px', fontSize: 13 }}
                          value={peopleCategoryFilter}
                          onChange={e => setPeopleCategoryFilter(e.target.value as any)}
                        >
                          <option value="ALL">All Categories</option>
                          <option value="Founder">Founders</option>
                          <option value="Partner">Partners</option>
                          <option value="Team Member">Team Members</option>
                        </select>
                      </div>
                    )}

                    {/* Sort Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Sort By:</span>
                      <select
                        style={{ ...ds.input, margin: 0, minWidth: 120, padding: '6px 12px', fontSize: 13 }}
                        value={peopleSortField}
                        onChange={e => setPeopleSortField(e.target.value as any)}
                      >
                        <option value="display_order">Display Order</option>
                        <option value="name">Name</option>
                      </select>
                      <button
                        style={{ background: '#1E293B', border: 'none', borderRadius: 6, color: '#94A3B8', cursor: 'pointer', padding: 8 }}
                        onClick={() => setPeopleSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                      >
                        {peopleSortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* People Catalog Grid */}
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
                          <tr>
                            <td colSpan={5} style={{ ...ds.td, textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
                              No team members or advisors match the current search/filters.
                            </td>
                          </tr>
                        ) : (
                          filteredTeam.map((m, idx, arr) => (
                            <tr key={m.id} style={ds.tr}>
                              <td style={ds.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <button style={ds.orderBtn} onClick={() => moveMemberOrder(m, 'up')} disabled={idx === 0}>
                                    <ArrowUp size={12} />
                                  </button>
                                  <span style={{ fontSize: 13, fontWeight: 800, color: '#F1F5F9' }}>{m.display_order}</span>
                                  <button style={ds.orderBtn} onClick={() => moveMemberOrder(m, 'down')} disabled={idx === arr.length - 1}>
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                              </td>
                              <td style={ds.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 'bold', color: '#fff', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)'
                                  }}>
                                    {m.image_url ? (
                                      <img src={m.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                                    )}
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
                                <button
                                  onClick={() => handleToggleMemberActive(m)}
                                  style={{
                                    border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                                    background: m.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: m.is_active ? '#34D399' : '#FCA5A5'
                                  }}
                                >
                                  {m.is_active ? '● Active' : '○ Inactive'}
                                </button>
                              </td>
                              <td style={ds.td}>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button style={ds.editBtn} title="Edit Details" onClick={() => openEditMember(m)}><Edit size={14} /></button>
                                  <button style={{ ...ds.editBtn, borderColor: 'rgba(239,68,68,0.2)', color: '#EF4444' }} title="Soft Delete (Deactivate)" onClick={() => triggerDeleteMember(m.id, m.name, false)}><X size={14} /></button>
                                  <button style={ds.deleteBtn} title="Permanent Delete" onClick={() => triggerDeleteMember(m.id, m.name, true)}><Trash2 size={14} /></button>
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
            )}
            {/* FAQs TAB */}
            {!globalSearchKeyword && activeTab === 'faqs' && (
              <div style={ds.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={ds.cardTitle}>Manage FAQs</h3>
                  <button style={ds.addButton} onClick={openAddFaq}>
                    <Plus size={16} /> Add FAQ
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748B' }} />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={faqSearch}
                      onChange={e => setFaqSearch(e.target.value)}
                      style={{ ...ds.input, paddingLeft: 36 }}
                    />
                  </div>
                  <select
                    value={faqCategoryFilter}
                    onChange={e => setFaqCategoryFilter(e.target.value)}
                    style={{ ...ds.input, width: 180 }}
                  >
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
                      {faqs
                        .filter(f => {
                          const matchSearch = f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.answer.toLowerCase().includes(faqSearch.toLowerCase());
                          const matchCat = faqCategoryFilter === 'ALL' || f.category === faqCategoryFilter;
                          return matchSearch && matchCat;
                        })
                        .map((f, idx, arr) => (
                          <tr key={f.id} style={ds.tr}>
                            <td style={ds.td}>
                              <div style={{ fontWeight: 600, color: '#F1F5F9' }}>{f.question}</div>
                              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{f.answer}</div>
                            </td>
                            <td style={ds.td}>
                              <span style={{ fontSize: 11, background: '#1E293B', padding: '2px 8px', borderRadius: 12, textTransform: 'capitalize', color: '#94A3B8' }}>{f.category}</span>
                            </td>
                            <td style={ds.td}>
                              <span style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 12,
                                background: f.is_active ? 'rgba(52, 211, 153, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: f.is_active ? '#34D399' : '#64748B'
                              }}>
                                {f.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
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
            )}

            {/* BLOG AUTHORS TAB */}
            {/* blog_authors tab is now unified inside the Blogs tab via sub-tabs */}

            {/* OPEN POSITIONS TAB */}
            {!globalSearchKeyword && activeTab === 'open_positions' && (
              <div style={ds.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={ds.cardTitle}>Manage Careers open positions</h3>
                  <button style={ds.addButton} onClick={openAddJob}>
                    <Plus size={16} /> Add Position
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748B' }} />
                    <input
                      type="text"
                      placeholder="Search positions..."
                      value={jobSearch}
                      onChange={e => setJobSearch(e.target.value)}
                      style={{ ...ds.input, paddingLeft: 36 }}
                    />
                  </div>
                  <select
                    value={jobCategoryFilter}
                    onChange={e => setJobCategoryFilter(e.target.value)}
                    style={{ ...ds.input, width: 180 }}
                  >
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
                      {openPositions
                        .filter(j => {
                          const matchSearch = j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.experience.toLowerCase().includes(jobSearch.toLowerCase());
                          const matchCat = jobCategoryFilter === 'ALL' || j.category === jobCategoryFilter;
                          return matchSearch && matchCat;
                        })
                        .map((j, idx, arr) => (
                          <tr key={j.id} style={ds.tr}>
                            <td style={ds.td}>
                              <div style={{ fontWeight: 600, color: '#F1F5F9' }}>{j.title}</div>
                              <div style={{ fontSize: 11, color: '#38BDF8', marginTop: 2 }}>{j.apply_link}</div>
                            </td>
                            <td style={ds.td}>{j.category}</td>
                            <td style={ds.td}>{j.location}</td>
                            <td style={ds.td}>{j.type}</td>
                            <td style={ds.td}>{j.experience}</td>
                            <td style={ds.td}>
                              <span style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 12,
                                background: j.is_active ? 'rgba(52, 211, 153, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: j.is_active ? '#34D399' : '#64748B'
                              }}>
                                {j.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={ds.td}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button style={ds.orderBtn} onClick={() => moveJobOrder(j, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                                <button style={ds.orderBtn} onClick={() => moveJobOrder(j, 'down')} disabled={idx === arr.length - 1}><ArrowDown size={14} /></button>
                              </div>
                            </td>
                            <td style={ds.td}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button style={ds.editBtn} onClick={() => openEditJob(j)}><Edit size={14} /></button>
                                <button style={ds.deleteBtn} onClick={() => handleDeleteJob(j.id)}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TIMELINE MILESTONES TAB */}
            {!globalSearchKeyword && activeTab === 'milestones' && (
              <div style={ds.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={ds.cardTitle}>Manage Timeline Milestones</h3>
                  <button style={ds.addButton} onClick={openAddMilestone}>
                    <Plus size={16} /> Add Milestone
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {milestones.map((m, idx) => (
                    <div key={m.id} style={{ display: 'flex', gap: 16, background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 20, alignItems: 'center' }}>
                      <div style={{ width: 80, fontSize: 24, fontWeight: 'bold', color: '#38BDF8', textAlign: 'center' }}>
                        {m.year}
                      </div>
                      
                      {m.image_url && (
                        <img src={m.image_url} alt={m.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                      )}

                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#F1F5F9', fontSize: 16 }}>{m.title}</h4>
                        <p style={{ margin: 0, color: '#94A3B8', fontSize: 13, lineHeight: 1.5 }}>{m.description}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={ds.orderBtn} onClick={() => moveMilestoneOrder(m, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                          <button style={ds.orderBtn} onClick={() => moveMilestoneOrder(m, 'down')} disabled={idx === milestones.length - 1}><ArrowDown size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={{ ...ds.editBtn, flex: 1 }} onClick={() => openEditMilestone(m)}><Edit size={14} /></button>
                          <button style={{ ...ds.deleteBtn, flex: 1 }} onClick={() => handleDeleteMilestone(m.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PARTNER PRODUCTS TAB */}
            {!globalSearchKeyword && activeTab === 'partner_products' && (
              <div style={ds.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={ds.cardTitle}>Manage Partner Products</h3>
                  <button style={ds.addButton} onClick={openAddProduct}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                <div style={ds.tableContainer}>
                  <table style={ds.table}>
                    <thead>
                      <tr>
                        <th style={ds.th}>Name</th>
                        <th style={ds.th}>Tagline</th>
                        <th style={ds.th}>Status</th>
                        <th style={ds.th}>Key Stat</th>
                        <th style={ds.th}>Gallery</th>
                        <th style={ds.th}>Order</th>
                        <th style={ds.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerProducts.map((p, idx) => (
                        <tr key={p.id} style={ds.tr}>
                          <td style={ds.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {p.logo_url && (
                                <img src={p.logo_url} alt={p.name} style={{ width: 24, height: 24, borderRadius: 4 }} />
                              )}
                              <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={ds.td}>
                            <div style={{ fontSize: 13, color: '#94A3B8' }}>{p.tagline}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{p.subtitle}</div>
                          </td>
                          <td style={ds.td}>
                            <span style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 12,
                              background: p.status_type === 'live' ? 'rgba(52, 211, 153, 0.1)' : p.status_type === 'beta' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                              color: p.status_type === 'live' ? '#34D399' : p.status_type === 'beta' ? '#FBBF24' : '#60A5FA'
                            }}>
                              {p.status_text}
                            </span>
                          </td>
                          <td style={ds.td}>
                            <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{p.stat_value}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{p.stat_subtext}</div>
                          </td>
                          <td style={ds.td}>
                            <span style={{ fontSize: 12, color: '#64748B' }}>{Array.isArray(p.gallery_images) ? p.gallery_images.length : 0} screenshots</span>
                          </td>
                          <td style={ds.td}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button style={ds.orderBtn} onClick={() => moveProductOrder(p, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                              <button style={ds.orderBtn} onClick={() => moveProductOrder(p, 'down')} disabled={idx === partnerProducts.length - 1}><ArrowDown size={14} /></button>
                            </div>
                          </td>
                          <td style={ds.td}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button style={ds.editBtn} onClick={() => openEditProduct(p)}><Edit size={14} /></button>
                              <button style={ds.deleteBtn} onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



            {/* NEW SYSTEM TOOL CONFIGURATIONS TAB */}
            {!globalSearchKeyword && activeTab === 'tool_config' && (
              <div>
                
                {/* 1. IDEA VALIDATOR CONFIGURATIONS */}
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
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Customer Demand</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.quality?.demand ?? 0.35} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'quality', 'demand', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Competitive Moat</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.quality?.moat ?? 0.30} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'quality', 'moat', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Technical Feasibility</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.quality?.technical ?? 0.20} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'quality', 'technical', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Founder-Market Fit</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.quality?.founder ?? 0.15} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'quality', 'founder', parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>B. Investor Readiness Score Weights (Must sum to 1.0)</h4>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Investor Appeal</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.readiness?.appeal ?? 0.40} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'readiness', 'appeal', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Market Timing</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.readiness?.timing ?? 0.30} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'readiness', 'timing', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Founder-Market Fit</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.readiness?.founder ?? 0.15} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'readiness', 'founder', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 140 }}>
                        <label style={ds.formLabel}>Customer Demand</label>
                        <input type="number" step="0.05" style={ds.input} value={toolConfigs.idea_validator.scoring_weights?.readiness?.demand ?? 0.15} onChange={e => updateToolConfigDeep('idea_validator', 'scoring_weights', 'readiness', 'demand', parseFloat(e.target.value) || 0)} />
                      </div>
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
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20, marginTop: -8 }}>
                      Customize raw score additions/penalties for the deterministic rule engine. Values represent points applied when factors are detected.
                    </p>

                    {/* Grouped Dynamic Modifiers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                      {/* 1. Market Size */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>1. Market Size / Opportunity</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (Large Market segment / Mass Market)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Large Addressable Market'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Large Addressable Market', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Targeting Mass Market'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Targeting Mass Market', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Medium Segment)</label>
                            <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Medium Addressable Market'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Medium Addressable Market', parseFloat(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (Small addressable market / Niche)</label>
                            <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Small Addressable Market'] ?? -2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Small Addressable Market', parseFloat(e.target.value) || 0)} />
                          </div>
                        </div>
                      </div>

                      {/* 2. Customer Demand */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>2. Customer Demand</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (Severe Pain / Paying Customers / Critical Pain Score)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Severe Customer Pain Point'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Severe Customer Pain Point', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Proven Demand via Paying Customers'] ?? 5.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Proven Demand via Paying Customers', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Moderate Pain / Waitlist / Elevated Pain Score)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate Customer Pain Point'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate Customer Pain Point', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Proven Demand via Waitlist Signups'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Proven Demand via Waitlist Signups', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (Mild Pain / Zero Validated Demand / Low Pain Score)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Mild Customer Pain Point'] ?? -1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Mild Customer Pain Point', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Zero Validated Demand'] ?? -2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Zero Validated Demand', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Competitive Moat */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>3. Competitive Moat</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Strong (Proprietary Data / Network Effects / Defensible Moat)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Proprietary Data Accumulation Loop'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Proprietary Data Accumulation Loop', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Defensible Competitor Moat'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Defensible Competitor Moat', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Moderate (Switching Costs / Moderate Differentiation)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate Customer Switching Costs'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate Customer Switching Costs', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate Product Differentiation'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate Product Differentiation', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Weak (Easy to Clone / Weak Differentiation / No Moat)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Product is Extremely Easy to Clone'] ?? -3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Product is Extremely Easy to Clone', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['No Moat / Low Defensibility'] ?? -2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'No Moat / Low Defensibility', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Technical Feasibility */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>4. Technical Feasibility</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (Simple MVP Path / Launched MVP Stage)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Simple MVP Development Path'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Simple MVP Development Path', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Launched MVP Stage'] ?? 4.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Launched MVP Stage', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Moderate MVP Path / Prototype Stage)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate MVP Development Path'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate MVP Development Path', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Prototype / Wired Interactive Stage'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Prototype / Wired Interactive Stage', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (Complex MVP / R&D Required / Custom Hardware)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Complex Frontend/Backend MVP Scope'] ?? -1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Complex Frontend/Backend MVP Scope', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Basic R&D or Scientific Research Required'] ?? -3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Basic R&D or Scientific Research Required', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5. Founder Market Fit */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>5. Founder Market Fit</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (Domain Expert / Deep Industry Experience / Track Record)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Domain Expert Founder(s)'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Domain Expert Founder(s)', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Deep Industry Experience'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Deep Industry Experience', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Experienced / Some Industry Exp / Some Track Record)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Experienced in Core Domain'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Experienced in Core Domain', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Some Industry Experience'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Some Industry Experience', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (Zero Prior Domain Knowledge / Zero Exp / Zero Track Record)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Zero Prior Domain Knowledge'] ?? -2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Zero Prior Domain Knowledge', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Zero Core Industry Experience'] ?? -1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Zero Core Industry Experience', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 6. Investor Appeal */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>6. Investor Appeal</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (SaaS / High Growth / High Scalability)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Subscription / Recurring Revenue'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Subscription / Recurring Revenue', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['High Scalability Potential'] ?? 2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'High Scalability Potential', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Moderate Scalability Potential)</label>
                            <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate Scalability Potential'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate Scalability Potential', parseFloat(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (One-Time Revenue / Low Scalability Potential)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['One-Time Revenue Model'] ?? -1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'One-Time Revenue Model', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Low Scalability Potential'] ?? -1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Low Scalability Potential', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 7. Market Timing */}
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>7. Market Timing</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High (Fast-Growing Industry / Strong "Why Now" Case)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Fast-Growing Industry Segment'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Fast-Growing Industry Segment', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Strong "Why Now" Case'] ?? 3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Strong "Why Now" Case', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium (Moderate Growth / Moderate "Why Now" Case)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate Industry Segment Growth'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate Industry Segment Growth', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Moderate "Why Now" Case'] ?? 1.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Moderate "Why Now" Case', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low (Declining Growth / Weak "Why Now" Case / Too Early)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Declining Industry Core Growth'] ?? -3.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Declining Industry Core Growth', parseFloat(e.target.value) || 0)} />
                              <input type="number" step="0.5" style={ds.input} value={toolConfigs.idea_validator.rule_modifiers?.['Weak "Why Now" Case'] ?? -2.0} onChange={e => updateToolConfig('idea_validator', 'rule_modifiers', 'Weak "Why Now" Case', parseFloat(e.target.value) || 0)} />
                            </div>
                          </div>
                        </div>
                      </div>
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

                {/* 2. BUILD TIME ESTIMATOR CONFIGURATIONS */}
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

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>A. Baseline Screen Counts per Product Type (Screens / Pages)</h4>
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
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 120 }}>
                        <label style={ds.formLabel}>iOS Mobile App</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.platform_additions?.ios ?? 8} onChange={e => updateToolConfig('build_estimator', 'platform_additions', 'ios', parseInt(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 120 }}>
                        <label style={ds.formLabel}>Android App (Shared)</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.platform_additions?.android_shared ?? 4} onChange={e => updateToolConfig('build_estimator', 'platform_additions', 'android_shared', parseInt(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 120 }}>
                        <label style={ds.formLabel}>Android App (Standalone)</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.platform_additions?.android_only ?? 8} onChange={e => updateToolConfig('build_estimator', 'platform_additions', 'android_only', parseInt(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 120 }}>
                        <label style={ds.formLabel}>Admin Panel</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.platform_additions?.admin ?? 5} onChange={e => updateToolConfig('build_estimator', 'platform_additions', 'admin', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>


                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>C. Team Preference Duration Multipliers</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>Each team type takes a [min, max] multiplier applied to the base day count.</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
                        <label style={ds.formLabel}>Solo Developer (Min, Max)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.solo?.[0] ?? 1.5} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'solo', [parseFloat(e.target.value) || 0, toolConfigs.build_estimator.team_multipliers?.solo?.[1] ?? 1.75])} />
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.solo?.[1] ?? 1.75} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'solo', [toolConfigs.build_estimator.team_multipliers?.solo?.[0] ?? 1.5, parseFloat(e.target.value) || 0])} />
                        </div>
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
                        <label style={ds.formLabel}>Small Team 2–4 (Min, Max)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.small?.[0] ?? 1.0} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'small', [parseFloat(e.target.value) || 0, toolConfigs.build_estimator.team_multipliers?.small?.[1] ?? 1.0])} />
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.small?.[1] ?? 1.0} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'small', [toolConfigs.build_estimator.team_multipliers?.small?.[0] ?? 1.0, parseFloat(e.target.value) || 0])} />
                        </div>
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 200 }}>
                        <label style={ds.formLabel}>Dedicated Team (Min, Max)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.dedicated?.[0] ?? 0.6} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'dedicated', [parseFloat(e.target.value) || 0, toolConfigs.build_estimator.team_multipliers?.dedicated?.[1] ?? 0.75])} />
                          <input type="number" step="0.05" style={ds.input} value={toolConfigs.build_estimator.team_multipliers?.dedicated?.[1] ?? 0.75} onChange={e => updateToolConfig('build_estimator', 'team_multipliers', 'dedicated', [toolConfigs.build_estimator.team_multipliers?.dedicated?.[0] ?? 0.6, parseFloat(e.target.value) || 0])} />
                        </div>
                      </div>
                    </div>

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>D. Complexity Thresholds (Weeks)</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>If estimated weeks exceed this value, that complexity tier is triggered.</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>Low Complexity (Max Weeks)</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.complexity_thresholds?.low ?? 4} onChange={e => updateToolConfig('build_estimator', 'complexity_thresholds', 'low', parseInt(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>Medium Complexity (Max Weeks)</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.complexity_thresholds?.medium ?? 12} onChange={e => updateToolConfig('build_estimator', 'complexity_thresholds', 'medium', parseInt(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>High Complexity (Max Weeks)</label>
                        <input type="number" style={ds.input} value={toolConfigs.build_estimator.complexity_thresholds?.high ?? 24} onChange={e => updateToolConfig('build_estimator', 'complexity_thresholds', 'high', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>E. AI Level Screen Additions</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>Extra screens added to the estimate based on the AI complexity chosen by the client.</p>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                      {([
                        { key: 'none',       label: 'No AI',                     def: 0 },
                        { key: 'assistant',  label: 'AI Assistant',              def: 3 },
                        { key: 'report_gen', label: 'AI Report Generation',      def: 5 },
                        { key: 'ocr',        label: 'OCR / Doc Processing',      def: 4 },
                        { key: 'ai_core',    label: 'AI Core Product',           def: 8 },
                      ] as { key: string; label: string; def: number }[]).map(ai => (
                        <div key={ai.key} style={{ ...ds.formGroup, flex: '1 1 140px' }}>
                          <label style={{ ...ds.formLabel, textTransform: 'none' }}>{ai.label}</label>
                          <input type="number" style={ds.input} value={toolConfigs.build_estimator.ai_additions?.[ai.key] ?? ai.def} onChange={e => updateToolConfig('build_estimator', 'ai_additions', ai.key, parseInt(e.target.value) || 0)} />
                        </div>
                      ))}
                    </div>

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>F. Feature Screen Additions</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>Extra screens added per selected feature (e.g. payments = 4 more screens).</p>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                      {([
                        { key: 'profiles',      label: 'User Profiles',       def: 2 },
                        { key: 'dashboard',     label: 'Dashboard',           def: 3 },
                        { key: 'analytics',     label: 'Analytics',           def: 4 },
                        { key: 'reporting',     label: 'Reporting',           def: 3 },
                        { key: 'payments',      label: 'Payments',            def: 4 },
                        { key: 'booking',       label: 'Booking System',      def: 4 },
                        { key: 'search',        label: 'Search',              def: 2 },
                        { key: 'notifications', label: 'Notifications',       def: 2 },
                        { key: 'messaging',     label: 'Messaging',           def: 5 },
                        { key: 'file_uploads',  label: 'File Uploads',        def: 2 },
                        { key: 'roles',         label: 'Multi-User Roles',    def: 3 },
                        { key: 'collaboration', label: 'Team Collaboration',  def: 5 },
                      ] as { key: string; label: string; def: number }[]).map(feat => (
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
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>Fine-tune week additions or reductions based on co-founder presence and technical feasibility signals.</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>Co-founder Bonus (weeks saved)</label>
                        <input type="number" step="0.5" style={ds.input} value={toolConfigs.build_estimator.weeks_adjustments?.cofounder_bonus ?? -2.0} onChange={e => updateToolConfig('build_estimator', 'weeks_adjustments', 'cofounder_bonus', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>Low Feasibility Penalty (weeks added)</label>
                        <input type="number" step="0.5" style={ds.input} value={toolConfigs.build_estimator.weeks_adjustments?.low_feasibility_penalty ?? 3.0} onChange={e => updateToolConfig('build_estimator', 'weeks_adjustments', 'low_feasibility_penalty', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div style={{ ...ds.formGroup, flex: 1, minWidth: 180 }}>
                        <label style={ds.formLabel}>Mid Feasibility Penalty (weeks added)</label>
                        <input type="number" step="0.5" style={ds.input} value={toolConfigs.build_estimator.weeks_adjustments?.mid_feasibility_penalty ?? 1.0} onChange={e => updateToolConfig('build_estimator', 'weeks_adjustments', 'mid_feasibility_penalty', parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>

                    <h4 style={{ color: '#E2E8F0', margin: '0 0 12px 0', fontSize: 14 }}>I. Feature Count Tiers & Integration Settings</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: -8 }}>Define screen adjustments for feature counts and integration complexities.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>Feature Tiers &amp; Additions</div>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low Limit (&lt;= features)</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tiers?.low ?? 3} onChange={e => updateToolConfig('build_estimator', 'feature_tiers', 'low', parseInt(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium Limit (&lt;= features)</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tiers?.medium ?? 7} onChange={e => updateToolConfig('build_estimator', 'feature_tiers', 'medium', parseInt(e.target.value) || 0)} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Low Tier Addition</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.low ?? 0} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'low', parseInt(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Medium Tier Addition</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.medium ?? 2} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'medium', parseInt(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>High Tier Addition</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.feature_tier_additions?.high ?? 5} onChange={e => updateToolConfig('build_estimator', 'feature_tier_additions', 'high', parseInt(e.target.value) || 0)} />
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: 13, marginBottom: 12 }}>Integration Screen Additions</div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Standard Integration Addition</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.integration_additions?.standard ?? 2} onChange={e => updateToolConfig('build_estimator', 'integration_additions', 'standard', parseInt(e.target.value) || 0)} />
                          </div>
                          <div style={ds.formGroup}>
                            <label style={ds.formLabel}>Custom Integration Addition</label>
                            <input type="number" style={ds.input} value={toolConfigs.build_estimator.integration_additions?.custom ?? 3} onChange={e => updateToolConfig('build_estimator', 'integration_additions', 'custom', parseInt(e.target.value) || 0)} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}


              </div>
            )}

            {!globalSearchKeyword && activeTab === 'submissions' && (
              <SubmissionManagement />
            )}

          </div>
        </main>
      </div>

      {/* DETAILED TOAST NOTIFICATIONS */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: toast.type === 'success' ? '#10B981' : '#EF4444',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 700,
          fontSize: 14,
          animation: 'slideUp 0.2s ease-out'
        }}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {toast.message}
          <style>{`
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {deleteConfirmOpen && deleteTarget && (
        <div style={ds.overlay}>
          <div style={{ ...ds.modalCard, maxWidth: 400 }}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} /> Confirm Deletion
              </h3>
              <button style={ds.closeBtn} onClick={() => setDeleteConfirmOpen(false)}><X size={18} /></button>
            </div>
            <div style={ds.modalBody}>
              <p style={{ margin: 0, fontSize: 14, color: '#E2E8F0', lineHeight: 1.6 }}>
                Are you sure you want to {deleteTarget.permanent ? 'PERMANENTLY DELETE' : 'DEACTIVATE'} member <strong>{deleteTarget.name}</strong>?
              </p>
              {deleteTarget.permanent && (
                <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#FCA5A5', fontWeight: 600 }}>
                  ⚠️ WARNING: This will permanently remove the record from the database and delete their avatar from storage. This action is irreversible.
                </p>
              )}
            </div>
            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
              <button
                style={{ ...ds.saveButton, background: '#EF4444', borderColor: '#EF4444' }}
                onClick={handleConfirmDeleteMember}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Deleting...' : deleteTarget.permanent ? 'Delete Permanently' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REDESIGNED TEAM MEMBER ADD/EDIT MODAL */}
      {teamModalOpen && editingMember && (
        <div style={ds.overlay}>
          <div style={ds.modalCard}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#F1F5F9' }}>
                {editingMember.id ? 'Edit Person Details' : 'Add New Person'}
              </h3>
              <button style={ds.closeBtn} onClick={() => setTeamModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div style={ds.modalBody}>
              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Full Name</label>
                <input
                  type="text"
                  style={ds.input}
                  value={editingMember.name || ''}
                  onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Jane Smith"
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Role / Title</label>
                <input
                  type="text"
                  style={ds.input}
                  value={editingMember.role || ''}
                  onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Lead Venture Architect"
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Category</label>
                <select
                  style={ds.input}
                  value={editingMember.category || 'Team Member'}
                  onChange={e => setEditingMember({ ...editingMember, category: e.target.value as any })}
                >
                  <option value="Founder">Founder</option>
                  <option value="Partner">Partner</option>
                  <option value="Team Member">Team Member</option>
                  <option value="Advisor">Advisor</option>
                </select>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Bio Narrative</label>
                <textarea
                  style={ds.textarea}
                  rows={4}
                  value={editingMember.bio || ''}
                  onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Tell their story and expertise..."
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Display Order Weight</label>
                <input
                  type="number"
                  style={ds.input}
                  value={editingMember.display_order ?? 1}
                  onChange={e => setEditingMember({ ...editingMember, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <input
                  type="checkbox"
                  id="m-active"
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                  checked={editingMember.is_active ?? true}
                  onChange={e => setEditingMember({ ...editingMember, is_active: e.target.checked })}
                />
                <label htmlFor="m-active" style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, cursor: 'pointer' }}>Active (Visible on Website)</label>
              </div>

              {/* PROFILE IMAGE STORAGE PIPELINE */}
              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Profile Avatar Image</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="member-img-upload"
                    onChange={handleAvatarUpload}
                    disabled={imageUploading}
                  />
                  <label htmlFor="member-img-upload" style={{ ...ds.uploadLabelBtn, opacity: imageUploading ? 0.6 : 1, cursor: imageUploading ? 'not-allowed' : 'pointer' }}>
                    <Upload size={14} /> {imageUploading ? 'Uploading to Supabase...' : 'Upload Image File'}
                  </label>
                  <input
                    type="text"
                    style={{ ...ds.input, flex: 1, margin: 0 }}
                    value={editingMember.image_url || ''}
                    onChange={e => setEditingMember({ ...editingMember, image_url: e.target.value })}
                    placeholder="Or enter public image URL directly"
                  />
                </div>
                {editingMember.image_url && (
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)' }}>
                      <img src={editingMember.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <button
                      style={{ color: '#EF4444', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => setEditingMember({ ...editingMember, image_url: '' })}
                    >
                      Clear Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setTeamModalOpen(false)}>Cancel</button>
              <button style={ds.saveButton} onClick={handleSaveMember} disabled={saveStatus === 'saving' || imageUploading}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save Person'}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* FAQ ADD/EDIT MODAL */}
      {faqModalOpen && editingFaq && (
        <div style={ds.overlay}>
          <div style={{ ...ds.modalCard, maxWidth: 540 }}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#F1F5F9' }}>
                {editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button style={ds.closeBtn} onClick={() => setFaqModalOpen(false)}><X size={18} /></button>
            </div>

            <div style={ds.modalBody}>
              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Category</label>
                <select
                  style={ds.input}
                  value={editingFaq.category || 'engagement'}
                  onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value })}
                >
                  <option value="engagement">Engagement Model</option>
                  <option value="product">Product & Scope</option>
                  <option value="security">Security & IP</option>
                </select>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Question Text</label>
                <input
                  type="text"
                  style={ds.input}
                  value={editingFaq.question || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. Do you sign NDAs?"
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Answer Text</label>
                <textarea
                  style={ds.textarea}
                  rows={4}
                  value={editingFaq.answer || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Provide a detailed, helpful answer..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <input
                  type="checkbox"
                  id="faq-active-check"
                  checked={editingFaq.is_active ?? true}
                  onChange={e => setEditingFaq({ ...editingFaq, is_active: e.target.checked })}
                />
                <label htmlFor="faq-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display as active on public FAQ list</label>
              </div>
            </div>

            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setFaqModalOpen(false)}>Cancel</button>
              <button style={ds.saveButton} onClick={handleSaveFaq} disabled={saveStatus === 'saving'}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOB POSITION ADD/EDIT MODAL */}
      {jobModalOpen && editingJob && (
        <div style={ds.overlay}>
          <div style={{ ...ds.modalCard, maxWidth: 540 }}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#F1F5F9' }}>
                {editingJob.id ? 'Edit Position' : 'Add Position'}
              </h3>
              <button style={ds.closeBtn} onClick={() => setJobModalOpen(false)}><X size={18} /></button>
            </div>

            <div style={ds.modalBody}>
              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Job Title</label>
                <input
                  type="text"
                  style={ds.input}
                  value={editingJob.title || ''}
                  onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Category</label>
                  <select
                    style={ds.input}
                    value={editingJob.category || 'Engineering'}
                    onChange={e => setEditingJob({ ...editingJob, category: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Job Type</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingJob.type || 'Full Time'}
                    onChange={e => setEditingJob({ ...editingJob, type: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Location</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingJob.location || 'Chennai, TN'}
                    onChange={e => setEditingJob({ ...editingJob, location: e.target.value })}
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Experience Level</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingJob.experience || ''}
                    onChange={e => setEditingJob({ ...editingJob, experience: e.target.value })}
                    placeholder="e.g. Mid-Level (2-3 Yrs)"
                  />
                </div>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Apply CTA Link or Email</label>
                <input
                  type="text"
                  style={ds.input}
                  value={editingJob.apply_link || ''}
                  onChange={e => setEditingJob({ ...editingJob, apply_link: e.target.value })}
                  placeholder="mailto:careers@crestcode.usa or custom link"
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Application Email (for form submissions)</label>
                <input
                  type="email"
                  style={ds.input}
                  value={editingJob.application_email || ''}
                  onChange={e => setEditingJob({ ...editingJob, application_email: e.target.value })}
                  placeholder="careers@crestcode.usa"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <input
                  type="checkbox"
                  id="job-active-check"
                  checked={editingJob.is_active ?? true}
                  onChange={e => setEditingJob({ ...editingJob, is_active: e.target.checked })}
                />
                <label htmlFor="job-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display as active position</label>
              </div>
            </div>

            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setJobModalOpen(false)}>Cancel</button>
              <button style={ds.saveButton} onClick={handleSaveJob} disabled={saveStatus === 'saving'}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save Position'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE MILESTONE ADD/EDIT MODAL */}
      {milestoneModalOpen && editingMilestone && (
        <div style={ds.overlay}>
          <div style={{ ...ds.modalCard, maxWidth: 540 }}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#F1F5F9' }}>
                {editingMilestone.id ? 'Edit Milestone' : 'Add Milestone'}
              </h3>
              <button style={ds.closeBtn} onClick={() => setMilestoneModalOpen(false)}><X size={18} /></button>
            </div>

            <div style={ds.modalBody}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, width: 120 }}>
                  <label style={ds.formLabel}>Year</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingMilestone.year || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    placeholder="e.g. 2024"
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Milestone Title</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingMilestone.title || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    placeholder="e.g. CrestCode Officially Launches"
                  />
                </div>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Milestone Copy Description</label>
                <textarea
                  style={ds.textarea}
                  rows={4}
                  value={editingMilestone.description || ''}
                  onChange={e => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  placeholder="Provide background story..."
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Timeline Image (Optional)</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="milestone-img-upload"
                    onChange={e => handlePortfolioFileUpload(e, url => setEditingMilestone({ ...editingMilestone, image_url: url }))}
                  />
                  <label htmlFor="milestone-img-upload" style={ds.uploadLabelBtn}>
                    <Upload size={14} /> Upload Image
                  </label>
                  <input
                    type="text"
                    style={{ ...ds.input, flex: 1 }}
                    value={editingMilestone.image_url || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, image_url: e.target.value })}
                    placeholder="Or enter public link"
                  />
                </div>
              </div>
            </div>

            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setMilestoneModalOpen(false)}>Cancel</button>
              <button style={ds.saveButton} onClick={handleSaveMilestone} disabled={saveStatus === 'saving' || imageUploading}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER PRODUCT ADD/EDIT MODAL */}
      {productModalOpen && editingProduct && (
        <div style={ds.overlay}>
          <div style={{ ...ds.modalCard, maxWidth: 640 }}>
            <div style={ds.modalHeader}>
              <h3 style={{ margin: 0, color: '#F1F5F9' }}>
                {editingProduct.id ? 'Edit Partner Product' : 'Add Partner Product'}
              </h3>
              <button style={ds.closeBtn} onClick={() => setProductModalOpen(false)}><X size={18} /></button>
            </div>

            <div style={ds.modalBody}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Product Name</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Dockly"
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Status Type</label>
                  <select
                    style={ds.input}
                    value={editingProduct.status_type || 'live'}
                    onChange={e => setEditingProduct({ ...editingProduct, status_type: e.target.value })}
                  >
                    <option value="live">Live</option>
                    <option value="beta">Beta Phase</option>
                    <option value="development">In Development</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Status Text (e.g. Live)</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.status_text || 'Live'}
                    onChange={e => setEditingProduct({ ...editingProduct, status_text: e.target.value })}
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Status Subtext (optional)</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.status_subtext || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, status_subtext: e.target.value || null })}
                    placeholder="e.g. Web ready"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Card Tagline</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.tagline || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="e.g. Family connectivity"
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Card Subtitle</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.subtitle || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                    placeholder="e.g. One connected platform..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Stat Value</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.stat_value || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, stat_value: e.target.value })}
                    placeholder="e.g. 2,400+ families"
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Stat Subtext</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.stat_subtext || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, stat_subtext: e.target.value })}
                    placeholder="e.g. onboarded within 90 days"
                  />
                </div>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>What We Did (Detailed Scope)</label>
                <textarea
                  style={ds.textarea}
                  rows={3}
                  value={editingProduct.what_we_did || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, what_we_did: e.target.value })}
                  placeholder="Describe CrestCode's contribution and achievements..."
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Industry</label>
                  <input type="text" style={ds.input} value={editingProduct.industry || ''} onChange={e => setEditingProduct({ ...editingProduct, industry: e.target.value })} />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Duration</label>
                  <input type="text" style={ds.input} value={editingProduct.duration || ''} onChange={e => setEditingProduct({ ...editingProduct, duration: e.target.value })} />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Team Size</label>
                  <input type="text" style={ds.input} value={editingProduct.team_size || ''} onChange={e => setEditingProduct({ ...editingProduct, team_size: e.target.value })} />
                </div>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  style={ds.input}
                  value={Array.isArray(editingProduct.tech_stack) ? editingProduct.tech_stack.join(', ') : ''}
                  onChange={e => setEditingProduct({ ...editingProduct, tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="e.g. Next.js, Node.js, PostgreSQL"
                />
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Feature Bullet Points (one per line)</label>
                <textarea
                  style={ds.textarea}
                  rows={3}
                  value={Array.isArray(editingProduct.features) ? editingProduct.features.map((f: any) => f.text).join('\n') : ''}
                  onChange={e => setEditingProduct({ ...editingProduct, features: e.target.value.split('\n').filter(Boolean).map(text => ({ text })) })}
                  placeholder="Planner & calendars&#13;Shared finances"
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Website URL</label>
                  <input
                    type="text"
                    style={ds.input}
                    value={editingProduct.website_url || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, website_url: e.target.value || null })}
                  />
                </div>
                <div style={{ ...ds.formGroup, flex: 1 }}>
                  <label style={ds.formLabel}>Product Logo</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="product-logo-upload"
                      onChange={e => handlePortfolioFileUpload(e, url => setEditingProduct({ ...editingProduct, logo_url: url }))}
                    />
                    <label htmlFor="product-logo-upload" style={ds.uploadLabelBtn}>
                      <Upload size={14} /> Logo
                    </label>
                    <input
                      type="text"
                      style={{ ...ds.input, flex: 1 }}
                      value={editingProduct.logo_url || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, logo_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={ds.formGroup}>
                <label style={ds.formLabel}>Gallery Screenshot URLs (one per line, future proof)</label>
                <textarea
                  style={ds.textarea}
                  rows={3}
                  value={Array.isArray(editingProduct.gallery_images) ? editingProduct.gallery_images.join('\n') : ''}
                  onChange={e => setEditingProduct({ ...editingProduct, gallery_images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                  placeholder="Enter screenshots links..."
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="product-gallery-upload"
                    style={{ display: 'none' }}
                    onChange={e => handlePortfolioFileUpload(e, url => {
                      const arr = Array.isArray(editingProduct.gallery_images) ? [...editingProduct.gallery_images] : [];
                      setEditingProduct({ ...editingProduct, gallery_images: [...arr, url] });
                    })}
                  />
                  <label htmlFor="product-gallery-upload" style={{ ...ds.uploadLabelBtn, margin: 0 }}>
                    <Upload size={14} /> Upload and Add Screenshot to Gallery
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="prod-active-check"
                  checked={editingProduct.is_active ?? true}
                  onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                />
                <label htmlFor="prod-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display product as active in public site</label>
              </div>
            </div>

            <div style={ds.modalFooter}>
              <button style={ds.cancelBtn} onClick={() => setProductModalOpen(false)}>Cancel</button>
              <button style={ds.saveButton} onClick={handleSaveProduct} disabled={saveStatus === 'saving' || imageUploading}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

// Sidebar Button Helper Component
interface SidebarButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}
function SidebarButton({ active, icon, label, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...ds.navLink,
        background: active ? '#1E293B' : 'transparent',
        color: active ? '#38BDF8' : '#94A3B8',
        fontWeight: active ? 700 : 500,
        borderLeft: active ? '4px solid #38BDF8' : '4px solid transparent',
        paddingLeft: active ? 16 : 20,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── STYLESHEETS ─────────────────────────────────────────────────────────────
const BLUE = '#3B82F6';
const DARK_BG = '#090D16';
const CARD_BG = '#0B132B';
const INPUT_BG = '#1C2541';

const ds: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: DARK_BG,
    color: '#F1F5F9',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  sidebar: {
    width: 260,
    background: '#0B0F19',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg,#3B82F6,#7C3AED)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#F1F5F9',
    letterSpacing: '-0.01em'
  },
  sidebarUser: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto'
  },
  navLink: {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: 'none',
    textAlign: 'left',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navDivider: {
    fontSize: 10,
    fontWeight: 800,
    color: '#475569',
    letterSpacing: '0.08em',
    padding: '20px 20px 8px 20px',
    textTransform: 'uppercase'
  },
  sidebarFooter: {
    padding: 20,
    borderTop: '1px solid rgba(255,255,255,0.04)'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.06)',
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s'
  },
  content: {
    flex: 1,
    overflowY: 'auto'
  },
  headerBar: {
    padding: '24px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: 'rgba(9,13,22,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    zIndex: 90,
    marginBottom: 20
  },
  tabTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '0.04em'
  },
  card: {
    background: CARD_BG,
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: 16,
    fontWeight: 800,
    color: '#F1F5F9',
    letterSpacing: '-0.01em'
  },
  formGroup: {
    marginBottom: 20
  },
  formLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 800,
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    background: INPUT_BG,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    margin: 0
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    background: INPUT_BG,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s'
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: BLUE,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg,#3B82F6,#2563EB)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.04)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '14px 16px',
    background: '#0F172A',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(15,23,42,0.2)'
  },
  td: {
    padding: '14px 16px',
    fontSize: 13,
    color: '#E2E8F0',
    verticalAlign: 'middle'
  },
  orderBtn: {
    background: '#1E293B',
    border: 'none',
    borderRadius: 4,
    padding: 4,
    color: '#94A3B8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBtn: {
    padding: 6,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#E2E8F0',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.05)',
    color: '#EF4444',
    cursor: 'pointer'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(9,13,22,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    background: CARD_BG,
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    padding: 4
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12
  },
  cancelBtn: {
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  saveButton: {
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: BLUE,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer'
  },
  uploadLabelBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  }
};
