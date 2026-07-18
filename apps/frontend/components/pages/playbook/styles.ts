export const playbookStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  /* Color System */
  --bg-base: #FAFAFA;
  --bg-light: #FFFFFF;
  --bg-dark: #0A0F1C;
  --bg-grey: #F4F5F7;
  
  --primary-blue: #005AE2;
  --bright-blue: #0088FF;
  --bright-blue-hover: #0070E0;
  --light-blue-bg: #EBF5FF;
  
  --text-black: #020617;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --white: #FFFFFF;
  
  --border-light: #E2E8F0;
  --border-dark: rgba(255, 255, 255, 0.1);
}

body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-base);
  color: var(--text-black);
  scroll-behavior: smooth;
}

::-webkit-scrollbar { display: none; }
* { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }

h1, h2, h3, h4, h5, h6, .section-title, .section-eyebrow, .card-title {
  font-family: 'Manrope', sans-serif;
}

p, span, div, button, a {
  font-family: 'Inter', sans-serif;
}

.section-container { max-width: 1200px; }

/* Section 1: Hero — spacing from global-styles.css */
.hero-section {
  background: var(--bg-base);
  overflow: hidden;
}

.hero-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #E6EFFF;
  color: #005AE2;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.05em;
  color: var(--text-black);
  margin-bottom: 24px;
}

.text-blue { color: var(--bright-blue); }

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 32px;
  max-width: 600px;
}

