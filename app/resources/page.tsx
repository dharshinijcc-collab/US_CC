'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Wrench, BookOpen, Calendar } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #F9F9FB;
        }

        h1, h2, h3 {
          font-family: 'Manrope', sans-serif;
        }

        .section-eyebrow {
          color: #005AE2;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          margin-bottom: 16px;
          filter: blur(0.5px);
          text-shadow: 0 0 10px rgba(0, 90, 226, 0.3);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: clamp(16px, 3vw, 24px);
          line-height: 1.1;
          color: #0A0F1C;
        }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: #64748B;
          font-weight: 500;
        }

        .resource-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 48px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: block;
        }

        .resource-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0, 90, 226, 0.15);
          border-color: rgba(0, 90, 226, 0.3);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-blue {
          background: rgba(0, 90, 226, 0.1);
          color: #005AE2;
        }

        .icon-purple {
          background: rgba(79, 70, 229, 0.1);
          color: #4F46E5;
        }

        .icon-teal {
          background: rgba(13, 148, 136, 0.1);
          color: #0D9488;
        }
        `
      }} />
      
      <Header />
      
      <div className="min-h-screen">
        {/* Header Section */}
        <section className="text-center px-5 pt-[130px] pb-[60px]">
          <p className="section-eyebrow">RESOURCES</p>
          <h1 className="section-title">
            Knowledge / <span className="text-[#005AE2]">Hub</span>
          </h1>
          <p className="body-text max-w-[600px] mx-auto">
            Explore our curated collection of tools, insights, and events designed to help founders and creators build better products.
          </p>
        </section>

        {/* Resources Grid */}
        <section className="px-5 pb-[100px] max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tools Card */}
            <Link href="/resources/tools" className="resource-card">
              <div className="icon-box icon-blue">
                <Wrench size={32} strokeWidth={2} />
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#0A0F1C] mb-4">
                Studio Tools
              </h3>
              <p className="body-text">
                Validate ideas, assess market fit, and de-risk your roadmap with our proprietary venture assessment framework.
              </p>
            </Link>

            {/* Blogs Card */}
            <Link href="/blogs" className="resource-card">
              <div className="icon-box icon-purple">
                <BookOpen size={32} strokeWidth={2} />
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#0A0F1C] mb-4">
                Insights & Blog
              </h3>
              <p className="body-text">
                Deep dives into product development, startup strategies, and the future of digital product engineering.
              </p>
            </Link>

            {/* Events Card */}
            <Link href="/resources/events" className="resource-card">
              <div className="icon-box icon-teal">
                <Calendar size={32} strokeWidth={2} />
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#0A0F1C] mb-4">
                Events
              </h3>
              <p className="body-text">
                Exclusive salons and experimental workshops designed for the modern creator, founder, and visionary architect.
              </p>
            </Link>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}
