'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/hooks/useScrollReveal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useContent } from '@/context/ContentContext';
import localConfig from '@/backend/config.json';
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';
import CountUp from '@/components/effects/CountUp';
import { useAdmin } from '@/context/AdminContext';
import { useInView } from 'framer-motion';
import { API_URL } from '@/services/api';
import { 
  User, Building, Lightbulb, Compass, Zap, Users, TrendingUp, Cpu, Globe, Brain, Home,
  ArrowLeft, ArrowRight, Sparkles, Check, X, AlertTriangle, Info, RefreshCw, ChevronRight 
} from 'lucide-react';
import { QAAnswers, ScoringResponse, DIMENSION_META, TRIAGE_CONFIG } from './idea-validator/types/scoring';

const PARTNER_PRODUCTS = [
  {
    id: '01',
    name: 'Dockly',
    tagline: 'Family connectivity',
    subtitle: 'One connected platform to manage your life, simplified',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    stat: '2,400+ families onboarded',
    statSub: 'Within the first 90 days post-launch',
    whatWeDid: 'Scoped, designed, and built a unified family hub from scratch — shipping a live product in 4 months with a 3-person team.',
    features: [
      {
        text: 'Planner & calendars',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      },
      {
        text: 'Shared finances',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            <line x1="12" y1="17" x2="12" y2="17" />
            <path d="M12 9V15M9 12h6" />
          </svg>
        )
      },
      {
        text: 'Secure vault',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        )
      }
    ],
    industry: 'Family Tech / SaaS',
    duration: '4 months',
    team: '3 members',
    stack: ['Next.js', 'Node.js', 'Tailwind CSS'],
    liveUrl: 'https://app.dockly.me/',
    statTheme: {
      bg: '#E6F4EA',
      text: '#064E3B',
      subText: '#047857',
      iconBg: '#A7F3D0',
      iconColor: '#059669'
    }
  },
  {
    id: '02',
    name: 'CastleGEC',
    tagline: 'Global education',
    subtitle: 'Study abroad & admissions consulting, simplified',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    stat: '500+ student placements',
    statSub: 'Secured in premier universities across the US and EU',
    whatWeDid: 'Designed and engineered a global education portal, unifying visa tracking and admissions counseling into one workflow for international students.',
    features: [
      {
        text: 'University admissions',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        )
      },
      {
        text: 'Visa guidance',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      },
      {
        text: 'Admissions insights',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )
      }
    ],
    industry: 'EdTech / Consulting',
    duration: '3 months',
    team: '2 members',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://castlegec.com/',
    statTheme: {
      bg: '#E6F4EA',
      text: '#064E3B',
      subText: '#047857',
      iconBg: '#A7F3D0',
      iconColor: '#059669'
    }
  },
  {
    id: '03',
    name: 'OpenCap',
    tagline: 'Trading analytics',
    subtitle: 'Trading analytics & prediction dashboard, simplified',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    stat: '$12M+ monthly trading volume',
    statSub: 'Processed through the prediction dashboard',
    whatWeDid: 'Developed high-frequency trading analytics dashboard and prediction models, enabling real-time portfolio tracking and option analytics.',
    features: [
      {
        text: 'AI trade prediction',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        )
      },
      {
        text: 'Portfolio analytics',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
        )
      },
      {
        text: 'Positions tracker',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        )
      }
    ],
    industry: 'Fintech / Trading',
    duration: '5 months',
    team: '4 members',
    stack: ['React.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    statTheme: {
      bg: '#E6F4EA',
      text: '#064E3B',
      subText: '#047857',
      iconBg: '#A7F3D0',
      iconColor: '#059669'
    }
  },
  {
    id: '04',
    name: 'VHOA',
    tagline: 'Real estate tech',
    subtitle: 'Virtual homeowners association portal, simplified',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
        <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01" />
      </svg>
    ),
    stat: '1,200+ active residents',
    statSub: 'Engaged across 15 premium communities',
    whatWeDid: 'Built an all-in-one HOA resident and property portal to streamline maintenance requests, announcements, and board communications.',
    features: [
      {
        text: 'Resident dashboard',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        )
      },
      {
        text: 'Service requests',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        )
      },
      {
        text: 'Announcements',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        )
      }
    ],
    industry: 'PropTech',
    duration: '6 months',
    team: '3 members',
    stack: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    statTheme: {
      bg: '#E6F4EA',
      text: '#064E3B',
      subText: '#047857',
      iconBg: '#A7F3D0',
      iconColor: '#059669'
    }
  }
];

