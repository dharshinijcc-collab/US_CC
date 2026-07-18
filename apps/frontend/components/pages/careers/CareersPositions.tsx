'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersPositions({ careersContent, activeFilter, setActiveFilter, filteredJobs, handleScroll, formData, setFormData, setShowForm }: any) {
  return (
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
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, jobTitle: job.title });
                      setShowForm(true);
                      setTimeout(() => {
                        handleScroll('apply-now');
                      }, 50);
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
  );
}
