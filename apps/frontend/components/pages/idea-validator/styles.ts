export const validatorStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-blue: #005AE2;
  --bg-dark: #0A0F1C;
  --bg-light: #F8FAFC;
  --text-black: #0F172A;
  --text-muted: #64748B;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
}

h1, h2, h3, h4, h5, h6, .manrope-font {
  font-family: 'Manrope', sans-serif;
}

.validator-container {
  padding-top: 90px;
  padding-bottom: 96px;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(0, 90, 226, 0.05), transparent 60%);
}

.content-box {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .validator-container {
    padding-top: 72px;
    padding-bottom: 64px;
  }
}

@media (max-width: 480px) {
  .content-box {
    padding: 0 16px;
  }
}

/* Wizard Progress Header */
.step-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.step-progress-bar {
  position: absolute;
  height: 3px;
  background-color: var(--border-light);
  top: 50%;
  left: 10%;
  right: 10%;
  transform: translateY(-50%);
  z-index: 0;
}

.step-progress-fill {
  position: absolute;
  height: 100%;
  background-color: var(--primary-blue);
  transition: width 0.3s ease;
}

.step-bubble {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--white);
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.step-bubble.active {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue);
  color: var(--white);
  box-shadow: 0 0 0 6px rgba(0, 90, 226, 0.15);
}

.step-bubble.completed {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue);
  color: var(--white);
}

/* Form Card */
.form-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  position: relative;
}

@media (max-width: 600px) {
  .form-card {
    padding: 32px 20px;
  }
}

.form-heading {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.form-subheading {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: #334155;
}

.form-label span {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.8rem;
}

.form-input-light, .input-text, .select-box, .textarea-box {
  width: 100%;
  padding: 14px 18px !important;
  border-radius: 12px !important;
  border: 1.5px solid #CBD5E1 !important;
  background: #FFFFFF !important; /* Pure white color inside */
  font-size: 0.95rem !important;
  color: #0F172A !important;
  box-shadow: inset 0 4px 8px rgba(15, 23, 42, 0.08), inset 0 -2px 5px rgba(15, 23, 42, 0.04), inset 3px 0 6px rgba(15, 23, 42, 0.05), inset -3px 0 6px rgba(15, 23, 42, 0.05) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  outline: none !important;
  font-family: 'Inter', sans-serif !important;
  box-sizing: border-box !important;
}

.form-input-light::placeholder, .input-text::placeholder, .select-box::placeholder, .textarea-box::placeholder {
  color: #9CA3AF !important;
  font-weight: 400 !important;
}

.form-input-light:focus, .input-text:focus, .select-box:focus, .textarea-box:focus {
  border-color: #005AE2 !important;
  background-color: #FFFFFF !important;
  box-shadow: inset 0 3px 6px rgba(15, 23, 42, 0.06), inset 0 -2px 4px rgba(15, 23, 42, 0.03), 0 0 0 4px rgba(0, 90, 226, 0.12) !important;
}

.textarea-box {
  resize: none !important;
  min-height: 100px;
}

/* Clean, professional radio pills grid with Inner Depth (White inside + 4-side inner shadow) */
.radio-pills-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
}

.radio-pill-card {
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid #CBD5E1;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: inset 0 4px 8px rgba(15, 23, 42, 0.08), inset 0 -2px 5px rgba(15, 23, 42, 0.04), inset 3px 0 6px rgba(15, 23, 42, 0.05), inset -3px 0 6px rgba(15, 23, 42, 0.05);
}

.radio-pill-card:hover {
  border-color: #005AE2;
  background: #FFFFFF;
  transform: translateY(-1px);
}

.radio-pill-card.active {
  border-color: #005AE2 !important;
  border-width: 2px !important;
  background-color: #FFFFFF !important;
  box-shadow: inset 0 3px 6px rgba(15, 23, 42, 0.06), inset 0 -2px 4px rgba(15, 23, 42, 0.03), 0 0 0 3.5px rgba(0, 90, 226, 0.12) !important;
}

.radio-pill-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: #0F172A;
  transition: color 0.2s;
}

.radio-pill-card.active .radio-pill-title {
  color: #005AE2;
}

.radio-pill-desc {
  font-size: 0.75rem;
  color: #64748B;
  margin-top: 4px;
  line-height: 1.3;
}

