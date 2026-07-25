'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import { AlertCircle, ChevronDown, Check } from 'lucide-react';

const SLIDES = [
  {
    tag: 'VENTURE ACCESS',
    title: 'Direct access to pre-vetted MLP ventures with unmatched execution speed and risk mitigation.',
    description: 'Transforming high-potential concepts into scalable, revenue-ready products backed by institutional co-building governance.'
  },
  {
    tag: 'CO-BUILDER SYNERGY',
    title: 'Partner as an active operator-investor alongside senior tech and growth leaders.',
    description: 'Align capital with hands-on domain leadership, strategic GTM execution, and co-founder equity ownership.'
  },
  {
    tag: 'CAPITAL EFFICIENCY',
    title: 'Optimized capital deployment standardizing validation from day zero to product launch.',
    description: 'Eliminate wasteful agency overhead while retaining maximum founder equity and long-term venture upside.'
  },
  {
    tag: 'EXCLUSIVE NETWORK',
    title: 'Join a curated circle of strategic angels, operators, and tech leaders scaling global ventures.',
    description: 'Access proprietary deal flow, co-investment rights, and real-time portfolio performance tracking.'
  }
];

const EXPERTISE_OPTIONS = [
  'Product Strategy',
  'Engineering / Architecture',
  'GTM / Sales',
  'Finance / M&A',
  'Legal / Compliance'
];

