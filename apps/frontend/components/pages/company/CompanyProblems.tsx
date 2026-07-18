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




export default function CompanyProblems({ companyContent, problemsWeLove }: any) {
  return (
    <section className="problems-section">
          <div className="problems-container">
            <div className="problems-header">
              <h2 className="problems-title">
                <EditableText
                  contentKey="company.problems.title"
                  value={companyContent?.problems?.title || 'The Kind of Problems We Love'}
                />
              </h2>
              <p className="problems-subtitle">
                <EditableText
                  contentKey="company.problems.subtitle"
                  value={companyContent?.problems?.subtitle || 'We don\'t shy away from the hard ones.'}
                />
              </p>
            </div>

            <div className="problems-grid">
              {problemsWeLove.map((item, index) => (
                <div key={index} className="problem-card">
                  <div className="problem-icon">
                    {item.icon}
                  </div>
                  <h3 className="problem-card-title">
                    <EditableText
                      contentKey={`company.problems.items.${index}.title`}
                      value={item.title}
                    />
                  </h3>
                  <p className="problem-card-desc">
                    <EditableText
                      contentKey={`company.problems.items.${index}.desc`}
                      value={item.desc}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
}
