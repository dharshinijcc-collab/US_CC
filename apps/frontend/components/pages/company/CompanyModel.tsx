'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, ArrowRight, Shield, Award, Lightbulb, Compass, Zap
} from 'lucide-react';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';




export default function CompanyModel({ companyContent, homeContent }: any) {
  return (
    <section className="section-dark" style={{ position: 'relative' }}>
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="dark-grid">
              <div className="dark-content">
                <EditableText
                  as="h3"
                  contentKey="home.partnership.eyebrow"
                  value={homeContent?.partnership?.eyebrow || 'WE AS CO-FOUNDERS'}
                  className="section-eyebrow"
                />
                <EditableText
                  as="h2"
                  contentKey="home.partnership.title"
                  value={homeContent?.partnership?.title || 'Make Innovation Accessible.'}
                  className="section-title text-white"
                />
                <div className="feature-list">
                  {(homeContent?.partnership?.features || []).map((feature: any, idx: number) => (
                    <div key={idx} className="feature-item">
                      <div className="feature-bullet">&#x2713;</div>
                      <div>
                        <EditableText
                          as="h4"
                          contentKey={`home.partnership.features.${idx}.title`}
                          value={feature.title}
                          className="feature-title"
                        />
                        <EditableText
                          as="p"
                          contentKey={`home.partnership.features.${idx}.description`}
                          value={feature.description}
                          className="feature-desc"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <BorderBeam className="testimonial-card-dark cc-reveal cc-delay-2 cc-card-3d cc-card-3d-dark cc-shine" style={{ padding: 0 }}>
                <div style={{ padding: '32px', height: '100%' }}>
                  <EditableText
                    as="p"
                    contentKey="home.partnership.testimonial.quote"
                    value={homeContent?.partnership?.testimonial?.quote || ''}
                    className="t-card-quote"
                  />
                  <div className="t-card-author">
                    <div className="t-avatar"></div>
                    <div>
                      <EditableText
                        contentKey="home.partnership.testimonial.author"
                        value={homeContent?.partnership?.testimonial?.author || ''}
                        className="t-name"
                      />
                      <EditableText
                        contentKey="home.partnership.testimonial.role"
                        value={homeContent?.partnership?.testimonial?.role || ''}
                        className="t-role"
                      />
                    </div>
                  </div>
                </div>
              </BorderBeam>
            </div>
          </div>
        </section>
  );
}