.hero-info-box {
  background: var(--light-blue-bg);
  border-left: 6px solid var(--bright-blue);
  padding: 24px 32px;
  border-radius: 4px 24px 24px 4px;
  margin-bottom: 40px;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--primary-blue);
  max-width: 600px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue));
  color: var(--white);
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateZ(15px);
  box-shadow: 0 4px 15px rgba(0, 136, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  text-decoration: none;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-primary:hover {
  transform: translateY(-3px) translateZ(15px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 136, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:active {
  transform: translateY(-1px) translateZ(15px) scale(0.98);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--border-light);
  color: var(--text-main);
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
}

.btn-outline:hover {
  background: var(--light-blue-bg);
  border-color: var(--bright-blue);
  color: var(--bright-blue);
}

.hero-image-container {
  position: relative;
  border-radius: 40px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 1/1;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.4);
}

/* Responsive Design Overrides */
@media (max-width: 900px) {
  .section-container {
    padding: 40px 20px !important;
  }
  
  .hero-section {
    padding-top: 60px !important;
    text-align: center !important;
  }
  
  .hero-title {
    font-size: 2.5rem !important;
  }
  
  .hero-description, .hero-info-box {
    margin-inline: auto !important;
    font-size: 1rem !important;
  }
  
  .hero-buttons {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  
  .hero-grid {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  
  .selection-grid, .outcome-grid, .post-greenlight-grid, .stats-section .section-container > div, .pods-section .section-container > div:last-child {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }
  
  .step-circles-row {
    flex-direction: column !important;
    gap: 32px !important;
  }
  
  .step-circles-row div {
    flex: none !important;
  }
  
  .step-circles-row div[style*="absolute"] {
    display: none !important;
  }
  
  .phase-title {
    font-size: 2rem !important;
    white-space: normal !important;
  }
  
  /* Table Responsiveness */
  .criteria-table-wrapper, .comparison-table-wrapper {
    overflow-x: auto !important;
    margin-inline: -20px !important;
    padding-inline: 20px !important;
  }
  
  .criteria-table-wrapper > div, .comparison-table-wrapper > div {
    min-width: 600px !important;
  }
  
  .final-cta-section .section-container {
    padding: 60px 20px !important;
    border-radius: 24px !important;
  }
  
  .final-cta-section h2 {
    font-size: 2rem !important;
  }
  
  .final-cta-section .cta-buttons {
    flex-direction: column !important;
  }
  
  .final-cta-section .cta-buttons a {
    width: 100% !important;
  }
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.95;
}

@media (max-width: 968px) {
  .hero-grid { grid-template-columns: 1fr; text-align: left; }
  .hero-description { margin-left: 0; }
  .hero-buttons { justify-content: flex-start; flex-direction: column; }
  .hero-image-container { max-width: 450px; margin: 0; }
}

/* Section 2: Tabs */
.phases-section {
  background: white;
  box-shadow: 0 10px 30px -10px rgba(0, 90, 226, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.phases-tabs {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  max-width: 800px;
  margin: 0 auto;
}

.phase-tab {
  background: none;
  border: none;
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #94A3B8;
  cursor: pointer;
  padding: 8px 12px;
  position: relative;
  transition: all 0.3s ease;
}

.phase-tab.active {
  color: var(--primary-blue);
}

.phase-tab.active::after {
  content: '';
  position: absolute;
  bottom: -17px;
  left: 0;
  width: 100%;
  height: 5px;
  background: #2563EB;
  border-radius: 2px 2px 0 0;
}

.phase-content-section {
  background: var(--bg-light);
  padding-block: var(--section-padding-y);
}

.phase-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.phase-label {
  color: var(--primary-blue);
  font-weight: 800;
  font-size: 0.8125rem;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.phase-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.phase-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.phase-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-light);
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 4px;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Selection Section */
/* Section 3: Phase 01 — Selection */
.selection-section {
  padding: 60px 0;
  background: white;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 32px;
}

.selection-filters::-webkit-scrollbar {
  display: none;
}

.selection-card {
  padding: 32px;
  border-radius: 20px;
  background: #F5F7FF;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
}

.selection-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-blue);
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  background: #DBEAFE;
  color: var(--primary-blue);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-black);
  letter-spacing: -0.02em;
}

.card-description {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: #64748B;
}

@media (max-width: 968px) {
  .selection-grid { grid-template-columns: 1fr; }
}

/* Section 3: Phase 02 */
.clinical-validation-section {
  background: #FFFFFF;
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.step-circles-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 64px;
  margin-bottom: 64px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number-circle {
  width: 44px;
  height: 44px;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.125rem;
  margin-bottom: 24px;
  box-shadow: 0 8px 16px rgba(0, 90, 226, 0.3);
}

.step-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.outcome-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
  position: relative;
  z-index: 1;
}

.outcome-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  text-align: left;
  border: 1px solid var(--border-light);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.outcome-card.proceed { border-left: 6px solid #10B981; }
.outcome-card.iterate { border-left: 6px solid #F59E0B; }
.outcome-card.kill { border-left: 6px solid #EF4444; }

.outcome-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-black);
}

.outcome-icon { width: 24px; height: 24px; }
.proceed-text { color: #10B981; }
.iterate-text { color: #F59E0B; }
.kill-text { color: #EF4444; }

.outcome-desc {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-muted);
}

/* Execution Section (Section 4) */
.post-greenlight-section {
  background: white;
  padding: 48px 0;
}

.post-greenlight-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  margin-top: 48px;
}

.phase-step-card {
  padding-left: 20px;
  border-left: 3px solid var(--primary-blue);
}

.phase-step-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--primary-blue);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.phase-step-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-black);
}

.phase-step-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.gate-table-wrapper {
  margin-top: 64px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
}

.gate-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.gate-table th {
  background: #F1F1F9;
  padding: 20px 24px;
  text-align: left;
  font-weight: 800;
  color: var(--text-black);
  border-bottom: 1px solid var(--border-light);
}

.gate-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.gate-table tr:last-child td { border-bottom: none; }

.text-green { color: #10B981; font-weight: 600; }
.text-yellow { color: #F59E0B; font-weight: 600; }
.text-red { color: #EF4444; font-weight: 600; }

/* Pods Section */
.pods-section {
  background: var(--bg-dark);
  padding: 60px 0;
  color: white;
  text-align: center;
  position: relative;
}

.pods-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 64px;
}

.pod-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.pod-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--primary-blue);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.pod-id {
  font-size: 0.625rem;
  font-weight: 800;
  color: var(--primary-blue);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 16px;
  display: block;
}

.pod-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: white;
}

.pod-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #94A3B8;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 120px;
  margin-top: 100px;
  padding-top: 100px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* Comparison Section */
.comparison-section {
  background: #F8FAFC;
  padding: 48px 0;
}

.comparison-table-wrapper {
  max-width: 1000px;
  margin: 64px auto 0;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th {
  padding: 24px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--text-black);
  border-bottom: 1px solid var(--border-light);
  background: white;
}

.comparison-table td {
  padding: 20px 24px;
  font-size: 0.9375rem;
  color: var(--text-muted);
  border-bottom: 1px solid #F1F5F9;
}

.comparison-table tr:last-child td { border-bottom: none; }

.feature-cell {
  font-weight: 700;
  color: var(--text-black) !important;
  width: 25%;
}

.studio-highlight {
  background: #F0F5FF;
  color: var(--primary-blue) !important;
  font-weight: 700;
  width: 25%;
}

.studio-header {
  background: #F0F5FF !important;
  color: var(--primary-blue) !important;
}

/* Final CTA Section */
.final-cta-section {
  background: var(--bg-light);
  padding: 60px 24px;
  text-align: center;
}

.cta-container {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--primary-blue);
  padding: 48px 40px;
  border-radius: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(135deg, #005AE2 0%, #0046B1 100%);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: white;
}

.cta-description {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-white {
  background: white;
  color: var(--primary-blue);
  padding: 16px 32px;
  border-radius: 100px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-white:hover {
  background: #F1F5F9;
  transform: translateY(-2px);
}

.btn-outline-white {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 16px 32px;
  border-radius: 100px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cta-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 90, 226, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 32px;
  letter-spacing: -0.04em;
}

.cta-button {
  display: inline-block;
  background: white;
  color: var(--primary-blue);
  padding: 20px 48px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  background: #f8fafc;
}
`;
