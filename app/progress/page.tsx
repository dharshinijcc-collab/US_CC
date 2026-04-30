'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProgressPage() {
  const [currentStep] = useState(1); // Mock step: 1 - Ideation

  const steps = [
    { id: 1, name: 'Ideation', status: 'In Progress', description: 'We are currently reviewing your idea and defining the core value proposition.' },
    { id: 2, name: 'Strategy & Setup', status: 'Pending', description: 'Technical planning and resource allocation for your venture.' },
    { id: 3, name: 'Design', status: 'Pending', description: 'Creating high-fidelity UI/UX designs for your product.' },
    { id: 4, name: 'Development', status: 'Pending', description: 'Building the scalable architecture and core features.' },
    { id: 5, name: 'Launch', status: 'Pending', description: 'Deploying to market and establishing feedback loops.' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .progress-container {
          min-height: 100vh;
          background: #F8FAFC;
          padding-top: 140px;
          padding-bottom: 80px;
        }
        .content-wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .progress-header {
          margin-bottom: 48px;
        }
        .progress-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 12px;
        }
        .progress-header p {
          color: #64748B;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .progress-card {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }
        
        .stepper {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 64px;
        }
        .stepper::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 2px;
          background: #E2E8F0;
          z-index: 0;
        }
        .step-item {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100px;
        }
        .step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: 2px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          font-weight: 700;
          color: #94A3B8;
        }
        .step-item.active .step-circle {
          border-color: #005AE2;
          background: #005AE2;
          color: white;
          box-shadow: 0 0 0 6px rgba(0, 90, 226, 0.1);
        }
        .step-item.completed .step-circle {
          border-color: #005AE2;
          background: #005AE2;
          color: white;
        }
        .step-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748B;
          text-align: center;
        }
        .step-item.active .step-name { color: #005AE2; }
        
        .phase-details {
          border-top: 1px solid #F1F5F9;
          padding-top: 32px;
        }
        .phase-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .status-badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 100px;
          background: #E0E7FF;
          color: #4338CA;
          font-weight: 700;
        }
        .phase-desc {
          color: #64748B;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        
        .support-box {
          margin-top: 48px;
          background: #0F172A;
          border-radius: 20px;
          padding: 32px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .support-btn {
          background: #005AE2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .support-btn:hover { background: #004ac2; }

        @media (max-width: 768px) {
          .stepper { overflow-x: auto; padding-bottom: 10px; justify-content: flex-start; gap: 40px; }
          .stepper::before { display: none; }
          .step-item { flex-shrink: 0; }
          .support-box { flex-direction: column; text-align: center; gap: 24px; }
        }
      `}} />

      <Header />
      
      <main className="progress-container">
        <div className="content-wrap">
          <div className="progress-header">
            <h1>Track Your Venture</h1>
            <p>Real-time updates on your idea's journey from concept to market.</p>
          </div>

          <div className="progress-card">
            <div className="stepper">
              {steps.map((step) => (
                <div key={step.id} className={`step-item ${step.id === currentStep ? 'active' : step.id < currentStep ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <span className="step-name">{step.name}</span>
                </div>
              ))}
            </div>

            <div className="phase-details">
              <div className="phase-title">
                Current Phase: {steps[currentStep-1].name}
                <span className="status-badge">{steps[currentStep-1].status}</span>
              </div>
              <p className="phase-desc">
                {steps[currentStep-1].description}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>SUBMITTED ON</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Oct 24, 2023</div>
                </div>
                <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>ESTIMATED REVIEW</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>2-3 Business Days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="support-box">
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Need assistance?</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Your dedicated product manager is here to help you.</p>
            </div>
            <button className="support-btn">Contact Support</button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
