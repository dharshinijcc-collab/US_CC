export const studioStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

:root {
  /* Color System */
  --bg-base: #F3F5F9;
  --bg-light: #F8FAFC;
  --bg-dark: #0A0F1C;
  --bg-grey: #F1F5F9;
  
  --primary: #4F46E5;
  --primary-blue: #005AE2;
  
  --text-black: #020617;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --white: #FFFFFF;
  
  --border-light: #E2E8F0;
  --border-dark: rgba(255, 255, 255, 0.1);
  --success-green: #10B981;
  --accent-cyan: #00E6A0;
}

@keyframes ambientGlow {
  0% {
    opacity: 0.8;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-15px) scale(1.08);
  }
  100% {
    opacity: 0.8;
    transform: translateY(0) scale(1);
  }
}
.hero-ambient-glow {
  animation: ambientGlow 10s ease-in-out infinite;
}

/* Base Styles */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bg-light);
  color: var(--text-black);
  scroll-behavior: smooth;
}

/* Hide scrollbars */
::-webkit-scrollbar { display: none; }
* { -ms-overflow-style: none; scrollbar-width: none; }

/* Headings - Manrope */
h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .f-card-title, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
  font-family: 'Manrope', sans-serif !important;
  font-weight: 800 !important;
}
h1 {
  text-align: center !important;
}

/* Sub-text - Manrope */
.section-subtitle, .hero-description, .card-description, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
  font-family: 'Manrope', sans-serif;
}

/* Content - Inter */
p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
  font-family: 'Inter', sans-serif;
}

* { box-sizing: border-box; }

.studio-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

.section-container { max-width: 100%; }
.pt-0 { padding-top: 0 !important; }
.pb-0 { padding-bottom: 0 !important; }

/* Typography */
.hero-title { 
  font-family: 'Manrope', sans-serif !important;
  font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
  font-weight: 800 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.22 !important; /* increased line-height for elite aesthetic */
  color: var(--text-black) !important;
  text-align: center !important;
  width: 100%;
  margin: 0 auto 28px !important; /* increased spacing below heading */
  max-width: 960px !important; /* wider boundaries for magnificent scale */
}
.hero-title span {
  font-family: 'Manrope', sans-serif !important;
  font-weight: 800 !important;
}
@media(max-width: 768px) {
  .hero-title {
    font-size: 32px !important;
    line-height: 1.25 !important;
  }
}
.hero-title-text {
  text-align: center !important;
  display: block;
  width: 100%;
}
.text-blue { color: var(--primary-blue); }

.section-title { 
  font-family: 'Manrope', sans-serif !important;
  font-size: 36px !important; 
  font-weight: 800 !important; 
  letter-spacing: -0.02em !important; 
  margin-bottom: 12px !important; 
  line-height: 1.25 !important; 
  text-align: center;
  color: var(--text-black) !important;
}
@media(max-width: 768px) {
  .section-title {
    font-size: 26px !important;
  }
}
.section-title-left { text-align: left; }
.title-dark { color: var(--white) !important; }

.section-eyebrow {
  display: inline-block;
  background-color: #E6EFFF !important;
  color: var(--primary-blue) !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 16px;
  font-family: 'Manrope', sans-serif !important;
}

.hero-eyebrow-pill {
  display: inline-block;
  background-color: #E6EFFF !important;
  color: var(--primary-blue) !important;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.8rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  margin-bottom: 32px;
  text-transform: uppercase !important;
  font-family: 'Manrope', sans-serif !important;
}

