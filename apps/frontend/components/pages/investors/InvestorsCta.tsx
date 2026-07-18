'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, ShieldAlert, Sparkles, Check, X, ArrowLeft, ArrowRight, 
  MapPin, Briefcase, DollarSign, Layers, Globe, Cpu, Ban, History, Sprout, Info, AlertTriangle
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';




export default function InvestorsCta({ content, getContent, formData, setFormData, submitted, setSubmitted, handleRoleChange, handleSubmit, isSubmitting }: any) {
  return (
    <section id="apply-form" style={{ background: '#EFF6FF' }}>
          <div className="section-container">
            
            <div className="form-section-card">
              <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)', bottom: '-100px', left: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

              <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="hero-eyebrow-pill" style={{ marginBottom: '16px' }}>
                  <EditableText contentKey="investors.form.eyebrow" value={content?.investors?.form?.eyebrow || 'Get Started'} />
                </div>
                <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                  {submitted ? 'Thank You!' : <EditableText contentKey="investors.form.title" value={content?.investors?.form?.title || 'Register Your Interest'} />}
                </h2>
                {!submitted && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: '48px', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6 }}>
                    <EditableText contentKey="investors.form.description" value={content?.investors?.form?.description || 'Complete the briefing form below and our team will get in touch to schedule a private briefing session.'} />
                  </p>
                )}

                {submitted ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#10B981',
                    padding: '36px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ margin: '0 auto 16px auto' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', fontFamily: "'Manrope', sans-serif" }}>Interest Submitted Successfully!</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', margin: 0, fontFamily: "'Inter', sans-serif" }}>A CrestCode partner will reach you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-row-2" style={{ marginBottom: '20px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelName" value={getContent('investors.form.labelName', 'FULL NAME')} />
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          className="form-input"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelEmail" value={getContent('investors.form.labelEmail', 'EMAIL ADDRESS')} />
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@company.com"
                          className="form-input"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-row-2" style={{ marginBottom: '24px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelExpertise" value={getContent('investors.form.labelExpertise', 'PRIMARY EXPERTISE')} />
                        </label>
                        <select
                          className="form-input"
                          style={{ background: '#131926', color: '#FFFFFF', cursor: 'pointer' }}
                          value={formData.expertise}
                          onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                        >
                          {['Product Strategy', 'Engineering / Architecture', 'GTM / Sales', 'Finance / M&A', 'Legal / Compliance'].map((opt, i) => (
                            <option key={i} style={{ background: '#0A0F1C' }} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelRole" value={getContent('investors.form.labelRole', 'PREFERRED ENGAGEMENT ROLE')} />
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                          {['Investor Only', 'Strategic Advisor', 'Venture CEO', 'Network Partner'].map((role, idx) => {
                            const isChecked = formData.preferredRoles.includes(role);
                            return (
                              <label key={idx} className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleRoleChange(role)}
                                />
                                <div className="checkmark"></div>
                                <span>{role}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '36px' }}>
                      <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                        <EditableText contentKey="investors.form.labelBackground" value={getContent('investors.form.labelBackground', 'BACKGROUND & CONTEXT')} />
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Briefly tell us about your investment background and strategic focus..."
                        className="form-input"
                        style={{ resize: 'none' }}
                        value={formData.background}
                        onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-pill"
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        color: '#0A0F1C',
                        padding: '18px',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 8px 24px rgba(255,255,255,0.15)',
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? <EditableText contentKey="investors.form.buttonSubmitting" value={getContent('investors.form.buttonSubmitting', 'Registering...')} /> : <EditableText contentKey="investors.form.buttonSubmit" value={getContent('investors.form.buttonSubmit', 'Register Strategic Interest')} />}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
  );
}
