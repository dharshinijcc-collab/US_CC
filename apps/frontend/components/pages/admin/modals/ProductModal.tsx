'use client';

import React from 'react';
import { X, Upload } from 'lucide-react';
import type { PartnerProduct } from '../types/admin.types';

interface ProductModalProps {
  editingProduct: Partial<PartnerProduct>;
  setEditingProduct: (p: Partial<PartnerProduct> | null) => void;
  onClose: () => void;
  onSave: () => void;
  saveStatus: string;
  imageUploading: boolean;
  handlePortfolioFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
  ds: Record<string, React.CSSProperties>;
}

export default function ProductModal({ editingProduct, setEditingProduct, onClose, onSave, saveStatus, imageUploading, handlePortfolioFileUpload, ds }: ProductModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={{ ...ds.modalCard, maxWidth: 700 }}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#F1F5F9' }}>{editingProduct.id ? 'Edit Partner Product' : 'Add Partner Product'}</h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={ds.modalBody}>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Product Name</label>
            <input type="text" style={ds.input} value={editingProduct.name || ''} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="e.g. FamilyHub" />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Status Type</label>
              <select style={ds.input} value={editingProduct.status_type || 'live'} onChange={e => setEditingProduct({ ...editingProduct, status_type: e.target.value })}>
                <option value="live">Live</option>
                <option value="beta">Beta</option>
                <option value="building">Building</option>
              </select>
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Status Text</label>
              <input type="text" style={ds.input} value={editingProduct.status_text || ''} onChange={e => setEditingProduct({ ...editingProduct, status_text: e.target.value })} placeholder="e.g. Live" />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Status Subtext (optional)</label>
              <input type="text" style={ds.input} value={editingProduct.status_subtext || ''} onChange={e => setEditingProduct({ ...editingProduct, status_subtext: e.target.value || null })} placeholder="e.g. Web ready" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Card Tagline</label>
              <input type="text" style={ds.input} value={editingProduct.tagline || ''} onChange={e => setEditingProduct({ ...editingProduct, tagline: e.target.value })} placeholder="e.g. Family connectivity" />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Card Subtitle</label>
              <input type="text" style={ds.input} value={editingProduct.subtitle || ''} onChange={e => setEditingProduct({ ...editingProduct, subtitle: e.target.value })} placeholder="e.g. One connected platform..." />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Stat Value</label>
              <input type="text" style={ds.input} value={editingProduct.stat_value || ''} onChange={e => setEditingProduct({ ...editingProduct, stat_value: e.target.value })} placeholder="e.g. 2,400+ families" />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Stat Subtext</label>
              <input type="text" style={ds.input} value={editingProduct.stat_subtext || ''} onChange={e => setEditingProduct({ ...editingProduct, stat_subtext: e.target.value })} placeholder="e.g. onboarded within 90 days" />
            </div>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.formLabel}>What We Did (Detailed Scope)</label>
            <textarea style={ds.textarea} rows={3} value={editingProduct.what_we_did || ''} onChange={e => setEditingProduct({ ...editingProduct, what_we_did: e.target.value })} placeholder="Describe CrestCode's contribution and achievements..." />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Industry</label>
              <input type="text" style={ds.input} value={editingProduct.industry || ''} onChange={e => setEditingProduct({ ...editingProduct, industry: e.target.value })} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Duration</label>
              <input type="text" style={ds.input} value={editingProduct.duration || ''} onChange={e => setEditingProduct({ ...editingProduct, duration: e.target.value })} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Team Size</label>
              <input type="text" style={ds.input} value={editingProduct.team_size || ''} onChange={e => setEditingProduct({ ...editingProduct, team_size: e.target.value })} />
            </div>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Tech Stack Tags (Comma separated)</label>
            <input type="text" style={ds.input} value={Array.isArray(editingProduct.tech_stack) ? editingProduct.tech_stack.join(', ') : ''} onChange={e => setEditingProduct({ ...editingProduct, tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="e.g. Next.js, Node.js, PostgreSQL" />
          </div>

          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Feature Bullet Points (one per line)</label>
            <textarea style={ds.textarea} rows={3} value={Array.isArray(editingProduct.features) ? editingProduct.features.map((f: any) => f.text).join('\n') : ''} onChange={e => setEditingProduct({ ...editingProduct, features: e.target.value.split('\n').filter(Boolean).map(text => ({ text })) })} placeholder="Planner & calendars&#13;Shared finances" />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Website URL</label>
              <input type="text" style={ds.input} value={editingProduct.website_url || ''} onChange={e => setEditingProduct({ ...editingProduct, website_url: e.target.value || null })} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Product Logo</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} id="product-logo-upload" onChange={e => handlePortfolioFileUpload(e, url => setEditingProduct({ ...editingProduct, logo_url: url }))} />
                <label htmlFor="product-logo-upload" style={ds.uploadLabelBtn}><Upload size={14} /> Logo</label>
                <input type="text" style={{ ...ds.input, flex: 1 }} value={editingProduct.logo_url || ''} onChange={e => setEditingProduct({ ...editingProduct, logo_url: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Gallery Screenshot URLs (one per line)</label>
            <textarea style={ds.textarea} rows={3} value={Array.isArray(editingProduct.gallery_images) ? editingProduct.gallery_images.join('\n') : ''} onChange={e => setEditingProduct({ ...editingProduct, gallery_images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} placeholder="Enter screenshot links..." />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input type="file" accept="image/*" id="product-gallery-upload" style={{ display: 'none' }} onChange={e => handlePortfolioFileUpload(e, url => { const arr = Array.isArray(editingProduct.gallery_images) ? [...editingProduct.gallery_images] : []; setEditingProduct({ ...editingProduct, gallery_images: [...arr, url] }); })} />
              <label htmlFor="product-gallery-upload" style={{ ...ds.uploadLabelBtn, margin: 0 }}><Upload size={14} /> Upload and Add Screenshot to Gallery</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="prod-active-check" checked={editingProduct.is_active ?? true} onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} />
            <label htmlFor="prod-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display product as active in public site</label>
          </div>
        </div>

        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={ds.saveButton} onClick={onSave} disabled={saveStatus === 'saving' || imageUploading}>
            {saveStatus === 'saving' ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
