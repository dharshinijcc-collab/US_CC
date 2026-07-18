'use client';
import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import {
  MapPin, Phone, Mail, Clock, MessageSquare, Shield, Award, Sparkles, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import GrainOverlay from '@/components/effects/GrainOverlay';
import BorderBeam from '@/components/effects/BorderBeam';




export default function ContactForm({ contactContent, formData, setFormData, handleSubmit, submitted, setSubmitted, handleServiceClick }: any) {
  const localServices = [
    {
      title: "General Inquiry",
      description: "Get in touch for general questions, partnerships, or other inquiries."
    },
    ...(contactContent.services?.services || [])
  ];

  return (
    <section id="form-section" style={{ 
          backgroundColor: '#FFFFFF', 
          position: 'relative', 
          overflow: 'hidden',
        }}>
          {/* Grid Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 90, 226, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 90, 226, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>
          
          <div className={clsx('section-container', 'grid-2', 'grid-2-align-top')} style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Left Column: Services */}
            <div>
              <EditableText 
                as="h2"
                contentKey="contact.services.title"
                value={contactContent.services.title}
                className={clsx('section-title', 'cc-slide-left')}
                style={{marginTop: 0}}
              />
              <EditableText 
                as="p"
                contentKey="contact.services.subtitle"
                value={contactContent.services.subtitle}
                className={clsx('body-text', 'cc-slide-left', 'cc-delay-1')}
              />
              
              <div className="services-list">
                {localServices.map((service, index) => (
                  <div 
                    key={service.title}
                    className={`service-card ${formData.serviceInterest === service.title ? 'active' : ''}`}
                    onClick={() => handleServiceClick(service.title)}
                  >
                    <div className="service-icon-box">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        {index === 0 ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ) : (
                          [
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          ][index - 1]
                        )}
                      </svg>
                    </div>
                    <div>
                      {index === 0 ? (
                        <h4 className="service-title">{service.title}</h4>
                      ) : (
                        <EditableText 
                          as="h4"
                          contentKey={`contact.services.services.${index - 1}.title`}
                          value={service.title}
                          className="service-title"
                        />
                      )}
                      {index === 0 ? (
                        <p className="service-desc">{service.description}</p>
                      ) : (
                        <EditableText 
                          as="p"
                          contentKey={`contact.services.services.${index - 1}.description`}
                          value={service.description}
                          className="service-desc"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <BorderBeam className={clsx('form-card', 'cc-slide-right')} style={{padding: 0}}>
              {submitted ? (
                <div className={clsx('text-center', 'py-20', 'px-10', 'animate-fade-in')} style={{minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <div className={clsx('w-20', 'h-20', 'bg-blue-50', 'text-blue-500', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mb-6')}>
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={clsx('text-3xl', 'font-bold', 'mb-4')}>
                    <EditableText contentKey="contact.form.success.title" value={contactContent.form.success.title} />
                  </h3>
                  <p className={clsx('text-gray-600', 'mb-8', 'max-w-sm')}>
                    <EditableText contentKey="contact.form.success.message" value={contactContent.form.success.message} />
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-bright"
                  >
                    <EditableText contentKey="contact.form.success.buttonText" value={contactContent.form.success.buttonText} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} method="POST" name="contact-form" style={{padding: '24px'}}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.nameLabel"
                        value={contactContent.form.nameLabel}
                        className="form-label"
                      />
                      <input type="text" name="firstName" className="form-input" placeholder={contactContent.form.namePlaceholder} 
                             value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required/>
                    </div>
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.emailLabel"
                        value={contactContent.form.emailLabel}
                        className="form-label"
                      />
                      <input type="email" name="workEmail" className="form-input" placeholder={contactContent.form.emailPlaceholder} 
                             value={formData.workEmail} onChange={e => setFormData({...formData, workEmail: e.target.value})} required/>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.companyLabel"
                        value={contactContent.form.companyLabel}
                        className="form-label"
                      />
                      <input type="text" name="company" className="form-input" placeholder={contactContent.form.companyPlaceholder} 
                             value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}/>
                    </div>
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.serviceLabel"
                        value={contactContent.form.serviceLabel}
                        className="form-label"
                      />
                      <select className="form-input" value={formData.serviceInterest} onChange={e => handleServiceClick(e.target.value)}>
                        {localServices.map(service => (
                          <option key={service.title} value={service.title}>{service.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{marginBottom: '32px'}}>
                    <EditableText 
                      as="label"
                      contentKey="contact.form.stageLabel"
                      value={contactContent.form.stageLabel}
                      className="form-label"
                    />
                    <div className="radio-pill-group">
                      {contactContent.form.stages.map((stage, idx) => (
                        <label key={stage} className={`radio-pill ${formData.projectStage === stage ? 'active' : ''}`}>
                          <input type="radio" name="projectStage" value={stage} 
                                  checked={formData.projectStage === stage} 
                                  onChange={e => setFormData({...formData, projectStage: e.target.value})} />
                          <div className="radio-circle"></div>
                          <EditableText 
                            as="span"
                            contentKey={`contact.form.stages.${idx}`}
                            value={stage}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{marginBottom: '32px'}}>
                    <EditableText 
                      as="label"
                      contentKey="contact.form.messageLabel"
                      value={contactContent.form.messageLabel}
                      className="form-label"
                    />
                    <textarea name="message" className="form-input" placeholder={contactContent.form.messagePlaceholder} 
                               value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                  </div>

                  <button type="submit" className="btn-bright" style={{width: '100%', padding: '14px'}}>
                    <EditableText contentKey="contact.form.buttonText" value={contactContent.form.buttonText} />
                  </button>
                </form>
              )}
            </BorderBeam>
          </div>
        </section>
  );
}
