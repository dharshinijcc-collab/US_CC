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
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import { API_URL, api } from '@/services/api';

import CareersHero from './CareersHero';
import CareersWhyJoin from './CareersWhyJoin';
import CareersLife from './CareersLife';
import CareersBenefits from './CareersBenefits';
import CareersPositions from './CareersPositions';
import CareersCta from './CareersCta';

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
      const response = await api.post('/submit-talent', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setShowForm(false);
        setSubmitted(true); // Show success message after successful submission
        setFormData({ firstName: '', email: '', interest: 'Engineering', linkedin: '', jobTitle: '' });
        setResumeFile(null);
        setFileError('');
        setErrors({});
      } else {
        alert(response.data?.error || response.data?.message || 'Submission failed. Please try again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || error.response?.data?.message || 'Network error. Please try again later.');
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
          font-family: 'Inter', sans-serif;
          background-color: #F8FAFC; 
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        h1, h2, h3, h4, h5, h6, .font-manrope { 
          font-family: 'Manrope', sans-serif; 
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
        <CareersHero careersContent={careersContent} handleScroll={handleScroll} />

        {/* --- 2. WHY JOIN CRESTCODE --- */}
        <CareersWhyJoin careersContent={careersContent} />

        {/* --- 3. LIFE AT CRESTCODE --- */}
        <CareersLife careersContent={careersContent} />

        {/* --- 4. BENEFITS & PERKS --- */}
        <CareersBenefits careersContent={careersContent} />

        {/* --- 5. OPEN POSITIONS --- */}
        <CareersPositions careersContent={careersContent} activeFilter={activeFilter} setActiveFilter={setActiveFilter} filteredJobs={filteredJobs} handleScroll={handleScroll} formData={formData} setFormData={setFormData} setShowForm={setShowForm} />

        {/* --- 6. CTA (RESUME SUBMISSION) --- */}
        <CareersCta submitted={submitted} setSubmitted={setSubmitted} careersContent={careersContent} showForm={showForm} setShowForm={setShowForm} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} errors={errors} setErrors={setErrors} resumeFile={resumeFile} setResumeFile={setResumeFile} isDragging={isDragging} setIsDragging={setIsDragging} fileError={fileError} setFileError={setFileError} fileInputRef={fileInputRef} handleDrop={handleDrop} handleFileChange={handleFileChange} isSubmitting={isSubmitting} />


        <Footer />
      </div>
    </>
  );
}
