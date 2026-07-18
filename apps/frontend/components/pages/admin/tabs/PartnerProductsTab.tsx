'use client';
import React from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus } from 'lucide-react';
import type { PartnerProduct } from '../types/admin.types';
import { ds } from '../ds';

interface PartnerProductsTabProps {
  partnerProducts: PartnerProduct[];
  openAddProduct: () => void;
  openEditProduct: (p: PartnerProduct) => void;
  handleDeleteProduct: (id: string) => void;
  moveProductOrder: (p: PartnerProduct, direction: 'up' | 'down') => void;
}

export default function PartnerProductsTab({ partnerProducts, openAddProduct, openEditProduct, handleDeleteProduct, moveProductOrder }: PartnerProductsTabProps) {
  return (
    <div style={ds.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={ds.cardTitle}>Manage Partner Products</h3>
        <button style={ds.addButton} onClick={openAddProduct}><Plus size={16} /> Add Product</button>
      </div>
      <div style={ds.tableContainer}>
        <table style={ds.table}>
          <thead>
            <tr>
              <th style={ds.th}>Name</th>
              <th style={ds.th}>Tagline</th>
              <th style={ds.th}>Status</th>
              <th style={ds.th}>Key Stat</th>
              <th style={ds.th}>Gallery</th>
              <th style={ds.th}>Order</th>
              <th style={ds.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partnerProducts.map((p, idx) => (
              <tr key={p.id} style={ds.tr}>
                <td style={ds.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.logo_url && <img src={p.logo_url} alt={p.name} style={{ width: 24, height: 24, borderRadius: 4 }} />}
                    <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{p.name}</span>
                  </div>
                </td>
                <td style={ds.td}><div style={{ fontSize: 13, color: '#94A3B8' }}>{p.tagline}</div><div style={{ fontSize: 11, color: '#64748B' }}>{p.subtitle}</div></td>
                <td style={ds.td}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: p.status_type === 'live' ? 'rgba(52,211,153,0.1)' : p.status_type === 'beta' ? 'rgba(251,191,36,0.1)' : 'rgba(96,165,250,0.1)', color: p.status_type === 'live' ? '#34D399' : p.status_type === 'beta' ? '#FBBF24' : '#60A5FA' }}>{p.status_text}</span></td>
                <td style={ds.td}><div style={{ color: '#F1F5F9', fontWeight: 600 }}>{p.stat_value}</div><div style={{ fontSize: 11, color: '#64748B' }}>{p.stat_subtext}</div></td>
                <td style={ds.td}><span style={{ fontSize: 12, color: '#64748B' }}>{Array.isArray(p.gallery_images) ? p.gallery_images.length : 0} screenshots</span></td>
                <td style={ds.td}><div style={{ display: 'flex', gap: 4 }}><button style={ds.orderBtn} onClick={() => moveProductOrder(p, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button><button style={ds.orderBtn} onClick={() => moveProductOrder(p, 'down')} disabled={idx === partnerProducts.length - 1}><ArrowDown size={14} /></button></div></td>
                <td style={ds.td}><div style={{ display: 'flex', gap: 8 }}><button style={ds.editBtn} onClick={() => openEditProduct(p)}><Edit size={14} /></button><button style={ds.deleteBtn} onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
