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
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    interest: 'Engineering',
    linkedin: '',
    jobTitle: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; linkedin?: string }>({});

  const [jobsData, setJobsData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/open-positions')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setJobsData(json.payload || []);
        }
      })
      .catch(() => {});
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-manrope">Loading careers...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-manrope">Loading content...</div>;

  const careersContent = content.careers;

  const jobs = jobsData.length > 0 ? jobsData : [
    { title: "Frontend Developer", location: "Chennai, TN", type: "Full Time", experience: "Mid-Level (2-3 Yrs)", category: "Engineering", apply_link: "mailto:careers@crestcode.usa", application_email: "careers@crestcode.usa" },
    { title: "Backend Developer", location: "Chennai, TN", type: "Full Time", experience: "Mid-Level (2-3 Yrs)", category: "Engineering", apply_link: "mailto:careers@crestcode.usa", application_email: "careers@crestcode.usa" },
    { title: "Product Designer", location: "Chennai, TN", type: "Full Time", experience: "Entry-Level", category: "Design", apply_link: "mailto:careers@crestcode.usa", application_email: "careers@crestcode.usa" }
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate email
    const newErrors: { email?: string; linkedin?: string } = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validateUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid URL';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Validate resume is required
    if (!resumeFile) {
      setFileError('Please upload your resume to apply.');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('email', formData.email);
      payload.append('interest', formData.interest);
      payload.append('linkedin', formData.linkedin);
      payload.append('jobTitle', formData.jobTitle);
      if (resumeFile) payload.append('resume', resumeFile);

      // Use API endpoint for submission
      const response = await fetch(`${API_URL}/submit-talent`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setShowForm(false);
        setSubmitted(true); // Show success message after successful submission
        setFormData({ firstName: '', email: '', interest: 'Engineering', linkedin: '', jobTitle: '' });
        setResumeFile(null);
        setFileError('');
        setErrors({});
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

        .careers-page h2 {
          font-size: 36px !important;
        }

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
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0F172A;
          outline: none;
          width: 100%;
          font-family: inherit;
          transition: border-color 0.3s;
          font-size: 14px;
        }
        .form-input:focus {
          border-color: var(--primary-blue);
          background: #FFFFFF;
        }
        .form-input.error {
          border-color: #EF4444;
          background: #FEF2F2;
        }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-eyebrow-pill {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: #005AE2 !important;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          padding: 8px 18px !important;
          border-radius: 100px !important;
          margin-bottom: 32px !important;
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .hero-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important;
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important;
          color: #0A0F1C !important;
          margin: 0 auto 28px !important;
          text-align: center !important;
          max-width: 960px !important;
        }
        .hero-description {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.8 !important;
          max-width: 720px !important;
          margin: 0 auto 32px !important;
          text-align: center !important;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #E6EFFF;
          color: #005AE2;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        /* Hero Section */
        .hero-section {
          background-color: #F1F5F9 !important;
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
              font-size: 36px !important;
            }
            
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
      `}} />

      <Header currentPage="careers" />

      <div className="careers-page" style={{ backgroundColor: '#F8FAFC' }}>
        {/* --- 1. HERO SECTION --- */}
        <section className="hero-section" style={{ backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.22), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.22), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div className="section-container pt-0 pb-0" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: '960px' }}>
            <span className="hero-eyebrow-pill" style={{ marginBottom: '32px' }}>
              <EditableText contentKey="careers.hero.eyebrow" value={careersContent.hero.eyebrow} />
            </span>
            <EditableText
              as="h1"
              contentKey="careers.hero.title"
              value={careersContent.hero.title || "Build Meaningful Technology With Us"}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap', width: '100%', textAlign: 'center' }}
            >
              {(() => {
                const headingText = careersContent.hero.title || "Build Meaningful Technology With Us";
                const lines = headingText.includes('\n') ? headingText.split('\n') : [headingText];
                
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  const hasNewlines = headingText.includes('\n');
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                        const cleanWordUpper = cleanWord.toUpperCase();
                        const isBlue = ['US', 'CRESTCODE', 'CAREERS'].includes(cleanWordUpper);
                        const isMidpoint = !hasNewlines && index === Math.floor(words.length / 2) - 1;
                        return (
                          <React.Fragment key={index}>
                            <span style={isBlue ? { color: '#005AE2' } : {}}>
                              {word}{' '}
                            </span>
                            {isMidpoint && <br />}
                          </React.Fragment>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '720px', fontWeight: 500, marginInline: 'auto', textAlign: 'center' }}>
              <EditableText contentKey="careers.hero.description" value={careersContent.hero.description} />
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => handleScroll('open-positions')} className="btn-primary-style">
                <EditableText contentKey="careers.hero.primaryButton" value={careersContent.hero.primaryButton} />
              </button>
              <button onClick={() => handleScroll('benefits')} className="btn-secondary-style">
                <EditableText contentKey="careers.hero.secondaryButton" value={careersContent.hero.secondaryButton} />
              </button>
            </div>
          </div>
        </section>

        {/* --- 2. WHY JOIN CRESTCODE --- */}
        <section style={{ backgroundColor: '#FFFFFF' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-eyebrow">
                <EditableText contentKey="careers.whyJoin.eyebrow" value={careersContent.whyJoin.eyebrow || "WHY JOIN US"} />
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }} className="font-manrope">
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
        <section style={{ backgroundColor: '#F8FAFC' }}>
          <div className="section-container">
            <div style={{ backgroundColor: 'var(--primary-blue)', borderRadius: '24px', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'center', color: '#FFF' }} className="life-grid">
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: 1.15 }} className="font-manrope">
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
        <section id="benefits" style={{ backgroundColor: '#FFFFFF', color: 'var(--text-black)' }}>
          <div className="section-container">
            <div style={{ marginBottom: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-eyebrow">
                <EditableText contentKey="careers.benefits.eyebrow" value={careersContent.benefits.eyebrow || "BENEFITS & PERKS"} />
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em', color: '#0F172A' }} className="font-manrope">
                <EditableText contentKey="careers.benefits.title" value={careersContent.benefits.title} />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
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
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--light-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', flexShrink: 0 }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }} className="font-manrope">
                      <EditableText contentKey={`careers.benefits.items.${i}.title`} value={careersContent.benefits.items[i].title} />
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                      <EditableText contentKey={`careers.benefits.items.${i}.desc`} value={careersContent.benefits.items[i].desc} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. OPEN POSITIONS --- */}
        <section id="open-positions" style={{ backgroundColor: '#F8FAFC' }}>
          <div className="section-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }} className="font-manrope">
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
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} /> 
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>{job.experience || job.exp}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (job.apply_link && job.apply_link.startsWith('mailto:')) {
                        window.location.href = job.apply_link;
                      } else if (job.apply_link) {
                        window.open(job.apply_link, '_blank');
                      } else {
                        setFormData({...formData, jobTitle: job.title});
                        handleScroll('apply-now');
                      }
                    }}
                    style={{ backgroundColor: 'var(--light-blue-bg)', color: 'var(--primary-blue)', padding: '12px 28px', borderRadius: '100px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e: any) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                    onMouseOut={(e: any) => e.currentTarget.style.backgroundColor = 'var(--light-blue-bg)'}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 6. CTA (RESUME SUBMISSION) --- */}
        <section id="apply-now" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="section-container">
            <div className="cta-card" style={{ backgroundColor: '#0052FF', border: 'none', borderRadius: '32px', padding: '80px 60px', textAlign: 'center', color: '#FFFFFF' }}>
              {!submitted ? (
                <>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', color: '#FFFFFF' }} className="font-manrope">
                    <EditableText contentKey="careers.cta.title" value={careersContent.cta.title} />
                  </h2>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '48px', maxWidth: '600px', marginInline: 'auto', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.cta.subtitle" value={careersContent.cta.subtitle} />
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#FFFFFF', color: '#0052FF', border: 'none', padding: '18px 48px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                      <EditableText contentKey="careers.cta.primaryButton" value={careersContent.cta.primaryButton} />
                    </button>
                    <Link href="https://www.linkedin.com/search/results/all/?keywords=crestcode%20technologies&origin=RICH_QUERY_SUGGESTION&spellCorrectionEnabled=false&heroEntityKey=urn%3Ali%3Aorganization%3A108093169&position=0" style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', padding: '16px 32px', borderRadius: '12px', transition: 'all 0.3s ease' }} className="font-manrope">
                      <EditableText contentKey="careers.cta.secondaryLink" value={careersContent.cta.secondaryLink} />
                    </Link>
                  </div>

                  {showForm && (
                    <div style={{ marginTop: '40px', maxWidth: '600px', marginInline: 'auto' }}>
                       <form onSubmit={handleSubmit} style={{ textAlign: 'left', background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                              style={{ padding: '12px 16px' }}
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
                              onChange={(e: any) => {
                                setFormData({...formData, email: e.target.value});
                                if (errors.email) setErrors({...errors, email: undefined});
                              }}
                              className={`form-input ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>{errors.email}</p>}
                          </div>
                        </div>

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label className="form-label">
                              Job Title <span style={{ color: '#EF4444', fontWeight: 700, marginLeft: '4px' }}>*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Frontend Developer"
                              required
                              value={formData.jobTitle}
                              onChange={(e: any) => setFormData({...formData, jobTitle: e.target.value})}
                              className="form-input"
                              style={{ padding: '12px 16px' }}
                            />
                          </div>
                          <div>
                            <label className="form-label">
                              <EditableText contentKey="careers.form.linkedinLabel" value={careersContent.form.linkedinLabel} />
                            </label>
                            <input
                              type="url"
                              placeholder={careersContent.form.linkedinPlaceholder}
                              value={formData.linkedin}
                              onChange={(e: any) => {
                                setFormData({...formData, linkedin: e.target.value});
                                if (errors.linkedin) setErrors({...errors, linkedin: undefined});
                              }}
                              className={`form-input ${errors.linkedin ? 'error' : ''}`}
                            />
                            {errors.linkedin && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>{errors.linkedin}</p>}
                          </div>
                        </div>

                        {/* Resume Upload */}
                        <div style={{ marginBottom: '16px' }}>
                          <label className="form-label">
                            Resume / CV <span style={{ color: '#EF4444', fontWeight: 700, marginLeft: '4px' }}>*</span>{' '}
                            <span style={{ color: '#64748B', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '4px' }}>
                              (PDF, DOC, DOCX - Max 5MB)
                            </span>
                          </label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              border: `2px dashed ${isDragging ? '#0052FF' : resumeFile ? '#10B981' : '#CBD5E1'}`,
                              borderRadius: '12px',
                              padding: '20px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: isDragging ? '0 0 0 3px rgba(0,82,255,0.15)' : 'none',
                              background: isDragging
                                ? '#EFF6FF'
                                : resumeFile
                                ? '#ECFDF5'
                                : '#F8FAFC',
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
                                  style={{ marginLeft: 'auto', background: '#FEE2E2', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444', flexShrink: 0 }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDragging ? '#0052FF' : '#4D79FF', margin: '0 auto 8px', border: '2px solid #BFDBFE' }}>
                                  <Upload size={20} />
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                                  Click to upload or drag and drop
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                                  PDF, DOC, DOCX (Max 5MB)
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

                        <button type="submit" className="btn-primary-style" style={{ width: '100%', borderRadius: '12px', padding: '14px 24px', fontSize: '15px' }} disabled={isSubmitting}>
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
                  <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }} className="font-manrope">
                    <EditableText contentKey="careers.success.title" value={careersContent.success.title} />
                  </h2>
                  <p style={{ fontSize: '1.125rem', color: '#94A3B8', marginBottom: '40px', maxWidth: '500px', marginInline: 'auto' }}>
                    <EditableText contentKey="careers.success.message" value={careersContent.success.message} />
                  </p>
                  <button onClick={() => { setSubmitted(false); setShowForm(true); }} className="btn-secondary-style" style={{ backgroundColor: 'transparent', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
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
