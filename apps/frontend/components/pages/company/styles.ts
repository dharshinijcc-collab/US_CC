export const companyStyles = `
/* ===== HERO ===== */
.company-hero {
  background: #FFFFFF;
  color: #0A0F1C;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.hero-glow {
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%);
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
.hero-glow-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  bottom: -100px;
  left: -50px;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.hero-glow-3 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  bottom: -100px;
  right: -50px;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #64748B;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== FILTER BAR ===== */
.filter-bar {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 28px 32px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}
.filter-pill {
  padding: 10px 22px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;
}
.filter-pill.active {
  background: #0A0F1C;
  color: white;
}
.filter-pill:not(.active) {
  background: white;
  color: #64748B;
  border-color: #E2E8F0;
}
.filter-pill:not(.active):hover {
  color: #0A0F1C;
  border-color: #CBD5E1;
}

/* ===== COMPANIES GRID ===== */
.companies-section {
  background: #FFFFFF;
  padding: var(--section-padding-y) var(--section-padding-x);
}
.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== COMPANY CARD ===== */
.company-card {
  background: white;
  border-radius: 24px;
  padding: 36px 32px;
  border: 1px solid #E2E8F0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.company-card:hover {
  transform: translateY(-6px);
  border-color: transparent;
}
.c-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.c-logo-avatar {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.c-est-badge {
  background: #F1F5F9;
  color: #64748B;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
}
.c-cat {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
}
.c-name {
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  font-weight: 800;
  color: #0A0F1C;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.c-desc {
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.65;
  margin-bottom: 24px;
  flex-grow: 1;
}
.c-tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.c-tag-badge {
  font-size: 0.75rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
}
.c-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.9375rem;
  color: #0A0F1C;
  text-decoration: none;
  transition: color 0.2s;
  margin-top: auto;
}
.c-link:hover {
  color: #005AE2;
}

/* ===== PROBLEMS WE LOVE SECTION ===== */
.problems-section {
  background: #FFFFFF;
  padding: var(--section-padding-y) var(--section-padding-x);
}
.problems-container {
  max-width: 1200px;
  margin: 0 auto;
}
.problems-header {
  margin-bottom: 48px;
}
.problems-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #0A0F1C;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.problems-subtitle {
  font-size: 1.125rem;
  color: #64748B;
  font-weight: 500;
}
.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}
.problem-card {
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  padding: 40px;
  background: #FFFFFF;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.problem-card:hover {
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
  border-color: #CBD5E1;
}
.problem-icon {
  width: 48px;
  height: 48px;
  background: #F0F5FF;
  color: #005AE2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.problem-card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0A0F1C;
  margin-bottom: 12px;
}
.problem-card-desc {
  color: #64748B;
  line-height: 1.6;
  font-size: 0.9375rem;
}
@media (max-width: 768px) {
  .problems-grid { grid-template-columns: 1fr; }
  .problem-card { padding: 32px 24px; }
}

/* ===== HOW IT GETS BORN (PROCESS) SECTION ===== */
.process-section {
  background: #FAFAFA;
  padding: var(--section-padding-y) var(--section-padding-x);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.process-header-box {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin-bottom: 64px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
  position: relative;
  z-index: 2;
}
.process-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #0A0F1C;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.process-subtitle {
  color: #64748B;
  font-size: 1rem;
  line-height: 1.6;
}
.process-list-container {
  max-width: 500px;
  width: 100%;
  position: relative;
  margin-bottom: 80px;
}
/* Vertical connecting line */
.process-list-container::before {
  content: '';
  position: absolute;
  left: 28px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: #E2E8F0;
  z-index: 0;
}
.process-item {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
}
.process-item:last-child {
  margin-bottom: 0;
}
.process-icon {
  width: 56px;
  height: 56px;
  background: #0F172A;
  color: #FFFFFF;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 8px #FAFAFA; /* creates space matching background to cut the line */
}
.process-content {
  padding-top: 6px;
}
.process-item-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #0A0F1C;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.process-item-num {
  font-weight: 800;
  color: #0A0F1C;
}
.process-item-desc {
  color: #64748B;
  line-height: 1.6;
  font-size: 0.9375rem;
}
.process-image-wrapper {
  max-width: 700px;
  width: 100%;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
  position: relative;
}
/* Overlay to give it that faded abstract look */
.process-image-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(250, 250, 250, 0.4);
  mix-blend-mode: overlay;
  pointer-events: none;
}
.process-image {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(100%) contrast(1.2) brightness(1.1);
  opacity: 0.8;
  transition: transform 0.5s ease, filter 0.5s ease;
}
.process-image-wrapper:hover .process-image {
  transform: scale(1.02);
  filter: grayscale(50%) contrast(1.1) brightness(1);
}
@media (max-width: 640px) {
  .process-list-container::before { left: 24px; }
  .process-icon { width: 48px; height: 48px; }
  .process-item { gap: 20px; }
  .process-header-box { padding: 32px 20px; }
}

/* ===== DARK SECTION (Make Innovation Accessible) ===== */
.section-dark {
  position: relative;
  background-color: #0A0F1C;
  color: #FFFFFF;
  overflow: hidden;
}
.section-container {
  max-width: 100%;
  margin: 0 auto;
}
.section-eyebrow {
  color: #005AE2;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: clamp(0.6875rem, 1vw, 0.8125rem);
  margin-bottom: 16px;
  font-family: 'Manrope', sans-serif;
}
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: clamp(16px, 3vw, 24px);
  line-height: 1.1;
  font-family: 'Manrope', sans-serif;
}
.dark-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.feature-bullet {
  width: 38px;
  height: 38px;
  border-radius: 100px;
  background-color: rgba(37,99,235,0.15);
  border: 2px solid #005AE2;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #005AE2;
  font-weight: 800;
  font-size: 1rem;
}
.feature-title {
  font-size: clamp(0.9375rem, 2vw, 1.125rem);
  font-weight: 800;
  margin-bottom: 6px;
  color: #FFFFFF;
  font-family: 'Manrope', sans-serif;
}
.feature-desc {
  color: #9CA3AF;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Manrope', sans-serif;
}
.testimonial-card-dark {
  background-color: #0F172A;
  padding: 40px 36px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.t-card-quote {
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: 36px;
  color: #FFFFFF;
}
.t-card-author {
  display: flex;
  align-items: center;
  gap: 14px;
}
.t-avatar {
  width: 46px;
  height: 46px;
  background-color: #334155;
  border-radius: 100px;
  flex-shrink: 0;
}
.t-name {
  font-weight: 800;
  font-size: 1rem;
  color: #FFFFFF;
  font-family: 'Manrope', sans-serif;
}
.t-role {
  color: #9CA3AF;
  font-size: clamp(0.6875rem, 1vw, 0.8125rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
  font-family: 'Manrope', sans-serif;
}

/* ===== FOOTER WRAPPER ===== */
.cc-footer-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}
.cc-footer-wrapper .footer {
  width: 100%;
  max-width: 100%;
}

/* ===== PAGE LAYOUT FIX ===== */
main {
  position: relative;
  z-index: 1;
}
.company-hero {
  position: relative;
  z-index: 1;
}

/* ===== RESPONSIVE: TABLET (max 900px) ===== */
@media (min-width: 900px) {
  .dark-grid {
    grid-template-columns: 1fr 1fr;
    gap: 64px;
  }
}

/* ===== RESPONSIVE: MOBILE (max 768px) ===== */
@media (max-width: 768px) {
  .company-hero {
    padding: 120px 24px 60px;
  }
  .hero-glow {
    width: 300px;
    height: 300px;
  }
  .filter-bar {
    padding: 20px 24px;
    gap: 8px;
  }
  .filter-pill {
    padding: 8px 16px;
    font-size: 0.8125rem;
  }
  .companies-section {
    padding: 40px 24px 60px;
  }
  .companies-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .company-card {
    padding: 28px 24px;
    border-radius: 20px;
  }
  .c-logo-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 1rem;
  }
  .c-header-row {
    margin-bottom: 16px;
  }
  .c-tag-list {
    margin-bottom: 20px;
  }
  .section-container {
    padding: 64px 24px;
  }
  .testimonial-card-dark {
    padding: 28px 24px;
    border-radius: 20px;
  }
  .t-card-quote {
    margin-bottom: 24px;
  }
  .feature-list {
    gap: 20px;
  }
  .feature-bullet {
    width: 34px;
    height: 34px;
    font-size: 0.875rem;
  }
}

/* ===== RESPONSIVE: SMALL MOBILE (max 480px) ===== */
@media (max-width: 480px) {
  .company-hero {
    padding: 100px 16px 48px;
  }
  .company-card {
    padding: 24px 20px;
  }
  .c-est-badge {
    font-size: 0.6875rem;
    padding: 5px 10px;
  }
  .companies-section {
    padding: 32px 12px 48px;
  }
  .filter-bar {
    padding: 16px 12px;
  }
  .section-container {
    padding: 52px 16px;
  }
}
`;
