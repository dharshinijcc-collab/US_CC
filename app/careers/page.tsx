'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen, 
  Clock, 
  Layout, 
  Heart, 
  Calendar, 
  Laptop, 
  ArrowRight,
  MapPin,
  Briefcase,
  ChevronRight,
  Check,
  Upload,
  FileText,
  X
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import { API_URL } from '@/services/api';

export default function CareersPage() {
  const { content, loading, error } = useContent();
  const [activeFilter, setActiveFilter] = useState("All Departments");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    interest: 'Engineering',
    linkedin: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-manrope">Loading careers...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-manrope text-red-500">Error: {error}</div>;

  const careersContent = content.careers;

  const jobs = [
    { title: "Frontend Developer", location: "Chennai, TN", type: "Full Time", exp: "Mid-Level (2-3 Yrs)", category: "Engineering" },
    { title: "Backend Developer", location: "Chennai, TN", type: "Full Time", exp: "Mid-Level (2-3 Yrs)", category: "Engineering" },
    { title: "Product Designer", location: "Chennai, TN", type: "Full Time", exp: "Entry-Level", category: "Design" }
  ];

  const filteredJobs = activeFilter === "All Departments" ? jobs : jobs.filter(j => j.category === activeFilter);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_SIZE_MB = 5;

  const validateFile = (file: File): string => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only PDF, DOC, or DOCX files are allowed.';
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File must be under ${MAX_SIZE_MB}MB.`;
    return '';
  };

  const handleFileChange = (file: File | null) => {
    setFileError('');
    if (!file) { setResumeFile(null); return; }
    const err = validateFile(file);
    if (err) { setFileError(err); setResumeFile(null); return; }
    setResumeFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('email', formData.email);
      payload.append('interest', formData.interest);
      payload.append('linkedin', formData.linkedin);
      if (resumeFile) payload.append('resume', resumeFile);

      const response = await fetch(`${API_URL}/submit-talent`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setSubmitted(false); // Hide form after successful submission
        setFormData({ firstName: '', email: '', interest: 'Engineering', linkedin: '' });
        setResumeFile(null);
      } else {
        const data = await response.json();
        alert(data.error || data.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-base: #FFFFFF;
          --bg-light: #F1F5F9; 
          --bg-dark: #0A0F1C;
          --primary-blue: #0052FF; 
          --primary-hover: #0040D0;
          --text-black: #0F172A;
          --text-muted: #64748B;
          --border: #E2E8F0;
          --light-blue-bg: #EFF6FF;
        }

        body, html {
          margin: 0; padding: 0;
          font-family: var(--font-inter), sans-serif;
          background-color: #F8FAFC; 
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        h1, h2, h3, h4, h5, h6, .font-manrope { 
          font-family: var(--font-manrope), sans-serif; 
          letter-spacing: -0.02em;
        }

        .section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        
        .job-card { 
          background-color: #FFFFFF;
          padding: 32px 40px;
          border-radius: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-blue);
        }

        .btn-primary-style {
          background-color: var(--primary-blue);
          color: #FFF;
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0, 82, 255, 0.2);
        }
        .btn-primary-style:hover { background-color: var(--primary-hover); transform: translateY(-2px); }
        .btn-primary-style:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-secondary-style {
          background-color: #FFF;
          color: var(--text-black);
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 800;
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 15px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-secondary-style:hover { background-color: #F8FAFC; border-color: var(--text-muted); }

        .form-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px 20px;
          color: white;
          outline: none;
          width: 100%;
          font-family: inherit;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-color: var(--primary-blue);
        }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-eyebrow-style {
          color: var(--primary-blue);
          background: var(--light-blue-bg);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          display: inline-block;
        }

        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px 40px; }
        
          /* Responsive Design */
          @media (max-width: 900px) {
            .hero-grid { 
              grid-template-columns: 1fr !important; 
              text-align: center !important;
              gap: 40px !important;
              padding-top: 40px !important;
            }
            .hero-grid div {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .hero-grid p {
              margin-inline: auto !important;
            }
            .hero-grid img {
              height: 300px !important;
            }
            
            .grid-4 {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            
            .life-grid {
              grid-template-columns: 1fr !important;
              padding: 40px 24px !important;
              gap: 40px !important;
            }
            
            .grid-3 {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
            
            .job-card {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 20px !important;
              padding: 24px !important;
            }
            
            .job-card button {
              width: 100% !important;
            }
            
            .cta-card {
              padding: 40px 20px !important;
              border-radius: 20px !important;
            }
            
            .cta-card h2 {
              font-size: 2rem !important;
            }
            
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
      `}} />

      <Header currentPage="careers" />
      
      <div className="careers-page">
        {/* --- 1. HERO SECTION --- */}
        <section style={{ padding: '140px 0 60px', backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="section-container hero-grid pt-0" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="hero-eyebrow-style">
                <EditableText contentKey="careers.hero.eyebrow" value={careersContent.hero.eyebrow} />
              </span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }} className="font-manrope">
                {careersContent.hero.title?.split(' ').map((word: string, i: number) => {
                  const isBlue = ['Meaningful'].includes(word.replace(/[^a-zA-Z]/g, ''));
                  return (
                    <span key={i} style={isBlue ? { color: '#005AE2' } : {}}>
                      {word}{' '}
                    </span>
                  );
                })}
              </h1>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '500px', fontWeight: 500 }}>
                <EditableText contentKey="careers.hero.description" value={careersContent.hero.description} />
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <button onClick={() => handleScroll('open-positions')} className="btn-primary-style">
                  <EditableText contentKey="careers.hero.primaryButton" value={careersContent.hero.primaryButton} />
                </button>
                <button onClick={() => handleScroll('benefits')} className="btn-secondary-style">
                  <EditableText contentKey="careers.hero.secondaryButton" value={careersContent.hero.secondaryButton} />
                </button>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <img 
                src="/images/careers.jpeg" 
                alt="Office Collaboration" 
                style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
              <div style={{ position: 'absolute', bottom: '-24px', left: '-24px', backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #F1F5F9', zIndex: 10 }}>
                <div style={{ display: 'flex', position: 'relative' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0052FF', border: '2px solid #FFF', zIndex: 3 }}></div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid #FFF', marginLeft: '-10px', zIndex: 2 }}></div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#A855F7', border: '2px solid #FFF', marginLeft: '-10px', zIndex: 1 }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-black)' }} className="font-manrope">50+ New Hires</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>Join our growing ecosystem of engineers and designers.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. WHY JOIN CRESTCODE --- */}
        <section style={{ padding: '100px 0', backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }} className="font-manrope">
                <EditableText contentKey="careers.whyJoin.title" value={careersContent.whyJoin.title} />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
                <EditableText contentKey="careers.whyJoin.subtitle" value={careersContent.whyJoin.subtitle} />
              </p>
            </div>
            
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { icon: <Rocket size={20}/>, title: "Real Product Experience", desc: "Work on live products that impact thousands of users daily from day one." },
                { icon: <TrendingUp size={20}/>, title: "Growth & Learning", desc: "Structured mentorship and generous education stipends for your career path." },
                { icon: <Users size={20}/>, title: "Collaborative Culture", desc: "No silos. We work across teams to solve complex problems together." },
                { icon: <Target size={20}/>, title: "Ownership & Impact", desc: "We trust you with autonomy. Your decisions shape the future of our products." }
              ].map((item, i) => (
                <div key={i} className="hover-lift" style={{ backgroundColor: 'var(--bg-light)', padding: '40px 32px', borderRadius: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--light-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', marginBottom: '24px' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '12px' }} className="font-manrope">
                    <EditableText contentKey={`careers.whyJoin.items.${i}.title`} value={careersContent.whyJoin.items[i].title} />
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey={`careers.whyJoin.items.${i}.desc`} value={careersContent.whyJoin.items[i].desc} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 3. LIFE AT CRESTCODE --- */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF', minHeight: '80vh' }}>
          <div className="section-container">
            <div style={{ backgroundColor: 'var(--primary-blue)', borderRadius: '24px', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'center', color: '#FFF' }} className="life-grid">
              <div>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: 1.1 }} className="font-manrope">
                  <EditableText contentKey="careers.life.title" value={careersContent.life.title} />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.life.description1" value={careersContent.life.description1} />
                  </p>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.life.description2" value={careersContent.life.description2} />
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400" alt="Team talking" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                  <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400" alt="Monitors" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '40px' }}>
                  <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=400" alt="Meeting" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400" alt="Brainstorming" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. BENEFITS & PERKS --- */}
        <section id="benefits" style={{ padding: '100px 0', backgroundColor: '#0A0F1C', minHeight: '80vh', color: '#FFF' }}>
          <div className="section-container">
            <div style={{ marginBottom: '40px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em', color: '#FFF' }} className="font-manrope">
                <EditableText contentKey="careers.benefits.title" value={careersContent.benefits.title} />
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', fontWeight: 500 }}>
                <EditableText contentKey="careers.benefits.subtitle" value={careersContent.benefits.subtitle} />
              </p>
            </div>
            
            <div className="grid-3">
              {[
                { icon: <BookOpen size={20}/>, title: "Continuous Learning", desc: "Monthly budget for books, courses, and conferences to sharpen your skills." },
                { icon: <MapPin size={20}/>, title: "Flexible Work", desc: "Work from anywhere. We value results over desk time and office hours." },
                { icon: <Layout size={20}/>, title: "Exposure to Product", desc: "Directly collaborate with founders and product owners on vision and strategy." },
                { icon: <Heart size={20}/>, title: "Health & Wellness", desc: "Premium health insurance and monthly wellness allowance for gym/mental health." },
                { icon: <Calendar size={20}/>, title: "Unlimited PTO", desc: "We trust you to manage your time. Rest is essential for peak performance." },
                { icon: <Laptop size={20}/>, title: "Tech Stipend", desc: "Top-tier hardware and home-office setup budget for all team members." }
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '8px', color: '#FFF' }} className="font-manrope">
                      <EditableText contentKey={`careers.benefits.items.${i}.title`} value={careersContent.benefits.items[i].title} />
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontWeight: 500 }}>
                      <EditableText contentKey={`careers.benefits.items.${i}.desc`} value={careersContent.benefits.items[i].desc} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. OPEN POSITIONS --- */}
        <section id="open-positions" style={{ padding: '100px 0', backgroundColor: '#FFFFFF', minHeight: '80vh' }}>
          <div className="section-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }} className="font-manrope">
                  <EditableText contentKey="careers.jobs.title" value={careersContent.jobs.title} />
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500 }}>
                  <EditableText contentKey="careers.jobs.subtitle" value={careersContent.jobs.subtitle} />
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {["All Departments", "Engineering", "Design"].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setActiveFilter(filter)}
                    style={{ 
                      padding: '10px 24px', 
                      borderRadius: '100px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: activeFilter === filter ? 'var(--primary-blue)' : '#E2E8F0',
                      color: activeFilter === filter ? '#FFF' : 'var(--text-black)',
                      transition: 'all 0.3s'
                    }}
                    className="font-manrope"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredJobs.map((job, i) => (
                <div key={i} className="job-card">
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }} className="font-manrope">
                      <EditableText contentKey={`careers.jobs.listings.${i}.title`} value={careersContent.jobs.listings[i].title} />
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} /> 
                        <EditableText contentKey={`careers.jobs.listings.${i}.location`} value={careersContent.jobs.listings[i].location} />
                      </span>
                    </div>
                  </div>
                  <button style={{ backgroundColor: 'var(--light-blue-bg)', color: 'var(--primary-blue)', padding: '12px 28px', borderRadius: '100px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e: any) => e.currentTarget.style.backgroundColor = '#DBEAFE'} onMouseOut={(e: any) => e.currentTarget.style.backgroundColor = 'var(--light-blue-bg)'}>
                    <EditableText contentKey="careers.jobs.viewButton" value={careersContent.jobs.viewButton} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 6. CTA (RESUME SUBMISSION) --- */}
        <section id="apply-now" style={{ padding: '100px 0', backgroundColor: '#FFFFFF', minHeight: 'auto' }}>
          <div className="section-container">
            <div className="cta-card" style={{ backgroundColor: '#0052FF', border: 'none', borderRadius: '32px', padding: '80px 60px', textAlign: 'center', color: '#FFFFFF' }}>
              {!submitted ? (
                <>
                  <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', color: '#FFFFFF' }} className="font-manrope">
                    <EditableText contentKey="careers.cta.title" value={careersContent.cta.title} />
                  </h2>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '48px', maxWidth: '600px', marginInline: 'auto', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.cta.subtitle" value={careersContent.cta.subtitle} />
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => setSubmitted(!submitted)} style={{ backgroundColor: '#FFFFFF', color: '#0052FF', border: 'none', padding: '18px 48px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                      <EditableText contentKey="careers.cta.primaryButton" value={careersContent.cta.primaryButton} />
                    </button>
                    <Link href="https://linkedin.com" target="_blank" style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', padding: '16px 32px', borderRadius: '12px', transition: 'all 0.3s ease' }} className="font-manrope">
                      <EditableText contentKey="careers.cta.secondaryLink" value={careersContent.cta.secondaryLink} />
                    </Link>
                  </div>

                  {submitted && (
                    <div style={{ marginTop: '60px', maxWidth: '800px', marginInline: 'auto' }}>
                       <form onSubmit={handleSubmit} style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                          <div>
                            <label className="form-label">
                              <EditableText contentKey="careers.form.nameLabel" value={careersContent.form.nameLabel} />
                            </label>
                            <input 
                              type="text" 
                              placeholder={careersContent.form.namePlaceholder} 
                              required
                              value={formData.firstName}
                              onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label className="form-label">
                              <EditableText contentKey="careers.form.emailLabel" value={careersContent.form.emailLabel} />
                            </label>
                            <input 
                              type="email" 
                              placeholder={careersContent.form.emailPlaceholder} 
                              required
                              value={formData.email}
                              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>
                          <div>
                            <label className="form-label">
                              <EditableText contentKey="careers.form.interestLabel" value={careersContent.form.interestLabel} />
                            </label>
                            <select 
                              value={formData.interest}
                              onChange={(e: any) => setFormData({...formData, interest: e.target.value})}
                              className="form-input"
                              style={{ appearance: 'none' }}
                            >
                              {careersContent.form.interestOptions.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">
                              <EditableText contentKey="careers.form.linkedinLabel" value={careersContent.form.linkedinLabel} />
                            </label>
                            <input 
                              type="url" 
                              placeholder={careersContent.form.linkedinPlaceholder} 
                              value={formData.linkedin}
                              onChange={(e: any) => setFormData({...formData, linkedin: e.target.value})}
                              className="form-input"
                            />
                          </div>
                        </div>

                        {/* Resume Upload */}
                        <div style={{ marginBottom: '24px' }}>
                          <label className="form-label">
                            <EditableText contentKey="careers.form.resumeLabel" value={careersContent.form.resumeLabel} />{' '}
                            <span style={{ color: '#64748B', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                              <EditableText contentKey="careers.form.resumeHint" value={careersContent.form.resumeHint} />
                            </span>
                          </label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              border: `2px dashed ${isDragging ? '#0052FF' : resumeFile ? '#10B981' : 'rgba(255,255,255,0.2)'}`,
                              borderRadius: '12px',
                              padding: '28px 20px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              background: isDragging
                                ? 'rgba(0,82,255,0.08)'
                                : resumeFile
                                ? 'rgba(16,185,129,0.06)'
                                : 'rgba(255,255,255,0.03)',
                            }}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                            />
                            {resumeFile ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                                  <FileText size={20} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>{resumeFile.name}</div>
                                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Ready to upload
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setResumeFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                  }}
                                  style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', flexShrink: 0 }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,82,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDragging ? '#0052FF' : '#4D79FF', margin: '0 auto 12px' }}>
                                  <Upload size={22} />
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E2E8F0', marginBottom: '4px' }}>
                                  <EditableText contentKey="careers.form.uploadTitle" value={careersContent.form.uploadTitle} />
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>
                                  <EditableText contentKey="careers.form.uploadHint" value={careersContent.form.uploadHint} />
                                </div>
                              </div>
                            )}
                          </div>
                          {fileError && (
                            <p style={{ color: '#F87171', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>
                              ⚠ {fileError}
                            </p>
                          )}
                        </div>

                        <button type="submit" className="btn-primary-style" style={{ width: '100%', borderRadius: '12px' }} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <EditableText contentKey="careers.form.submittingText" value={careersContent.form.submittingText} />
                          ) : (
                            <EditableText contentKey="careers.form.buttonText" value={careersContent.form.buttonText} />
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '40px 0' }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', margin: '0 auto 32px' }}>
                    <Check size={40} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }} className="font-manrope">
                    <EditableText contentKey="careers.success.title" value={careersContent.success.title} />
                  </h2>
                  <p style={{ fontSize: '1.125rem', color: '#94A3B8', marginBottom: '40px', maxWidth: '500px', marginInline: 'auto' }}>
                    <EditableText contentKey="careers.success.message" value={careersContent.success.message} />
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary-style" style={{ backgroundColor: 'transparent', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                    <EditableText contentKey="careers.success.buttonText" value={careersContent.success.buttonText} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
