'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Compass, Cpu, Layers, Sparkles, Check, X, HelpCircle, ChevronDown, MessageSquare
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/effects/ScrollStack';




export default function StudioDifference({ studioContent, openFaqIdx, setOpenFaqIdx, renderCellText }: any) {
  return (
    <section id="diff" className="studio-difference-section" style={{ backgroundColor: '#EFF6FF' }}>
          <div className="diff-header">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <EditableText
                contentKey="studio.differentiation.eyebrow"
                value={studioContent.differentiation?.eyebrow || "Why CrestCode"}
                className="hero-eyebrow-pill"
              />
              <EditableText
                as="h2"
                contentKey="studio.differentiation.title"
                value={studioContent.differentiation?.title || "Not a vendor.\nNot a studio that vanishes.\nA co-builder."}
                className="section-title"
                style={{
                  color: '#0F172A',
                  margin: '0 auto 16px',
                  maxWidth: '800px',
                  whiteSpace: 'pre-line'
                }}
              />
              <EditableText
                as="p"
                contentKey="studio.differentiation.subtitle"
                value={studioContent.differentiation?.subtitle || "Here is how we compare to the alternatives — and why it matters for your venture."}
                className="section-subtitle"
                style={{
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>

          {/* Diff table: outer scroll wrapper for mobile, inner wrap for styling */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0px' }}>
          <div className="diff-table-wrap" style={{ marginBottom: 0 }}>
            <table className="diff-table">
              <thead>
                {(() => {
                  const defaultHeaders = ["Capability", "CrestCode", "Dev Agencies", "Other Studios", "Freelancers"];
                  const headers = studioContent.differentiation?.headers || defaultHeaders;
                  return (
                    <tr>
                      <th style={{ width: '28%' }}>
                        <EditableText contentKey="studio.differentiation.headers.0" value={headers[0]} />
                      </th>
                      <th className="highlight" style={{ width: '18%' }}>
                        <EditableText contentKey="studio.differentiation.headers.1" value={headers[1]} />
                      </th>
                      <th style={{ width: '18%' }}>
                        <EditableText contentKey="studio.differentiation.headers.2" value={headers[2]} />
                      </th>
                      <th style={{ width: '18%' }}>
                        <EditableText contentKey="studio.differentiation.headers.3" value={headers[3]} />
                      </th>
                      <th style={{ width: '18%' }}>
                        <EditableText contentKey="studio.differentiation.headers.4" value={headers[4]} />
                      </th>
                    </tr>
                  );
                })()}
              </thead>
              <tbody>
                {(() => {
                  const defaultDiffRows = [
                    { feature: "Zero to one expertise", c1: "✓", c2: "Sometimes", c3: "Sometimes", c4: "✗" },
                    { feature: "End-to-end product ownership", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                    { feature: "Strategic product & business guidance", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                    { feature: "MLP standard — not just MVP", c1: "✓", c2: "✗", c3: "Rarely", c4: "✗" },
                    { feature: "In-house senior team, no outsourcing", "c1": "✓", "c2": "Varies", "c3": "Varies", "c4": "✗" },
                    { feature: "Go-to-market & pitch support", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                    { feature: "Co-founder network access", c1: "✓", c2: "✗", c3: "✗", c4: "✗" },
                    { feature: "Lifelong partnership model", c1: "✓", c2: "✗", c3: "Rarely", c4: "✗" }
                  ];

                  const diffRows = (studioContent.differentiation?.rows || []).length > 0
                    ? studioContent.differentiation.rows
                    : defaultDiffRows;

                  return diffRows.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td className="feature">
                        <EditableText
                          contentKey={`studio.differentiation.rows.${idx}.feature`}
                          value={row.feature}
                        />
                      </td>
                      <td className="highlight">
                        <EditableText
                          contentKey={`studio.differentiation.rows.${idx}.c1`}
                          value={row.c1}
                        >
                          {renderCellText(row.c1)}
                        </EditableText>
                      </td>
                      <td>
                        <EditableText
                          contentKey={`studio.differentiation.rows.${idx}.c2`}
                          value={row.c2}
                        >
                          {renderCellText(row.c2)}
                        </EditableText>
                      </td>
                      <td>
                        <EditableText
                          contentKey={`studio.differentiation.rows.${idx}.c3`}
                          value={row.c3}
                        >
                          {renderCellText(row.c3)}
                        </EditableText>
                      </td>
                      <td>
                        <EditableText
                          contentKey={`studio.differentiation.rows.${idx}.c4`}
                          value={row.c4}
                        >
                          {renderCellText(row.c4)}
                        </EditableText>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          </div> {/* end outer scroll wrapper */}
        </section>
  );
}
