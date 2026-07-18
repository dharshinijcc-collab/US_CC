export const contactStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  /* Color System */
  --bg-base: #FFFFFF;
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

/* Base Styles */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bg-base);
  color: var(--text-black);
  scroll-behavior: smooth;
}

/* Headings - Manrope */
h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
  font-family: 'Manrope', sans-serif;
}

/* Sub-text - Manrope */
.section-subtitle, .hero-description, .card-description, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
  font-family: 'Manrope', sans-serif;
}

/* Content - Inter */
p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
  font-family: 'Inter', sans-serif;
}

/* Page Load Animation */
.contact-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

/* Fade In Up Animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeInUp 0.6s ease-out forwards; }
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }

.page-wrapper { min-height: 100vh; overflow-x: hidden; padding-bottom: 0; }
.pt-0 { padding-top: 0 !important; }
.pb-0 { padding-bottom: 0 !important; }

.hero-eyebrow-pill {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #E6EFFF !important;
  color: #005AE2 !important;
  font-size: 0.8rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  padding: 8px 18px !important;
  border-radius: 100px !important;
  margin-bottom: 32px !important;
  text-transform: uppercase !important;
  font-family: 'Manrope', sans-serif !important;
}
.hero-description {
  font-family: 'Inter', sans-serif !important;
  font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
  font-weight: 500 !important;
  color: #64748B !important;
  line-height: 1.8 !important;
  max-width: 720px !important;
  margin: 0 auto 32px !important;
  text-align: center !important;
}

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
.text-bright-blue { 
  color: var(--bright-blue);
  background: linear-gradient(135deg, var(--primary-blue), var(--bright-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 90, 226, 0.3);
}

.section-title { 
  font-size: 36px !important; 
  font-weight: 800; 
  letter-spacing: -0.02em; 
  margin-bottom: clamp(12px, 2vw, 16px); 
  line-height: 1.2; 
  color: var(--text-black);
}

.hero-eyebrow-pill {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #E6EFFF !important;
  color: var(--primary-blue) !important;
  padding: 8px 18px !important; /* increased padding */
  border-radius: 100px !important;
  font-size: 0.8rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  margin-bottom: 32px !important; /* increased spacing */
  text-transform: uppercase !important;
  font-family: 'Manrope', sans-serif !important;
}

.body-text {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  line-height: 1.6;
  color: var(--text-muted);
  font-weight: 500;
}

