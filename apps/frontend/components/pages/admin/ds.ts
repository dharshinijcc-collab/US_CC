import React from 'react';

const BLUE = '#3B82F6';
const DARK_BG = '#090D16';
const CARD_BG = '#0B132B';
const INPUT_BG = '#1C2541';

export const ds: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: DARK_BG,
    color: '#F1F5F9',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  sidebar: {
    width: 260,
    background: '#0B0F19',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg,#3B82F6,#7C3AED)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#F1F5F9',
    letterSpacing: '-0.01em'
  },
  sidebarUser: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto'
  },
  navLink: {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: 'none',
    textAlign: 'left',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navDivider: {
    fontSize: 10,
    fontWeight: 800,
    color: '#475569',
    letterSpacing: '0.08em',
    padding: '20px 20px 8px 20px',
    textTransform: 'uppercase'
  },
  sidebarFooter: {
    padding: 20,
    borderTop: '1px solid rgba(255,255,255,0.04)'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.06)',
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s'
  },
  content: {
    flex: 1,
    overflowY: 'auto'
  },
  headerBar: {
    padding: '24px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: 'rgba(9,13,22,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    zIndex: 90,
    marginBottom: 20
  },
  tabTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '0.04em'
  },
  card: {
    background: CARD_BG,
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: 16,
    fontWeight: 800,
    color: '#F1F5F9',
    letterSpacing: '-0.01em'
  },
  formGroup: {
    marginBottom: 20
  },
  formLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 800,
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    background: INPUT_BG,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    margin: 0
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    background: INPUT_BG,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s'
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: BLUE,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg,#3B82F6,#2563EB)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.04)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '14px 16px',
    background: '#0F172A',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(15,23,42,0.2)'
  },
  td: {
    padding: '14px 16px',
    fontSize: 13,
    color: '#E2E8F0',
    verticalAlign: 'middle'
  },
  orderBtn: {
    background: '#1E293B',
    border: 'none',
    borderRadius: 4,
    padding: 4,
    color: '#94A3B8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBtn: {
    padding: 6,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#E2E8F0',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.05)',
    color: '#EF4444',
    cursor: 'pointer'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(9,13,22,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    background: CARD_BG,
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    padding: 4
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12
  },
  cancelBtn: {
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  saveButton: {
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: BLUE,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer'
  },
  uploadLabelBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  }
};