/* Toggle Button Group & Grid with Inner Depth (White inside + 4-side inner shadow) */
.toggle-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
  width: 100%;
}

.toggle-btn {
  padding: 14px 20px;
  border-radius: 12px;
  border: 1.5px solid #CBD5E1;
  background: #FFFFFF;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #334155;
  box-shadow: inset 0 4px 8px rgba(15, 23, 42, 0.08), inset 0 -2px 5px rgba(15, 23, 42, 0.04), inset 3px 0 6px rgba(15, 23, 42, 0.05), inset -3px 0 6px rgba(15, 23, 42, 0.05);
  height: 100%;
  min-height: 50px;
  outline: none;
}

.toggle-btn:hover {
  border-color: #005AE2;
  background: #FFFFFF;
}

.toggle-btn.active {
  background-color: #FFFFFF !important;
  border-color: #005AE2 !important;
  border-width: 2px !important;
  color: #005AE2 !important;
  box-shadow: inset 0 3px 6px rgba(15, 23, 42, 0.06), inset 0 -2px 4px rgba(15, 23, 42, 0.03), 0 0 0 3.5px rgba(0, 90, 226, 0.12) !important;
}

.toggle-btn svg {
  color: #64748B;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toggle-btn.active svg {
  color: #005AE2 !important;
}

/* 1 to 10 Button Group for Pain Score */
.pain-score-group {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

@media (max-width: 600px) {
  .pain-score-group {
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .toggle-btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
}

.pain-btn {
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: #FAFAFA;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pain-btn:hover {
  border-color: #CBD5E1;
}

.pain-btn.active {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  color: var(--white);
}

/* Radio Pill Selection Box */
.radio-pills-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

@media (max-width: 480px) {
  .radio-pills-row {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

.radio-pill-card {
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  background-color: #FAFAFA;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-pill-card:hover {
  border-color: #CBD5E1;
}

.radio-pill-card.active {
  background-color: #E6EFFF;
  border-color: var(--primary-blue);
}

.radio-title {
  font-weight: 700;
  font-size: 0.925rem;
  color: var(--text-black);
}

.radio-pill-card.active .radio-title {
  color: var(--primary-blue);
}

.radio-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Navigation Buttons row */
.btn-row {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  border-top: 1px solid var(--border-light);
  padding-top: 32px;
  gap: 16px;
}

.btn-form-prev {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  padding: 14px 28px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-form-prev:hover {
  color: var(--text-black);
  border-color: var(--text-muted);
}

.btn-form-next {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-blue);
  color: var(--white);
  border: none;
  padding: 14px 36px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 16px -4px rgba(0, 90, 226, 0.25);
  transition: all 0.2s;
  margin-left: auto;
}

.btn-form-next:hover {
  background-color: #004ac2;
  transform: translateY(-1px);
}

/* Error Banner */
.error-banner {
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
  color: #EF4444;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 28px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Loading Screen styles */
.loading-wrap {
  text-align: center;
  padding: 64px 24px;
}

.spinner-outer {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
}

.spinner-circle {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 80px;
  height: 80px;
  border: 4px solid transparent;
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-inner {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border: 4px solid transparent;
  border-bottom-color: #10B981;
  border-radius: 50%;
  animation: spin-reverse 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-black);
  margin-bottom: 8px;
  height: 24px;
}

.loading-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Results Screen Scorecard */
.score-circle-panel {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  width: 100%;
  box-sizing: border-box;
}

.score-circle-outer {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.score-circle-inner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-big-num {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-black);
  line-height: 1;
}

.score-scale {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 2px;
}

.score-summary-details {
  flex-grow: 1;
}

.triage-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.825rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.score-summary-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.score-summary-desc {
  color: var(--text-muted);
  font-size: 0.925rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .score-circle-panel {
    flex-direction: column;
    text-align: center;
  }
}

/* Quick Metrics Grid */
.metrics-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  margin-top: 24px;
}

.metric-mini-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
}

.metric-mini-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.metric-mini-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-black);
}

/* Dimension details split layout */
.dimensions-section {
  margin-bottom: 56px;
}

.dimensions-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.dimensions-split {
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 800px) {
  .dimensions-split {
    grid-template-columns: 1fr;
  }
}

.dimensions-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dim-nav-item {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.dim-nav-item:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 8px 16px rgba(0, 90, 226, 0.03);
}

.dim-nav-item.active {
  border-color: var(--primary-blue);
  background-color: #E6EFFF;
  box-shadow: 0 8px 24px rgba(0, 90, 226, 0.06);
}

.dim-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dim-nav-title-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dim-nav-icon {
  font-size: 1.2rem;
}

.dim-nav-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-black);
}