.thesis-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 4rem;
  align-items: start;
}
@media(max-width: 991px) {
  .thesis-grid {
    grid-template-columns: 1fr !important;
    gap: 2.5rem !important;
  }
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.thesis-text-scroll {
  max-height: none;
  overflow-y: visible;
  padding-right: 0;
}

.section-subtitle, .hero-description {
  font-family: 'Inter', sans-serif !important;
  color: var(--text-muted) !important;
  font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
  line-height: 1.65 !important;
  font-weight: 500 !important;
  max-width: 650px;
  margin: 0 auto 24px !important;
  text-align: center !important;
}

.body-text {
  font-family: 'Inter', sans-serif !important;
  font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
  line-height: 1.65 !important;
  color: var(--text-muted) !important;
  font-weight: 500 !important;
}

/* Buttons */
.btn-primary { 
  background-color: var(--primary-blue); 
  color: var(--white); 
  padding: 16px 40px; 
  border-radius: 100px; 
  font-weight: 700; 
  font-size: 16px; 
  border: none; 
  cursor: pointer; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  display: inline-block;
  box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
}
.btn-primary:hover { 
  background-color: #004ac2; 
  transform: translateY(-2px); 
  box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
}
.btn-primary:active { transform: translateY(0) scale(0.98); }
.btn-nav { padding: 10px 24px; font-size: 14px; box-shadow: none;}
.btn-secondary {
  background-color: #004ac2;
  color: var(--primary-white);
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 16px;
  border: 2px solid var(--primary-blue);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
}
.btn-secondary:hover {
  background-color: var(--primary-blue);
  color: var(--white);
  transform: translateY(-2px);
}

/* Layout & Grids */

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
.grid-2-align-top { align-items: start; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

/* Sections */
.section-white { background-color: var(--white); }
.section-base { background-color: var(--bg-base); }
.section-dark { background-color: var(--bg-dark); color: var(--white); }

/* Hero Carousel Stepper */
.hero-carousel-panel {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
}
.hero-carousel-tabs {
  display: flex;
  border-bottom: 1px solid #E2E8F0;
  background: #FFFFFF;
  overflow-x: auto;
}
.hero-carousel-tab {
  flex: 1;
  padding: 14px 10px;
  border: none;
  background: none;
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94A3B8;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.hero-carousel-tab.active {
  color: #005AE2;
  border-bottom-color: #005AE2;
  background: #F0F7FF;
}
.hero-carousel-body {
  flex: 1;
  padding: 28px 28px 20px;
  overflow-y: auto;
  animation: hcFadeIn 0.3s ease;
}
@keyframes hcFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hcFadeIn {
  animation: hcFadeIn 0.4s ease;
}
.hc-phase-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #005AE2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.hc-phase-title {
  font-family: 'Manrope', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  line-height: 1.2;
}
.hc-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.hc-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.hc-card:hover {
  border-color: #005AE2;
  box-shadow: 0 4px 16px rgba(0,90,226,0.08);
}
.hc-card-title {
  font-family: 'Manrope', sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 6px;
}
.hc-card-desc {
  font-size: 0.75rem;
  color: #64748B;
  line-height: 1.5;
}
/* Comparison table inside hero carousel */
.hc-comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.72rem;
}
.hc-comparison-table th {
  background: #DBEAFE;
  padding: 10px 12px;
  text-align: left;
  font-weight: 800;
  color: #0F172A;
  border-bottom: 1px solid #E2E8F0;
}
.hc-comparison-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #F1F5F9;
  color: #64748B;
  line-height: 1.4;
}
.hc-comparison-table tr:last-child td { border-bottom: none; }
.hc-comparison-table td:first-child { font-weight: 700; color: #0F172A; }
.hc-comparison-table td:last-child  { color: #005AE2; font-weight: 700; }
.hero-carousel-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  border-top: 1px solid #E2E8F0;
  background: #FFFFFF;
}
.hc-nav-dots {
  display: flex;
  gap: 6px;
}
.hc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #CBD5E1;
  cursor: pointer;
  transition: all 0.2s;
}
.hc-dot.active {
  background: #005AE2;
  width: 18px;
  border-radius: 4px;
}
.hc-nav-btn {
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  font-size: 1rem;
  transition: all 0.2s;
}
.hc-nav-btn:hover { background: #F0F7FF; border-color: #005AE2; color: #005AE2; }
.hc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.hero-eyebrow-pill {
  display: inline-flex;
  background-color: #E6EFFF;
  color: #005AE2;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 8px 18px;
  border-radius: 100px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.hero-img-col {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
  height: 100%;
  min-height: 400px;
  background-color: var(--bg-dark);
  position: relative;
}
.hero-img-bg {
  width: 100%; height: 100%; position: absolute; top:0; left:0;
}
.hero-img-badge {
  position: absolute;
  bottom: 32px; left: 32px; right: 32px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}
.hero-badge-dot {
  width: 6px; height: 6px; background-color: #00E6A0; border-radius: 50%; display: inline-block; margin-right: 8px;
}
.hero-badge-tag { font-size: 0.7rem; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; margin-bottom: 8px;}
.hero-badge-val { font-size: 2rem; font-weight: 800; color: var(--white); line-height: 1; margin-bottom: 4px;}
.hero-badge-lbl { font-size: 0.75rem; font-weight: 500; color: #9CA3AF; }

.status-badge { 
  background-color: rgba(16, 185, 129, 0.1); 
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--success-green); 
  padding: 12px 16px; 
  border-radius: 8px; 
  font-size: 0.875rem; font-weight: 600; 
  display: flex; align-items: center; gap: 8px; 
  margin-top: 32px;
}

/* Generic Cards */
.card { 
  background-color: var(--white); 
  border: 1px solid var(--border-light); 
  padding: 20px; 
  border-radius: 24px; 
  aspect-ratio: 1 / 1;
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
  display: flex; flex-direction: column;
  justify-content: center;
  position: relative;
  transform-style: preserve-3d;
}
.card:hover { 
  transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
  background-color: var(--bg-dark); 
  color: var(--white); 
  border: 1px solid var(--border-dark); 
}

.card-title { font-size: clamp(1.05rem, 2vw, 1.15rem) !important; font-weight: 800; margin-bottom: 8px !important; letter-spacing: -0.02em; color: var(--text-black); transition: color 0.3s;}
.card:hover .card-title { color: var(--white); }

.card-desc { font-size: 0.85rem !important; color: var(--text-muted); line-height: 1.45 !important; margin-bottom: 16px !important; font-weight: 500; flex-grow: 1; transition: color 0.3s;}
.card:hover .card-desc { color: #9CA3AF; }

.icon-circle { width: 48px; height: 48px; border-radius: 12px; background-color: #F0F5FF; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background-color 0.3s, color 0.3s;}
.card:hover .icon-circle { background-color: var(--primary-blue); color: var(--white); }

.card-link { font-weight: 800; font-size: 0.875rem; color: var(--primary-blue); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s;}
.card:hover .card-link { color: var(--accent-cyan); }

.card-desc span { color: var(--text-main); transition: color 0.3s; }
.card:hover .card-desc span { color: var(--white); }

/* Lists */
.check-list { list-style: none; padding: 0; margin: 0 0 32px 0; }
.check-list li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 16px; }
.card-dark .check-list li { color: var(--white); }
.check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem;}

/* --- UPDATED: Solving It Section (Dark) & Stacked Fanned Cards --- */
.solving-col-text {
  font-size: clamp(1.125rem, 2.5vw, 1.35rem);
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  text-align: center;
  font-weight: 500;
  max-width: 400px;
  margin: 0 auto;
}
.solving-subtitle {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 800;
  color: var(--white);
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: -0.01em;
}

.card-stack-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* The white rounded-square cards fanning out */
.card-stack-item {
  position: absolute;
  width: 300px;
  height: 300px;
  background: var(--white);
  border-radius: 20px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  transform-origin: center center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #E2E8F0;
}

.card-stack-icon {
  width: 56px;
  height: 56px;
  background-color: #FF8EBB; /* Exact pink from the image */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: white;
  flex-shrink: 0;
}

.card-stack-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.8;
  font-weight: 600;
  overflow: hidden;
  margin: 0;
}

/* Highlight active card on hover */
.card-stack-item.active-hover:hover {
  transform: translateY(-10px) rotate(2deg) scale(1.05) !important;
  box-shadow: 0 40px 80px -15px rgba(0, 90, 226, 0.25) !important;
  z-index: 60 !important;
}
.card-stack-item {
  cursor: pointer;
}

/* Purple 'C' Bubble Badge at bottom right of the card stack */
.c-badge-bubble {
  position: absolute;
  bottom: -16px;
  right: -16px;
  width: 72px;
  height: 72px;
  background-color: white;
  border-radius: 50%;
  border-bottom-left-radius: 4px; /* Creates the teardrop shape pointing down-left */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 30;
}
.c-badge-inner {
  width: 52px;
  height: 52px;
  background-color: #B548C6; /* Purple color from image */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 20px;
}

/* Why Ideas Fail Section */
.feature-box { background-color: var(--bg-dark); color: var(--white); padding: 20px; border-radius: 20px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid var(--border-dark); }
.feature-box-icon { width: 40px; height: 40px; background-color: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); flex-shrink: 0;}
.feature-box h4 { margin: 0 0 8px 0; font-size: 1.15rem; font-weight: 800; }
.feature-box p { margin: 0; font-size: 0.95rem; color: #9CA3AF; line-height: 1.6; font-weight: 500;}
.image-box-abstract { border-radius: 24px; overflow: hidden; height: 100%; min-height: 400px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);}

