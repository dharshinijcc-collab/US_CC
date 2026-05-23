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
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9FB', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header />
      {/* Header Section */}
      <section className="text-center px-5 pt-[100px] pb-[60px]">
        <EditableText
          contentKey="resources.events.header.label"
          value={eventsContent.header?.label || 'Curated Gatherings'}
          className="text-[#005AE2] text-[12px] font-bold tracking-[0.2em] uppercase mb-5"
          as="p"
        />
        <h1 className="text-[48px] font-extrabold text-[#0A0F1C] mb-5 leading-tight">
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
          className="text-[#64748B] max-w-[500px] mx-auto text-[16px] leading-[1.6]"
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
                className="text-[#005AE2] text-[11px] font-bold tracking-[0.1em]"
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
                className="text-[14px] text-[#64748B] leading-[1.6] mb-[30px] flex-grow"
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
            className="text-[16px] font-semibold mb-4"
            as="h4"
          />
          <div className="flex justify-between items-center flex-wrap gap-5">
            <EditableText
              contentKey="resources.events.cta.description"
              value={eventsContent.cta?.description || 'Join our registry to be considered for upcoming curated events and private studio launches.'}
              className="text-[#94A3B8] text-[14px] max-w-[400px]"
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
  );
}
