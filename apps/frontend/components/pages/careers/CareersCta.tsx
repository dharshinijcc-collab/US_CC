'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersCta({ submitted, setSubmitted, careersContent, showForm, setShowForm, formData, setFormData, handleSubmit, errors, setErrors, resumeFile, setResumeFile, isDragging, setIsDragging, fileError, setFileError, fileInputRef, handleDrop, handleFileChange, isSubmitting }: any) {
  return (
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
  );
}
