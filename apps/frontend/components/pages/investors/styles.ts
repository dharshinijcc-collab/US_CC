export const investorsStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  /* Color System matching Studio page */
  --primary-blue: #005AE2;
  --accent-gold: #c5a880; /* Elegant gold for 'Built to Last' heading highlight */
  --text-black: #020617;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --bg-light: #F8FAFC;
  --bg-grey: #F1F5F9;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-light);
  color: var(--text-black);
  margin: 0;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Hide scrollbars */
::-webkit-scrollbar { display: none; }
* { -ms-overflow-style: none; scrollbar-width: none; }

h1, h2, h3, h4, h5, h6 {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

.section-container {
  max-width: 1200px;
}

/* Hero Section */
.hero-section {
  background-color: #F1F5F9 !important;
}
.hero-eyebrow-pill {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #E6EFFF !important;
  color: #005AE2 !important;
  font-size: 0.8rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.1em !important;
  padding: 8px 18px !important;
  border-radius: 100px !important;
  margin-bottom: 32px !important;
  text-transform: uppercase !important;
  font-family: 'Manrope', sans-serif !important;
}
.hero-title {
  font-family: 'Manrope', sans-serif !important;
  font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
  font-weight: 800 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.22 !important;
  color: #020617 !important;
  margin: 0 auto 28px !important;
  text-align: center !important;
  max-width: 960px !important;
}
.hero-title span {
  font-family: 'Manrope', sans-serif !important;
  font-weight: 800 !important;
}
.btn-primary {
  display: inline-block !important;
  padding: 16px 36px !important;
  border-radius: 100px !important;
  font-weight: 700 !important;
  font-family: 'Inter', sans-serif !important;
  text-decoration: none !important;
  background-color: var(--primary-blue) !important;
  color: #FFFFFF !important;
  font-size: 0.95rem !important;
  border: none !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 10px 20px -6px rgba(0, 90, 226, 0.3) !important;
}
.btn-primary:hover {
  background-color: #004ac2 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 15px 30px -8px rgba(0, 90, 226, 0.4) !important;
}
@media(max-width: 768px) {
  .hero-title {
    font-size: 32px !important;
    line-height: 1.25 !important;
  }
}
.hero-description {
  font-family: 'Inter', sans-serif !important;
  font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
  font-weight: 500 !important;
  color: #64748B !important;
  line-height: 1.65 !important;
  max-width: 650px !important;
  margin: 0 auto 24px !important;
  text-align: center !important;
}

/* Premium Center-Aligned Headings Structure */
.section-header-centered {
  text-align: center;
  margin-bottom: 24px;
}
.section-header-centered .label {
  color: var(--primary-blue) !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  display: block;
  margin-bottom: 12px;
  font-family: 'Manrope', sans-serif !important;
}
.section-header-centered h2 {
  font-size: 36px !important;
  color: var(--text-black) !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.25 !important;
  max-width: 800px;
  margin: 0 auto 12px;
}
@media(max-width: 768px) {
  .section-header-centered h2 {
    font-size: 26px !important;
  }
}
.section-header-centered p {
  color: var(--text-muted) !important;
  font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
  line-height: 1.65 !important;
  max-width: 680px;
  margin: 0 auto;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
}

/* Why Invest Stack Cards */
.why-invest-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.why-invest-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-blue);
  box-shadow: 0 16px 32px rgba(0, 90, 226, 0.05);
}

/* Two Paths Cards */
.path-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.path-card:hover {
  transform: translateY(-6px);
  border-color: var(--primary-blue);
  box-shadow: 0 24px 48px rgba(0, 90, 226, 0.08);
}

/* Premium Benefit Cards */
.benefit-card-new {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 20px 20px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
.benefit-card-new:hover {
  transform: translateY(-8px) scale(1.01);
  border-color: var(--card-glow);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.benefit-badge {
  align-self: flex-start;
  background: #F1F5F9;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 4px 10px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  color: #475569;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
}

/* Selective Item Checklist */
.selective-item {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
}
.selective-item:hover {
  transform: translateY(-2px);
  border-color: var(--primary-blue);
  box-shadow: 0 12px 24px rgba(0, 90, 226, 0.04);
}
.selective-check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #F0F7FF;
  color: var(--primary-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
}

/* Clear Terms Cards */
.term-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition: all 0.3s ease;
}
.term-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-blue);
  box-shadow: 0 16px 32px rgba(0, 90, 226, 0.04);
}
.term-card h3 {
  font-size: 1.1rem !important;
  margin-bottom: 8px !important;
}
.term-card p {
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
}
.path-card, .benefit-card-new {
  padding: 20px !important;
  border-radius: 16px !important;
}

/* Premium Bottom CTA Strategic Interest Form */
.form-section-card {
  background: #0A0F1C;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 36px;
  padding: 24px 24px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
}

.investor-cta-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.6fr;
  gap: 24px;
  align-items: stretch;
}

.form-input-light {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 0.9rem;
  color: #0F172A;
  transition: all 0.2s ease;
  outline: none;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}
.form-input-light::placeholder {
  color: #9CA3AF;
}
.form-input-light:focus {
  border-color: #0047AB;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.12);
}
.form-input-light.has-error {
  border-color: #EF4444 !important;
  background-color: #FEF2F2 !important;
}

.custom-checkbox-light {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.82rem;
  color: #374151;
  font-family: 'Inter', sans-serif;
  user-select: none;
}
.custom-checkbox-light:hover {
  border-color: #CBD5E1;
  background: #F1F5F9;
}
.custom-checkbox-light input {
  accent-color: #0047AB;
  cursor: pointer;
}
.custom-checkbox-light:has(input:checked) {
  border-color: #0047AB;
  background: #0047AB;
  color: #FFFFFF;
}

.btn-navy-pill {
  width: 100%;
  background-color: #0047AB !important;
  color: #FFFFFF !important;
  padding: 14px 24px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  border: none !important;
  cursor: pointer;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  transition: all 0.25s ease !important;
  font-family: 'Inter', sans-serif !important;
  box-shadow: 0 4px 14px rgba(0, 71, 171, 0.22) !important;
}
.btn-navy-pill:hover {
  background-color: #003584 !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(0, 71, 171, 0.35) !important;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.95rem;
  color: white;
  transition: all 0.25s ease;
  outline: none;
  font-family: 'Inter', sans-serif;
}
.form-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.form-input:focus {
  border-color: var(--primary-blue);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.15);
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Inter', sans-serif;
}
.custom-checkbox:hover {
  border-color: var(--primary-blue);
  background: rgba(255, 255, 255, 0.06);
}
.custom-checkbox input {
  display: none;
}
.checkmark {
  width: 18px;
  height: 18px;
  border: 2.2px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: transparent;
  flex-shrink: 0;
}
.custom-checkbox input:checked + .checkmark {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
}
.custom-checkbox input:checked + .checkmark::after {
  content: "";
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
  left: 5px;
  top: 1px;
  position: relative;
}
.custom-checkbox:has(input:checked) {
  border-color: var(--primary-blue);
  background: rgba(0, 90, 226, 0.12);
  color: white;
}

.btn-pill {
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.grid-2 { display: grid; grid-template-columns: 1fr 1.15fr; gap: 48px; align-items: start; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

@media (max-width: 900px) {
  .investor-cta-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
  .section-container {
    max-width: 1200px;
  }
  .form-section-card {
    padding: 24px 24px !important;
  }
}
`;
