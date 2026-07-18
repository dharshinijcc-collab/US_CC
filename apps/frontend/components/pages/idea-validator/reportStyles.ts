export const reportStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-blue: #005AE2;
  --accent-blue: #005AE2;
  --bg-dark: #0F172A;
  --bg-light: #F8FAFC;
  --text-black: #1E293B;
  --text-muted: #64748B;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
  --mono-font: 'Fira Code', monospace;
}

/* ── Scoped Report Typography (only inside .validator-container) ── */
.validator-container h1,
.validator-container h2,
.validator-container h3,
.validator-container h4,
.validator-container h5,
.validator-container h6 {
  font-family: 'Manrope', sans-serif;
  color: var(--text-black);
  margin-top: 0;
}

.validator-container h2 { font-size: 1.35rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
.validator-container h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }
.validator-container h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
.validator-container h5 { font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; }

.validator-container,
.validator-container p,
.validator-container li,
.validator-container span:not(.cc-footer-wrapper span),
.validator-container div:not(.cc-footer-wrapper div) {
  font-family: 'Inter', sans-serif;
}

.validator-container p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #334155;
  margin: 0 0 14px 0;
}

.validator-container li {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #334155;
}


.validator-container {
  padding-top: 90px;
  padding-bottom: 96px;
  min-height: 100vh;
  background: #FAFAFA;
}

.content-box {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .validator-container {
    padding-top: 72px;
    padding-bottom: 64px;
  }
}

/* Dimension nav row — keeps label and score on opposite sides */
.dim-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* Notebook Meta Header */
.doc-meta-header {
  display: flex;
  justify-content: flex-start;
  gap: 32px;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 12px;
  margin-bottom: 24px;
}

.doc-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.meta-val {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-black);
}

/* Notebook Title Row */
.dashboard-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-subtitle {
  font-family: var(--mono-font);
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 600;
  color: #005AE2;
  letter-spacing: 0.05em;
  display: block;
}

.dashboard-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #0F172A;
  margin: 4px 0 0 0;
  letter-spacing: -0.03em;
}

.dashboard-header-actions {
  display: flex;
  gap: 12px;
}

.alert-banner-mock {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #92400E;
  font-size: 0.825rem;
}

.alert-icon-mock {
  font-size: 1.1rem;
}

.alert-banner-ai-active {
  background: #EEF2FF;
  border: 1px solid #C7D2FE;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3730A3;
  font-size: 0.825rem;
}

.alert-icon-ai-active {
  font-size: 1.1rem;
}

.badge-ai-status {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.3);
}

.badge-mock-status {
  background: #f59e0b;
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ── Notebook Workspace Layout ── */
.notebook-workspace {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  align-items: start;
}

.notebook-score-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.notebook-dimensions-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
}

