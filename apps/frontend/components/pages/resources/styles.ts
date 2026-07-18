export const resourcesStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-blue: #005AE2;
  --accent-gold: #c5a880;
  --text-black: #020617;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --bg-light: #F8FAFC;
  --bg-grey: #F1F5F9;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
}

body, html {
  margin: 0;
  padding: 0;
  background-color: var(--bg-light);
  color: var(--text-black);
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
}

h1, h2, h3, h4, h5, h6, .manrope-font {
  font-family: 'Manrope', sans-serif;
}

.resources-page {
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #F8FAFC;
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
  letter-spacing: 0.15em !important;
  padding: 8px 18px !important; /* increased padding */
  border-radius: 100px !important;
  margin-bottom: 32px !important; /* increased spacing */
  text-transform: uppercase !important;
  font-family: 'Manrope', sans-serif !important;
}
.hero-title {
  font-family: 'Manrope', sans-serif !important;
  font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
  font-weight: 800 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.22 !important; /* increased line-height for elite aesthetic */
  color: #020617 !important;
  margin: 0 auto 28px !important; /* increased spacing below heading */
  text-align: center !important;
  max-width: 960px !important; /* wider boundaries for magnificent scale */
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
.hero-description, .hero-subtitle {
  font-family: 'Inter', sans-serif !important;
  font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
  font-weight: 500 !important;
  color: #64748B !important;
  line-height: 1.8 !important; /* wider line height for premium readability */
  max-width: 720px !important; /* expanded to follow modern web layouts */
  margin: 0 auto 32px !important;
  text-align: center !important;
}

/* Centered Header Utilities */
.header-center {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 24px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== SECTION 2: FEATURED ARTICLE ===== */
.featured-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  display: flex;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 60px;
}
.featured-card:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 20px 40px -15px rgba(0, 90, 226, 0.15);
}
.featured-img-col {
  flex: 1;
  min-height: 350px;
  background: linear-gradient(135deg, rgba(0, 90, 226, 0.05) 0%, rgba(0, 90, 226, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-right: 1px solid var(--border-light);
}
.featured-content-col {
  flex: 1.2;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (max-width: 768px) {
  .featured-card { flex-direction: column; }
  .featured-img-col { min-height: 250px; border-right: none; border-bottom: 1px solid var(--border-light); }
  .featured-content-col { padding: 40px 24px; }
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.tag-group {
  display: flex;
  gap: 12px;
  align-items: center;
}
.tag-primary {
  background: rgba(0, 90, 226, 0.1);
  color: var(--primary-blue);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.tag-secondary {
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}
.read-time {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.featured-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-main);
}
.featured-desc {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* ===== SECTION 3: FILTER BAR ===== */
.filter-section {
  box-shadow: 0 10px 30px -10px rgba(0, 90, 226, 0.08);
  padding: 24px 0;
  background-color: var(--white);
  position: sticky;
  top: 80px;
  z-index: 50;
}
.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.filter-label {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.filter-pill {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-pill:hover {
  color: var(--text-main);
}
.filter-pill.active {
  background: rgba(0, 90, 226, 0.1);
  color: var(--primary-blue);
}
.resource-count {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

/* ===== SECTION 4, 5, 6: RESOURCE GRIDS ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.res-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.res-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-blue);
  box-shadow: 0 16px 32px rgba(0, 90, 226, 0.05);
}
.btn-tool-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: var(--primary-blue);
  color: #FFFFFF;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}
.res-card-link:hover .btn-tool-cta {
  background-color: #004ac2;
  box-shadow: 0 4px 12px rgba(0, 90, 226, 0.25);
}

/* Resource Card Interiors */
.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 8px;
  color: var(--text-main);
}

.card-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.45;
  margin-bottom: 16px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-light);
  padding-top: 24px;
  font-size: 0.875rem;
}
.card-author {
  color: var(--text-muted);
  font-weight: 500;
}
.card-link {
  color: var(--primary-blue);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}
.card-link:hover {
  color: #0044a0;
}

/* Interactive Tools specific */
.tool-badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.tool-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}
.tool-tag {
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Curated Reading specific */
.reading-source {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

/* Section Titles */
.section-title {
  font-family: 'Manrope', sans-serif !important;
  font-size: 36px !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  margin-bottom: 12px !important;
  line-height: 1.25 !important;
  color: var(--text-main) !important;
  text-align: center !important;
}
@media(max-width: 768px) {
  .section-title {
    font-size: 26px !important;
  }
}
.section-subtitle {
  font-family: 'Inter', sans-serif !important;
  color: var(--text-muted) !important;
  font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
  line-height: 1.65 !important;
  font-weight: 500 !important;
  max-width: 600px;
  margin: 0 auto 24px !important;
  text-align: center !important;
}
.eyebrow-text {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #E6EFFF !important;
  color: var(--primary-blue) !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  padding: 6px 14px !important;
  border-radius: 100px !important;
  margin-bottom: 16px !important;
  font-family: 'Manrope', sans-serif !important;
}
`;
