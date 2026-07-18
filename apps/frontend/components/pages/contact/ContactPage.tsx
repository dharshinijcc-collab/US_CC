'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import { api } from '@/services/api';
import '@/styles/global-styles.css';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { contactStyles } from './styles';
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';

export default function ContactPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { content, loading, error } = useContent();

  const [formData, setFormData] = useState({
    firstName: '',
    workEmail: '',
    company: '',
    serviceInterest: 'General Inquiry',
    projectStage: 'Discovery',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleServiceClick = (service: any) => {
    setFormData({ ...formData, serviceInterest: service });
  };
  useScrollReveal();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-manrope">Loading contact...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const contactContent = content.contact;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.post('/submit-contact', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          workEmail: '',
          company: '',
          serviceInterest: 'General Inquiry',
          projectStage: 'Discovery',
          message: ''
        });
      } else {
        alert(response.data?.error || 'Submission failed. Please try again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Network error. Please try again later.');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: contactStyles }} />

      <Header currentPage="contact" />
      <div className="contact-page" id="top" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
        {/* Hero Section */}
        <ContactHero contactContent={contactContent} handleScroll={handleScroll} />

        {/* Form and Services Section */}
        <ContactForm 
          contactContent={contactContent} 
          formData={formData} 
          setFormData={setFormData} 
          handleSubmit={handleSubmit} 
          submitted={submitted} 
          setSubmitted={setSubmitted} 
          handleServiceClick={handleServiceClick} 
        />
      </div>
      <Footer />
    </>
  );
}