.dim-nav-score {
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--primary-blue);
}

.dim-progress-bg {
  width: 100%;
  height: 6px;
  background-color: #E2E8F0;
  border-radius: 100px;
  overflow: hidden;
}

.dim-progress-fill {
  height: 100%;
  background-color: var(--primary-blue);
  border-radius: 100px;
  transition: width 0.4s ease;
}

/* Detail Panel */
.dim-detail-panel {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

.dim-detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.dim-detail-label {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-black);
}

.dim-detail-score-pill {
  padding: 8px 16px;
  border-radius: 100px;
  background-color: #E6EFFF;
  color: var(--primary-blue);
  font-weight: 800;
  font-size: 1rem;
}

.dim-detail-prose {
  color: #475569;
  font-size: 0.975rem;
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 500;
}

.signals-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 600px) {
  .signals-split {
    grid-template-columns: 1fr;
  }
}

.signals-list-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signals-list-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.signals-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.4;
}

.signal-icon-pos {
  color: #10B981;
  flex-shrink: 0;
  margin-top: 2px;
}

.signal-icon-neg {
  color: #EF4444;
  flex-shrink: 0;
  margin-top: 2px;
}

.actions-box {
  background-color: #FAFAFA;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
}

.actions-box-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 16px;
}

/* Deep-Dive Report details */
.report-section {
  margin-bottom: 56px;
}

.report-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

@media (max-width: 600px) {
  .report-card {
    padding: 32px 20px;
  }
}

.report-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 16px;
}

.report-block {
  margin-bottom: 36px;
}

.report-block-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 12px;
}

.report-block-text {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  font-weight: 500;
}

.alert-block {
  border-left: 4px solid var(--primary-blue);
  background-color: #E6EFFF;
  padding: 20px;
  border-radius: 0 16px 16px 0;
  margin-bottom: 24px;
}

.alert-block.warning {
  border-left-color: #F59E0B;
  background-color: #FFFBEB;
}

.alert-block-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-black);
  margin-bottom: 8px;
}

.alert-block-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #475569;
  font-weight: 500;
}

/* Results Action buttons */
.results-actions-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 56px;
  border-top: 1px solid var(--border-light);
  padding-top: 40px;
}

.btn-results-call {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--primary-blue);
  color: var(--white);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
  transition: all 0.3s ease;
}

.btn-results-call:hover {
  background-color: #004ac2;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
}

.btn-results-outline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--white);
  color: var(--text-black);
  border: 1px solid var(--border-light);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-results-outline:hover {
  border-color: var(--text-muted);
  background-color: #FAFAFA;
  transform: translateY(-2px);
}

/* Upgrade Page Styles */
.upgrade-wrap {
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upgrade-icon-box {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #FFF8E1;
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
}

.upgrade-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.upgrade-desc {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 36px;
}

.upgrade-btn-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-upgrade-pro {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
  color: var(--white);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.35);
  transition: all 0.3s ease;
}

.btn-upgrade-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.45);
}

/* ── Methodology Section ── */
.methodology-wrap {
  max-width: 960px;
  margin: 48px auto 0;
}
.meth-section-title {
  font-size: clamp(1.3rem, 3vw, 1.75rem);
  font-weight: 800;
  color: var(--text-black);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.meth-section-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 32px;
}
@media (max-width: 768px) {
  .methodology-wrap {
    margin: 32px auto 0;
  }
}