/* 3D Buttons */
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
  text-decoration: none;
}
.btn-primary:hover { 
  background-color: #004ac2; 
  transform: translateY(-2px); 
  box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
}
.btn-primary:active { transform: translateY(0) scale(0.98); }
.btn-bright { 
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
  box-shadow: 
    0 4px 15px rgba(0, 136, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}
.btn-bright::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}
.btn-bright:hover {
  transform: translateY(-3px) translateZ(15px) scale(1.05);
  box-shadow: 
    0 8px 25px rgba(0, 136, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.btn-bright:hover::before {
  left: 100%;
}
.btn-bright:active {
  transform: translateY(-1px) translateZ(15px) scale(0.98);
}

.btn-dark {
  background: linear-gradient(135deg, var(--bg-dark), #1a2332);
  color: var(--white);
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(15px);
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.btn-dark:hover {
  transform: translateY(-2px) translateZ(15px);
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-white {
  background-color: var(--white);
  color: var(--bright-blue);
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  transform: translateZ(10px);
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.btn-white:hover { transform: translateY(-2px) translateZ(10px); }

/* Layout Grids */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 48px); align-items: center; }
.grid-2-align-top { align-items: start; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

/* Hero Section — spacing from global-styles.css */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  overflow: hidden;
  background-color: #F1F5F9 !important;
  box-sizing: border-box;
  min-height: auto;
  padding-top: 128px !important;
  padding-bottom: var(--section-padding-bottom) !important;
  padding-left: var(--section-padding-x) !important;
  padding-right: var(--section-padding-x) !important;
}

@media (max-width: 1024px) {
  .hero-section {
    min-height: auto;
    padding-top: 110px !important;
    padding-bottom: var(--section-padding-bottom-tablet) !important;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding-top: 110px !important;
    padding-bottom: var(--section-padding-bottom-tablet) !important;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: auto;
    padding-top: 102px !important;
    padding-bottom: var(--section-padding-bottom-mobile) !important;
  }
}
.hero-image-wrap {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
  height: 100%;
  min-height: 450px;
  background: url('/images/contact_hero_abstract_tech.png') center/cover;
  transform: translateZ(20px);
  transition: transform 0.3s ease;
}
.hero-image-wrap:hover {
  transform: translateZ(20px) scale(1.02);
}

/* Interactive Service Cards */
.services-list { display: flex; flex-direction: column; gap: 16px; margin-top: 24px;}
.service-card {
  display: flex; align-items: center; gap: 20px;
  padding: 16px 20px;
  border-radius: 16px;
  background: var(--white);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateZ(10px);
  box-shadow: 
    0 4px 10px rgba(0,0,0,0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.service-card:hover { 
  border-color: #CBD5E1; 
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  transform: translateY(-2px) translateZ(10px);
}
.service-card.active {
  border-color: var(--bright-blue);
  box-shadow: 
    0 15px 40px rgba(0, 136, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
.service-icon-box {
  width: 48px; height: 48px; border-radius: 12px;
  background-color: var(--bg-grey);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  transform: translateZ(5px);
}
.service-card.active .service-icon-box { 
  background-color: var(--light-blue-bg); 
  color: var(--bright-blue);
  transform: translateZ(5px) scale(1.1);
}
.service-title { font-size: 1.1rem; font-weight: 800; color: var(--text-black); margin-bottom: 4px; }
.service-desc { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin: 0;}

/* Form Card */
.form-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 40px 80px -20px rgba(0,0,0,0.12),
    0 0 0 1px rgba(0,0,0,0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateZ(30px);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.02);
}
.form-card:hover {
  transform: translateY(-2px) translateZ(30px);
  box-shadow: 
    0 60px 100px -30px rgba(0,0,0,0.15),
    0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
@media(max-width: 640px) { .form-row-2 { grid-template-columns: 1fr; gap: 24px; } }
.form-group { display: flex; flex-direction: column; margin-bottom: 24px; }
.form-group:last-child { margin-bottom: 0; }
.form-label { font-size: 0.85rem; font-weight: 800; color: var(--text-black); margin-bottom: 12px; }
.form-input {
  padding: 16px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-black);
  outline: none;
  transition: all 0.3s ease;
  background: var(--bg-base);
  transform: translateZ(5px);
}
.form-input::placeholder { color: #9CA3AF; font-weight: 500;}
.form-input:focus { 
  border-color: var(--bright-blue); 
  background-color: var(--white);
  transform: translateZ(5px);
}
textarea.form-input { resize: none; min-height: 120px; }

/* Custom Select */
select.form-input {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat; background-position: right 16px center; background-size: 16px;
  transform: translateZ(5px);
}

/* Radio Pills */
.radio-pill-group { display: flex; flex-wrap: wrap; gap: 12px; }
.radio-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  background: var(--bg-base);
  border: 1px solid var(--border-light);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer; 
  transition: all 0.3s ease;
  transform: translateZ(5px);
}
.radio-pill:hover { 
  border-color: #CBD5E1; 
  transform: translateY(-1px) translateZ(5px);
}
.radio-pill.active { 
  background: var(--white); 
  border-color: var(--bright-blue); 
  color: var(--text-black); 
  box-shadow: 
    0 4px 10px rgba(0, 136, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.radio-circle { 
  width: 16px; 
  height: 16px; 
  border-radius: 50%; 
  border: 2px solid #CBD5E1; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  transform: translateZ(3px);
}
.radio-pill.active .radio-circle { 
  border-color: var(--bright-blue);
  transform: translateZ(3px) scale(1.1);
}
.radio-pill.active .radio-circle::after { 
  content: ''; 
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
  background-color: var(--bright-blue); 
}
.radio-pill input[type="radio"] { display: none; }

/* Contact Info Cards */
.contact-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 900px; margin: 40px auto 0; }
.info-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 24px;
  padding: 20px 20px;
  text-align: center;
  box-shadow: 
    0 10px 40px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateZ(20px);
  transition: all 0.3s ease;
}
.info-card:hover {
  transform: translateY(-3px) translateZ(20px);
  box-shadow: 
    0 15px 50px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
.info-icon { 
  width: 48px; 
  height: 48px; 
  background: var(--light-blue-bg); 
  color: var(--bright-blue); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  margin: 0 auto 24px; 
  transform: translateZ(10px);
}
.info-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 12px; color: var(--text-black); }
.info-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; margin-bottom: 24px; }
.info-link { font-weight: 800; font-size: 1rem; color: var(--bright-blue); text-decoration: none; }
.info-link:hover { text-decoration: underline; }

/* Process Steps */
.process-steps-wrap { text-align: center; margin-top: 48px; }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 40px; position: relative; }
/* Dotted line behind circles */
.steps-grid::before { 
  content: ''; 
  position: absolute; 
  top: 32px; 
  left: 15%; 
  right: 15%; 
  height: 2px; 
  border-top: 2px dashed var(--border-light); 
  z-index: 0; 
}
@media(max-width: 768px) { 
  .steps-grid { 
    grid-template-columns: 1fr; 
    gap: 48px; 
  } 
  .steps-grid::before { display: none; } 
}
.step-item { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.step-circle { 
  width: 64px; 
  height: 64px; 
  border-radius: 50%; 
  background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue)); 
  color: var(--white); 
  font-size: 1.5rem; 
  font-weight: 800; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  margin-bottom: 24px; 
  box-shadow: 
    0 0 0 8px var(--bg-base),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transform: translateZ(15px);
}
.step-title { font-size: 1.25rem; font-weight: 800; color: var(--text-black); margin-bottom: 12px; }
.step-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; max-width: 280px; margin: 0 auto; }

/* Full Width CTA Strip */
.cta-strip {
  background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue));
  padding: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.cta-strip::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
.cta-strip-inner {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  position: relative;
  z-index: 1;
}
.cta-strip-title { 
  font-size: 36px !important; 
  font-weight: 800; 
  color: var(--white); 
  letter-spacing: -0.02em; 
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transform: translateZ(10px);
}

/* Responsive Design */
@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
    text-align: center !important;
  }
  
  .hero-title {
    font-size: 36px !important;
    margin-bottom: 24px !important;
  }
  
  .body-text {
    margin-inline: auto !important;
    margin-bottom: 32px !important;
  }
  
  .hero-image-wrap {
    min-height: 250px !important;
    margin-top: 20px !important;
  }
  
  .service-card {
    text-align: left !important;
  }
  
  .form-card {
    margin-top: 20px !important;
  }
  
  .form-card form {
    padding: 20px !important;
  }
  
  .cta-strip-inner {
    flex-direction: column !important;
    text-align: center !important;
  }
}
`;
