'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';
import localConfig from '@/shared/config.json';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { companyStyles } from './styles';
import CompanyHero from './CompanyHero';
import CompanyProblems from './CompanyProblems';
import CompanyModel from './CompanyModel';
import CompanyProcess from './CompanyProcess';

export default function CompanyPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { content } = useContent();

  // CMS-driven content with fallback to localConfig
  const companyContent = (content as any)?.company || (localConfig as any).company;
  const homeContent = (content as any)?.home || (localConfig as any).home;

  const problemsWeLove = [
    {
      title: "Complex Workflows",
      desc: "Processes too tangled for off-the-shelf tools. We map, simplify, and build around them.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><rect x="3" y="15" width="6" height="6" rx="1"></rect><path d="M9 6h6"></path><path d="M21 9v6"></path><path d="M15 18H9"></path><path d="M3 15V9"></path></svg>
      )
    },
    {
      title: "Broken User Experiences",
      desc: "Products that frustrate instead of flow. We find where users drop off and redesign from there.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-3-3m0 0l-3 3m3-3v8"></path><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"></path></svg>
      )
    },
    {
      title: "Systems That Don't Talk",
      desc: "Disconnected tools, siloed data, integration nightmares. We make them work as one.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
      )
    },
    {
      title: "Ideas That Need Technical Co-Thinking",
      desc: "You have the vision but need a product partner who can think through the build with you, not just execute orders.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 12m-4 0a4 4 0 108 0 4 4 0 10-8 0"></path></svg>
      )
    }
  ];

  const processSteps = [
    {
      num: "01",
      title: "Pressure Test",
      desc: "Vetting ideas against market physics and scalability.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 11-4 0"></path><path d="M5.52 16h12.96"></path></svg>
    },
    {
      num: "02",
      title: "Blueprint",
      desc: "Defining technical architecture and user experience flows.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
    },
    {
      num: "03",
      title: "Build in Sprints",
      desc: "Rapid execution with iterative feedback loops.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    },
    {
      num: "04",
      title: "Ship & Sustain",
      desc: "Operationalizing growth and scaling infrastructure.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 10.5L21 3m-7.5 7.5L9 21M13.5 10.5l-3-3m3 3l3 3m-3-3L3 21"></path></svg>
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: companyStyles }} />
      <Header />

      <main>
        {/* HERO */}
        <CompanyHero companyContent={companyContent} handleScroll={handleScroll} />

        {/* SECTION: PROBLEMS WE LOVE */}
        <CompanyProblems companyContent={companyContent} problemsWeLove={problemsWeLove} />

        {/* SECTION: COMPANY MODEL */}
        <CompanyModel companyContent={companyContent} homeContent={homeContent} />

        {/* SECTION: HOW A PRODUCT GETS BORN */}
        <CompanyProcess companyContent={companyContent} processSteps={processSteps} />
      </main>

      <div className="cc-footer-wrapper">
        <Footer />
      </div>
    </>
  );
}