.strengths-risks-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .notebook-workspace {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .notebook-score-row {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
  .notebook-score-index {
    max-width: 240px;
    margin: 0 auto;
    width: 100%;
  }
  .notebook-dimensions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .strengths-risks-split {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Left Sidebar Navigation */
.notebook-sidebar {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  position: sticky;
  top: 100px;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-group-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-item-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.sidebar-item-btn:hover {
  background-color: var(--bg-light);
}

.sidebar-item-btn.active {
  background-color: #F0F6FF;
  border-left: 3px solid #005AE2 !important;
  border-radius: 0 4px 4px 0;
}

.cell-num {
  font-family: var(--mono-font);
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.sidebar-item-btn.active .cell-num {
  color: #005AE2;
}

.cell-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-black);
}

.sidebar-item-btn.active .cell-name {
  color: #005AE2;
}

/* Notebook Right Content Area */
.notebook-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.notebook-cell-panel {
  display: none;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
}

.notebook-cell-panel.active-cell {
  display: block;
  animation: ccFadeIn 0.25s ease forwards;
}

.notebook-cell-panel.hidden-cell {
  display: none;
}

.notebook-cell-header {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-light);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cell-in-tag {
  font-family: var(--mono-font);
  font-size: 0.78rem;
  font-weight: 600;
  color: #005AE2;
}

.cell-out-tag {
  font-family: var(--mono-font);
  font-size: 0.78rem;
  font-weight: 600;
  color: #B91C1C;
}

.cell-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-black);
  letter-spacing: -0.01em;
}

.notebook-cell-body {
  padding: 24px;
}

/* Notebook Score Design */
.notebook-score-index {
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  background: #FAFAFA;
}

.score-label {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.score-num-nb {
  font-size: 2.75rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1;
}

.score-denom-nb {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 600;
}

.score-badge-nb {
  margin-top: 8px;
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-badge-nb.strong { background: #DCFCE7; color: #15803D; }
.score-badge-nb.needs-val { background: #FEF3C7; color: #D97706; }
.score-badge-nb.risk { background: #FEE2E2; color: #B91C1C; }

/* Dimensions list */
.dim-nav-item-nb {
  background-color: var(--white);
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.dim-nav-item-nb:hover { border-color: #005AE2; }
.dim-nav-item-nb.active {
  border-color: var(--border-light);
  border-left: 3px solid #005AE2 !important;
  background-color: var(--bg-light);
}

.dim-progress-bg {
  width: 100%;
  height: 4px;
  background-color: #E2E8F0;
  border-radius: 2px;
  overflow: hidden;
}

.dim-progress-fill {
  height: 100%;
  background-color: #005AE2;
  border-radius: 2px;
}

.dim-detail-panel-nb {
  background-color: var(--white);
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  padding: 16px;
}

.dim-detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.dim-detail-label {
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
}

.dim-detail-score-pill {
  font-size: 0.72rem;
  font-weight: 800;
  background: #F0F6FF;
  color: #005AE2;
  padding: 3px 6px;
  border-radius: 3px;
}

.dim-detail-prose {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.45;
  margin-bottom: 12px;
}

.signals-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.signals-list-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.signals-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.signal-li {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 0.75rem;
  color: #334155;
  line-height: 1.35;
}

.signal-icon-pos {
  color: #15803D;
  flex-shrink: 0;
  margin-top: 1px;
}

.signal-icon-neg {
  color: #B91C1C;
  flex-shrink: 0;
  margin-top: 1px;
}

.actions-box {
  background-color: #F8FAFC;
  border: 1.5px solid #E2E8F0;
  border-radius: 4px;
  padding: 10px;
}

.actions-box-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-black);
}

/* Scoped strength and risk style settings */
.sr-card-half {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
}

.sr-title {
  font-family: var(--mono-font);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.strength-title { color: #15803D; }
.risk-title { color: #B91C1C; }

.sr-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.sr-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.35;
}

.sr-bullet {
  font-weight: 800;
}

.strength .sr-bullet { color: #16A34A; }
.risk .sr-bullet { color: #DC2626; }

/* Due Diligence Memo */
.memo-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  gap: 4px;
  margin-bottom: 12px;
}

.memo-tab-btn {
  padding: 6px 10px;
  font-weight: 700;
  font-size: 0.78rem;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.memo-tab-btn:hover { color: var(--text-black); }
.memo-tab-btn.active { color: #005AE2; border-bottom-color: #005AE2; }

.memo-content-box {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
}

.memo-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  background: #FAFAFA;
  padding: 8px 12px;
  border-radius: 4px;
}

.dd-sub-label {
  font-family: var(--mono-font);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Red flags */
.red-flag-card-flat {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 4px;
}

/* Risk Matrix */
.risk-matrix-card {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 4px;
}

.risk-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
}

.risk-card-title {
  font-weight: 800;
  color: var(--text-black);
}

.risk-card-desc {
  color: var(--text-muted);
  line-height: 1.35;
}

.risk-card-mitigation {
  color: var(--text-black);
  line-height: 1.3;
  background: #F1F5F9;
  border-radius: 3px;
}

/* Checklist and Roadmap */
.evidence-checklist-row-flat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid #E2E8F0;
  border-radius: 4px;
  background: #FFFFFF;
}

.roadmap-phase-card {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
}

.phase-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-light);
}

.roadmap-step-box-flat {
  background: #FAFAFA;
  border: 1.5px solid #E2E8F0;
  border-radius: 4px;
}

.step-box-footer-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-light);
}

/* Buttons */
.btn-results-call {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #005AE2;
  color: var(--white);
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-results-call:hover {
  background-color: #1d4ed8;
}

.btn-results-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--white);
  color: var(--text-black);
  border: 1.5px solid #E2E8F0;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-results-outline:hover {
  border-color: var(--text-muted);
  background-color: #FAFAFA;
}

/* Auth Gate Overlay */
.auth-gate-overlay-fixed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 160px;
  background-color: rgba(248, 250, 252, 0.4);
  z-index: 100;
}

@keyframes ccFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.cc-page-enter {
  animation: ccFadeIn 0.25s ease forwards;
}
`;
