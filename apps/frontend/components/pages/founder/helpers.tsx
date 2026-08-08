'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Zap, Users, TrendingUp, Cpu, Globe
} from 'lucide-react';
import EditableText from '@/components/pages/admin/EditableText';
import CountUp from '@/components/effects/CountUp';
import { useAdmin } from '@/context/AdminContext';
import { useInView } from 'framer-motion';

export const PARTNER_PRODUCTS = [
  {
    id: '01',
    name: 'Dockly',
    status: { type: 'live', text: 'Live', subText: 'Web ready' },
    logo: 'https://www.google.com/s2/favicons?sz=64&domain=dockly.me',
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
    stack: ['Next.js', 'Node.js', 'Tailwind CSS', 'Supabase'],
    liveUrl: 'https://dockly.me/',
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
    status: { type: 'live', text: 'Live', subText: 'Web ready' },
    logo: 'https://www.google.com/s2/favicons?sz=64&domain=castlegec.com',
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
    stack: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
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
    status: { type: 'beta', text: 'Beta phase' },
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
    stack: ['React.js', 'Node.js', 'PostgreSQL', 'TensorFlow'],
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
    name: 'NestBloq',
    status: { type: 'development', text: 'In development' },
    tagline: 'Partner operations',
    subtitle: 'B2B partner operations and workflow automation',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    stat: '5+ active operations hubs',
    statSub: 'Deployed for strategic partner products',
    whatWeDid: 'Designed and built the operations hub to orchestrate workflow management, delivery logistics, and service coordination for B2B partner products.',
    features: [
      {
        text: 'Partner workspace',
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
        text: 'Integration gateway',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        )
      },
      {
        text: 'Delivery flows',
        icon: (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        )
      }
    ],
    industry: 'B2B / Operations',
    duration: '5 months',
    team: '3 members',
    stack: ['Next.js', 'GraphQL', 'AWS', 'Docker'],
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

export const renderProductIcon = (p: any, idx: number) => {
  const original = PARTNER_PRODUCTS[idx];
  const logoUrl = p.logo || original?.logo;
  
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={p.name}
        style={{ 
          width: '28px', 
          height: '28px', 
          objectFit: 'contain',
          borderRadius: '4px'
        }} 
      />
    );
  }
  
  return p.icon || original?.icon;
};

export function RotatingIdeaPlaceholder({
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
  const [isFocused, setIsFocused] = useState(false);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (idea.trim()) return;
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % examples.length);
        setFadeState('fade-in');
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [idea, examples.length]);

  const showPlaceholder = !idea && !isFocused;

  return (
    <div style={{ position: 'relative', width: '100%', height: '96px' }}>
      <textarea
        id="idea"
        name="idea"
        className="idea-textarea"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          resize: 'none',
          padding: '0',
          fontSize: '1.05rem',
          fontFamily: 'inherit',
          color: '#1E293B', // Slate gray, never black
          backgroundColor: 'transparent',
          outline: 'none',
          borderRadius: '0',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        value={idea}
        onChange={(e) => onIdeaChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
        maxLength={500}
      />
      {/* Custom animated placeholder overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '0',
        fontSize: '1.05rem',
        fontFamily: 'inherit',
        color: '#94A3B8',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showPlaceholder ? (fadeState === 'fade-in' ? 0.75 : 0) : 0,
        transform: showPlaceholder ? (fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(-6px)') : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5,
      }}>
        {examples[exampleIndex]}
      </div>
    </div>
  );
}

export function MetricsRow({ metrics }: { metrics: any[] }) {
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

export function TechLogo({ name }: { name: string }) {
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

export function getCardIcon(iconName: string) {
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