/* What We Look For */
.look-card { background: #F1F3F5; border-radius: 32px; padding: 24px 24px; text-align: left; border: none; box-shadow: none; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; transition: transform 0.3s ease; }
.look-card:hover { transform: translateY(-8px); }
.look-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #005AE2; margin-bottom: 40px; background: none; padding: 0; }
.look-icon svg { width: 100%; height: 100%; }
.look-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-black); }
.look-desc { font-size: 1rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }


/* ── NEW STYLES: Selection Steps & Premium Values ── */
.selection-step-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 32px 24px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
}
.selection-step-card:hover {
  transform: translateY(-6px);
  border-color: #005AE2 !important;
  box-shadow: 0 20px 40px -10px rgba(0,90,226,0.1) !important;
}

.value-premium-card {
  background: var(--card-bg, #F8FAFC) !important;
  border: 1px solid var(--card-border, #E2E8F0) !important;
  border-radius: 20px;
  padding: 24px 24px;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 230px;
  z-index: 1;
}
.value-premium-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--card-glow);
  opacity: 0.7;
  transition: height 0.3s ease, opacity 0.3s ease;
}
.value-premium-card:hover {
  transform: translateY(-6px);
  background: var(--card-bg-hover, #FFFFFF) !important;
  border-color: var(--card-border-hover, var(--card-glow)) !important;
  box-shadow: 0 15px 30px -5px var(--card-glow-shadow), 0 0 0 1px rgba(0, 0, 0, 0.02) !important;
}
.value-premium-card:hover::after {
  height: 5px;
  opacity: 1;
}
.value-card-bg-num {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2.25rem;
  font-weight: 800;
  font-family: 'Manrope', sans-serif;
  color: rgba(0, 0, 0, 0.035);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  transition: all 0.35s ease;
}
.value-premium-card:hover .value-card-bg-num {
  color: var(--card-glow);
  opacity: 0.15;
  transform: scale(1.08);
}

@media (max-width: 768px) {
  .timeline-table-section {
    padding: 48px 16px;
  }
  
  .timeline-table, .timeline-table thead, .timeline-table tbody, .timeline-table th, .timeline-table td, .timeline-table tr {
    display: block;
    width: 100%;
  }

  .timeline-table thead {
    display: none;
  }

  .timeline-table tr {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 16px;
    padding: 16px;
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
  }

  .timeline-table td {
    padding: 6px 0;
    border: none !important;
    width: 100% !important;
  }

  .timeline-table td.stage-col {
    font-size: 0.8rem;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
  }

  .timeline-table td.title-col {
    font-size: 1.1rem;
    padding-bottom: 8px;
    border-bottom: 1px solid #F1F5F9 !important;
    margin-bottom: 8px;
  }

  .timeline-table td.desc-col {
    font-size: 0.9rem;
    color: #475569;
    padding-bottom: 12px;
  }

  .timeline-table td.duration-col {
    border-top: 1px solid #F1F5F9 !important;
    padding-top: 10px;
    font-size: 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .timeline-table td.duration-col::before {
    content: 'DURATION';
    font-weight: 700;
    color: #64748B;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
}

/* FAQ */
.faq-item { background-color: var(--white); border: 1px solid var(--border-light); border-radius: 20px; padding: 24px 32px; margin-bottom: 16px; cursor: pointer; transition: box-shadow 0.2s;}
.faq-item:hover { box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05); }
.faq-header { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: clamp(1rem, 2vw, 1.125rem); color: var(--text-main); }
.faq-icon { font-size: 1.5rem; color: var(--text-muted); font-weight: 400;}
.faq-content { margin-top: 16px; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-muted); line-height: 1.6; font-weight: 500; display: block; }


/* Mobile Responsive System */
@media (max-width: 900px) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .section-title {
    font-size: 2.25rem !important;
    text-align: center !important;
    transform: none !important;
    margin-bottom: 40px !important;
  }
  .hero-img-col {
    min-height: 400px !important;
    margin-top: 40px;
  }
  .card-stack-wrapper {
    height: 400px !important;
  }
  .card-stack-item {
    width: 320px !important;
    height: 320px !important;
    padding: 32px !important;
  }
  .solving-subtitle {
    font-size: 1.75rem !important;
    text-align: center !important;
  }
  .solving-col-text {
    font-size: 1rem !important;
    text-align: center !important;
  }
  .card {
    aspect-ratio: auto !important;
  }
}

