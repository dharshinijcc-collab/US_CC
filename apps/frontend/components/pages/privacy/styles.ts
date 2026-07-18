export const privacyStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System - Consistent with Studio Page Theme */
          --bg-base: #F3F5F9;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --bg-grey: #F1F5F9;
          
          --primary: #4F46E5;
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
          --success-green: #10B981;
          --accent-cyan: #00E6A0;
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

        * { box-sizing: border-box; }

        /* Page Load Animation */
        .privacy-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

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
        
        /* Specialized Container for Legal Documents */
        .legal-container { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: clamp(80px, 8vw, 120px) 24px clamp(40px, 6vw, 80px) 24px; 
        }

        /* Buttons & Pills */
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

        .btn-nav { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 10px 24px; 
          border-radius: 100px; 
          font-size: 14px; 
          border: none; 
          cursor: pointer; 
          transition: background-color 0.2s, transform 0.2s; 
        }
        .btn-nav:hover { background-color: #004ac2; }

        .eyebrow-pill {
          display: inline-block;
          background-color: var(--light-blue-bg);
          color: var(--primary-blue);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        /* Typography - Document Specific */

        .section-title { 
          font-size: clamp(2rem, 4vw, 2.75rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: 16px; 
          line-height: 1.1; 
          text-align: center;
          color: var(--text-black);
        }
        
        .legal-title { 
          font-size: clamp(2.5rem, 5vw, 3.5rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: 16px; 
          line-height: 1.1; 
          color: var(--text-black);
        }
        
        .legal-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 48px;
        }

        .legal-h2 {
          font-size: clamp(1.5rem, 3vw, 1.75rem);
          font-weight: 800;
          color: var(--text-black);
          margin: 48px 0 24px 0;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .legal-number {
          color: var(--primary-blue);
        }

        .legal-p {
          font-size: clamp(0.9rem, 1.5vw, 0.95rem);
          line-height: 1.7;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 20px;
        }

        /* Custom Lists */
        .legal-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }
        .legal-list li {
          display: flex;
          align-items: flex-start;
          font-size: clamp(0.85rem, 1.5vw, 0.9rem);
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .legal-list li strong {
          color: var(--text-main);
          font-weight: 700;
        }
        .list-icon {
          color: var(--primary-blue);
          flex-shrink: 0;
          margin-right: 12px;
          margin-top: 3px;
        }

        /* Callout / Card Sections */
        .legal-card {
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
        }
        .legal-card:hover { 
          transform: perspective(800px) rotateX(-2deg) rotateY(2deg) translateY(-6px);
          box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,90,226,0.06);
        }
        .legal-card::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
          transition: left 0s; pointer-events: none;
        }
        .legal-card:hover::before { left: 140%; transition: left 0.5s ease; }
        .legal-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-top: 24px;
          margin-bottom: 24px;
        }
        @media(min-width: 640px) {
          .legal-card-grid { grid-template-columns: 1fr 1fr; }
        }
        .legal-card-h3 {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-black);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .legal-card-p {
          font-size: clamp(0.85rem, 1.5vw, 0.9rem);
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
        }

        /* Contact Pills */
        .contact-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }
        .contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .contact-pill:hover {
          border-color: #CBD5E1;
          box-shadow: 0 8px 15px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
        .contact-pill svg {
          color: var(--primary-blue);
        }

        /* Footer */
        .footer { 
          background-color: var(--bg-dark); 
          color: #9CA3AF; 
          padding: 80px 0 60px; 
          font-size: clamp(0.875rem, 1.5vw, 1rem); 
          font-weight: 500; 
          border-top: 1px solid var(--border-dark);
        }
        .footer-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 48px; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }
        .footer-logo { 
          color: var(--white); 
          font-weight: 800; 
          font-size: clamp(1.125rem, 2.5vw, 1.25rem); 
          margin-bottom: 16px; 
          letter-spacing: -0.02em; 
        }
        .footer-heading { 
          color: var(--white); 
          font-weight: 700; 
          margin-bottom: 24px; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
        }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }
        .btn-footer { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 10px 20px; 
          border-radius: 100px; 
          border: none; 
          font-weight: 700; 
          font-size: 13px; 
          cursor: pointer; 
          transition: background-color 0.2s;
        }
        .btn-footer:hover { background-color: #004ac2; }
`;