export default function LandingPage() {
  const { content, loading, error } = useContent();
  const { isAdminMode } = useAdmin();
  const homeContent = content?.home || (localConfig as any).home;

  

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Step 1 (About the Idea), 2: Step 2 (Founder), 3: Loading, 4: Results
  const [pendingIdea, setPendingIdea] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [report, setReport] = useState<ScoringResponse | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string>('investor_appeal');
  const [formError, setFormError] = useState<string | null>(null);
  const [memoTab, setMemoTab] = useState<'summary' | 'thesis' | 'strengths' | 'risks' | 'recommendation'>('summary');
  const [activeDDGroup, setActiveDDGroup] = useState<string | null>('market');
  const [outcomeSubmitted, setOutcomeSubmitted] = useState<boolean>(false);
  const [outcomeForm, setOutcomeForm] = useState({ launched: 'no', monthly_revenue: '0', customers: '0', funding: 'none' });
  const [loadingStepText, setLoadingStepText] = useState('Extracting business signals...');

  // Form Fields State matching exact blueprint specifications
  const [answers, setAnswers] = useState<QAAnswers>({
    customer: '',
    problem: '',
    pain_score: 5,
    validation_level: 'none',
    market_size_choice: 'medium',
    revenue_model_choice: 'subscription',
    why_now: 'The timing is right due to market shifts and technological advancements.',
    competitors: '',
    moat: '',
    solo_founder: true,
    has_technical_cofounder: false,
    technical_background: 'no',
    current_stage: 'forming',
    launch_timeline: 'January 2026',
    funding_status: 'bootstrapped',
    contact_name: '',
    contact_email: '',
    need_help: false
  });

  const handleInputChange = (field: keyof QAAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    if (!answers.customer.trim() || answers.customer.trim().length < 10) {
      setFormError('Customer segment is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.problem.trim() || answers.problem.trim().length < 10) {
      setFormError('Problem description is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.competitors.trim() || answers.competitors.trim().length < 10) {
      setFormError('Competitors list is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.moat.trim() || answers.moat.trim().length < 10) {
      setFormError('Moat / Differentiation is required and must be at least 10 characters.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!answers.launch_timeline.trim() || answers.launch_timeline.trim().length < 3) {
      setFormError('Launch timeline is required and must be at least 3 characters.');
      return false;
    }
    if (!answers.contact_name.trim() || answers.contact_name.trim().length < 2) {
      setFormError('Your name is required and must be at least 2 characters.');
      return false;
    }
    const emailRegex = /^.+@.+\..+$/;
    if (!answers.contact_email.trim() || !emailRegex.test(answers.contact_email.trim())) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setFormError(null);
    if (submissionStep === 1 && !validateStep1()) return;
    setFormError(null);
    setSubmissionStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setFormError(null);
    setSubmissionStep(prev => prev - 1);
  };

  const handleReset = () => {
    setSubmissionStep(0);
    setReport(null);
    setIdea('');
    setAnswers({
      customer: '',
      problem: '',
      pain_score: 5,
      validation_level: 'none',
      market_size_choice: 'medium',
      revenue_model_choice: 'subscription',
      why_now: 'The timing is right due to market shifts and technological advancements.',
      competitors: '',
      moat: '',
      solo_founder: true,
      has_technical_cofounder: false,
      technical_background: 'no',
      current_stage: 'forming',
      launch_timeline: 'January 2026',
      funding_status: 'bootstrapped',
      contact_name: '',
      contact_email: '',
      need_help: false
    });
  };

  const handleValidatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateStep2()) return;

    setIsLoading(true);
    setSubmissionStep(3); // Loading screen step
    setLoadingStepText('Extracting business signals...');

    const loadingStages = [
      'Extracting business signals...',
      'Analyzing market timing & dynamics...',
      'Evaluating technical feasibility...',
      'Calculating investor appeal indices...',
      'Generating VC-grade due diligence report...'
    ];

    let currentStageIndex = 0;
    const stageTimer = setInterval(() => {
      if (currentStageIndex < loadingStages.length - 1) {
        currentStageIndex++;
        setLoadingStepText(loadingStages[currentStageIndex]);
      }
    }, 1200);

    const ideaText = `Original Concept: ${idea}
Target Customer: ${answers.customer}
Core Problem: ${answers.problem}
Competitors: ${answers.competitors}
Moat: ${answers.moat}`;

    try {
      const response = await fetch('/founder/idea-validator/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaText, answers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error generating scores');
      }

      clearInterval(stageTimer);
      setIsLoading(false);
      if (data.id) {
        window.location.href = `/founder/idea-validator/report?id=${data.id}`;
      } else {
        throw new Error('No report ID returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
      setSubmissionStep(2); // Return to step 2
      setIsLoading(false);
      clearInterval(stageTimer);
    }
  };
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const heroRef = useRef(null);

  const [activeProd, setActiveProd] = useState(0);

  const ideaExamples = [
    "Building a comprehensive life and legacy management application for family",
    "Creating reporting solutions for thinkandswim platform for option traders",
    "Creating an AI powered HOA management solution"
  ];

  const partneredProductsFallback = [
    {
      id: "01",
      status: "Live",
      category: "Family Connectivity",
      title: "One Connected Platform to Manage Your Life",
      company: "Dockly",
      description: "A simple and elegant family connectivity application designed to help family members coordinate schedules, manage tasks, and track shared finances in one secure space.",
      features: [
        "Planner & Calendars",
        "Shared Finances",
        "Secure Vault"
      ],
      tech: [
        "Next.js",
        "Node.js",
        "Tailwind CSS"
      ],
      industry: "Family Tech / SaaS",
      duration: "4 months",
      teamSize: "3 members",
      image: "/images/dockly_showcase.png",
      websiteLink: "https://app.dockly.me/",
      whatCrestcodeDid: "Scoped, designed, and built a unified family hub from scratch — shipping a live product in 4 months with a 3-person team.",
      highlightStat: "2,400+ families onboarded",
      highlightSub: "Within the first 90 days post-launch"
    },
    {
      id: "02",
      status: "Live",
      category: "Global Education",
      title: "Study Abroad & Admissions Consulting",
      company: "CastleGEC",
      description: "A comprehensive education portal connecting students in Dubai with top-tier universities across the US, UK, and EU, streamlining applications, visa processing, and portfolio creation.",
      features: [
        "University Admissions",
        "Visa Guidance",
        "Admissions Insights"
      ],
      tech: [
        "Next.js",
        "React",
        "Tailwind CSS"
      ],
      industry: "EdTech / Consulting",
      duration: "3 months",
      teamSize: "2 members",
      image: "/images/castlegc_showcase.png",
      websiteLink: "https://castlegec.com/",
      whatCrestcodeDid: "Designed and engineered a custom global education portal, integrating visa tracking and admissions counseling workflows for international students.",
      highlightStat: "500+ student placements",
      highlightSub: "Secured in premier universities across US & EU"
    },
    {
      id: "03",
      status: "In Progress",
      category: "Trading Analytics",
      title: "Trading Analytics & Prediction Dashboard",
      company: "OpenCap",
      description: "An options trading analytics platform designed for real-time portfolio performance tracking, open positions management, and AI-driven trade prediction models.",
      features: [
        "AI Trade Prediction",
        "Portfolio Analytics",
        "Positions Tracker"
      ],
      tech: [
        "React.js",
        "Node.js",
        "PostgreSQL"
      ],
      industry: "Fintech / Trading",
      duration: "5 months",
      teamSize: "4 members",
      image: "/images/opencap_showcase.png",
      whatCrestcodeDid: "Developed high-frequency trading analytics dashboard and prediction models, enabling real-time portfolio tracking and option analytics.",
      highlightStat: "$12M+ monthly trading volume",
      highlightSub: "Processed through the prediction dashboard"
    },
    {
      id: "04",
      status: "In Progress",
      category: "Real Estate Tech",
      title: "Virtual Homeowners Association Portal",
      company: "VHOA",
      description: "A modern resident and property management platform facilitating seamless communication and operations between apartment owners, tenants, and HOA board members.",
      features: [
        "Resident Dashboard",
        "Service Requests",
        "Announcements"
      ],
      tech: [
        "Next.js",
        "Node.js",
        "PostgreSQL"
      ],
      industry: "PropTech",
      duration: "6 months",
      teamSize: "3 members",
      image: "/images/vhoa_showcase.png",
      whatCrestcodeDid: "Built an all-in-one HOA resident and property portal to streamline maintenance requests, announcements, and board communications.",
      highlightStat: "1,200+ active residents",
      highlightSub: "Engaged across 15 premium communities"
    }
  ];

  

  const backFeaturesFallback = [
    // Card 0: Visionary Founders
    [
      "Validated product concept and market positioning",
      "Technical architecture and product roadmap",
      "A Minimum Lovable Product — built to delight, not just function",
      "Go-to-market strategy and launch support",
      "Pitch materials for investors or partners"
    ],
    // Card 1: Business Owners
    [
      "Clear problem definition and solution scope",
      "Business case and requirements documentation",
      "A Minimum Lovable Product your users will actually love",
      "Operational workflows and automation built in",
      "A long-term partner who grows with your business"
    ]
  ];

  // Carousel scrolling/dragging logic
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMethodStep, setActiveMethodStep] = useState(0);

  // Auto-cycle partnered products


  

  // Auto-scroll logic (smooth loop without duplicate elements)
  useEffect(() => {
    if (isDown || isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;

        // If we are at the end, scroll back smoothly to 0
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by card width (420px card + 32px gap = 452px)
          carouselRef.current.scrollBy({ left: 452, behavior: 'smooth' });
        }
      }
    }, 3500); // Auto-scroll every 3.5 seconds

    return () => clearInterval(interval);
  }, [isDown, isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollLeftFunc = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRightFunc = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  const loadScript = (src: string, id: string) => {
    return new Promise((resolve) => {
      if (document.getElementById(id)) {
        const checkReady = () => {
          if (id === 'three-script' && (window as any).THREE) return true;
          if (id === 'vanta-script' && (window as any).VANTA) return true;
          if (id === 'vanta-waves-script' && (window as any).VANTA?.WAVES) return true;
          return false;
        };

        if (checkReady()) {
          resolve(true);
          return;
        }

        const interval = setInterval(() => {
          if (checkReady()) {
            clearInterval(interval);
            resolve(true);
          }
        }, 50);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  useScrollReveal([loading, content]);

  // Vanta clouds effect (Disabled to follow investor page hero background style)
  useEffect(() => {
    // Vanta disabled for a clean, premium background design
    return;
  }, [loading]);



  // Handle body scroll locking for modals
  useEffect(() => {
    if (submissionStep >= 1 && submissionStep <= 4) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [submissionStep]);

  // We still show the loader if content isn't ready, 
  // but loading.tsx will have already shown a similar state.
  // If there's a load error but we have local fallback config, log it and proceed using localConfig
  if (error && localConfig?.home) {
    console.warn("Content fetch failed, falling back to local static config:", error);
  }

  // We still show the loader if content isn't ready and we don't have local fallback config
  if (loading && !content && !localConfig?.home) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Loading</p>
    </div>
  );

  // We only show the error screen if there is no local fallback config at all
  if (error && !localConfig?.home) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope px-4 text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Loading Failed</h1>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );



  if (!homeContent) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <p className="text-gray-500 italic">No content available. Please ensure the backend is running or config.json is populated.</p>
    </div>
  );

  const methodologyCards = homeContent.methodology.cards.length <= 4
    ? [
      ...homeContent.methodology.cards,
      {
        title: "AI & Automation Integration",
        highlight: "INTELLIGENT WORKFLOWS. ELITE SPEED.",
        description: "We infuse artificial intelligence and workflow automation directly into your venture’s core operations to minimize manual friction and accelerate scale.",
        icon: "cpu"
      },
      {
        title: "Silicon Valley Execution",
        highlight: "GLOBAL TALENT. RAPID LAUNCH.",
        description: "Access top-tier engineers, world-class designers, and product leaders working on a unified, high-velocity roadmap designed to optimize your runway.",
        icon: "target"
      }
    ]
    : homeContent.methodology.cards;

  const handleIdeaSubmit = (e: any) => {
    e.preventDefault();
    if (!idea || idea.trim().length < 10) {
      setFormMessage('Please tell us about your idea (at least 10 characters)');
      setMessageType('error');
      return;
    }
    setFormMessage('');
    window.location.href = `/founder/idea-validator?idea=${encodeURIComponent(idea)}`;
  };

  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userName || !userEmail || !emailRegex.test(userEmail)) {
      setFormMessage('Please provide your name and a valid email address');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/submit-idea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: pendingIdea,
          email: userEmail,
          name: userName
        }),
      });
      if (response.ok) {
        setSubmissionStep(3);
        setIdea('');
      } else {
        setFormMessage('Something went wrong. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setFormMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  const PAGE_STYLES = String.raw`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #E6EFFF;
          color: #005AE2;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em; /* elegant tracking for premium look */
          padding: 8px 18px; /* spacious pill */
          border-radius: 100px;
          margin-bottom: 40px; /* more breathing room below the eyebrow pill */
          text-transform: uppercase;
        }

        :root {
          /* Color System */
          --bg-base: #F3F5F9;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --bg-grey: #F1F5F9;
          --primary: #4F46E5;
          --primary-blue: #005AE2;
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
          --border-dark: rgba(255, 255, 255, 0.1);
          --success-green: #10B981;
          --accent-cyan: #00E6A0;
          
          /* Specific Section Colors */
          --peach-bg: #FFF2ED;
          --peach-border: #FFEBE0;
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-base);
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        /* Headings - Manrope */
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .f-card-title, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
          font-family: 'Manrope', sans-serif;
        }

        /* Sub-text - Manrope */
        .section-subtitle, .hero-description, .card-description, .f-card-desc, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
          font-family: 'Manrope', sans-serif;
        }

        /* Content - Inter */
        p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
          font-family: 'Inter', sans-serif;
        }

        * { box-sizing: border-box; }

        /* Page Load Animation */
        .landing-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        /* 3D Hero ambient glow */
        .hero-glow-wrap { position: relative; overflow: hidden; }
        .hero-glow-wrap .cc-glow-orb { pointer-events: none; }

        /* Fade In Up Animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }

        /* Enhanced card hover */
        .sys-card, .sys-card-small {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
        }
        .sys-card:hover {
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,90,226,0.06);
        }
        .sys-card-small:hover {
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,90,226,0.06);
        }

        /* Shimmer button */
        .btn-primary { position: relative; overflow: hidden; }
        .btn-primary::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0s;
          pointer-events: none;
        }
        .btn-primary:hover::before { left: 140%; transition: left 0.5s ease; }

        /* Section dark glow */
        .section-dark { position: relative; overflow: hidden; }

        /* Stat number pop */
        .stat-num {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .stat-item:hover .stat-num { transform: scale(1.08); }

        /* Process step hover */
        .process-step {
          transition: transform 0.3s ease;
        }
        .process-step:hover { transform: translateY(-6px); }
        .step-icon-peach {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .process-step:hover .step-icon-peach {
          transform: scale(1.15) rotate(-5deg);
          box-shadow: 0 8px 20px rgba(255,120,60,0.2);
        }
        .section-container { max-width: 1200px; }

        /* ===== GLOBAL RESPONSIVE SYSTEM ===== */

        /* --- Hero --- */
        @media(max-width: 480px) {
          .hero-idea-box { max-width: 100% !important; }
        }

        /* --- Section titles --- */
        @media(max-width: 480px) {
          .section-title { font-size: 1.6rem !important; }
          .section-subtitle { font-size: 0.9rem !important; }
        }

        /* --- Cards grid: force single column on phones --- */
        @media(max-width: 540px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .cards-grid-2 { grid-template-columns: 1fr !important; }
        }

        /* --- Sys cards (audience / who we build for) --- */
        @media(max-width: 768px) {
          .sys-card { padding: 32px 24px; border-radius: 20px; }
          .sys-card-small { padding: 28px 20px; border-radius: 20px; }
        }
        @media(max-width: 480px) {
          .sys-card { padding: 24px 18px; }
          .sys-card-small { padding: 20px 16px; }
        }

        /* --- Testimonials --- */
        @media(max-width: 768px) {
          .testimonial-card { padding: 32px 24px; border-radius: 24px; }
        }
        @media(max-width: 480px) {
          .testimonial-card { padding: 24px 16px; border-radius: 20px; }
        }

        /* --- Founder quote card --- */
        @media(max-width: 768px) {
          .founder-quote-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 24px !important;
            border-radius: 28px !important;
            margin-top: 40px !important;
          }
          .founder-img { width: 80px !important; height: 80px !important; }
        }
        @media(max-width: 480px) {
          .founder-quote-card { padding: 24px 16px !important; border-radius: 20px !important; }
          .fq-text { font-size: 1rem !important; }
        }

        /* --- Flip cards / audience grid --- */
        @media(max-width: 768px) {
          .flip-card-inner { min-height: 490px !important; }
          .flip-card-front, .flip-card-back { padding: 28px 20px !important; border-radius: 20px !important; }
        }
        @media(max-width: 480px) {
          .flip-card-inner { min-height: 490px !important; }
          .audience-card-wrap .flip-card-inner { min-height: 490px !important; }
        }

        /* --- Metrics row --- */
        @media(max-width: 640px) {
          .metrics-row { flex-direction: column; align-items: center; gap: 32px; }
        }

        /* --- Signup overlay --- */
        @media(max-width: 900px) {
          .signup-left { display: none !important; }
          .signup-right { padding: 32px 24px !important; }
        }
        @media(max-width: 480px) {
          .signup-right { padding: 24px 16px !important; }
          .signup-title { font-size: 1.6rem !important; }
        }

        /* --- Carousel cards --- */
        @media(max-width: 480px) {
          .carousel-card { width: 280px !important; height: 360px !important; padding: 24px 20px !important; }
        }

        /* --- Prevent horizontal scroll --- */
        .landing-page { overflow-x: hidden; }
        *, *::before, *::after { box-sizing: border-box; }
        .text-center { text-align: center; }
        .text-primary { color: var(--primary-blue); }
        .text-white { color: var(--white); }
        .text-accent { color: var(--accent-cyan); }

        /* Typography */
        .hero-title { 
          font-family: 'Manrope', sans-serif !important;
          font-size: 44px !important; /* reduced to fit the full first line on one row (2-line heading) */
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.42 !important; /* increased for more whitespace between the two heading lines */
          color: #020617 !important;
          margin: 0 auto 36px !important; /* more space below heading */
          text-align: center !important;
          max-width: 960px !important;
        }
        .hero-title span {
          font-family: 'Manrope', sans-serif !important;
          font-weight: 800 !important;
        }
        @media(max-width: 768px) {
          .hero-title {
            font-size: 30px !important;
            line-height: 1.38 !important; /* slightly more open on mobile too */
          }
        }
        .section-title { 
          font-family: 'Manrope', sans-serif !important;
          font-size: 36px !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 12px !important;
          line-height: 1.25 !important;
          text-align: center !important;
          color: var(--text-black) !important;
        }
        @media(max-width: 768px) {
          .section-title {
            font-size: 26px !important;
          }
        }
        .section-subtitle { 
          font-family: 'Inter', sans-serif !important;
          color: var(--text-muted) !important; 
          font-size: clamp(0.9rem, 2vw, 0.95rem) !important; 
          line-height: 1.65 !important; 
          font-weight: 500 !important;
          max-width: 600px; 
          margin: 0 auto 24px !important; 
        }
        .section-eyebrow { 
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #E6EFFF;
          color: var(--primary-blue) !important; 
          font-weight: 800 !important; 
          letter-spacing: 0.15em !important; 
          text-transform: uppercase !important; 
          font-size: 0.75rem !important; 
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px !important; 
          font-family: 'Manrope', sans-serif !important;
        }

        /* Sections - all share a unified 100px top/bottom padding via .section-container */
        .section-light { background-color: #EFF6FF; }
        .section-cta-sky {
          background-image: url('/images/studio/footer_no_faces.png');
          background-size: cover;
          background-position: center;
          position: relative;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
          overflow: hidden;
          color: #FFFFFF !important;
        }
        .section-cta-sky::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to bottom, rgba(207, 218, 245, 0.3) 0%, rgba(205, 217, 248, 0.5).5) 100%);
          z-index: 1;
        }
        .section-cta-sky .section-title, 
        .section-cta-sky .section-subtitle {
          color: #FFFFFF !important;
        }

        .section-cta-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, 
            transparent 0%,
            rgba(11, 16, 25, 0.6) 60%,
            #0B1019 100%
          );
          pointer-events: none;
          z-index: 2;
        }
        .section-dark { background-color: var(--bg-dark); color: var(--white); }
        .section-grey { background-color: var(--bg-base); box-shadow: inset 0 24px 48px -24px rgba(0, 90, 226, 0.05), inset 0 -24px 48px -24px rgba(0, 90, 226, 0.05); }

        /* Buttons */
        .btn-primary { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 16px 40px; 
          border-radius: 100px; 
          font-weight: 700; 
          font-size: 16px; 
          border: none; 
          cursor: pointer; 
          transition: background-color 0.2s, transform 0.2s; 
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
        }
        .btn-primary:hover { background-color: #004ac2; transform: translateY(-2px); }
        .btn-nav { padding: 10px 24px; font-size: 14px; box-shadow: none; }

        .idea-textarea::placeholder { color: #CBD5E1; }

        /* Hero Section — vertical spacing from global-styles.css */
        .hero-section {
          text-align: center !important;
          background-color: #F1F5F9 !important;
        }
        @media(max-width: 768px) {
          .hero-section {
            min-height: auto !important;
          }
        }
        .hero-description {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.65 !important;
          max-width: 650px !important;
          margin: 0 auto 24px !important;
          text-align: center !important;
        }
        .email-form { max-width: 500px; margin: 0 auto; position: relative; }
        .email-form-input { background-color: var(--white); border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 40px 100px -20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
        .idea-textarea { width: 100%; height: 160px; padding: 24px; border: none; outline: none; font-family: inherit; font-size: clamp(0.95rem, 2vw, 1.125rem); resize: none; color: var(--text-black); }
        .idea-textarea::placeholder { color: var(--text-muted); }
        .submit-btn { position: absolute; bottom: 16px; right: 16px; background-color: var(--primary-blue); color: var(--white); padding: 12px 24px; border-radius: 100px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: background-color 0.2s; }
        .submit-btn:hover { background-color: #004ac2; }
        .hero-note { font-size: clamp(0.75rem, 1.25vw, 0.8125rem); font-weight: 600; color: var(--text-muted); margin-top: 24px; }
        .form-message { margin-top: 16px; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; }
        .form-message.success { background-color: #ECFDF5; color: var(--success-green); }
        .form-message.error { background-color: #FEF2F2; color: #991B1B; }

        /* Hero Email Popup */
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translate(-50%, -44%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        .hero-email-popup-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 15, 28, 0.38);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 50;
          border-radius: inherit;
        }
        .hero-email-popup {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(440px, 90vw);
          background: #ffffff;
          border-radius: 24px;
          padding: 40px 36px 36px;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02);
          z-index: 51;
          animation: popupSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          text-align: center;
        }
        .hero-email-popup-close {
          position: absolute;
          top: 14px; right: 18px;
          background: none; border: none;
          font-size: 1.5rem; color: #94A3B8;
          cursor: pointer; line-height: 1;
          transition: color 0.2s;
        }
        .hero-email-popup-close:hover { color: #475569; }
        .hero-email-popup-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 10px 24px -6px rgba(0,90,226,0.4);
        }
        .hero-email-popup h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          color: #0A0F1C; margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .hero-email-popup p {
          font-size: 0.95rem; color: #64748B;
          line-height: 1.6; font-weight: 500;
          margin: 0 0 24px;
        }
        .hero-email-popup-input-row {
          display: flex; gap: 8px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hero-email-popup-input-row:focus-within {
          border-color: #005AE2;
          box-shadow: 0 0 0 4px rgba(0,90,226,0.1);
        }
        .hero-email-popup-input {
          flex: 1; border: none; background: transparent;
          outline: none; font-size: 0.95rem; font-weight: 500;
          color: #0A0F1C; font-family: 'Inter', sans-serif;
          min-width: 0;
        }
        .hero-email-popup-input::placeholder { color: #94A3B8; }
        .hero-email-popup-btn {
          background: #005AE2; color: #fff;
          border: none; border-radius: 10px;
          padding: 10px 18px; font-weight: 700;
          font-size: 0.875rem; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 12px rgba(0,90,226,0.3);
        }
        .hero-email-popup-btn:hover { background: #004ac2; transform: translateY(-1px); }
        .hero-email-popup-success {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 8px 0;
        }
        .hero-email-popup-success-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: #ECFDF5; display: flex; align-items: center; justify-content: center;
        }
        .hero-email-popup-privacy {
          margin-top: 14px;
          font-size: 0.75rem; color: #94A3B8; font-weight: 500;
        }

        /* Grid Systems */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: stretch; grid-auto-rows: 1fr; }
        .cards-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px;}
        .features-grid-4 {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .features-grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .features-grid-4 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .features-grid-4 {
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
          }
          .features-grid-4 .sys-card-small {
            padding: 32px 20px;
          }
        }

        /* System Cards */
        .sys-card { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 48px 40px; border-radius: 24px; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .sys-card:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }
        .sys-card-small { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 40px 32px; border-radius: 24px; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .sys-card-small:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }

        .card-learn-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: transparent;
          color: var(--primary-blue);
          border: 1.5px solid var(--primary-blue);
          border-radius: 100px;
          padding: 10px 22px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-learn-more-btn svg {
          transition: transform 0.3s ease;
        }
        .card-learn-more-btn:hover {
          background-color: var(--primary-blue);
          color: var(--white) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 90, 226, 0.2);
        }
        .card-learn-more-btn:hover svg {
          transform: translateX(4px);
        }
        .sys-card:hover .card-learn-more-btn {
          color: var(--white);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .sys-card:hover .card-learn-more-btn:hover {
          background-color: var(--white);
          color: var(--bg-dark) !important;
          border-color: var(--white);
          box-shadow: 0 8px 16px rgba(255, 255, 255, 0.15);
        }

        /* Dedicated Testimonial Card Aesthetic */
        .testimonial-card {
          background-color: #F5F9FF; /* Lite Blue Tint */
          border: 1px solid rgba(0, 90, 226, 0.05);
          padding: 48px 40px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
        }
        .testimonial-card:hover {
          background-color: var(--white);
          transform: translateY(-12px);
          box-shadow: 0 30px 60px -12px rgba(0, 90, 226, 0.12);
          border-color: rgba(0, 90, 226, 0.15);
        }

        /* Target Audience Elements */
        .card-icon { width: 44px !important; height: 44px !important; background-color: var(--white); color: var(--primary-blue); display: flex; align-items: center; justify-content: center; border-radius: 12px !important; margin-bottom: 16px !important; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); flex-shrink: 0; }
        .card-icon svg { width: 20px !important; height: 20px !important; min-width: 20px !important; min-height: 20px !important; flex-shrink: 0; display: block; }
        .sys-card:hover .card-icon { background-color: var(--primary-blue); color: var(--white); }
        .card-title { font-size: clamp(1.05rem, 2vw, 1.15rem) !important; font-weight: 800; margin-bottom: 8px !important; color: var(--text-black); letter-spacing: -0.02em; transition: color 0.3s; }
        .sys-card:hover .card-title { color: var(--white); }
        .card-description { color: var(--text-muted); font-size: 0.85rem !important; line-height: 1.45 !important; font-weight: 500; margin-bottom: 16px !important; transition: color 0.3s; }
        .sys-card:hover .card-description { color: #9CA3AF; }
        .card-features { list-style: none; padding: 0; margin: 0; }
        .card-features li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 12px; transition: color 0.3s; }
        .sys-card:hover .card-features li { color: var(--white); }
        .check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem; }
        
        /* sys-card-small inner hovers */
        .f-card-icon { transition: all 0.3s; }
        .sys-card-small:hover .f-card-icon { background-color: var(--primary-blue); color: var(--white); }
        .f-card-title { transition: color 0.3s; }
        .sys-card-small:hover .f-card-title { color: var(--white); }
        .f-card-highlight { transition: color 0.3s; }
        .sys-card-small:hover .f-card-highlight { color: var(--accent-cyan); }
        .f-card-desc { transition: color 0.3s; }
        .sys-card-small:hover .f-card-desc { color: #9CA3AF; }

        /* Dark Section Content */
        .dark-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; margin-bottom: 80px; }
        @media(min-width: 900px) { .dark-grid { grid-template-columns: 1fr 1fr; gap: 64px; } }
        .feature-list { display: flex; flex-direction: column; gap: 32px; }
        .feature-item { display: flex; gap: 20px; }
        .feature-bullet { width: 40px; height: 40px; border-radius: 100px; background-color: rgba(37,99,235,0.15); border: 2px solid var(--primary-blue); flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-weight: 800; }
        .feature-title { font-size: clamp(1rem, 2vw, 1.125rem); font-weight: 800; margin-bottom: 8px; color: var(--white); }
        .feature-desc { color: #9CA3AF; font-size: clamp(0.875rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; }
        
        .testimonial-card-dark { background-color: #0F172A; padding: 48px 40px; border-radius: 24px; border: 1px solid var(--border-dark); }
        .t-card-quote { font-size: clamp(1.125rem, 2.5vw, 1.35rem); font-weight: 600; line-height: 1.6; margin-bottom: 40px; color: var(--white); }
        .t-card-author { display: flex; align-items: center; gap: 16px; }
        .t-avatar { width: 48px; height: 48px; background-color: #334155; border-radius: 100px; }
        .t-name { font-weight: 800; font-size: 1rem; color: var(--white); }
        .t-role { color: #9CA3AF; font-size: clamp(0.6875rem, 1vw, 0.8125rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

        /* Stats Row */
        .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; padding: 0; text-align: center; }
        @media(min-width: 768px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }

        /* 3D Stat Card */
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, background 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .stat-item:hover {
          transform: perspective(800px) rotateX(-6deg) translateY(-10px) scale(1.04);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        /* Shimmer line inside card */
        .stat-item::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transition: left 0.6s ease;
        }
        .stat-item:hover::before { left: 140%; }
        /* Glow orb behind number */
        .stat-item::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .stat-item:hover::after { opacity: 1; }

        .stat-num {
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: -0.03em;
          display: flex;
          align-items: baseline;
          justify-content: center;
          color: #ffffff;
        }
        .stat-label {
          color: rgba(255,255,255,0.85);
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition: color 0.3s ease;
        }
        .stat-item:hover .stat-label { color: #ffffff; }

        .metrics-bg-section {
          position: relative;
          background: #0A0F1C;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          min-height: 220px;
          overflow: hidden;
          width: 100% !important;
          max-width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block;
        }

        /* How We Make It Happen Features */
        .f-card-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 24px; font-weight: 800; font-size: 1.25rem; }
        .primary-bg { background-color: rgba(0, 90, 226, 0.1); color: var(--primary-blue); }
        .f-card-title { font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: var(--text-black); }
        .f-card-highlight { color: var(--primary-blue); font-size: clamp(0.75rem, 1.25vw, 0.8125rem); font-weight: 700; margin-bottom: 16px; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em; }
        .f-card-desc { color: var(--text-muted); font-size: clamp(0.875rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; }

        /* 3D Glass Auto-Scrolling Carousel */
        .carousel-section-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-top: 64px;
          padding: 40px 0 80px;
        }
        
        .carousel-section-wrapper::before,
        .carousel-section-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 15%;
          z-index: 5;
          pointer-events: none;
        }
        .carousel-section-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #F9FAFB, transparent);
        }
        .carousel-section-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #F9FAFB, transparent);
        }
        .carousel-track {
          display: flex;
          width: max-content;
          gap: 32px;
          padding: 20px 0;
        }
        
        /* Optional: add smooth scrolling if users use trackpad */
        .carousel-section-wrapper {
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          scroll-behavior: smooth;
          user-select: none;
        }
        .carousel-section-wrapper::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        
        .carousel-nav-btn {
          position: absolute;
          top: 55%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 90, 226, 0.15);
          color: #0A0F1C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 90, 226, 0.08);
        }
        .carousel-nav-btn:hover {
          background: #005AE2;
          color: white;
          box-shadow: 0 15px 35px rgba(0, 90, 226, 0.25);
          transform: translateY(-50%) scale(1.08);
          border-color: transparent;
        }
        .carousel-nav-btn.left {
          left: 40px;
        }
        .carousel-nav-btn.right {
          right: 40px;
        }
        @media (max-width: 768px) {
          .carousel-nav-btn {
            display: none;
          }
        }
        
        .carousel-card {
          width: 420px;
          height: 480px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 32px;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 90, 226, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
          transform: perspective(1000px) rotateY(-5deg) translateZ(0);
          z-index: 1;
        }
        
        .carousel-card:hover {
          transform: perspective(1000px) rotateY(0deg) translateZ(20px) translateY(-10px);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 30px 60px rgba(0, 90, 226, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 1);
          z-index: 10;
        }
        
        .carousel-bg-number {
          position: absolute;
          bottom: -20px;
          right: -10px;
          font-size: 14rem;
          font-weight: 900;
          color: rgba(0, 90, 226, 0.04);
          line-height: 1;
          font-family: 'Inter', sans-serif;
          transition: all 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        
        .carousel-card:hover .carousel-bg-number {
          color: rgba(0, 90, 226, 0.08);
          transform: scale(1.05) translate(-10px, -10px);
        }
        
        .carousel-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary-blue), #003a9e);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 40px;
          box-shadow: 0 10px 20px rgba(0, 90, 226, 0.3);
          z-index: 2;
          position: relative;
        }
        
        .carousel-content {
          position: relative;
          z-index: 2;
          flex-grow: 1;
        }
        
        .carousel-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text-black);
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        .carousel-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          font-weight: 500;
        }
        
        @media(max-width: 768px) {
          .carousel-card {
            width: 320px;
            height: 400px;
            padding: 32px 24px;
          }
          .carousel-bg-number {
            font-size: 10rem;
          }
        }

        /* Testimonials */
        /* Testimonials Aesthetic Refinement */
        .t-quote {
          font-style: normal;
          color: var(--text-black);
          font-size: 1.1rem;
          line-height: 1.7;
          font-weight: 500;
          margin-bottom: 40px;
          flex-grow: 1;
          transition: color 0.3s ease;
        }
        
        .t-box-author {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
        }
        .t-avatar-light {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(0, 90, 226, 0.1), rgba(0, 90, 226, 0.05));
          border-radius: 50%;
          border: 1px solid rgba(0, 90, 226, 0.1);
        }
        
        .t-name-light { font-weight: 800; font-size: 1rem; color: var(--text-black); transition: color 0.3s; display: block; }
        .t-role-light { color: var(--text-muted); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 6px; transition: color 0.3s; display: block; }
        
        /* Remove the dark theme hover for testimonials to keep it minimalist and light */
        .testimonial-card:hover .t-quote, 
        .testimonial-card:hover .t-name-light,
        .testimonial-card:hover .t-role-light { color: inherit; }

        /* Founder Quote Box Aesthetic Refinement */
        .founder-quote-card {
          background-color: #F5F9FF; /* Lite Blue Tint */
          border-radius: 40px;
          padding: clamp(40px, 6vw, 80px);
          display: flex;
          align-items: center;
          gap: clamp(32px, 5vw, 64px);
          border: 1px solid rgba(0, 90, 226, 0.05);
          max-width: 1000px;
          margin: 80px auto 0;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .founder-quote-card:hover {
          background-color: var(--white); /* Turns white on hover for contrast */
          transform: translateY(-8px);
          box-shadow: 0 40px 80px -15px rgba(0, 90, 226, 0.1);
          border-color: rgba(0, 90, 226, 0.15);
        }
        
        .founder-img {
          width: clamp(120px, 18vw, 180px);
          height: clamp(120px, 18vw, 180px);
          border-radius: 50%;
          border: 6px solid var(--white);
          box-shadow: 0 15px 35px rgba(0, 90, 226, 0.1);
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.5s ease;
          position: relative;
          z-index: 1;
        }
        .founder-quote-card:hover .founder-img {
          transform: scale(1.05) rotate(2deg);
        }
        
        .fq-marks {
          color: var(--primary-blue);
          font-size: 40px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 20px;
          opacity: 0.8;
          letter-spacing: -2px;
        }
        
        .fq-text {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 700;
          color: var(--text-black);
          line-height: 1.5;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }
        
        .fq-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
        }
        .fq-author { font-weight: 800; font-size: 1.1rem; color: var(--text-black); }
        .fq-role { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }

        /* Multi-step Submission Styles */
        .step-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 15, 28, 0.4);
          backdrop-filter: blur(12px);
          z-index: 1000; display: flex; align-items: flex-start; justify-content: center;
          overflow-y: auto; padding: 40px 20px;
          animation: cc-fadeIn 0.3s ease;
        }
        .step-modal {
          background: white; border-radius: 32px; width: min(480px, 95vw);
          padding: 32px 24px; text-align: center; position: relative;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.25);
          animation: cc-popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .step-modal-wizard {
          background: white; border-radius: 24px; width: min(680px, 95vw);
          padding: 24px 32px; position: relative; text-align: left;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.25);
          margin-top: auto; margin-bottom: auto;
          animation: cc-popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .step-modal-wizard .form-group {
          margin-bottom: 14px !important;
          gap: 4px !important;
        }
        .step-modal-wizard .form-label {
          font-size: 0.88rem !important;
          margin-bottom: 2px !important;
          font-weight: 700 !important;
          color: #334155 !important;
        }
        .step-modal-wizard .textarea-box {
          min-height: 52px !important;
          padding: 8px 12px !important;
          font-size: 0.88rem !important;
          border-radius: 8px !important;
        }
        .step-modal-wizard .radio-pills-row {
          gap: 8px !important;
        }
        .step-modal-wizard .radio-pill-card {
          padding: 10px 12px !important;
          border-radius: 8px !important;
          gap: 2px !important;
        }
        .step-modal-wizard .radio-title {
          font-size: 0.85rem !important;
        }
        .step-modal-wizard .radio-desc {
          font-size: 0.7rem !important;
          line-height: 1.2 !important;
        }
        .step-modal-wizard .toggle-btn-group {
          gap: 8px !important;
        }
        .step-modal-wizard .toggle-btn {
          padding: 8px 14px !important;
          font-size: 0.85rem !important;
          border-radius: 8px !important;
        }
        .step-modal-wizard .pain-btn {
          height: 32px !important;
          font-size: 0.85rem !important;
          border-radius: 6px !important;
        }
        .step-modal-wizard .form-heading {
          font-size: 1.35rem !important;
          margin-bottom: 4px !important;
        }
        .step-modal-wizard .form-subheading {
          font-size: 0.88rem !important;
          margin-bottom: 16px !important;
        }
        .step-modal-wizard .step-progress-row {
          margin-bottom: 20px !important;
        }
        .step-modal-wizard .step-bubble {
          width: 32px !important;
          height: 32px !important;
          font-size: 0.85rem !important;
        }
        .step-modal-close {
          position: absolute; top: 20px; right: 20px; background: none; border: none;
          font-size: 24px; color: #94A3B8; cursor: pointer;
        }
        .form-section-card {
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 16px;
          background-color: #FCFDFE;
        }
        .form-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
        }
        .step-modal-icon-wrap {
          width: 64px; height: 64px; background: #F1F5F9; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; color: #005AE2;
        }
        .step-modal h3 { font-size: 1.75rem; font-weight: 800; color: #0A0F1C; margin-bottom: 12px; }
        .step-modal p { color: #64748B; font-size: 1rem; line-height: 1.6; margin-bottom: 32px; font-weight: 500; }
        .step-input-wrap {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px;
          padding: 16px 20px; margin-bottom: 24px; transition: border-color 0.2s;
        }
        .step-input-wrap:focus-within { border-color: #005AE2; }
        .step-input { border: none; background: transparent; width: 100%; outline: none; font-size: 1rem; color: #0A0F1C; }
        .btn-step-primary {
          width: 100%; background: #005AE2; color: white; padding: 18px;
          border-radius: 16px; font-weight: 700; border: none; cursor: pointer;
          font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-step-primary:hover { background: #004ac2; transform: translateY(-2px); }
        .step-modal-footer { margin-top: 32px; font-size: 0.75rem; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Signup Overlay Styles */
        .signup-overlay {
          position: fixed; inset: 0; background: white; z-index: 2000;
          display: flex; animation: cc-pageSlide 0.5s ease;
        }
        .signup-left {
          width: 38%; background: #0A0F1C; color: white; padding: 60px 64px;
          display: flex; flex-direction: column; justify-content: flex-start;
          gap: 20px;
        }
        /* @media (max-width: 900px) { .signup-left { display: none; } } */
        /* Maintain desktop signup view */
        .signup-left { display: flex; }
        .signup-right {
          flex: 1; padding: 40px 64px; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; overflow-y: auto;
        }
        .signup-form-box { 
          width: 100%; max-width: 440px; 
          display: flex; flex-direction: column;
        }
        .signup-badge {
          background: #E0E7FF; color: #4338CA; padding: 6px 12px;
          border-radius: 100px; font-size: 0.75rem; font-weight: 700;
          display: inline-block; margin-bottom: 24px;
        }
        .signup-title { font-size: 2.25rem; font-weight: 800; color: #0A0F1C; margin-bottom: 8px; }
        .signup-subtitle { color: #64748B; margin-bottom: 24px; font-weight: 500; }
        .signup-field { margin-bottom: 20px; }
        .signup-label { display: block; font-size: 0.875rem; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
        .signup-input {
          width: 100%; padding: 14px 16px; background: white;
          border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 1rem;
          transition: border-color 0.2s;
        }
        .signup-input:focus { border-color: #005AE2; outline: none; }
        .signup-divider {
          display: flex; align-items: center; margin: 32px 0; color: #94A3B8; font-size: 0.8rem; font-weight: 700;
        }
        .signup-divider::before, .signup-divider::after { content: ''; flex: 1; height: 1px; background: #E2E8F0; margin: 0 16px; }
        .btn-google {
          width: 100%; background: white; border: 1.5px solid #E2E8F0; padding: 14px;
          border-radius: 12px; font-weight: 600; display: flex; align-items: center;
          justify-content: center; gap: 12px; cursor: pointer; transition: background 0.2s;
        }
        .btn-google:hover { background: #F8FAFC; }
        .signup-footer { margin-top: 32px; text-align: center; color: #64748B; font-weight: 500; font-size: 0.9rem; }
        .signup-footer a { color: #005AE2; font-weight: 700; text-decoration: none; }

        @keyframes cc-popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes cc-fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Hero Aura Animation */
        @keyframes float-aura {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .hero-aura {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 100%;
          filter: blur(100px);
          opacity: 0.12;
          z-index: 0;
          pointer-events: none;
          animation: float-aura 15s infinite alternate ease-in-out;
        }
        .aura-1 { background: radial-gradient(circle, #4F46E5, transparent 70%); top: -300px; left: -200px; }
        .aura-2 { background: radial-gradient(circle, #005AE2, transparent 70%); bottom: -200px; right: -200px; animation-delay: -7s; }

        @keyframes border-beam {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }

        .hero-idea-box {
          position: relative;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 1px; /* Subtle border container */
          box-shadow: 
            0 20px 50px -12px rgba(0, 90, 226, 0.15),
            0 0 0 1px rgba(0, 90, 226, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 480px;
          border: none;
          overflow: hidden;
        }

        .hero-idea-box:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 
            0 30px 70px -10px rgba(0, 90, 226, 0.25),
            0 0 25px rgba(0, 90, 226, 0.2);
        }

        .hero-idea-inner {
          position: relative;
          background: white;
          border-radius: 23px;
          width: 100%;
          height: 100%;
          padding: 8px;
          box-shadow: inset 0 0 0 1px rgba(0, 90, 226, 0.08);
          z-index: 1; /* Stay above the beam */
        }

        /* Seamless Footer Merge Override */
        .cc-footer-wrapper .footer {
          border-top: none !important;
        }

        /* ===== INFOGRAPHIC (How We Help) — CENTER CIRCLE + RIGHT CARDS ===== */
        .inf-section-bg {
          background: linear-gradient(135deg, rgba(240,245,255,0.85) 0%, rgba(238,242,255,0.9) 50%, rgba(235,240,255,0.85) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 24px 48px -24px rgba(0,90,226,0.08), inset 0 -24px 48px -24px rgba(0,90,226,0.08);
        }

        .inf-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          margin-top: 56px;
          position: relative;
          min-height: 480px;
        }

        /* ── CENTER CIRCLE (left column, centered vertically) ── */
        .inf-center-col {
          flex: 0 0 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          align-self: stretch;
        }

        .inf-center-circle {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%);
          border: 2px solid rgba(0,90,226,0.18);
          box-shadow:
            0 8px 40px rgba(0,90,226,0.15),
            inset 0 1px 0 rgba(255,255,255,0.6),
            0 0 0 12px rgba(0,90,226,0.05),
            0 0 0 24px rgba(0,90,226,0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
          z-index: 2;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .inf-center-circle:hover {
          transform: scale(1.06);
          box-shadow:
            0 16px 56px rgba(0,90,226,0.22),
            inset 0 1px 0 rgba(255,255,255,0.7),
            0 0 0 14px rgba(0,90,226,0.07),
            0 0 0 28px rgba(0,90,226,0.04);
        }
        .inf-center-eyebrow {
          font-size: 0.52rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #005AE2;
          display: block;
          margin-bottom: 6px;
        }
        .inf-center-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 900;
          font-size: 0.95rem;
          color: #0A0F1C;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 6px;
        }
        .inf-center-sub {
          font-size: 0.65rem;
          color: #64748B;
          line-height: 1.5;
          font-weight: 500;
          margin: 0;
        }

        /* Vertical dashed line through center circle */
        .inf-center-col::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,90,226,0.25) 0px,
            rgba(0,90,226,0.25) 6px,
            transparent 6px,
            transparent 14px
          );
          z-index: 0;
        }

        /* ── RIGHT CARDS COLUMN ── */
        .inf-right-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding-left: 48px;
          position: relative;
        }

        .inf-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
        }

        /* Numbered circle badge */
        .inf-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #1A2744;
          color: #ffffff;
          font-weight: 900;
          font-size: 0.82rem;
          font-family: 'Manrope', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.04em;
          box-shadow: 0 6px 18px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,255,255,0.08);
          z-index: 2;
          flex-shrink: 0;
          margin-right: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.3s ease;
        }
        .inf-item:hover .inf-circle {
          transform: scale(1.14);
          box-shadow: 0 10px 28px rgba(0,90,226,0.45);
          background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
        }

        /* Dot node between circle and card */
        .inf-dot-node {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #005AE2;
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 0 3px rgba(0,90,226,0.2);
          flex-shrink: 0;
          z-index: 3;
          margin: 0 4px;
        }

        /* Dashed horizontal connector */
        .inf-h-connector {
          height: 1.5px;
          width: 28px;
          flex-shrink: 0;
          background-image: repeating-linear-gradient(
            90deg,
            rgba(0,90,226,0.55) 0px,
            rgba(0,90,226,0.55) 5px,
            transparent 5px,
            transparent 10px
          );
        }

        /* Pill card */
        .inf-card {
          background: linear-gradient(120deg, rgba(5,80,204,0.88) 0%, rgba(30,64,175,0.9) 45%, rgba(26,79,212,0.88) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 14px 18px 14px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          position: relative;
          overflow: hidden;
          cursor: default;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 4px 20px rgba(0,90,226,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease;
        }
        .inf-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 60%);
          border-radius: inherit;
          pointer-events: none;
        }
        .inf-card:hover {
          transform: translateX(8px) scale(1.012);
          box-shadow: 0 10px 36px rgba(0,90,226,0.32), inset 0 1px 0 rgba(255,255,255,0.18);
        }

        .inf-card-body {
          flex: 1;
          position: relative;
          z-index: 1;
          min-width: 0;
        }
        .inf-card-highlight {
          font-size: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 2px;
        }
        .inf-card-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 0.92rem;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0 0 3px;
          line-height: 1.2;
        }
        .inf-card-desc {
          font-size: 0.73rem;
          color: rgba(255,255,255,0.72);
          line-height: 1.5;
          font-weight: 500;
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .inf-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.9);
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .inf-card:hover .inf-card-icon {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.45);
          transform: rotate(12deg) scale(1.12);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .inf-center-col { flex: 0 0 180px; }
          .inf-center-circle { width: 150px; height: 150px; }
          .inf-right-col { padding-left: 32px; }
        }

        @media (max-width: 768px) {
          .inf-wrap {
            flex-direction: column;
            align-items: stretch;
            min-height: auto;
            gap: 32px;
          }
          .inf-center-col {
            flex: none;
            flex-direction: row;
            align-self: auto;
            gap: 20px;
            padding: 0;
            align-items: center;
          }
          .inf-center-col::before { display: none; }
          .inf-center-circle {
            width: 110px;
            height: 110px;
            flex-shrink: 0;
          }
          .inf-center-title { font-size: 0.8rem; }
          .inf-center-sub { display: none; }
          .inf-right-col { padding-left: 0; gap: 14px; }
          .inf-card { border-radius: 20px; padding: 12px 14px; }
          .inf-card:hover { transform: translateX(4px); }
          .inf-card-desc { -webkit-line-clamp: 3; }
          .inf-h-connector { width: 16px; }
          .inf-circle { width: 40px; height: 40px; font-size: 0.72rem; }
        }

        @media (max-width: 480px) {
          .inf-center-circle { width: 88px; height: 88px; }
          .inf-center-eyebrow { font-size: 0.45rem; }
          .inf-center-title { font-size: 0.7rem; }
          .inf-card-title { font-size: 0.82rem; }
          .inf-card-desc { font-size: 0.68rem; }
          .inf-circle { width: 36px; height: 36px; font-size: 0.65rem; }
          .inf-dot-node { width: 7px; height: 7px; }
          .inf-h-connector { width: 10px; }
        }

        /* ===== FLIP CARDS (Who We Build For) ===== */
        .audience-card-wrap {
          perspective: 1200px;
          display: flex;
          flex-direction: column;
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 520px;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .flip-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
          padding: 28px 24px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: var(--bg-light);
          border: 1px solid var(--border-light);
          overflow: hidden;
          transform: translate3d(0,0,0);
          -webkit-transform: translate3d(0,0,0);
        }
        .flip-card-front-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .flip-card-back {
          transform: rotateY(180deg) translate3d(0,0,0);
          -webkit-transform: rotateY(180deg) translate3d(0,0,0);
          background: linear-gradient(135deg, #0A0F1C 0%, #1a2744 100%);
          border-color: rgba(0,90,226,0.3);
          color: #ffffff;
          justify-content: space-between;
        }
        .flip-back-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .flip-back-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #00E6A0;
          margin-bottom: 24px;
        }
        .flip-back-features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .flip-back-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          line-height: 1.4;
        }
        .flip-back-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 230, 160, 0.15);
          border: 1.5px solid #00E6A0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          color: #00E6A0;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .flip-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 10px 22px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: fit-content;
        }
        .flip-back-btn:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.5);
        }

        /* ===== AUDIENCE CARD WRAPPER (no hover color overrides) ===== */
        .audience-card-wrap {
          perspective: 1200px;
        }
        /* Prevent sys-card hover effects from bleeding into flip cards */
        .audience-card-wrap .card-title,
        .audience-card-wrap:hover .card-title {
          color: var(--text-black) !important;
        }
        .audience-card-wrap .card-description,
        .audience-card-wrap:hover .card-description {
          color: var(--text-muted) !important;
        }
        .audience-card-wrap .card-learn-more-btn,
        .audience-card-wrap:hover .card-learn-more-btn {
          color: var(--primary-blue) !important;
          border-color: var(--primary-blue) !important;
          background-color: transparent !important;
        }
        .audience-card-wrap .card-icon,
        .audience-card-wrap:hover .card-icon {
          background-color: var(--white) !important;
          color: var(--primary-blue) !important;
          width: 56px !important;
          height: 56px !important;
          flex-shrink: 0 !important;
        }
        .audience-card-wrap .card-features li,
        .audience-card-wrap:hover .card-features li {
          color: var(--text-main) !important;
        }
        /* Keep learn-more hover working properly */
        .audience-card-wrap .card-learn-more-btn:hover {
          background-color: var(--primary-blue) !important;
          color: var(--white) !important;
          border-color: var(--primary-blue) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 90, 226, 0.2);
        }
        /* Fix flip-card-inner height — all cards same height, button always at bottom */
        .audience-card-wrap {
          height: auto;
        }
        .audience-card-wrap .flip-card-inner {
          min-height: 490px;
        }

        /* ===== NEW CIRCULAR METHODOLOGY HUB-AND-SPOKE ===== */
        .tech-hub-section {
          background: #FFFFFF;
          box-shadow: inset 0 24px 48px -24px rgba(0,90,226,0.08), inset 0 -24px 48px -24px rgba(0,90,226,0.08);
          overflow: hidden;
          position: relative;
        }

        .radial-hub-container {
          width: 100%;
          max-width: 1000px;
          height: 700px;
          margin: 40px auto 0;
          position: relative;
        }

        .radial-hub-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .hub-center-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: #EBF5FF;
          border: 3px solid #005AE2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 36px rgba(0, 90, 226, 0.12), 0 0 0 10px rgba(0, 90, 226, 0.04);
          z-index: 10;
          padding: 16px;
          transition: transform 0.3s ease;
        }

        .hub-center-circle:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        .brain-pulsing-icon {
          color: #005AE2;
          margin-bottom: 6px;
          animation: brainPulse 2.5s infinite ease-in-out;
        }

        @keyframes brainPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(0, 90, 226, 0)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 8px rgba(0, 90, 226, 0.3)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(0, 90, 226, 0)); }
        }

        .hub-center-text {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          color: #002D72;
          text-align: center;
          line-height: 1.3;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .spoke-card {
          position: absolute;
          width: 250px;
          background: linear-gradient(135deg, #EBF2FF 0%, #F0F5FF 100%);
          border: 1.5px solid rgba(0, 90, 226, 0.18);
          border-radius: 14px;
          padding: 16px 20px;
          box-shadow: 0 8px 24px rgba(0, 90, 226, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 5;
        }

        .spoke-card:hover {
          transform: translateY(-5px);
          border-color: #005AE2;
          background: linear-gradient(135deg, #DDEAFF 0%, #E6EFFF 100%);
          box-shadow: 0 15px 35px -10px rgba(0, 90, 226, 0.18);
        }

        .spoke-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 0.92rem;
          font-weight: 800;
          color: #002D72;
          margin: 0 0 6px 0;
          text-align: center;
          letter-spacing: -0.01em;
        }

        .spoke-card-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          line-height: 1.45;
          color: #1E40AF;
          margin: 0;
          text-align: center;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .radial-hub-container {
            display: none !important;
          }
          .hub-mobile-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            padding: 0 20px;
            margin-top: 40px;
          }
          .mobile-spoke-card {
            background: linear-gradient(135deg, #EBF2FF 0%, #F0F5FF 100%);
            border: 1.5px solid rgba(0, 90, 226, 0.18);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0, 90, 226, 0.05);
            transition: all 0.3s ease;
          }
          .mobile-spoke-card:hover {
            transform: translateY(-4px);
            border-color: #005AE2;
            background: linear-gradient(135deg, #DDEAFF 0%, #E6EFFF 100%);
            box-shadow: 0 12px 28px rgba(0, 90, 226, 0.12);
          }
        }

        .hub-mobile-grid {
          display: none;
        }

        /* Partnered Products Carousel Section */
        .partnered-products-section {
          background-color: #F8FAFC;
          position: relative;
        }
        .product-carousel-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          max-width: 1200px;
          min-height: 580px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          position: relative;
        }
        .product-sidebar {
          width: 32%;
          background: #F8FAFC;
          border-right: 1px solid #E2E8F0;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        .product-tab-btn {
          width: 100%;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
          text-align: left;
        }
        .product-tab-btn:hover {
          border-color: #CBD5E1;
          background: #F1F5F9;
          transform: translateY(-1px);
        }
        .product-tab-btn.active {
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
          border-color: #3B82F6;
          color: #1E3A8A;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
        }
        .tab-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #64748B;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .product-tab-btn.active .tab-icon-wrap {
          border-color: #93C5FD;
          color: #3B82F6;
        }
        .tab-label {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #1E293B;
          transition: color 0.2s ease;
        }
        .tab-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
          text-align: left;
        }
        .tab-category {
          display: none;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .tab-chevron {
          color: #94A3B8;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-left: auto;
          display: none;
        }
        .product-details {
          width: 68%;
          padding: 40px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #FFFFFF;
        }
        .solution-box {
          background: #EFF6FF;
          border-radius: 16px;
          padding: 22px 26px;
          margin-bottom: 24px;
          border: 1px solid #DBEAFE;
        }
        .solution-title {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #000000;
          font-weight: 800;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .solution-text {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #1E40AF;
          font-weight: 500;
        }
        .details-section-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #787880;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .details-features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }
        .details-feature-pill {
          background: #F4F4F5;
          color: #27272A;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .details-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 8px;
        }
        .details-tech-pill {
          background: #F8FAFC;
          color: #475569;
          border: 1px solid #E2E8F0;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .details-tech-pill:hover {
          background: #EFF6FF;
          border-color: #BFDBFE;
          color: #005AE2;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.05);
        }
        .details-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .details-stat-card {
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .details-stat-card-label {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .details-stat-card-value {
          font-size: 1.1rem;
          font-weight: 800;
        }
        /* Color variations for right-side stats cards */
        .details-stat-card:nth-child(1) {
          background: #EFF6FF;
          border: 1px solid #DBEAFE;
        }
        .details-stat-card:nth-child(1) .details-stat-card-label {
          color: #1E40AF;
        }
        .details-stat-card:nth-child(1) .details-stat-card-value {
          color: #1E3A8A;
        }
        .details-stat-card:nth-child(1):hover {
          background: #DBEAFE;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .details-stat-card:nth-child(2) {
          background: #ECFDF5;
          border: 1px solid #D1FAE5;
        }
        .details-stat-card:nth-child(2) .details-stat-card-label {
          color: #065F46;
        }
        .details-stat-card:nth-child(2) .details-stat-card-value {
          color: #064E3B;
        }
        .details-stat-card:nth-child(2):hover {
          background: #D1FAE5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }

        .details-stat-card:nth-child(3) {
          background: #F5F3FF;
          border: 1px solid #EDE9FE;
        }
        .details-stat-card:nth-child(3) .details-stat-card-label {
          color: #5B21B6;
        }
        .details-stat-card:nth-child(3) .details-stat-card-value {
          color: #4C1D95;
        }
        .details-stat-card:nth-child(3):hover {
          background: #EDE9FE;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }
        .highlight-bar {
          background: #ECFDF5;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .highlight-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #A7F3D0;
          color: #047857;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .highlight-text-wrap {
          display: flex;
          flex-direction: column;
        }
        .highlight-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #064E3B;
          line-height: 1.25;
        }
        .highlight-subtitle {
          font-size: 0.8rem;
          font-weight: 500;
          color: #047857;
          line-height: 1.25;
        }
        .details-checkout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #005AE2 0%, #0047C4 100%);
          border: 1px solid #0047C4;
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.15);
        }
        .details-checkout-btn:hover {
          background: linear-gradient(135deg, #0047C4 0%, #003699 100%);
          border-color: #003699;
          box-shadow: 0 6px 16px rgba(0, 90, 226, 0.25);
          color: #FFFFFF;
        }

        /* Sliding vertical layout for Partnered Products (No scroll stack) */
        @media (min-width: 769px) {
          .product-sidebar {
            width: 32%;
            background: #F8FAFC;
            border-right: 1px solid #E2E8F0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
          }
          .product-sidebar-viewport {
            height: 100%;
            overflow: hidden;
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .product-sidebar-track {
            display: flex;
            flex-direction: column;
            gap: 0;
            transform: none !important;
            width: 100%;
            height: 100%;
            flex-grow: 1;
          }
          .product-tab-btn {
            flex: 1;
            height: auto;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;
            background: #F8FAFC;
            border: none;
            border-bottom: 1px solid #E2E8F0;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            text-align: left;
            border-radius: 0;
            padding: 24px 32px;
            box-sizing: border-box;
            position: relative;
            box-shadow: none;
          }
          .product-tab-btn:last-child {
            border-bottom: none;
          }
          .product-tab-btn:hover:not(.active) {
            background: #F1F5F9;
            color: #1E293B;
          }
          .product-tab-btn.active {
            background: #FFFFFF;
            color: #005AE2;
            box-shadow: none;
            transform: none;
            z-index: 2;
            width: calc(100% + 1px);
            border-right: 1px solid #FFFFFF;
          }
          /* Left vertical accent line indicator for active button */
          .product-tab-btn::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            background: linear-gradient(180deg, #005AE2 0%, #3B82F6 100%);
            transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .product-tab-btn.active::before {
            width: 5px;
          }
          .product-tab-btn.active .tab-icon-wrap {
            border-color: #93C5FD;
            color: #005AE2;
            background: #EFF6FF;
          }
          .tab-category {
            display: inline;
          }
          .tab-chevron {
            display: block;
          }
          /* Active text and chevron states */
          .product-tab-btn.active .tab-label {
            color: #005AE2;
          }
          .product-tab-btn.active .tab-category {
            color: #3B82F6;
          }
          .product-tab-btn.active .tab-chevron {
            opacity: 1;
            transform: translateX(0);
            color: #005AE2;
          }
          /* Subtle hover highlights for inactive tabs */
          .product-tab-btn:hover:not(.active) {
            background: #F1F5F9;
          }
          .product-tab-btn:hover:not(.active) .tab-icon-wrap {
            border-color: #005AE2;
            color: #005AE2;
            background: #EFF6FF;
            box-shadow: 0 0 10px rgba(0, 90, 226, 0.1);
          }
          .product-tab-btn:hover:not(.active) .tab-label {
            color: #005AE2;
          }
          .product-tab-btn:hover:not(.active) .tab-category {
            color: #3B82F6;
          }
          .product-tab-btn:hover:not(.active) .tab-chevron {
            opacity: 0.7;
            transform: translateX(-4px);
            color: #3B82F6;
          }
          /* Glow styling for active tab icon wrap */
          .product-tab-btn.active .tab-icon-wrap {
            box-shadow: 0 0 12px rgba(0, 90, 226, 0.2);
          }
        }

        /* Responsive Styles for Redesigned Section */
        @media (max-width: 992px) {
          .details-company-title {
            font-size: 2.5rem;
          }
          .product-details {
            padding: 40px;
          }
        }
        @media (max-width: 768px) {
          .product-carousel-card {
            flex-direction: column;
            min-height: auto;
          }
          .product-sidebar {
            width: 100%;
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid #E2E8F0;
            overflow-x: auto;
            padding: 20px 24px;
            gap: 12px;
          }
          .product-sidebar-viewport {
            display: contents;
          }
          .product-sidebar-track {
            display: flex;
            flex-direction: row;
            gap: 12px;
            width: max-content;
            transform: none !important;
          }
          .product-tab-btn {
            width: auto;
            flex-shrink: 0;
            padding: 12px 18px;
            height: auto;
          }
          .product-details {
            width: 100%;
            padding: 32px 24px;
          }
          .details-stats-grid {
            gap: 16px;
          }
        }
        @media (max-width: 480px) {
          .details-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      <Header />

      <div className="landing-page" style={{ overflow: 'hidden', position: 'relative', backgroundColor: '#F8FAFC' }}>

        {/* Step 1: Idea Submission Hero */}
        <header ref={heroRef} className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '700px' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '960px', width: '100%' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="home.hero.eyebrow" value={homeContent.hero.eyebrow} />
            </div>
            <EditableText
              as="h1"
              contentKey="home.hero.heading"
              value={homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products"}
              className="hero-title"
              style={{ color: '#0A0F1C', whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products";
                const lines = headingText.split('\n');
                return lines.map((line, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {line.split(/[\s\u00a0]+/).map((word: string, index: number) => {
                      if (!word) return null;
                      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                      const cleanWordUpper = cleanWord.toUpperCase();
                      const isBlue = ['BOLD', 'IDEAS', 'REAL', 'IDEA', 'CUSTOMER', 'CUSTOMERS', 'PRODUCTS', 'PRODUCT', 'VENTURES', 'VENTURE'].includes(cleanWordUpper);
                      return (
                        <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                          {word}{' '}
                        </span>
                      );
                    })}
                    {lineIdx < lines.length - 1 && <br />}
                  </React.Fragment>
                ));
              })()}
            </EditableText>
            <EditableText
              as="p"
              contentKey="home.hero.subheading"
              value={homeContent.hero.subheading}
              style={{ textAlign: 'center', color: '#475569', fontSize: 'clamp(1rem, 2vw, 1.125rem)', maxWidth: '720px', margin: '0 auto 40px', lineHeight: 1.8, fontWeight: 500, textWrap: 'balance' }}
            />
          </div>

          <form id="idea-section" onSubmit={handleIdeaSubmit} method="POST" style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div className="hero-idea-box" style={{ maxWidth: '580px', width: '100%' }}>
              <div className="hero-idea-inner">
                <RotatingIdeaPlaceholder
                  examples={ideaExamples}
                  idea={idea}
                  isLoading={isLoading}
                  onIdeaChange={setIdea}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', padding: '0 8px 8px 0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                    {idea.trim().split(/\s+/).filter(word => word.length > 0).length}/100 words
                  </span>
                  <button type="submit" disabled={isLoading} style={{
                    backgroundColor: '#005AE2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 90, 226, 0.2)'
                  }}
                    onMouseOver={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#004ac2';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#005AE2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <EditableText contentKey="home.hero.submitBtn" value={homeContent.hero.submitBtn} />
                  </button>
                </div>
              </div>
            </div>
            {formMessage && submissionStep < 1 && (
              <div className={`form-message ${messageType}`} style={{
                marginTop: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                animation: 'cc-fadeIn 0.3s ease'
              }}>
                {formMessage}
              </div>
            )}
            <p className="hero-note">{homeContent.hero.footerNote}</p>
          </form>
        </header>

        {/* Step 2 inline implemented above */}




        {/* Target Audiences Section */}
        <section id="audiences-section" className="section-light" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="section-container">
            <div className="text-center">
              <EditableText
                as="h3"
                contentKey="home.audiences.eyebrow"
                value={homeContent.audiences.eyebrow}
                className="section-eyebrow cc-reveal"
              />
            </div>
            <EditableText
              as="h2"
              contentKey="home.audiences.title"
              value={homeContent.audiences.title}
              className="section-title text-center cc-reveal cc-delay-1"
            />
            <EditableText
              as="p"
              contentKey="home.audiences.subtitle"
              value={homeContent.audiences.subtitle}
              className="section-subtitle text-center cc-reveal cc-delay-2"
            />

            <div className="cards-grid" style={{ gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
              {(homeContent.audiences.items || []).slice(0, 2).map((item: any, idx: number) => {
                const isFlipped = flippedCards.has(idx);
                return (
                  <div key={idx} className="audience-card-wrap">
                    <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                      {/* FRONT */}
                      <div className="flip-card-front" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between', height: '100%' }}>
                        <div>
                          <div className="card-icon">
                            {item.icon === 'user' && <User size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                            {item.icon === 'building' && <Building size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                            {item.icon === 'idea' && <Lightbulb size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                          </div>
                          <EditableText
                            as="h4"
                            contentKey={`home.audiences.items.${idx}.title`}
                            value={item.title}
                            className="card-title"
                          />
                          <EditableText
                            as="p"
                            contentKey={`home.audiences.items.${idx}.description`}
                            value={item.description}
                            className="card-description"
                            style={{ minHeight: '80px' }}
                          />
                          <ul className="card-features">
                            {(item.features || []).slice(0, 3).map((feature: string, fIdx: number) => (
                              <li key={fIdx}>
                                <span className="check-icon">&#x2713;</span>
                                <EditableText
                                  contentKey={`home.audiences.items.${idx}.features.${fIdx}`}
                                  value={feature}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ paddingTop: '24px', paddingBottom: '16px', marginTop: 'auto' }}>
                          <button
                            className="card-learn-more-btn"
                            onClick={() => setFlippedCards(prev => { const n = new Set(prev); n.add(idx); return n; })}
                          >
                            Learn More
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="flip-card-back" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px' }}>
                        <div style={{ flexGrow: 1 }}>
                          <p className="flip-back-eyebrow">What you walk away with:</p>
                          <h4 className="flip-back-title">{item.title}</h4>
                          <ul className="flip-back-features" style={{ marginBottom: '24px' }}>
                            {(() => {
                              const itemsToUse = (item.backFeatures && item.backFeatures.length >= 5)
                                ? item.backFeatures
                                : (backFeaturesFallback[idx] || item.features || []);
                              return itemsToUse.slice(0, 5).map((feature: string, fIdx: number) => (
                                <li key={fIdx}>
                                  <span className="flip-back-check">✓</span>
                                  <EditableText
                                    contentKey={`home.audiences.items.${idx}.backFeatures.${fIdx}`}
                                    value={feature}
                                  />
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>

                        {item.backNote && (
                          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <EditableText
                              as="p"
                              contentKey={`home.audiences.items.${idx}.backNote`}
                              value={item.backNote}
                              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', margin: 0, lineHeight: '1.45', fontWeight: 500 }}
                            />
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto', width: '100%' }}>
                          <Link
                            href={idx === 0 ? "/studio" : "/contact"}
                            className="btn-pill"
                            style={{
                              flexGrow: 1,
                              padding: '12px 24px',
                              borderRadius: '100px',
                              background: '#FFFFFF',
                              color: 'var(--primary-blue)',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              textDecoration: 'none',
                              boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                            }}
                          >
                            <EditableText
                              contentKey={`home.audiences.items.${idx}.backCtaText`}
                              value={idx === 0 ? "Apply to Studio" : "Start a Conversation"}
                            />

                          </Link>

                          <button
                            className="flip-back-btn"
                            style={{ padding: '12px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#ffffff' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCards(prev => { const n = new Set(prev); n.delete(idx); return n; });
                            }}
                            title="Go Back"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How We Help — Interactive circular diagram */}
        <section className="tech-hub-section" style={{ backgroundColor: '#EFF6FF', marginTop: '-2px' }}>
          <div className="section-container" style={{ maxWidth: '1100px', position: 'relative' }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <h3 className="section-eyebrow text-center cc-reveal" style={{ marginBottom: '12px' }}>OUR METHODOLOGY</h3>
              <EditableText
                as="h2"
                contentKey="methodology.title"
                value={content?.methodology?.title || "How We Help"}
                className="section-title"
                style={{ marginBottom: '12px' }}
              />
              <EditableText
                as="p"
                contentKey="methodology.subtitle"
                value={content?.methodology?.subtitle || "Our collaborative venture-building methodology designed to de-risk startups and scale high-growth products from day one."}
                className="section-subtitle"
                style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: '#64748B' }}
              />
            </div>

            {/* DESKTOP CIRCULAR HUB-AND-SPOKE DIAGRAM */}
            <div className="radial-hub-container">
              <svg className="radial-hub-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0A0F1C" />
                  </marker>
                </defs>

                {/* Concentric Dashed Background Circles */}
                <circle cx="500" cy="350" r="130" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <circle cx="500" cy="350" r="240" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <circle cx="500" cy="350" r="350" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

                {/* Spokes Connecting Center to Cards */}
                {/* 1. Outcome Ownership (Top Center) - extended to touch card 1 at top: 0px */}
                <line x1="500" y1="260" x2="500" y2="105" stroke="#0A0F1C" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* 2. Built to Scale (Top Right) */}
                <line x1="560" y1="290" x2="670" y2="225" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 3. We Challenge You (Middle Right) */}
                <line x1="560" y1="410" x2="690" y2="465" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 4. Lifelong Partner (Bottom Center) - extended to touch card 4 at bottom: 0px (top border around y=585) */}
                <line x1="500" y1="440" x2="500" y2="585" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 5. Rigorous Validation (Bottom Left) */}
                <line x1="440" y1="410" x2="310" y2="465" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 6. Senior In-House Team (Top Left) */}
                <line x1="440" y1="290" x2="330" y2="225" stroke="#0A0F1C" strokeWidth="1.5" />
              </svg>

              {/* CENTER CIRCLE WITH ECOSYSTEM ICON */}
              <div className="hub-center-circle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <EditableImage
                  contentKey="home.hero.ecosystemIcon"
                  src={homeContent.hero.ecosystemIcon || "/Ecosystem_Icon-removebg-preview.png"}
                  alt="Ecosystem Icon"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* 1. Outcome Ownership */}
              {methodologyCards[0] && (
                <div className="spoke-card" style={{ left: '50%', top: '0px', transform: 'translateX(-50%)' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.0.title"
                      value={methodologyCards[0].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.0.description"
                      value={methodologyCards[0].description}
                    />
                  </p>
                </div>
              )}

              {/* 2. Built to Scale */}
              {methodologyCards[1] && (
                <div className="spoke-card" style={{ left: '67%', top: '150px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.1.title"
                      value={methodologyCards[1].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.1.description"
                      value={methodologyCards[1].description}
                    />
                  </p>
                </div>
              )}

              {/* 3. We Challenge You */}
              {methodologyCards[2] && (
                <div className="spoke-card" style={{ left: '69%', top: '410px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.2.title"
                      value={methodologyCards[2].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.2.description"
                      value={methodologyCards[2].description}
                    />
                  </p>
                </div>
              )}

              {/* 4. Lifelong Partner */}
              {methodologyCards[3] && (
                <div className="spoke-card" style={{ left: '50%', bottom: '0px', top: 'auto', transform: 'translateX(-50%)' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.3.title"
                      value={methodologyCards[3].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.3.description"
                      value={methodologyCards[3].description}
                    />
                  </p>
                </div>
              )}

              {/* 5. Rigorous Validation */}
              {methodologyCards[4] && (
                <div className="spoke-card" style={{ left: '6%', top: '410px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.4.title"
                      value={methodologyCards[4].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.4.description"
                      value={methodologyCards[4].description}
                    />
                  </p>
                </div>
              )}

              {/* 6. Senior In-House Team */}
              {methodologyCards[5] && (
                <div className="spoke-card" style={{ left: '8%', top: '150px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.5.title"
                      value={methodologyCards[5].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.5.description"
                      value={methodologyCards[5].description}
                    />
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE GRID LAYOUT */}
            <div className="hub-mobile-grid">
              {methodologyCards.slice(0, 6).map((card: any, idx: number) => (
                <div key={idx} className="mobile-spoke-card">
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey={`home.methodology.cards.${idx}.title`}
                      value={card.title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey={`home.methodology.cards.${idx}.description`}
                      value={card.description}
                    />
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>






        {/* ── Partners Products Section ── */}
        {(() => {
          const items = homeContent.partnerProducts?.items || PARTNER_PRODUCTS;
          const prod = items[activeProd] || PARTNER_PRODUCTS[activeProd];

          return (
            <section className="page-section" style={{ backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                {/* Section Eyebrow */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#E6EFFF',
                    color: '#005AE2',
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    borderRadius: '100px',
                    marginBottom: '16px',
                  }}>
                    <EditableText
                      contentKey="home.partnerProducts.eyebrow"
                      value={homeContent.partnerProducts?.eyebrow || "Partners' Products"}
                    />
                  </span>
                  <h2 style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    margin: '0 auto 12px',
                    lineHeight: 1.25,
                  }}>
                    <EditableText
                      contentKey="home.partnerProducts.title"
                      value={homeContent.partnerProducts?.title || "What we've built together"}
                    />
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText
                      contentKey="home.partnerProducts.description"
                      value={homeContent.partnerProducts?.description || "Real ventures built in partnership with founders who chose to build, not just plan."}
                    />
                  </p>
                </div>

                {/* Two-column layout */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr',
                  gap: '0',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  {/* Left sidebar — product list */}
                  <div style={{
                    borderRight: '1px solid #E2E8F0',
                    padding: '8px 0',
                    background: '#F1F5F9',
                  }}>
                    {items.map((p: any, idx: number) => (
                      <button
                        key={p.id || idx}
                        onClick={() => setActiveProd(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '14px 20px',
                          border: 'none',
                          borderLeft: activeProd === idx ? `3px solid #005AE2` : '3px solid transparent',
                          background: activeProd === idx ? '#FFFFFF' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Icon box */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: activeProd === idx ? '#E6EFFF' : '#FFFFFF',
                          color: activeProd === idx ? '#005AE2' : '#475569',
                          border: activeProd === idx ? '1px solid #BAE6FD' : '1px solid #E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}>
                          {p.icon || PARTNER_PRODUCTS[idx]?.icon}
                        </div>
                        <div>
                          <div style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: activeProd === idx ? '#0F172A' : '#475569',
                            lineHeight: 1.3,
                            transition: 'color 0.2s',
                          }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${idx}.name`}
                              value={p.name}
                            />
                          </div>
                          <div style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.8rem',
                            color: '#6B7280',
                            fontWeight: 500,
                            marginTop: '2px',
                          }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${idx}.tagline`}
                              value={p.tagline}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right detail panel */}
                  <div style={{ padding: '32px 36px', background: '#FFFFFF' }}>
                    {/* Product name + subtitle */}
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '2.25rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.03em',
                        margin: '0 0 8px',
                      }}>
                        <EditableText
                          contentKey={`home.partnerProducts.items.${activeProd}.name`}
                          value={prod.name}
                        />
                      </h3>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1.125rem',
                        color: '#005AE2',
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4,
                      }}>
                        <EditableText
                          contentKey={`home.partnerProducts.items.${activeProd}.subtitle`}
                          value={prod.subtitle}
                        />
                      </p>
                    </div>


                    {/* What CrestCode did */}
                    <div style={{
                      background: '#F1F5F9',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      marginBottom: '28px',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '10px',
                      }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                          <path d="M9 18h6" />
                          <path d="M10 22h4" />
                        </svg>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>What CrestCode Did</span>
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        <EditableText
                          contentKey={`home.partnerProducts.items.${activeProd}.whatWeDid`}
                          value={prod.whatWeDid}
                        />
                      </p>
                    </div>

                    {/* Key Features */}
                    <div style={{ marginBottom: '28px' }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>Key Features</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {(prod.features || []).map((f: any, i: number) => (
                          <span key={i} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#F1F5F9',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '0.875rem',
                            color: '#334155',
                            fontWeight: 600,
                          }}>
                            {f.icon || PARTNER_PRODUCTS[activeProd]?.features[i]?.icon}
                            <EditableText
                              contentKey={`home.partnerProducts.items.${activeProd}.features.${i}.text`}
                              value={f.text}
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Industry / Duration / Team */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                      {[
                        { label: 'Industry', value: prod.industry, key: 'industry' },
                        { label: 'Duration', value: prod.duration, key: 'duration' },
                        { label: 'Team size', value: prod.team, key: 'team' },
                      ].map((meta, i) => (
                        <div key={i} style={{
                          background: '#F1F5F9',
                          borderRadius: '12px',
                          padding: '16px 18px',
                        }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, marginBottom: '6px' }}>{meta.label}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${activeProd}.${meta.key}`}
                              value={meta.value}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>Technology Stack</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(prod.stack || []).map((s: string, i: number) => (
                          <span key={i} style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontSize: '0.875rem',
                            color: '#334155',
                            fontWeight: 600,
                          }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${activeProd}.stack.${i}`}
                              value={s}
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visit live product button */}
                    <a href={prod.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '14px 24px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '12px',
                      fontSize: '0.925rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                      Visit live product
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}






        {/* Testimonials Section */}
        <section id="testimonials-section" className="section-light">
          <div className="section-container">
            <div className="text-center">
              <EditableText
                as="h3"
                contentKey="home.testimonials.eyebrow"
                value={homeContent.testimonials?.eyebrow || "CLIENT STORIES"}
                className="section-eyebrow cc-reveal"
              />
            </div>
            <EditableText
              as="h2"
              contentKey="home.testimonials.title"
              value={homeContent.testimonials.title}
              className="section-title text-center cc-reveal"
              style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}
            />

            <div className="cards-grid-2">
              {(homeContent.testimonials.items || [])
                .filter((item: any) => item.author && !item.author.toLowerCase().includes('abdul') && !item.author.toLowerCase().includes('adbul'))
                .map((item: any, idx: number) => (
                  <div key={idx} className="testimonial-card">
                    <EditableText
                      as="p"
                      contentKey={`home.testimonials.items.${idx}.quote`}
                      value={item.quote}
                      className="t-quote"
                    />
                    <div className="t-box-author">
                      <div>
                        <EditableText
                          contentKey={`home.testimonials.items.${idx}.author`}
                          value={item.author}
                          className="t-name-light"
                        />
                        <EditableText
                          contentKey={`home.testimonials.items.${idx}.role`}
                          value={item.role}
                          className="t-role-light"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </section>



        <Footer />
      </div>

      {/* 2-STEP FORM WIZARD & SCORECARD RESULTS OVERLAY */}
      {submissionStep >= 1 && submissionStep <= 3 && (
        <div className="step-modal-overlay">
          
          {/* STEP 1 & 2: QUESTIONNAIRE WIZARD */}
          {submissionStep >= 1 && submissionStep <= 2 && (
            <div className="step-modal-wizard">
              <button className="step-modal-close" onClick={handleReset}>&times;</button>
              
              {/* Stepper Progress bar */}
              <div className="step-progress-row" style={{ maxWidth: 300, margin: '0 auto 40px', padding: 0 }}>
                <div className="step-progress-bar" style={{ left: '20%', right: '20%' }}>
                  <div className="step-progress-fill" style={{ width: `${(submissionStep === 2) ? 100 : 0}%` }}></div>
                </div>
                <div className={`step-bubble ${submissionStep === 1 ? 'active' : 'completed'}`}>1</div>
                <div className={`step-bubble ${submissionStep === 2 ? 'active' : ''}`}>2</div>
              </div>

              <form onSubmit={handleValidatorSubmit} className="form-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                {formError && (
                  <div className="error-banner" style={{ marginBottom: '24px' }}>
                    <AlertTriangle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* STEP 1: ABOUT THE IDEA */}
                {submissionStep === 1 && (
                  <div>
                    <h2 className="form-heading">Step 1: About The Idea</h2>
                    <p className="form-subheading" style={{ marginBottom: '24px' }}>Help us evaluate the core parameters, problem size, and validation level of your idea.</p>

                    <div className="form-section-card">
                      <div className="form-section-title">
                        <Lightbulb size={18} style={{ color: '#005AE2' }} />
                        <span>Core Value Proposition</span>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Who is the customer? *</label>
                        <textarea 
                          className="textarea-box"
                          placeholder="e.g. Small law firms with 5–20 attorneys..."
                          value={answers.customer}
                          onChange={(e) => handleInputChange('customer', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">What problem does it solve? *</label>
                        <textarea 
                          className="textarea-box"
                          placeholder="e.g. Legal teams spend 40% of their time on repetitive manual research..."
                          value={answers.problem}
                          onChange={(e) => handleInputChange('problem', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pain Score (1-10)</label>
                        <div className="pain-score-group">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                            <button 
                              key={val}
                              type="button"
                              className={`pain-btn ${answers.pain_score === val ? 'active' : ''}`}
                              onClick={() => handleInputChange('pain_score', val)}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-section-card">
                      <div className="form-section-title">
                        <TrendingUp size={18} style={{ color: '#005AE2' }} />
                        <span>Market & Defensibility</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Validation Level</label>
                        <div className="radio-pills-row">
                          <div 
                            className={`radio-pill-card ${answers.validation_level === 'none' ? 'active' : ''}`}
                            onClick={() => handleInputChange('validation_level', 'none')}
                          >
                            <span className="radio-title">None</span>
                            <span className="radio-desc">Just an early concept</span>
                          </div>
                          <div 
                            className={`radio-pill-card ${answers.validation_level === 'conversations' ? 'active' : ''}`}
                            onClick={() => handleInputChange('validation_level', 'conversations')}
                          >
                            <span className="radio-title">Conversations</span>
                            <span className="radio-desc">Spoken with potential users</span>
                          </div>
                          <div 
                            className={`radio-pill-card ${answers.validation_level === 'waitlist' ? 'active' : ''}`}
                            onClick={() => handleInputChange('validation_level', 'waitlist')}
                          >
                            <span className="radio-title">Waitlist / Signups</span>
                            <span className="radio-desc">Tangible user interest leads</span>
                          </div>
                          <div 
                            className={`radio-pill-card ${answers.validation_level === 'paying_customers' ? 'active' : ''}`}
                            onClick={() => handleInputChange('validation_level', 'paying_customers')}
                          >
                            <span className="radio-title">Paying Customers</span>
                            <span className="radio-desc">Active pilot contracts</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Competitors *</label>
                        <textarea 
                          className="textarea-box"
                          placeholder="e.g. competitor1.com, competitor2.com - enter website details..."
                          value={answers.competitors}
                          onChange={(e) => handleInputChange('competitors', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Do you have a MOAT? *</label>
                        <textarea 
                          className="textarea-box"
                          placeholder="e.g. Proprietary verification model; deep workflow integrations..."
                          value={answers.moat}
                          onChange={(e) => handleInputChange('moat', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ABOUT THE FOUNDER */}
                {submissionStep === 2 && (
                  <div>
                    <h2 className="form-heading">Step 2: About The Founder</h2>
                    <p className="form-subheading" style={{ marginBottom: '24px' }}>Help us evaluate execution capacity, timeline models, and founder alignment.</p>

                    <div className="form-section-card">
                      <div className="form-section-title">
                        <Users size={18} style={{ color: '#005AE2' }} />
                        <span>Founding Team & Capabilities</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Are you a solo founder?</label>
                        <div className="toggle-btn-group">
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.solo_founder === true ? 'active' : ''}`}
                            onClick={() => {
                              handleInputChange('solo_founder', true);
                              handleInputChange('has_technical_cofounder', false);
                            }}
                          >
                            👤 Solo Founder
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.solo_founder === false ? 'active' : ''}`}
                            onClick={() => handleInputChange('solo_founder', false)}
                          >
                            👥 Co-founders / Team
                          </button>
                        </div>
                      </div>

                      {!answers.solo_founder && (
                        <div className="form-group">
                          <label className="form-label">Is there a technical co-founder?</label>
                          <div className="toggle-btn-group">
                            <button 
                              type="button" 
                              className={`toggle-btn ${answers.has_technical_cofounder === true ? 'active' : ''}`}
                              onClick={() => handleInputChange('has_technical_cofounder', true)}
                            >
                              💻 Yes, they can code
                            </button>
                            <button 
                              type="button" 
                              className={`toggle-btn ${answers.has_technical_cofounder === false ? 'active' : ''}`}
                              onClick={() => handleInputChange('has_technical_cofounder', false)}
                            >
                              🚫 No tech co-founder
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">What is your technical background?</label>
                        <div className="toggle-btn-group">
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.technical_background === 'can_code' ? 'active' : ''}`}
                            onClick={() => handleInputChange('technical_background', 'can_code')}
                          >
                            💻 I can code
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.technical_background === 'used_to_code' ? 'active' : ''}`}
                            onClick={() => handleInputChange('technical_background', 'used_to_code')}
                          >
                            ⏳ I used to code
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.technical_background === 'no' ? 'active' : ''}`}
                            onClick={() => handleInputChange('technical_background', 'no')}
                          >
                            🚫 Non-technical
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-section-card">
                      <div className="form-section-title">
                        <Compass size={18} style={{ color: '#005AE2' }} />
                        <span>Execution Timeline & Stage</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Current Stage</label>
                        <div className="toggle-btn-group">
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.current_stage === 'forming' ? 'active' : ''}`}
                            onClick={() => handleInputChange('current_stage', 'forming')}
                          >
                            💡 Still forming
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.current_stage === 'ux_design' ? 'active' : ''}`}
                            onClick={() => handleInputChange('current_stage', 'ux_design')}
                          >
                            🎨 Got UX design
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.current_stage === 'prototype' ? 'active' : ''}`}
                            onClick={() => handleInputChange('current_stage', 'prototype')}
                          >
                            ⚙️ Have prototype
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.current_stage === 'mvp' ? 'active' : ''}`}
                            onClick={() => handleInputChange('current_stage', 'mvp')}
                          >
                            🚀 Have MVP
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Launch Timeline *</label>
                        <div className="launch-timeline-select-group" style={{ display: 'flex', gap: '12px' }}>
                          <select 
                            className="select-box"
                            value={answers.launch_timeline.split(' ')[0] || 'January'}
                            onChange={(e) => {
                              const year = answers.launch_timeline.split(' ')[1] || '2026';
                              handleInputChange('launch_timeline', `${e.target.value} ${year}`);
                            }}
                            style={{ flex: 1 }}
                          >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select 
                            className="select-box"
                            value={answers.launch_timeline.split(' ')[1] || '2026'}
                            onChange={(e) => {
                              const month = answers.launch_timeline.split(' ')[0] || 'January';
                              handleInputChange('launch_timeline', `${month} ${e.target.value}`);
                            }}
                            style={{ flex: 1 }}
                          >
                            {['2026', '2027', '2028', '2029', '2030'].map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Funding Status</label>
                        <div className="toggle-btn-group">
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.funding_status === 'bootstrapped' ? 'active' : ''}`}
                            onClick={() => handleInputChange('funding_status', 'bootstrapped')}
                          >
                            🌱 Bootstrapped
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.funding_status === 'raising' ? 'active' : ''}`}
                            onClick={() => handleInputChange('funding_status', 'raising')}
                          >
                            📈 Raising Seed
                          </button>
                          <button 
                            type="button" 
                            className={`toggle-btn ${answers.funding_status === 'raised' ? 'active' : ''}`}
                            onClick={() => handleInputChange('funding_status', 'raised')}
                          >
                            💰 Funded
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-section-card">
                      <div className="form-section-title">
                        <User size={18} style={{ color: '#005AE2' }} />
                        <span>Founder Contact Information</span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0px', marginBottom: '16px', lineHeight: '1.4' }}>
                        💡 <strong>Note:</strong> Your contact details are strictly used for communications and do not impact the score evaluation of the idea.
                      </p>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Your Name *</label>
                        <input 
                          type="text" 
                          className="input-text"
                          placeholder="e.g. Jane Doe"
                          value={answers.contact_name}
                          onChange={(e) => handleInputChange('contact_name', e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Email Address *</label>
                        <input 
                          type="email" 
                          className="input-text"
                          placeholder="e.g. jane@example.com"
                          value={answers.contact_email}
                          onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                        <input 
                          type="checkbox" 
                          id="need_help"
                          checked={answers.need_help || false}
                          onChange={(e) => handleInputChange('need_help', e.target.checked)}
                          style={{ width: 18, height: 18, accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
                        />
                        <label htmlFor="need_help" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                          Do you need help from CrestCode?
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons Row */}
                <div className="btn-row" style={{ marginTop: '32px' }}>
                  {submissionStep === 2 && (
                    <button 
                      type="button" 
                      className="btn-form-prev"
                      onClick={handlePrevStep}
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                  )}

                  {submissionStep === 1 ? (
                    <button 
                      type="button" 
                      className="btn-form-next"
                      onClick={handleNextStep}
                      style={{ marginLeft: 'auto' }}
                    >
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn-form-next"
                      style={{ background: 'linear-gradient(135deg, #005AE2 0%, #4F46E5 100%)', marginLeft: 'auto' }}
                    >
                      <Sparkles size={16} />
                      <span>Generate Report</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: LOADING SCREEN */}
          {submissionStep === 3 && (
            <div className="step-modal" style={{ maxWidth: '480px', padding: '40px' }}>
              <div className="spinner-outer" style={{ margin: '0 auto 24px' }}>
                <div className="spinner-circle"></div>
                <div className="spinner-inner"></div>
              </div>
              <div className="loading-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {loadingStepText}
              </div>
              <p className="loading-desc" style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
                Our AI due diligence engine is evaluating your startup signals...
              </p>
            </div>
          )}

          {/* RESULTS DISPLAY HAS BEEN TRANSITIONED TO A DEDICATED FULL-SCREEN REPORT PAGE */}

        </div>
      )}
    </>
  );
}
function RotatingIdeaPlaceholder({
  examples,
  idea,
  isLoading,
  onIdeaChange,
}: {
  examples: string[];
  idea: string;
  isLoading: boolean;
  onIdeaChange: (value: string) => void;
}) {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    if (idea.trim()) return;
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % examples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [idea, examples.length]);

  return (
    <textarea
      id="idea"
      name="idea"
      className="idea-textarea"
      style={{
        width: '100%',
        height: '96px',
        border: 'none',
        resize: 'none',
        padding: '16px 20px',
        fontSize: '1.05rem',
        fontFamily: 'inherit',
        color: '#0A0F1C',
        backgroundColor: 'transparent',
        outline: 'none',
        borderRadius: '14px',
      }}
      placeholder={examples[exampleIndex]}
      value={idea}
      onChange={(e) => onIdeaChange(e.target.value)}
      disabled={isLoading}
      maxLength={500}
    />
  );
}

function MetricsRow({ metrics }: { metrics: any[] }) {
  const rowRef = useRef(null);
  const isRowInView = useInView(rowRef, { once: true, margin: "-100px" });
  const { isAdminMode } = useAdmin();

  // To ensure they all stop at the same time, we use the same duration
  const countDuration = 2.5;

  return (
    <div className="stats-row" style={{ borderTop: 'none', padding: 0 }} ref={rowRef}>
      {metrics.map((metric, idx) => (
        <div key={idx} className="stat-item">
          <div className="stat-num" style={{ color: '#ffffff', display: 'flex', gap: '2px', alignItems: 'baseline' }}>
            <EditableText contentKey={`home.metrics.${idx}.prefix`} value={metric.prefix || ''} variant="ghost" />
            <div className="stat-num">
              {isAdminMode ? (
                <EditableText contentKey={`home.metrics.${idx}.value`} value={(metric.value || 0).toString()} variant="ghost" />
              ) : (
                <CountUp
                  key={`stat-${idx}`}
                  end={Number(metric.value) || 0}
                  duration={countDuration}
                  start={isRowInView}
                />
              )}
            </div>
            <EditableText contentKey={`home.metrics.${idx}.suffix`} value={metric.suffix || ''} variant="ghost" />
          </div>
          <EditableText
            contentKey={`home.metrics.${idx}.label`}
            value={metric.label || ''}
            className="stat-label"
            style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}
          />
        </div>
      ))}
    </div>
  );
}

function TechLogo({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case 'next.js':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <circle cx="64" cy="64" r="64" fill="#000" />
          <path d="M101.4 101.4L55.2 42.8H48v42.4h7.2V51.8l38 48.6c4.2-5.4 7.2-11.8 8.2-18.8zM80.8 42.8h7.2v42.4h-7.2z" fill="#fff" />
        </svg>
      );
    case 'react.js':
    case 'react native':
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" width="24" height="24" style={{ flexShrink: 0 }} className="react-spin-logo">
          <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1.5" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'angular':
      return (
        <svg viewBox="0 0 250 250" width="24" height="24" style={{ flexShrink: 0 }}>
          <polygon points="125,30 31.9,63.2 46.1,186.3 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
          <polygon points="125,30 125,52.2 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
          <path d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.7l11.7,29.2h21.7L125,52.1z M125,75.4l18.5,46.1h-37L125,75.4z" fill="#FFFFFF" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#05998b" />
          <path d="M74.8 17.5L34.1 68.2h26.2l-9.7 42.3 54.1-59H69.1l5.7-34z" fill="#fff" />
        </svg>
      );
    case 'django':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#092e20" />
          <text x="20" y="86" fill="#fff" fontFamily="'Manrope', sans-serif" fontSize="62" fontWeight="900" letterSpacing="-4">dj</text>
        </svg>
      );
    case 'node.js':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <path d="M64 16.5L25.5 38.7v44.3L64 105.2l38.5-22.2V38.7L64 16.5z" fill="#339933" />
          <path d="M64 16.5v88.7l38.5-22.2V38.7L64 16.5z" fill="#215732" />
          <path d="M64 45l22 12.7V83L64 95.7 42 83V57.7L64 45z" fill="#fff" />
        </svg>
      );
    case 'aws':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#232f3e" />
          <path d="M40 75c12 8 28 8 40 0" stroke="#ff9900" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M78 74l4 4-2-8-6 2z" fill="#ff9900" />
          <text x="34" y="58" fill="#fff" fontFamily="sans-serif" fontSize="26" fontWeight="900">aws</text>
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" style={{ flexShrink: 0 }} fill="#2496ED">
          <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.188V8.918c0-.103-.084-.188-.186-.188h-2.119c-.103 0-.188.085-.188.188v1.972c0 .105.085.188.188.188zM11.266 11.078h2.119c.102 0 .188-.083.188-.188V8.918c0-.103-.086-.188-.188-.188h-2.119c-.103 0-.188.085-.188.188v1.972c0 .105.085.188.188.188zM11.266 8.357h2.119c.102 0 .188-.083.188-.186V6.197c0-.103-.086-.186-.188-.186h-2.119c-.103 0-.188.083-.188.186v1.974c0 .103.085.186.188.186zM8.548 11.078h2.119c.103 0 .188-.083.188-.188V8.918c0-.103-.085-.188-.188-.188H8.548c-.103 0-.188.085-.188.188v1.972c0 .105.085.188.188.188zM8.548 8.357h2.119c.103 0 .188-.083.188-.186V6.197c0-.103-.085-.186-.188-.186H8.548c-.103 0-.188.083-.188.186v1.974c0 .103.085.186.188.186zM5.83 11.078h2.119c.103 0 .188-.083.188-.188V8.918c0-.103-.085-.188-.188-.188H5.83c-.103 0-.188.085-.188.188v1.972c0 .105.085.188.188.188zM3.114 11.078h2.119c.102 0 .188-.083.188-.188V8.918c0-.103-.086-.188-.188-.188H3.114c-.103 0-.188.085-.188.188v1.972c0 .105.085.188.188.188zM20.614 9.176c-.234-1.025-1.127-1.802-2.193-1.802-.093 0-.188.006-.281.018-.68-1.503-2.186-2.529-3.924-2.529-.092 0-.187.004-.28.014V11.23h5.922c.456 0 .756-.372.756-.91 0-.374-.15-.815-.174-1.144zM22.097 12.3c-.632-.375-1.397-.47-2.11-.41-.18.016-.368.03-.553.03H1.054c-.185 0-.353.035-.502.1-.295.13-.487.397-.533.725-.333 2.37.585 5.568 2.03 6.953 1.258 1.205 2.87 1.3 3.655 1.3 7.828 0 11.517-4.225 13.6-5.83.916-.704 1.76-1.5 2.338-2.427.35-.563.606-1.22.45-1.84z" fill="#2496ED" /></svg>
      );
    case 'nginx':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#009639" />
          <path d="M96 28L32 64v36l64-36V28zM32 28l64 36v36L32 64V28z" fill="#fff" opacity="0.3" />
          <path d="M32 28l64 36v36L32 64V28z" fill="#fff" />
          <path d="M96 28L32 64v36l64-36V28z" fill="#006424" />
        </svg>
      );
    case 'swift':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#fa7343" />
          <path d="M106.6 96c-13.4-15.5-35.8-24.3-51.2-24.3-10.7 0-20.7 4.2-28.7 11.2 18.2-19.6 46.2-25.2 67.2-25.2 5.6 0 10.9.4 15.7 1.1-23.8-19.6-54.3-21.3-73.4-11.8-7.8 3.9-14 10.1-18.2 17.6 15.7-28 49-37 72.8-37 3.1 0 6.2.2 9 .5C68.9 9.5 32 25.2 21.6 57.1c-2.2 6.7-3.1 13.4-2.5 19.9 8.7-22.1 32-35.6 56-35.6 5.6 0 11.2.7 16.5 2.2-28.6 2.5-54.9 19.3-64.4 42-2 4.8-3.4 10.1-4 15.7 18.5-12.6 44-16.2 66.4-16.2 13.4 0 25.5 1.3 35.8 4.2-14-11.2-31.4-16.5-48.7-16.5-7.8 0-15.7.8-23.2 2.5 19-8.4 43.1-9.5 62.2-1.7 5 2 9.2 4.8 12.5 8.2z" fill="#fff" />
        </svg>
      );
    case 'flutter':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <path d="M74.8 15.5L25.5 64.8l16.4 16.4L91.2 31.9z" fill="#02539a" />
          <path d="M91.2 31.9L74.8 15.5 25.5 64.8l24.7 24.7z" fill="#45d1fd" />
          <path d="M74.8 112.5L42 79.6 25.5 96.1l49.3 49.3 49.3-49.3-16.4-16.4z" fill="#02539a" />
          <path d="M74.8 112.5L42 79.6l24.7-24.7 32.9 32.9z" fill="#45d1fd" />
        </svg>
      );
    case 'stripe':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#635bff" />
          <path d="M69.8 45.4c0-4.1-3.2-5.7-8.7-5.7-7.9 0-14.7 2.4-19.6 5.1V32.7c5.4-2.2 12.9-3.7 20.3-3.7 16.5 0 26.6 8 26.6 22.3v30.9c0 10.3 3.6 14.5 6.9 16.6H77.1c-1.8-1.8-3.2-4.5-3.5-7.4-4.8 5-11.9 8.4-20 8.4-14 0-23.7-8.1-23.7-20.7 0-15.5 13.5-22.1 31.5-22.1 3.5 0 6-.3 8.4-.9v-.7zm-8.4 25.2c-7.4 0-11.9 2.8-11.9 8.2 0 5 4 8 10.7 8 7.4 0 12.6-4.5 12.6-11v-4c-2.4.6-6 .8-11.4.8z" fill="#fff" />
        </svg>
      );
    case 'paypal':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#003087" />
          <path d="M85.7 38.3c-2-8.5-9.1-14.3-19.5-14.3H39.5c-2.2 0-4.1 1.6-4.4 3.8L22.2 108.6c-.3 1.9 1.2 3.6 3.1 3.6h15.2c2.2 0 4.1-1.6 4.4-3.8L53 58h5.7c10.4 0 18.5-4.2 20.9-14.3.9-3.7.8-6.9-.9-9.4z" fill="#0079C1" />
          <path d="M78 52.8c-2 8.5-9.1 14.3-19.5 14.3H46.3l-8 51.5c-.3 1.9 1.2 3.6 3.1 3.6h15.2c2.2 0 4.1-1.6 4.4-3.8l8-51.5H74.7c10.4 0 18.5-4.2 20.9-14.3.9-3.7.8-6.9-.9-9.4-2 8.5-9.1 14.3-19.5 14.3H78v-.1z" fill="#00457C" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#336791" />
          <path d="M92.2 64c0-11-7.2-19.5-16-19.5h-10v39h10c8.8 0 16-8.5 16-19.5z" fill="#fff" />
          <path d="M56.2 30h-10v58h10c8.8 0 16-8.5 16-19.5s-7.2-19.5-16-19.5z" fill="#fff" opacity="0.8" />
          <circle cx="56.2" cy="45" r="4" fill="#336791" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 128 128" width="24" height="24" style={{ flexShrink: 0 }}>
          <rect width="128" height="128" rx="24" fill="#13aa52" />
          <path d="M64 16c0 0-20 28-20 48s12 36 20 48c0 0 20-28 20-48s-20-48-20-48z" fill="#499d4a" />
          <path d="M64 16v96c0 0 20-28 20-48S64 16 64 16z" fill="#3fa049" />
          <path d="M64 40v48c0 0 8-12 8-24S64 40 64 40z" fill="#fff" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

function getCardIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case 'lambda':
      return <Compass className="hub-branch-icon" />;
    case 'grid':
      return <Zap className="hub-branch-icon" />;
    case 'layers':
      return <Users className="hub-branch-icon" strokeWidth={2} />;
    case 'star':
      return <TrendingUp className="hub-branch-icon" />;
    case 'cpu':
      return <Cpu className="hub-branch-icon" />;
    case 'target':
      return <Globe className="hub-branch-icon" />;
    default:
      return <Compass className="hub-branch-icon" />;
  }
}