/* Dark Shine Card */
.dark-shine-card {
  background-color: var(--bg-dark) !important;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255,255,255,0.05) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
}
.dark-shine-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-25deg);
  transition: left 0.7s ease;
  z-index: 1;
  pointer-events: none;
}
.dark-shine-card:hover::before {
  left: 200%;
}
.dark-shine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3) !important;
}

/* Mobile padding overrides */
@media (max-width: 768px) {
  [data-mobile-padding="40px 24px"] { padding: 40px 24px !important; }
  [data-mobile-padding="100px 24px"] { padding: 100px 24px !important; }
}

/* Phase Section - Selection Process */
.phase-section-wrap {
  position: relative;
  background: #F0EEE9;
  overflow: hidden;
}
.phase-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(191,219,254,0.45) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(221,214,254,0.35) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 60% 10%, rgba(254,215,170,0.3)  0%, transparent 50%);
}
.phase-watermark {
  font-family: 'Playfair Display', serif;
  font-size: clamp(6rem, 16vw, 10rem);
  font-weight: 900;
  line-height: 0.85;
  position: absolute;
  top: -10px;
  left: -8px;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  transition: opacity 0.5s ease, color 0.5s ease;
  opacity: 0.08;
}
.phase-pill {
  padding: 9px 20px;
  border-radius: 100px;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
  color: #888;
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.phase-pill:hover {
  background: rgba(255,255,255,0.8);
  color: #333;
  border-color: rgba(0,0,0,0.15);
}
.phase-pill.active {
  background: #fff;
  border-color: var(--pill-ac);
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  color: var(--pill-ac-dark);
}
.phase-pill.active .pill-num {
  color: var(--pill-ac);
}
.gcard {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.85);
  border-radius: 18px;
  padding: 24px 22px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: all 0.35s ease;
  animation: gcardIn 0.5s cubic-bezier(0.34,1.15,0.64,1) both;
}
.gcard:hover {
  background: rgba(255,255,255,0.75);
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
}
.gcard-green {
  border-left: 3px solid #10B981 !important;
  background: rgba(236,253,245,0.6) !important;
}
.gcard-amber {
  border-left: 3px solid #F59E0B !important;
  background: rgba(255,251,235,0.6) !important;
}
.gcard-red {
  border-left: 3px solid #EF4444 !important;
  background: rgba(254,242,242,0.6) !important;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.section-header h2 {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  max-width: 520px;
}

.section-header p {
  color: var(--text-muted);
  font-size: 0.975rem;
  max-width: 340px;
  line-height: 1.7;
}

.section-header .label {
  color: #64748B;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
@keyframes gcardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
.phase-tag-anim {
  animation: fadeUp 0.4s ease both;
}
.phase-title-anim {
  animation: fadeUp 0.45s ease 0.06s both;
}
.phase-desc-anim {
  animation: fadeUp 0.4s ease 0.12s both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
.counter-bar {
  flex: 1;
  height: 2px;
  background: rgba(0,0,0,0.08);
  border-radius: 1px;
  overflow: hidden;
  max-width: 120px;
}
.counter-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
}

/* ── DIFFERENTIATION ──────────────────────────────── */
.diff-header {
  max-width: 1200px;
  margin: 0 auto 5rem;
  text-align: center;
}

.diff-header .label {
  color: #005AE2;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.75rem;
  display: block;
  margin-bottom: 16px;
}

.diff-header h2 {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  max-width: 680px;
  margin: 0 auto 1rem;
  color: #0F172A;
}

.diff-header p {
  color: #64748B;
  font-size: 0.975rem;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.7;
}

.diff-table-wrap {
  max-width: 1200px;
  margin: 0 auto 0px !important;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  overflow: hidden;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
}

.diff-table th {
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.25rem 2rem;
  text-align: left;
  border-bottom: 1px solid #E2E8F0;
  color: #64748B;
}

.diff-table th.highlight {
  background: #F0F7FF;
  color: #005AE2;
  border-bottom-color: #BFDBFE;
}

.diff-table td {
  padding: 1.25rem 2rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #E2E8F0;
  color: #64748B;
}

.diff-table tr:last-child td { border-bottom: none; }

.diff-table td.feature {
  color: #0F172A;
  font-weight: 500;
  font-size: 0.925rem;
}

.diff-table td.highlight {
  background: #F0F7FF;
  color: #005AE2;
  font-weight: 600;
}

.diff-table tr:hover td { background: #F8FAFC; }
.diff-table tr:hover td.highlight { background: #E0F2FE; }

.check { color: #22c55e; font-size: 1rem; }
.cross { color: rgba(0,0,0,0.25); font-size: 1rem; }
.partial { color: #f59e0b; font-size: 0.8rem; font-style: italic; }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.selection-stepper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 20px 10px;
  gap: 8px;
  -webkit-overflow-scrolling: touch;
}
.selection-stepper-container::-webkit-scrollbar {
  display: none;
}
@media (max-width: 768px) {
  .diff-header { margin-bottom: 3rem; }
  .diff-table-wrap { overflow-x: auto; }
  .diff-table th, .diff-table td { padding: 1rem; font-size: 0.8rem; }
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .selection-stepper-container {
    justify-content: flex-start;
  }
}

.hero-split-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr;
  gap: clamp(24px, 5vw, 64px);
  align-items: start;
}
@media (max-width: 900px) {
  .hero-split-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
}
`;
