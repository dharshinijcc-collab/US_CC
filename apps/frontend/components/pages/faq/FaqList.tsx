'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, MessageSquare, ArrowRight, Sparkles
} from 'lucide-react';
import BorderBeam from '@/components/effects/BorderBeam';




export default function FaqList({ faqContent, activeTab, setActiveTab, faqsData, openFaq, toggleFaq, magBtn2 }: any) {
  return (
    <section id="faq-section" style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">

            {/* Dynamic Category Rendering with Reordering */}
            {[
              { id: 'engagement', content: (
                <div id="engagement-group" className="faq-group cc-slide-left cc-delay-1">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.engagement.title"
                        value={faqContent.categories.engagement.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Studio track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'engagement') : faqContent.categories.engagement.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `engagement-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`engagement-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )},
              { id: 'product', content: (
                <div id="product-group" className="faq-group cc-slide-center cc-delay-2">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.product.title"
                        value={faqContent.categories.product.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Product track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'product') : faqContent.categories.product.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `product-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`product-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )},
              { id: 'security', content: (
                <div id="security-group" className="faq-group cc-slide-right cc-delay-3">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.security.title"
                        value={faqContent.categories.security.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Security track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'security') : faqContent.categories.security.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `sec-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`sec-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            ].sort((a, b) => (a.id === activeTab ? -1 : b.id === activeTab ? 1 : 0)).map(cat => cat.content)}

            {/* CTA Banner */}
            <BorderBeam className="cta-banner cc-reveal cc-delay-1 cc-shine" style={{ padding: 0 }}>
              <div style={{ 
                padding: '24px 24px', 
                textAlign: 'center', 
                width: '100%', 
                background: '#005AE2', 
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', color: '#FFFFFF' }} className="font-manrope">
                    <EditableText contentKey="faq.cta.title" value={faqContent.cta.title} />
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', fontWeight: 500, marginBottom: '40px', lineHeight: 1.6 }}>
                    <EditableText contentKey="faq.cta.subtitle" value={faqContent.cta.subtitle} />
                  </p>
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <button ref={magBtn2} className="cc-magnetic" style={{ backgroundColor: '#FFFFFF', color: '#005AE2', padding: '14px 32px', borderRadius: '100px', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' }}>
                      <EditableText contentKey="faq.cta.buttonText" value={faqContent.cta.buttonText} />
                    </button>
                  </Link>
                </div>
              </div>
            </BorderBeam>

          </div>
        </section>
  );
}
