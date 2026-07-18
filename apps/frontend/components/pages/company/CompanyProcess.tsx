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




export default function CompanyProcess({ companyContent, processSteps }: any) {
  return (
    <section className="process-section">
          <div className="process-header-box">
            <h2 className="process-title">
              <EditableText
                contentKey="company.process.title"
                value={companyContent?.process?.title || 'How a Product Gets Born at Crestcode'}
              />
            </h2>
            <p className="process-subtitle">
              <EditableText
                contentKey="company.process.subtitle"
                value={companyContent?.process?.subtitle || 'Every product we\'ve shipped followed the same discipline.'}
              />
            </p>
          </div>

          <div className="process-list-container">
            {processSteps.map((step, index) => (
              <div key={index} className="process-item">
                <div className="process-icon">
                  {step.icon}
                </div>
                <div className="process-content">
                  <h4 className="process-item-title">
                    <span className="process-item-num">{step.num}</span>{' '}
                    <EditableText
                      contentKey={`company.process.steps.${index}.title`}
                      value={step.title}
                    />
                  </h4>
                  <p className="process-item-desc">
                    <EditableText
                      contentKey={`company.process.steps.${index}.desc`}
                      value={step.desc}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
  );
}
