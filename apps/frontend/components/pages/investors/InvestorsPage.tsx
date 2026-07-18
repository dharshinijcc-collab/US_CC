'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';
import { api } from '@/services/api';
import '@/styles/global-styles.css';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { investorsStyles } from './styles';
import InvestorsHero from './InvestorsHero';
import InvestorsThesis from './InvestorsThesis';
import InvestorsPortfolio from './InvestorsPortfolio';
import InvestorsVentureModel from './InvestorsVentureModel';
import InvestorsCoCircle from './InvestorsCoCircle';
import InvestorsGovernance from './InvestorsGovernance';
import InvestorsCta from './InvestorsCta';

export default function InvestorsPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { content, loading, error } = useContent();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: 'Product Strategy',
    preferredRoles: [] as string[],
    background: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to safely get content values
  const getContent = (path: string, defaultValue: any) => {
    const keys = path.split('.');
    let value: any = content;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value !== undefined ? value : defaultValue;
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/submit-investor', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          expertise: 'Product Strategy',
          preferredRoles: [],
          background: ''
        });
      } else {
        alert(response.data?.error || 'Submission failed. Please try again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading investor relations...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: investorsStyles }} />

      <Header />

      <div className="investors-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
        {/* ── 1. HERO SECTION ── */}
        <InvestorsHero content={content} getContent={getContent} handleScroll={handleScroll} />

        {/* ── 2. WHY INVEST IN CRESTCODE? ── */}
        <InvestorsThesis content={content} getContent={getContent} />

        {/* ── 3. TWO WAYS TO INVEST ── */}
        <InvestorsPortfolio content={content} getContent={getContent} />

        {/* ── 4. WHAT YOU GET AS AN INVESTOR ── */}
        <InvestorsVentureModel content={content} getContent={getContent} />

        {/* ── 5. WE'RE SELECTIVE. ON PURPOSE. ── */}
        <InvestorsCoCircle content={content} getContent={getContent} />

        {/* ── 6. CLEAR TERMS. NO SURPRISES. ── */}
        <InvestorsGovernance content={content} getContent={getContent} />

        {/* ── 7. CTA APPLICATION FORM ── */}
        <InvestorsCta 
          content={content} 
          getContent={getContent} 
          formData={formData} 
          setFormData={setFormData} 
          submitted={submitted} 
          setSubmitted={setSubmitted} 
          handleRoleChange={handleRoleChange} 
          handleSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>

      <Footer />
    </>
  );
}