export default function InvestorsCta({
  content,
  getContent,
  formData,
  setFormData,
  submitted,
  setSubmitted,
  handleRoleChange,
  handleSubmit,
  isSubmitting
}: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Automatic slide transition timer (changes automatically every 4.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form Validation Logic
  const validate = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName || data.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (at least 2 letters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.expertise) {
      newErrors.expertise = 'Please select your domain expertise';
    }

    if (!data.preferredRoles || data.preferredRoles.length === 0) {
      newErrors.preferredRoles = 'Please select at least one preferred role';
    }

    if (!data.background || data.background.trim().length < 10) {
      newErrors.background = 'Please provide background details (min 10 characters)';
    }

    return newErrors;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate(formData);
    setErrors(currentErrors);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    
    // Mark all fields touched
    setTouched({
      fullName: true,
      email: true,
      expertise: true,
      preferredRoles: true,
      background: true
    });

    if (Object.keys(validationErrors).length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <section id="apply-form" style={{ background: '#F8FAFC', padding: '60px 24px' }}>
      <div className="section-container" style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* Eyebrow & Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="hero-eyebrow-pill" style={{ marginBottom: '12px', background: '#EFF6FF', color: '#005AE2' }}>
            <EditableText contentKey="investors.form.eyebrow" value={content?.investors?.form?.eyebrow || 'GET STARTED'} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px', fontFamily: "'Manrope', sans-serif" }}>
            {submitted ? 'Thank You!' : <EditableText contentKey="investors.form.title" value={content?.investors?.form?.title || 'Join as an Operator-Investor'} />}
          </h2>
          {!submitted && (
            <p style={{ color: '#64748B', maxWidth: '640px', margin: '0 auto', fontSize: '0.98rem', fontWeight: 500, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              <EditableText contentKey="investors.form.description" value={content?.investors?.form?.description || 'Complete the briefing form below and our team will get in touch to schedule a private briefing session.'} />
            </p>
          )}
        </div>

        {/* Side-by-side layout grid */}
        <div className="investor-cta-grid">
          
          {/* Left Side: Automatic Wording Slider Card */}
          <div className="investor-left-card" style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '44px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            position: 'relative',
          }}>
            {/* Quote / Highlight Mark Icon */}
            <div style={{ marginBottom: '24px', color: '#0047AB' }}>
              <svg width="40" height="32" viewBox="0 0 40 32" fill="currentColor" opacity="0.85">
                <path d="M12 0C5.37258 0 0 5.37258 0 12V32H16V16H8C8 11.5817 11.5817 8 16 8V0H12ZM36 0C29.3726 0 24 5.37258 24 12V32H40V16H32C32 11.5817 35.5817 8 40 8V0H36Z"/>
              </svg>
            </div>

            {/* Automatic Slide Content with Smooth Transition */}
            <div key={currentSlide} style={{
              animation: 'ccSlideFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#005AE2',
                backgroundColor: '#EFF6FF',
                padding: '5px 14px',
                borderRadius: '100px',
                letterSpacing: '0.12em',
                marginBottom: '18px',
                textTransform: 'uppercase',
                fontFamily: "'Manrope', sans-serif"
              }}>
                {SLIDES[currentSlide].tag}
              </span>

              <p style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.5,
                letterSpacing: '-0.015em',
                marginBottom: '16px',
                fontFamily: "'Inter', sans-serif",
              }}>
                {SLIDES[currentSlide].title}
              </p>

              <p style={{
                fontSize: '0.92rem',
                color: '#64748B',
                lineHeight: 1.65,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                margin: 0,
              }}>
                {SLIDES[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="investor-right-card" style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '40px 36px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          }}>
            {submitted ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                padding: '36px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ margin: '0 auto 16px auto' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 style={{ color: '#0F172A', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', fontFamily: "'Manrope', sans-serif" }}>Interest Submitted Successfully!</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, fontFamily: "'Inter', sans-serif" }}>A CrestCode partner will reach out to schedule your private briefing.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate style={{ textAlign: 'left' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  
                  {/* Full Name Field */}
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                      <EditableText contentKey="investors.form.labelName" value={getContent('investors.form.labelName', 'Full Name')} /> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`form-input-light ${touched.fullName && errors.fullName ? 'has-error' : ''}`}
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, fullName: e.target.value }));
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      onBlur={() => handleBlur('fullName')}
                    />
                    {touched.fullName && errors.fullName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                        <AlertCircle size={13} />
                        <span>{errors.fullName}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Address Field */}
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                      <EditableText contentKey="investors.form.labelEmail" value={getContent('investors.form.labelEmail', 'Email Address')} /> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      className={`form-input-light ${touched.email && errors.email ? 'has-error' : ''}`}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      onBlur={() => handleBlur('email')}
                    />
                    {touched.email && errors.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                        <AlertCircle size={13} />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  
                  {/* ENHANCED CUSTOM DOMAIN EXPERTISE DROPDOWN */}
                  <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
                    <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                      <EditableText contentKey="investors.form.labelExpertise" value={getContent('investors.form.labelExpertise', 'Domain Expertise')} /> <span style={{ color: '#EF4444' }}>*</span>
                    </label>

                    {/* Custom Dropdown Trigger Box */}
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`form-input-light ${touched.expertise && errors.expertise ? 'has-error' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderColor: isDropdownOpen ? '#0047AB' : (touched.expertise && errors.expertise ? '#EF4444' : '#E2E8F0'),
                        boxShadow: isDropdownOpen ? '0 0 0 3px rgba(0, 71, 171, 0.15)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ color: formData.expertise ? '#0F172A' : '#94A3B8', fontWeight: 600, fontSize: '0.92rem', fontFamily: "'Inter', sans-serif" }}>
                        {formData.expertise || 'Select domain expertise...'}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: isDropdownOpen ? '#0047AB' : '#64748B',
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>

                    {/* Enhanced Dropdown Menu Popover */}
                    {isDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 2px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                        zIndex: 100,
                        overflow: 'hidden',
                        padding: '4px',
                        animation: 'ccDropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      }}>
                        {EXPERTISE_OPTIONS.map((opt, i) => {
                          const isSelected = formData.expertise === opt;
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                setFormData((prev: any) => ({ ...prev, expertise: opt }));
                                if (errors.expertise) setErrors((prev) => ({ ...prev, expertise: '' }));
                                setIsDropdownOpen(false);
                                setTouched((prev) => ({ ...prev, expertise: true }));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: isSelected ? 700 : 600,
                                fontFamily: "'Inter', sans-serif",
                                color: isSelected ? '#FFFFFF' : '#334155',
                                backgroundColor: isSelected ? '#0047AB' : 'transparent',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseOver={(e: any) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                                  e.currentTarget.style.color = '#005AE2';
                                }
                              }}
                              onMouseOut={(e: any) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#334155';
                                }
                              }}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check size={16} style={{ color: '#FFFFFF' }} />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {touched.expertise && errors.expertise && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                        <AlertCircle size={13} />
                        <span>{errors.expertise}</span>
                      </div>
                    )}
                  </div>

                  {/* Preferred Role Checkboxes */}
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                      <EditableText contentKey="investors.form.labelRole" value={getContent('investors.form.labelRole', 'Preferred Role')} /> <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                      {['Investor Only', 'Strategic Advisor', 'Venture CEO', 'Network Partner'].map((role, idx) => {
                        const isChecked = formData.preferredRoles.includes(role);
                        return (
                          <label key={idx} className="custom-checkbox-light">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                handleRoleChange(role);
                                if (errors.preferredRoles) setErrors((prev) => ({ ...prev, preferredRoles: '' }));
                              }}
                            />
                            <span>{role}</span>
                          </label>
                        );
                      })}
                    </div>
                    {touched.preferredRoles && errors.preferredRoles && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                        <AlertCircle size={13} />
                        <span>{errors.preferredRoles}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Background & Context Field */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                    <EditableText contentKey="investors.form.labelBackground" value={getContent('investors.form.labelBackground', 'Tell us about your builder background')} /> <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly tell us about your investment background and strategic focus..."
                    className={`form-input-light ${touched.background && errors.background ? 'has-error' : ''}`}
                    style={{ resize: 'none' }}
                    value={formData.background}
                    onChange={(e) => {
                      setFormData((prev: any) => ({ ...prev, background: e.target.value }));
                      if (errors.background) setErrors((prev) => ({ ...prev, background: '' }));
                    }}
                    onBlur={() => handleBlur('background')}
                  ></textarea>
                  {touched.background && errors.background && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                      <AlertCircle size={13} />
                      <span>{errors.background}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button in Navy Blue */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-navy-pill"
                >
                  {isSubmitting ? (
                    <EditableText contentKey="investors.form.buttonSubmitting" value={getContent('investors.form.buttonSubmitting', 'Registering...')} />
                  ) : (
                    <>
                      <EditableText contentKey="investors.form.buttonSubmit" value={getContent('investors.form.buttonSubmit', 'Register Strategic Interest')} />
                      <span style={{ fontSize: '1.1rem' }}>→</span>
                    </>
                  )}
                </button>

                <p style={{ marginTop: '16px', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5, textAlign: 'center', margin: '16px 0 0 0' }}>
                  By clicking on the button, you consent to the processing of personal data and agree to the site's Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ccSlideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ccDropdownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}} />
    </section>
  );
}