.arch-pipeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 56px;
}
@media (max-width: 720px) {
  .arch-pipeline { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .arch-pipeline { gap: 14px; }
}
.arch-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.arch-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,90,226,0.07);
}
.arch-pass-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.arch-pass-1 { background: #E6EFFF; color: var(--primary-blue); }
.arch-pass-2 { background: #ECFDF5; color: #059669; }
.arch-pass-3 { background: #FDF4FF; color: #9333EA; }
.arch-card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 10px;
}
.arch-card-temp {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  background: #F1F5F9;
  color: var(--text-muted);
  padding: 3px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
}
.arch-card-desc {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.55;
}
.dims-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 40px;
}
@media (max-width: 720px) {
  .dims-grid { grid-template-columns: repeat(2, 1fr); }
}
.dim-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-black);
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.formula-block {
  background: #F8FAFC;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 20px;
  font-family: 'Courier New', Courier, monospace;
}
.formula-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}
.formula-text {
  font-size: 0.95rem;
  color: var(--text-black);
  line-height: 1.7;
}
@media (max-width: 480px) {
  .formula-block { padding: 16px; }
  .formula-text { font-size: 0.82rem; line-height: 1.6; }
}
.formula-highlight { color: var(--primary-blue); font-weight: 700; }
.formula-green { color: #059669; font-weight: 700; }
.formula-purple { color: #9333EA; font-weight: 700; }
.triage-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  font-size: 0.875rem;
}
.triage-table th {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
}
.triage-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
  font-weight: 500;
}
.triage-table tr:last-child td { border-bottom: none; }
@media (max-width: 600px) {
  .triage-table { font-size: 0.78rem; }
  .triage-table th, .triage-table td { padding: 8px 10px; }
}
@media (max-width: 400px) {
  .triage-table th:nth-child(3),
  .triage-table td:nth-child(3) { display: none; }
}
.conf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}
@media (max-width: 600px) {
  .conf-row { grid-template-columns: 1fr; }
}
.conf-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.conf-card-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 10px;
}
.conf-card-formula {
  background: #F8FAFC;
  border-radius: 10px;
  padding: 12px 14px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--text-black);
  line-height: 1.6;
  margin-bottom: 10px;
}
@media (max-width: 400px) {
  .conf-card-formula { font-size: 0.75rem; }
}
.conf-card-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.report-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}
@media (max-width: 720px) {
  .report-preview-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .report-preview-grid { grid-template-columns: 1fr; }
}
.report-preview-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.report-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,90,226,0.06);
}
.report-preview-icon { font-size: 1.4rem; margin-bottom: 4px; }
.report-preview-title { font-size: 0.9rem; font-weight: 800; color: var(--text-black); }
.report-preview-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
.no-fetch-callout {
  background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);
  border: 1px solid #6EE7B7;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 48px;
}
.no-fetch-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
.no-fetch-text { font-size: 0.875rem; color: #065F46; line-height: 1.5; font-weight: 500; }
.no-fetch-text strong { font-weight: 800; }
.section-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 48px 0 36px;
}
.section-divider-line { flex: 1; height: 1px; background: var(--border-light); }
.section-divider-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
@media (max-width: 400px) {
  .section-divider-label { font-size: 0.7rem; }
}
.cta-banner {
  background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  color: var(--white);
  margin-top: 48px;
}
.cta-banner h3 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.cta-banner p {
  font-size: 1rem;
  opacity: 0.85;
  max-width: 540px;
  margin: 0 auto 32px;
  line-height: 1.6;
}
.btn-cta-white {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  color: var(--primary-blue);
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}
.btn-cta-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0,0,0,0.2);
}
@media (max-width: 480px) {
  .cta-banner { padding: 28px 20px; }
  .btn-cta-white { padding: 14px 24px; font-size: 0.9rem; }
}

.hero-intro-card {
  padding: 64px 48px;
}
@media (max-width: 600px) {
  .hero-intro-card {
    padding: 40px 20px;
  }
}

