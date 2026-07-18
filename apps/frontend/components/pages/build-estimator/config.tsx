import React from 'react';
import {
  Home, Globe, ShoppingCart, Smartphone, Bot, Wrench, Building2, Sparkles,
  Lightbulb, FileText, Layout, Palette, Code2, Database, KeyRound, Lock,
  User, Users, LayoutDashboard, BarChart2, ClipboardList, CreditCard, Calendar, Search, Bell,
  MessageSquare, Paperclip, Handshake, Ban, Brain, Mail, Cloud, Plug, ShieldCheck,
  Package, CheckCircle, Cpu, Star, Zap
} from 'lucide-react';
import type { ProductType, AILevel, TeamPref } from './types';

export const BLUE = '#005AE2';
export const BLUE_LIGHT = '#EFF6FF';
export const DARK = '#0F172A';
export const MUTED = '#64748B';
export const BORDER = '#E2E8F0';

export const PRODUCT_TYPES: { key: ProductType; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'landing',    label: 'Landing Page',        icon: <Home size={20} />, desc: 'Single page for marketing or lead capture' },
  { key: 'marketing',  label: 'Marketing Website',   icon: <Globe size={20} />, desc: 'Multi-page brand & content site' },
  { key: 'saas',       label: 'SaaS Platform',        icon: <Zap size={20} />, desc: 'Web app with subscriptions & dashboards' },
  { key: 'marketplace',label: 'Marketplace',          icon: <ShoppingCart size={20} />, desc: 'Buyer/seller transaction platform' },
  { key: 'mobile',     label: 'Mobile App',           icon: <Smartphone size={20} />, desc: 'iOS and/or Android native app' },
  { key: 'ai_product', label: 'AI Product',           icon: <Bot size={20} />, desc: 'AI-first product or LLM-powered tool' },
  { key: 'internal',   label: 'Internal Tool',        icon: <Wrench size={20} />, desc: 'Internal ops, admin or workflow tool' },
  { key: 'enterprise', label: 'Enterprise Platform',  icon: <Building2 size={20} />, desc: 'Complex multi-tenant enterprise system' },
  { key: 'other',      label: 'Other',                icon: <Sparkles size={20} />, desc: 'Custom or hybrid product' },
];

export const ASSET_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'idea_only',      label: 'Idea Only',                  icon: <Lightbulb size={16} /> },
  { key: 'requirements',   label: 'Requirements Document',       icon: <FileText size={16} /> },
  { key: 'wireframes',     label: 'Wireframes',                 icon: <Layout size={16} /> },
  { key: 'final_design',   label: 'Final UI Design',            icon: <Palette size={16} /> },
  { key: 'codebase',       label: 'Existing Codebase',          icon: <Code2 size={16} /> },
  { key: 'database',       label: 'Existing Database',          icon: <Database size={16} /> },
  { key: 'api',            label: 'Existing API',               icon: <Plug size={16} /> },
  { key: 'auth',           label: 'Existing Auth System',       icon: <KeyRound size={16} /> },
];

export const PLATFORM_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'web',     label: 'Web Application',  icon: <Globe size={16} /> },
  { key: 'ios',     label: 'iOS App',           icon: <Smartphone size={16} /> },
  { key: 'android', label: 'Android App',       icon: <Smartphone size={16} /> },
  { key: 'admin',   label: 'Admin Dashboard',   icon: <LayoutDashboard size={16} /> },
  { key: 'api',     label: 'API Only',          icon: <Plug size={16} /> },
];

export const FEATURE_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'auth',          label: 'User Authentication',   icon: <Lock size={16} /> },
  { key: 'profiles',      label: 'User Profiles',         icon: <User size={16} /> },
  { key: 'dashboard',     label: 'Dashboard',             icon: <LayoutDashboard size={16} /> },
  { key: 'analytics',     label: 'Analytics',             icon: <BarChart2 size={16} /> },
  { key: 'reporting',     label: 'Reporting',             icon: <ClipboardList size={16} /> },
  { key: 'payments',      label: 'Payments',              icon: <CreditCard size={16} /> },
  { key: 'booking',       label: 'Booking System',        icon: <Calendar size={16} /> },
  { key: 'search',        label: 'Search',                icon: <Search size={16} /> },
  { key: 'notifications', label: 'Notifications',         icon: <Bell size={16} /> },
  { key: 'messaging',     label: 'Messaging',             icon: <MessageSquare size={16} /> },
  { key: 'file_uploads',  label: 'File Uploads',          icon: <Paperclip size={16} /> },
  { key: 'roles',         label: 'Multi-User Roles',      icon: <ShieldCheck size={16} /> },
  { key: 'collaboration', label: 'Team Collaboration',    icon: <Handshake size={16} /> },
];

export const AI_OPTIONS: { key: AILevel; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'none',       label: 'No AI',                    icon: <Ban size={20} />,  desc: 'Traditional software only' },
  { key: 'assistant',  label: 'AI Assistant',             icon: <Bot size={20} />, desc: 'Chatbot or AI help widget' },
  { key: 'report_gen', label: 'AI Report Generation',     icon: <FileText size={20} />, desc: 'AI writes structured outputs' },
  { key: 'ocr',        label: 'OCR / Document Processing',icon: <FileText size={20} />, desc: 'Extract data from documents' },
  { key: 'ai_core',    label: 'AI Core Product',           icon: <Brain size={20} />, desc: 'AI is the product itself' },
];

export const INTEGRATION_OPTIONS: { key: string; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'payment',    label: 'Payment Processors',                  desc: 'Stripe, PayPal, Razorpay',           icon: <CreditCard size={16} /> },
  { key: 'email',      label: 'Email Integration',                   desc: 'Outlook, Gmail, Apple Mail',         icon: <Mail size={16} /> },
  { key: 'microsoft',  label: 'Microsoft Services',                  desc: 'Microsoft 365, Teams, Azure',        icon: <Cloud size={16} /> },
  { key: 'custom',     label: 'Custom APIs',                         desc: 'Internal or proprietary systems',    icon: <Plug size={16} /> },
  { key: 'chatbot',    label: 'Chatbot',                             desc: 'Support & conversational bots',      icon: <Bot size={16} /> },
  { key: 'slack',      label: 'Messenger such as Slack',             desc: 'Slack, Discord, Microsoft Teams',    icon: <MessageSquare size={16} /> },
  { key: 'salesforce', label: 'Custom Applications such as Salesforce', desc: 'Salesforce, HubSpot, Zoho CRM',      icon: <Database size={16} /> },
];

export const TEAM_OPTIONS: { key: TeamPref; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'solo',      label: 'Solo Developer',          icon: <User size={20} />, desc: 'One developer building everything' },
  { key: 'small',     label: 'Small Team (2–4)',         icon: <Users size={20} />, desc: 'Standard cross-functional squad' },
  { key: 'dedicated', label: 'Dedicated Product Team',  icon: <Zap size={20} />, desc: 'Full-scale team, fastest delivery' },
];

export const STEPS = [
  { label: 'Product Type', icon: Package },
  { label: 'Progress',     icon: CheckCircle },
  { label: 'Platforms',    icon: Cpu },
  { label: 'Features',     icon: Star },
  { label: 'AI',           icon: Cpu },
  { label: 'Integrations', icon: Zap },
  { label: 'Team',         icon: Users },
];
