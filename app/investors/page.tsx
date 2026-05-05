'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import CountUp from '@/components/effects/CountUp';
import Link from 'next/link';
import localConfig from '@/backend/config.json';

import { API_URL } from '@/services/api';

export default function InvestorsPage() {
  const { content, loading, error } = useContent();
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    expertise: 'Product Strategy',
    preferredRoles: [] as string[],
    background: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading our model...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content || !content.investors) return null;

  const investorContent = content.investors;

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/submit-investor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          expertise: 'Product Strategy',
          preferredRoles: [],
          background: ''
        });
      } else {
        const data = await response.json();
        alert(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };
  const investors = content?.investors || (localConfig as any).investors;
  
  if (!investors) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Investors content not found.</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          --primary-blue: #005AE2;
          --text-black: #020617;
          --text-muted: #64748B;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --white: #FFFFFF;
          --accent-green: #10B981;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--white);
          color: var(--text-black);
          margin: 0;
          overflow-x: hidden;
        }

        h1, h2, h3, h4 {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(40px, 6vw, 80px) 24px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 24px;
          font-weight: 800;
        }

        .text-blue { color: var(--primary-blue); }

        .btn-pill {
          padding: 16px 40px;
          border-radius: 100px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-blue), #4F46E5);
          color: white;
          box-shadow: 0 10px 24px -6px rgba(0, 90, 226, 0.4);
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover { 
          transform: translateY(-4px) scale(1.02); 
          box-shadow: 0 20px 40px -8px rgba(0, 90, 226, 0.5); 
        }

        .btn-secondary {
          background-color: white;
          color: var(--text-black);
          border: 1.5px solid #E2E8F0;
          cursor: pointer;
        }
        .btn-secondary:hover { 
          background: #F8FAFC; 
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          transform: translateY(-4px);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1);
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        .card-standard {
          padding: 40px;
          border-radius: 24px;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-standard:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.06);
        }

        /* Operator Advantage Grid */
        .advantage-card {
          padding: 32px;
          border-left: 4px solid var(--primary-blue);
          background: #FDFDFF;
          transition: background 0.3s;
        }
        .advantage-card:hover { 
          background: #F0F5FF; 
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(0, 90, 226, 0.15);
        }

        /* Comparison Section */
        @keyframes stroke-glow {
          0% { border-color: rgba(0, 90, 226, 0.1); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 0 rgba(0, 90, 226, 0); }
          50% { border-color: rgba(0, 90, 226, 0.5); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 15px 2px rgba(0, 90, 226, 0.2); }
          100% { border-color: rgba(0, 90, 226, 0.1); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 0 rgba(0, 90, 226, 0); }
        }

        .comp-card {
          padding: 60px 48px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
        }
        .comp-card:hover {
          transform: translateY(-8px);
          animation: stroke-glow 2s infinite;
        }
        .comp-card-dark { background: var(--bg-dark); color: white; }
        .comp-card-light { background: #F1F5F9; color: var(--text-black); }

        .orbit-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 40px -15px rgba(0,0,0,0.08);
          height: 100%;
          cursor: default;
          border: 1px solid #F1F5F9;
        }
        .orbit-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.12);
          border: 2px solid var(--primary-blue);
        }

        /* Custom Checkbox */
        .custom-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .custom-checkbox:hover {
          border-color: var(--primary-blue);
          background: #F0F7FF;
        }
        .custom-checkbox input {
          display: none;
        }
        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #CBD5E1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: white;
          flex-shrink: 0;
        }
        .custom-checkbox input:checked + .checkmark {
          background: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .custom-checkbox input:checked + .checkmark::after {
          content: "";
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-bottom: 2px;
        }
        .custom-checkbox:has(input:checked) {
          border-color: var(--primary-blue);
          background: #F0F7FF;
          color: var(--primary-blue);
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--primary-blue);
          background: white;
          box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.1);
        }
        .comp-card-light:hover { background: #FFFFFF; border: 1px solid #E2E8F0; }

        /* Metrics Styling */
        .metric-value {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--primary-blue);
          line-height: 1;
          margin-bottom: 12px;
        }
        .metric-bar {
          height: 4px;
          width: 60px;
          background: var(--primary-blue);
          margin: 12px auto 20px auto;
          border-radius: 2px;
        }

        /* Evaluation Steps */
        .step-number {
          font-size: 4rem;
          font-weight: 800;
          color: #E2E8F0;
          line-height: 1;
          margin-bottom: 16px;
          transition: color 0.3s ease;
        }
        .step-number:hover {
          color: var(--primary-blue);
          opacity: 0.2;
        }

        .section-dark {
          background-color: var(--bg-dark);
          color: white;
          border-radius: 64px;
          margin: 0 24px;
        }

        /* Outcomes Section Cards */
        .outcome-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid #F1F5F9;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
          cursor: pointer;
        }
        .outcome-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary-blue);
          box-shadow: 0 20px 40px -10px rgba(0, 90, 226, 0.1);
        }
        .outcome-placeholder {
          border: 2px dashed #CBD5E1;
          padding: 24px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 180px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .outcome-placeholder:hover {
          border-color: var(--primary-blue);
          background: #F8FAFC;
          transform: translateY(-8px);
        }

        .participation-card {
          background: white;
          padding: 48px 40px;
          border-radius: 32px;
          border: 1px solid #F1F5F9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .participation-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary-blue);
          box-shadow: 0 40px 80px -20px rgba(0, 90, 226, 0.12);
        }

        @media (max-width: 991px) {
          .grid-4 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; gap: 32px; }
          .section-container { padding: 60px 24px; }
          .hero-title { font-size: 2.5rem; }
          .comp-card { padding: 40px 24px; }
        }
      `}} />

      <Header />

      <div className="investors-page">
        {/* Hero Section */}
      <section className="section-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '160px' }}>
        <div style={{ maxWidth: '900px' }}>
          <div style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.15em', marginBottom: '24px', textTransform: 'uppercase' }}>
            <EditableText contentKey="investors.hero.eyebrow" value="STRATEGIC FUTURISM" />
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '24px' }}>
            <EditableText contentKey="investors.hero.title1" value="Not Just Capital." /><br />
            <EditableText contentKey="investors.hero.title2" value="Build With Us." />
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <EditableText 
              as="p"
              contentKey="investors.hero.subheading"
              value="A different kind of engagement for high-conviction individuals. Crestcode Product Studio connects institutional operators with early-stage hypergrowth ventures."
              style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6', fontWeight: 500, maxWidth: '700px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/contact" className="btn-pill btn-primary">
              <EditableText contentKey="investors.hero.ctaPrimary" value="Become an Operator-Investor" />
            </Link>
            <a href="#more" className="btn-pill btn-secondary">
              <EditableText contentKey="investors.hero.ctaSecondary" value="View Our Model" />
            </a>
          </div>
        </div>
      </section>

      {/* Active Builders Section */}
      <section className="section-container" id="more" style={{ padding: '60px 24px' }}>
        <div className="grid-2" style={{ gap: '60px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Active Builders" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '-20px', 
              right: '-10px', 
              background: 'black', 
              color: 'white', 
              padding: '30px', 
              borderRadius: '20px', 
              maxWidth: '280px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
              zIndex: 2
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4', margin: 0 }}>
                <EditableText contentKey="investors.builders.quote" value='"Passive capital is a commodity. Strategic execution is the alpha."' />
              </p>
            </div>
          </div>
          <div style={{ paddingLeft: '0' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', lineHeight: '1.1' }}>
              <EditableText contentKey="investors.builders.title" value="From Passive Capital to Active Builders" />
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6', fontWeight: 500 }}>
              <EditableText contentKey="investors.builders.description" value="We believe that capital alone is no longer a competitive advantage. The modern venture landscape demands builders who have seen the patterns of scale before." />
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-blue)', background: '#F0F5FF', padding: '10px', borderRadius: '12px' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <div>
                  <h4 style={{ marginBottom: '4px', fontSize: '1.1rem', fontWeight: 800 }}>
                    <EditableText contentKey="investors.builders.feature1.title" value="Execution Focus" />
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                    <EditableText contentKey="investors.builders.feature1.desc" value="Move beyond quarterly reports. Influence the product roadmap directly." />
                  </p>
                </div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-blue)', background: '#F0F5FF', padding: '10px', borderRadius: '12px' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657-5.657l1.414-1.414m-14.142 14.142l1.414-1.414m0-14.142l-1.414-1.414m14.142 14.142l-1.414-1.414M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>
                </div>
                <div>
                  <h4 style={{ marginBottom: '4px', fontSize: '1.1rem', fontWeight: 800 }}>
                    <EditableText contentKey="investors.builders.feature2.title" value="Operator Network" />
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                    <EditableText contentKey="investors.builders.feature2.desc" value="Deploy your specific expertise where it moves the needle most." />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="section-container" style={{ background: '#F8FAFC', borderRadius: '40px', margin: '40px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <h2 style={{ fontSize: '2.75rem', marginBottom: '16px' }}>
            <EditableText contentKey="investors.architecture.title" value="An Architecture for Experts" />
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <EditableText contentKey="investors.architecture.subtitle" value="We partner with individuals who bring more than a checkbook to the table." />
          </p>
        </div>
        <div className="grid-4">
          {[
            { title: "Former Founders", desc: "Those who have exited and want to build again without the 0-to-1 grind.", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 7H13Z"/></svg> },
            { title: "Operators & CXOs", desc: "Scaling experts from unicorn-stage companies looking for diversification.", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
            { title: "Domain Experts", desc: "Specialists in deep tech, logistics, or fintech who can de-risk technical roadmaps.", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg> },
            { title: "Strategic Angels", desc: "Seasoned investors who prefer the high-touch studio model over spray-and-pray.", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> }
          ].map((card, idx) => (
            <div key={idx} className="card-standard" style={{ borderRadius: '20px', padding: '32px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F0F5FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', marginBottom: '24px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
                <EditableText contentKey={`investors.architecture.cards.${idx}.title`} value={card.title} />
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 500 }}>
                <EditableText contentKey={`investors.architecture.cards.${idx}.desc`} value={card.desc} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tier Section (Studio vs Startup) */}
      <section className="section-container">
        <div className="grid-2" style={{ gap: '32px', alignItems: 'stretch' }}>
          {/* Card 1: Studio-Level */}
          <div className="comp-card" style={{ 
            background: 'black', color: 'white', position: 'relative', overflow: 'hidden', padding: '48px 40px', borderRadius: '24px',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.studio.title" value="Studio-Level" />
            </h2>
            <p style={{ color: '#94A3B8', marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.studio.description" value="Invest in the infrastructure. Gain fractional equity across every venture Crestcode launches." />
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', position: 'relative', zIndex: 2 }}>
              {['Diversified Exposure', 'Operational Upside', 'Governance Role'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px', alignItems: 'center', fontWeight: 600 }}>
                  <svg width="20" height="20" fill="none" stroke="#10B981" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  <EditableText contentKey={`investors.tiers.studio.points.${i}`} value={pt} />
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-pill btn-secondary" style={{ textAlign: 'center', background: 'white', color: 'black', border: 'none', width: 'fit-content', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.studio.cta" value="Invest in Studio" />
            </Link>
          </div>

          {/* Card 2: Startup-Level */}
          <div className="comp-card" style={{ 
            background: '#F8FAFC', color: 'black', position: 'relative', overflow: 'hidden', padding: '48px 40px', borderRadius: '24px',
            backgroundImage: 'linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.95)), url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.startup.title" value="Startup-Level" />
            </h2>
            <p style={{ color: '#4B5563', marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.startup.description" value="High-conviction bets on specific incubated ventures where your domain expertise is a direct catalyst." />
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', position: 'relative', zIndex: 2 }}>
              {['Targeted Impact', 'Domain Alignment', 'Direct Advisor Role'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px', alignItems: 'center', fontWeight: 600, position: 'relative', zIndex: 2 }}>
                  <svg width="20" height="20" fill="none" stroke="var(--primary-blue)" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  <EditableText contentKey={`investors.tiers.startup.points.${i}`} value={pt} />
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-pill btn-primary" style={{ textAlign: 'center', width: 'fit-content', position: 'relative', zIndex: 2 }}>
              <EditableText contentKey="investors.tiers.startup.cta" value="Invest in Venture" />
            </Link>
          </div>
        </div>
      </section>

      {/* Operator Advantage */}
      <section className="section-container">
        <h2 style={{ fontSize: '2.75rem', textAlign: 'center', marginBottom: '60px' }}>
          <EditableText contentKey="investors.advantage.title" value="The Operator Advantage" />
        </h2>
        <div className="grid-4">
          {[
            { title: "Product Strategy", desc: "Review roadmaps, participate in design sprints, and validate feature priorities with market reality." },
            { title: "Mentorship", desc: "Guide young studio-hired founders through the psychological and operational hurdles of early growth." },
            { title: "GTM Decisions", desc: "Open your network and help define the high-velocity sales and marketing playbooks." },
            { title: "Scaling Frameworks", desc: "Implement organizational structures and operational rhythms that you've mastered elsewhere." }
          ].map((card, idx) => (
            <div key={idx} className="advantage-card" style={{ padding: '32px 24px', borderRadius: '20px', background: '#F8FAFC', borderLeft: '4px solid var(--primary-blue)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>
                <EditableText contentKey={`investors.advantage.cards.${idx}.title`} value={card.title} />
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 500 }}>
                <EditableText contentKey={`investors.advantage.cards.${idx}.desc`} value={card.desc} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pathway Section */}
      <section style={{ background: 'black', color: 'white', padding: '80px 24px' }}>
        <div className="section-container grid-2" style={{ gap: '60px', padding: 0 }}>
          <div>
             <h2 style={{ fontSize: '2.75rem', marginBottom: '24px' }}>
               <EditableText contentKey="investors.pathway.title" value="The Pathway to CEO" />
             </h2>
             <p style={{ fontSize: '1.1rem', color: '#94A3B8', marginBottom: '40px', lineHeight: '1.6' }}>
               <EditableText contentKey="investors.pathway.description" value="For the right investor, the studio offers a unique transition. Move from strategic advisor to venture CEO as the startup hits its growth inflection point." />
             </p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ minWidth: '40px', height: '40px', background: 'var(--primary-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>
                <EditableText contentKey="investors.pathway.step1.num" value="1" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 0 }}>
                  <EditableText contentKey="investors.pathway.step1.title" value="Advisory Phase:" />{' '}
                  <span style={{ fontWeight: 500, color: '#94A3B8' }}>
                    <EditableText contentKey="investors.pathway.step1.desc" value="Engage with a venture during its incubation." />
                  </span>
                </h4>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ minWidth: '40px', height: '40px', background: 'var(--primary-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>
                <EditableText contentKey="investors.pathway.step2.num" value="2" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 0 }}>
                  <EditableText contentKey="investors.pathway.step2.title" value="Operational Shift:" />{' '}
                  <span style={{ fontWeight: 500, color: '#94A3B8' }}>
                    <EditableText contentKey="investors.pathway.step2.desc" value="Transition into a full-time leadership role." />
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80" alt="Pathway" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="section-container grid-2" style={{ alignItems: 'flex-start', gap: '60px' }}>
        <div>
          <h2 style={{ fontSize: '2.75rem', marginBottom: '24px' }}>
            <EditableText contentKey="investors.outcomes.title" value="Asymmetric Outcomes" />
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6', fontWeight: 500 }}>
            <EditableText contentKey="investors.outcomes.description" value="Our model is built for significant multiples, de-risked by operational excellence." />
          </p>
          <div style={{ background: '#E2E8F0', padding: '40px 32px', borderRadius: '24px', maxWidth: '280px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-blue)', lineHeight: '1' }}>
              <EditableText contentKey="investors.outcomes.multiplier" value="12.4x">
                <CountUp end={12.4} decimals={1} />
              </EditableText>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'black', marginTop: '12px' }}>
              <EditableText contentKey="investors.outcomes.multiplierLabel" value="Average Follow-on Valuation Multiplier" />
            </p>
          </div>
        </div>
        <div className="grid-3" style={{ gap: '20px' }}>
          {[
            { icon: 'L1', title: 'LogiFlow AI', sub: 'SaaS', progress: 80 },
            { icon: 'V', title: 'Veritas Health', sub: 'ML', progress: 65 },
            { icon: 'K', title: 'Kernal Core', sub: 'Cyber', progress: 40 },
            { icon: 'N', title: 'Nexus Prop', sub: 'Fintech', progress: 55 },
            { icon: 'A', title: 'Arcade Commerce', sub: 'Retail', progress: 30 }
          ].map((item, idx) => (
            <div key={idx} className="outcome-card">
              <div>
                <div style={{ width: '32px', height: '32px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px', fontWeight: 800 }}>
                  <EditableText contentKey={`investors.outcomes.ventures.${idx}.title`} value={item.title} />
                </h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <EditableText contentKey={`investors.outcomes.ventures.${idx}.sub`} value={item.sub} />
                </p>
              </div>
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--primary-blue)', width: `${item.progress}%` }}></div>
              </div>
            </div>
          ))}
          <div className="outcome-placeholder">
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>
              <EditableText contentKey="investors.outcomes.placeholder" value="NEXT VENTURE INCUBATION" />
            </p>
          </div>
        </div>
      </section>

      {/* Flexible Participation */}
      <section style={{ background: '#F8FAFC', padding: '80px 24px' }}>
        <div className="section-container" style={{ padding: 0 }}>
          <h2 style={{ fontSize: '2.75rem', textAlign: 'center', marginBottom: '60px' }}>
            <EditableText contentKey="investors.participation.title" value="Flexible Participation" />
          </h2>
          <div className="grid-2" style={{ gap: '32px' }}>
            <div className="participation-card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                <EditableText contentKey="investors.participation.card1.title" value="Direct Equity" />
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
                <EditableText contentKey="investors.participation.card1.description" value="Standard cap table participation with clearly defined rights." />
              </p>
              <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: 800, textDecoration: 'none' }}>
                <EditableText contentKey="investors.participation.card1.link" value="Preferred Stock Terms" />
              </a>
            </div>
            <div className="participation-card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                <EditableText contentKey="investors.participation.card2.title" value="Studio Credits" />
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
                <EditableText contentKey="investors.participation.card2.description" value='Contribute expertise as "Sweat Equity" alongside your capital.' />
              </p>
              <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: 800, textDecoration: 'none' }}>
                <EditableText contentKey="investors.participation.card2.link" value="Performance Based" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Execution Over Speculation */}
      <section className="section-container">
        <h2 style={{ fontSize: '2.75rem', textAlign: 'center', marginBottom: '60px' }}>
          <EditableText contentKey="investors.execution.title" value="Execution Over Speculation" />
        </h2>
        <div className="grid-4" style={{ gap: '32px' }}>
          {[
            { num: '01', title: 'Speed to Market', desc: 'Studio infrastructure reduces time to market by 40%.' },
            { num: '02', title: 'Talent Density', desc: 'Centralized engineering and design teams ensure quality.' },
            { num: '03', title: 'Shared Resources', desc: 'Legal and back-office costs are shared across portfolio.' },
            { num: '04', title: 'Lower Failure Rates', desc: 'Systematic validation gates ensure commercial potential.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'transparent', border: 'none', padding: 0, minHeight: 'auto' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#E2E8F0', lineHeight: '1', marginBottom: '16px' }}>
                <EditableText contentKey={`investors.execution.items.${idx}.num`} value={item.num} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>
                <EditableText contentKey={`investors.execution.items.${idx}.title`} value={item.title} />
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 500 }}>
                <EditableText contentKey={`investors.execution.items.${idx}.desc`} value={item.desc} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Repeatable Engine */}
      <section className="section-container" style={{ padding: '60px 24px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '40px', 
          overflow: 'hidden', 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)',
          border: '1px solid #F1F5F9',
          minHeight: '450px'
        }}>
          <div style={{ padding: '80px 60px' }}>
            <h2 style={{ fontSize: '2.75rem', marginBottom: '24px' }}>
              <EditableText contentKey="investors.engine.title" value="The Repeatable Engine" />
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.7' }}>
              <EditableText contentKey="investors.engine.description" value="Our partnership with leading tech universities ensures a constant pipeline of breakthrough IP and hungry, world-class engineering talent." />
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['University R&D Bridge', 'Talent Pipeline', 'IP Moat'].map((p, i) => (
                <span key={i} style={{ background: '#F1F5F9', padding: '10px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                  <EditableText contentKey={`investors.engine.tags.${i}`} value={p} />
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="/repeatable_engine_v2.png" alt="Repeatable Engine" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Choose Your Orbit (Tiers) */}
      <section className="section-container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>
          <EditableText contentKey="investors.orbit.title" value="Choose Your Orbit" />
        </h2>
        <div className="grid-3" style={{ gap: '24px', alignItems: 'center' }}>
          <div className="orbit-card" style={{ background: 'white', padding: '48px 32px', borderRadius: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              <EditableText contentKey="investors.orbit.passive.title" value="Passive" />
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '32px' }}>
              <EditableText contentKey="investors.orbit.passive.quote" value='"Deploy and Watch"' />
            </p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              {['Quarterly Reports', 'Annual Meeting', 'Exit Rights'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--primary-blue)' }}></div>
                  <EditableText contentKey={`investors.orbit.passive.points.${i}`} value={pt} />
                </li>
              ))}
            </ul>
          </div>

          <div className="orbit-card orbit-card-recommended" style={{ 
            background: 'white', padding: '56px 32px', borderRadius: '24px', textAlign: 'center',
            position: 'relative', zIndex: 2
          }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-blue)', color: 'white', padding: '4px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>
              <EditableText contentKey="investors.orbit.strategic.label" value="RECOMMENDED" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              <EditableText contentKey="investors.orbit.strategic.title" value="Strategic" />
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '32px' }}>
              <EditableText contentKey="investors.orbit.strategic.quote" value='"The Operator-Investor"' />
            </p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              {['Advisory Council Seat', 'Deal Flow Preview', 'Product Feedback Sprints'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--primary-blue)' }}></div>
                  <EditableText contentKey={`investors.orbit.strategic.points.${i}`} value={pt} />
                </li>
              ))}
            </ul>
          </div>

          <div className="orbit-card" style={{ background: 'white', padding: '48px 32px', borderRadius: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              <EditableText contentKey="investors.orbit.active.title" value="Active" />
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '32px' }}>
              <EditableText contentKey="investors.orbit.active.quote" value='"Venture Partner"' />
            </p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              {['Fractional Leadership', 'Direct Incubation Access', 'Carry/Bonus Participation'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--primary-blue)' }}></div>
                  <EditableText contentKey={`investors.orbit.active.points.${i}`} value={pt} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section className="section-container grid-2" style={{ background: '#FFFFFF', alignItems: 'flex-start', gap: '100px' }}>
        <div>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '24px', lineHeight: '1.1', fontWeight: 800 }}>
            <EditableText contentKey="investors.cta.title" value="Don't Just Invest in Startups. Build Them." />
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 500, marginBottom: '48px', maxWidth: '500px' }}>
            <EditableText contentKey="investors.cta.description" value="Join an elite circle of builders, operators, and visionary investors reshaping the architecture of innovation." />
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { num: '1', text: 'Exclusive Early Access to Incubations' },
              { num: '2', text: 'Proprietary Strategic Intel Reports' },
              { num: '3', text: 'Invite-Only Executive Summits' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ 
                  background: '#F1F5F9', 
                  color: 'var(--text-black)', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 800
                }}>
                  {item.num}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-black)' }}>
                  <EditableText contentKey={`investors.cta.features.${i}`} value={item.text} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ 
          background: '#FFFFFF', 
          padding: '60px 48px', 
          borderRadius: '40px', 
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)', 
          border: '1px solid #F1F5F9',
          width: '100%'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '80px', height: '80px', background: '#F0FDF4', color: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Application Received!</h3>
              <p style={{ color: '#64748B', fontSize: '1.125rem', marginBottom: '32px' }}>Thank you for your interest. Our investment team will review your background and reach out within 48 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn-pill btn-primary"
                style={{ border: 'none', cursor: 'pointer', padding: '16px 32px' }}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', fontWeight: 800 }}>
                <EditableText contentKey="investors.form.title" value="Join as an Operator-Investor" />
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="grid-2" style={{ gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <EditableText contentKey="investors.form.labelName" value="Full Name" />
                    </label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="form-input" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <EditableText contentKey="investors.form.labelEmail" value="Email Address" />
                    </label>
                    <input 
                      type="email" 
                      placeholder="john@operator.vc" 
                      className="form-input" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <EditableText contentKey="investors.form.labelExpertise" value="Domain Expertise" />
                  </label>
                  <select 
                    className="form-input" 
                    style={{ appearance: 'none' }}
                    value={formData.expertise}
                    onChange={e => setFormData({...formData, expertise: e.target.value})}
                  >
                    {['Product Strategy', 'Engineering / Architecture', 'GTM / Sales', 'Finance / M&A', 'Legal / Compliance'].map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>
                    <EditableText contentKey="investors.form.labelRole" value="Preferred Role" />
                  </label>
                  <div className="grid-2" style={{ gap: '12px' }}>
                    {['Investor Only', 'Strategic Advisor', 'Venture CEO', 'Network Partner'].map((role, idx) => (
                      <label key={idx} className="custom-checkbox">
                        <input 
                          type="checkbox" 
                          checked={formData.preferredRoles.includes(role)}
                          onChange={() => handleRoleChange(role)}
                        />
                        <div className="checkmark"></div>
                        <EditableText contentKey={`investors.form.roles.options.${idx}`} value={role} />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <EditableText contentKey="investors.form.labelBackground" value="Tell us about your builder background" />
                  </label>
                  <textarea 
                    placeholder="Tell us about your builder background..." 
                    className="form-input" 
                    style={{ minHeight: '120px', resize: 'none' }} 
                    value={formData.background}
                    onChange={e => setFormData({...formData, background: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="btn-pill btn-primary" style={{ width: '100%', border: 'none', cursor: 'pointer', padding: '18px', fontSize: '1rem', marginTop: '8px' }}>
                  <EditableText contentKey="investors.form.submit" value="Submit Application" />
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  </>
  );
}