/* Red Flags Styles */
.red-flags-section {
  margin-bottom: 56px;
}
.red-flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
}
.red-flag-card {
  background: #FFF5F5;
  border: 1px solid #FEB2B2;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.red-flag-card.medium {
  background: #FFFDF5;
  border-color: #FEEBC8;
}
.red-flag-card.low {
  background: #F7FAFC;
  border-color: #E2E8F0;
}
.red-flag-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}
.red-flag-badge.high { background: #FED7D7; color: #9B2C2C; }
.red-flag-badge.medium { background: #FEEBC8; color: #9C4221; }
.red-flag-badge.low { background: #EDF2F7; color: #4A5568; }
.red-flag-title { font-size: 1rem; font-weight: 800; color: #0F172A; }
.red-flag-desc { font-size: 0.82rem; color: #4A5568; line-height: 1.5; }
.red-flag-rec { font-size: 0.82rem; color: #2D3748; line-height: 1.5; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; margin-top: auto; }

/* Risk Matrix Styles */
.risk-matrix-section { margin-bottom: 56px; }
.risk-matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.risk-matrix-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
}
.risk-matrix-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.risk-matrix-card.high::before { background-color: #E53E3E; }
.risk-matrix-card.medium::before { background-color: #DD6B20; }
.risk-matrix-card.low::before { background-color: #319795; }
.risk-card-header { display: flex; justify-content: space-between; align-items: center; }
.risk-card-title { font-size: 0.95rem; font-weight: 800; color: var(--text-black); text-transform: capitalize; }
.risk-card-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
.risk-card-mitigation { font-size: 0.8rem; color: #1A202C; line-height: 1.4; background: #EDF2F7; padding: 10px; border-radius: 8px; margin-top: auto; }

/* Confidence Breakdown Styles */
.conf-breakdown-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
}
.conf-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.conf-breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.conf-breakdown-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.conf-breakdown-val { font-size: 1.25rem; font-weight: 800; color: var(--text-black); }
.conf-progress-bar-bg { width: 100%; height: 6px; background: #E2E8F0; border-radius: 100px; overflow: hidden; }
.conf-progress-bar-fill { height: 100%; border-radius: 100px; }

/* Comparable Startups Styles */
.comps-section { margin-bottom: 56px; }
.comps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.comp-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}
.comp-header { display: flex; justify-content: space-between; align-items: center; }
.comp-name { font-size: 1.1rem; font-weight: 800; color: var(--text-black); }
.comp-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; }
.comp-model { font-size: 0.78rem; font-weight: 700; color: var(--primary-blue); background: #E6EFFF; padding: 4px 10px; border-radius: 100px; width: fit-content; }
.comp-lesson { font-size: 0.8rem; color: #2D3748; line-height: 1.5; border-top: 1px solid var(--border-light); padding-top: 12px; margin-top: auto; }

/* Phased Validation Roadmap Styles */
.roadmap-section { margin-bottom: 56px; }
.roadmap-timeline { display: flex; flex-direction: column; gap: 20px; position: relative; padding-left: 28px; margin-top: 24px; }
.roadmap-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #E2E8F0;
}
.roadmap-item { position: relative; }
.roadmap-bubble {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--white);
  border: 3px solid var(--primary-blue);
  box-sizing: border-box;
}
.roadmap-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.roadmap-header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.roadmap-phase-title { font-size: 0.78rem; font-weight: 800; color: var(--primary-blue); text-transform: uppercase; letter-spacing: 0.05em; }
.roadmap-improvement { font-size: 0.78rem; font-weight: 800; color: #2F855A; background: #C6F6D5; padding: 2px 8px; border-radius: 100px; }
.roadmap-task { font-size: 1rem; font-weight: 800; color: var(--text-black); }
.roadmap-details-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-light); padding-top: 10px; margin-top: 4px; }

/* VC Investor Memo Styles */
.memo-section { margin-bottom: 56px; }
.memo-tabs { display: flex; border-bottom: 1px solid var(--border-light); margin-bottom: 24px; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.memo-tab-btn {
  padding: 10px 18px;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.memo-tab-btn:hover { color: var(--text-black); }
.memo-tab-btn.active { color: var(--primary-blue); border-bottom-color: var(--primary-blue); }
.memo-content-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.01);
  line-height: 1.6;
  font-size: 0.92rem;
  color: #334155;
}
.memo-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  background: var(--bg-light);
  padding: 16px 20px;
  border-radius: 12px;
}

/* BuildTime Estimator Styles */
.buildtime-section { margin-bottom: 56px; }
.buildtime-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.01);
}
.bt-meta-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}
.bt-meta-item { display: flex; flex-direction: column; gap: 6px; }
.bt-meta-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.bt-meta-val { font-size: 1.35rem; font-weight: 800; color: var(--text-black); }
.phase-list { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
.phase-item {
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.phase-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.phase-name { font-size: 0.92rem; font-weight: 800; color: var(--text-black); }
.phase-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
.phase-badge-row { display: flex; gap: 8px; }
.phase-badge-time { font-size: 0.78rem; font-weight: 700; background: #E6EFFF; color: var(--primary-blue); padding: 4px 10px; border-radius: 100px; white-space: nowrap; }
.phase-badge-effort { font-size: 0.78rem; font-weight: 700; background: #EDF2F7; color: #4A5568; padding: 4px 10px; border-radius: 100px; white-space: nowrap; }

/* Accordion Styles for Investor DD Questions */
.dd-section { margin-bottom: 56px; }
.accordion-item { border: 1px solid var(--border-light); border-radius: 16px; background: var(--white); margin-bottom: 12px; overflow: hidden; }
.accordion-header {
  padding: 18px 24px;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-black);
  background: var(--white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
  text-transform: capitalize;
}
.accordion-header:hover { background: var(--bg-light); }
.accordion-content { padding: 24px; border-top: 1px solid var(--border-light); background: var(--bg-light); display: flex; flex-direction: column; gap: 20px; }
.dd-question-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dd-q-text { font-size: 0.92rem; font-weight: 800; color: var(--text-black); }
.dd-sub-item { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; }
.dd-sub-label { font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.7rem; }
.dd-sub-val { color: #334155; line-height: 1.4; }

/* Score Sensitivity Card */
.sensitivity-section { margin-bottom: 56px; }
.sensitivity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px; }
.sensitivity-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}
.sens-info { display: flex; flex-direction: column; gap: 4px; }
.sens-milestone { font-size: 0.9rem; font-weight: 700; color: var(--text-black); }
.sens-gain { font-size: 1.15rem; font-weight: 800; color: #2F855A; background: #C6F6D5; padding: 4px 12px; border-radius: 100px; white-space: nowrap; }

/* Transparency Formula Box */
.transparency-box {
  background: var(--bg-light);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: #334155;
}
.transparency-formula {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-blue);
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 6px;
}

/* Outcome Survey Box */
.outcome-survey-box {
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  margin-top: 56px;
}
.outcome-survey-title { font-size: 1.2rem; font-weight: 800; color: var(--text-black); margin-bottom: 8px; }
.outcome-survey-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px; }

/* Custom Modal Scrollability for wizard & dashboard on homepage */
.step-modal-overlay {
  z-index: 99999;
}
.step-modal {
  max-width: 900px !important;
  width: 95% !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  border-radius: 24px !important;
  padding: 40px !important;
}

@media (max-width: 600px) {
  .step-modal {
    padding: 24px 16px !important;
  }
}

/* Dedicated Subpage Styles */
.validator-page-root textarea:focus,
.validator-page-root select:focus,
.validator-page-root input:focus {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 226, 0.08) !important;
}

.pain-btn:hover {
  border-color: var(--primary-blue) !important;
  background-color: rgba(0, 90, 226, 0.02) !important;
}

.radio-pill-card:hover {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.toggle-btn:hover {
  background-color: rgba(0, 90, 226, 0.02) !important;
  border-color: var(--primary-blue) !important;
}

.toggle-btn.active {
  background-color: rgba(0, 90, 226, 0.08) !important;
  border-color: var(--primary-blue) !important;
  color: var(--primary-blue) !important;
}

/* Auth Cards Floating Animation */
.auth-card input {
  transition: all 0.2s ease;
}

.auth-card input:focus {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 226, 0.08) !important;
}

/* Glassmorphism for the Auth gate */
.auth-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animations */
@keyframes ccFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cc-page-enter {
  animation: ccFadeIn 0.4s ease forwards;
}
/* ── Extra Mobile Responsiveness ─────────────────── */
@media (max-width: 600px) {
  .validator-page-root {
    padding-top: 80px !important;
    padding-bottom: 48px !important;
  }
  .validator-page-root > div {
    padding: 0 16px !important;
  }
  .form-card {
    padding: 20px 16px !important;
    border-radius: 16px !important;
  }
  .form-section-title {
    font-size: 0.95rem !important;
  }
  .radio-pills-row {
    grid-template-columns: 1fr 1fr !important;
  }
  .toggle-btn-group {
    flex-wrap: wrap !important;
  }
  .toggle-btn {
    font-size: 0.8rem !important;
    padding: 8px 12px !important;
  }
  .step-progress-row {
    max-width: 300px !important;
  }
}
@media (max-width: 400px) {
  .radio-pills-row {
    grid-template-columns: 1fr !important;
  }
  .form-card {
    padding: 16px 12px !important;
  }
}
`;
