'use client';

import React from 'react';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const defaultEvents = [
  { month: 'JUNE', title: 'The Craft of Product', day: '14', desc: 'A deep-dive session into precision engineering and tactile design systems.' },
  { month: 'JULY', title: 'Founders Roundtable', day: '03', desc: 'Candid discussions on scaling culture and the philosophy of venture.' },
  { month: 'JULY', title: 'Form & Function', day: '19', desc: 'Exploring the intersection of industrial design and digital fluidity.' },
  { month: 'AUGUST', title: 'Intelligence by Design', day: '28', desc: 'Integrating generative models into human-centric creative workflows.' },
  { month: 'SEPTEMBER', title: 'Studio Retreat', day: '12', desc: 'An immersive weekend in the desert focused on strategic clarity.' },
  { month: 'OCTOBER', title: 'Late Night Pixels', day: '07', desc: 'After-hours collaborative hacking and generative visuals showcase.' },
];

export default function EventsPage() {
  const { content } = useContent();
  const eventsContent = content?.resources?.events || {};

  const events = eventsContent.items || defaultEvents;

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
          -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, h5, h6 {
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
          text-align: center;
          color: #0A0F1C;
        }

        .title-dark {
          color: #FFFFFF;
        }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: #64748B;
          font-weight: 500;
        }
        `
      }} />
      <div className="min-h-screen" style={{ backgroundColor: '#F9F9FB' }}>
      <Header />
      {/* Header Section */}
      <section className="text-center px-5 pt-[100px] pb-[60px]">
        <EditableText
          contentKey="resources.events.header.label"
          value={eventsContent.header?.label || 'Curated Gatherings'}
          className="section-eyebrow"
          as="p"
        />
        <h1 className="section-title">
          Where / ideas / <EditableText
            contentKey="resources.events.header.highlight"
            value={eventsContent.header?.highlight || 'convene.'}
            className="text-[#005AE2]"
            as="span"
          />
        </h1>
        <EditableText
          contentKey="resources.events.header.description"
          value={eventsContent.header?.description || 'Exclusive salons and experimental workshops designed for the modern creator, founder, and visionary architect.'}
          className="body-text max-w-[500px] mx-auto"
          as="p"
        />
      </section>

      {/* Events Grid */}
      <section className="px-5 pb-[80px] max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event: any, index: number) => (
            <div key={index} className="bg-white border border-[#E2E8F0] p-10 rounded-lg flex flex-col h-full">
              <EditableText
                contentKey={`resources.events.items.${index}.month`}
                value={event.month}
                className="section-eyebrow"
                as="div"
              />
              <EditableText
                contentKey={`resources.events.items.${index}.title`}
                value={event.title}
                className="text-[18px] font-semibold text-[#0A0F1C] mt-[10px]"
                as="h3"
              />
              <EditableText
                contentKey={`resources.events.items.${index}.day`}
                value={event.day}
                className="text-[80px] font-extrabold text-[#F1F5F9] my-5"
                as="div"
              />
              <EditableText
                contentKey={`resources.events.items.${index}.desc`}
                value={event.desc}
                className="body-text mb-[30px] flex-grow"
                as="p"
              />
              <button className="border border-[#CBD5E1] bg-transparent py-3 text-[12px] font-bold cursor-pointer tracking-[0.1em] hover:bg-[#F1F5F9] transition-colors">
                GET INVITED
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="px-5 pb-[100px] max-w-[1100px] mx-auto">
        <div className="bg-[#0A0F1C] text-white p-[60px] rounded-lg">
          <EditableText
            contentKey="resources.events.cta.title"
            value={eventsContent.cta?.title || 'An invitation only circle.'}
            className="section-title title-dark"
            as="h4"
          />
          <div className="flex justify-between items-center flex-wrap gap-5">
            <EditableText
              contentKey="resources.events.cta.description"
              value={eventsContent.cta?.description || 'Join our registry to be considered for upcoming curated events and private studio launches.'}
              className="body-text max-w-[400px]"
              as="p"
            />
            <button className="bg-[#005AE2] text-white border-none px-8 py-4 font-bold cursor-pointer hover:bg-[#004ac2] transition-colors">
              GET INVITED
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
    </>
  );
}