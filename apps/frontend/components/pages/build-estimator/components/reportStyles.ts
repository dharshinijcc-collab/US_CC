export const reportStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', sans-serif; background: #F8FAFF; }
        .rpt-nav-btn { width:100%; display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:8px; border:none; cursor:pointer; background:transparent; text-align:left; font-family:'Manrope',sans-serif; font-size:0.82rem; font-weight:600; color:#64748B; transition:all 0.15s; }
        .rpt-nav-btn:hover { background:#F1F5F9; color:#0F172A; }
        .rpt-nav-btn.active { background:#EFF6FF; color:#005AE2; font-weight:800; }
        .rpt-card { background:#fff; border-radius:14px; border:1px solid #E2E8F0; padding:24px; margin-bottom:16px; }
        .bte-btn:hover { opacity:0.88; transform:translateY(-1px); }
        .bte-btn { transition:all 0.15s; }

        /* ── Report Layout ──────────────────────────────────────────────────── */
        .rpt-layout { max-width:1100px; margin:24px auto; padding:0 16px; display:flex; gap:20px; align-items:flex-start; }
        .rpt-sidebar { width:210px; flex-shrink:0; position:sticky; top:100px; }
        .rpt-content { flex:1; min-width:0; }

        /* Hero stats row responsive */
        .rpt-hero-stats { display:flex; gap:24px; flex-wrap:wrap; margin-top:20px; }
        .rpt-hero-stat { background:rgba(255,255,255,0.10); border-radius:12px; padding:16px 24px; min-width:140px; }

        /* Team grid and report grids */
        .rpt-team-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; }
        .rpt-tl-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
        .rpt-mvp-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

        /* Accessibility Outline & Focus Indicator Audit */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        .bte-option-btn:focus-visible,
        .bte-multi-btn:focus-visible,
        .rpt-nav-btn:focus-visible {
          outline: 2.5px solid #005AE2 !important;
          outline-offset: 3px !important;
        }
        
        .rpt-sidebar-toggle { display:none; width:100%; margin-bottom:10px; padding:10px 16px; border-radius:8px; border:1.5px solid #E2E8F0; background:#fff; cursor:pointer; font-family:'Manrope',sans-serif; font-size:0.82rem; font-weight:700; color:#64748B; }

        /* ── Tablet: sidebar goes to top ───────────────────────────────────── */
        @media (max-width: 900px) {
          .rpt-layout { flex-direction: column; }
          .rpt-sidebar { width: 100%; position: static; }
          .rpt-sidebar-inner { display: flex; flex-wrap: wrap; gap: 6px; }
          .rpt-nav-btn { width: auto; flex: 0 0 auto; }
          .rpt-sidebar-toggle { display: block; }
          .rpt-sidebar-collapsed { display: none; }
          .rpt-sidebar-expanded  { display: block; }
        }

        /* ── Mobile ─────────────────────────────────────────────────────────── */
        @media (max-width: 600px) {
          .rpt-hero-stats { gap: 12px; }
          .rpt-hero-stat  { padding: 12px 16px; min-width: 120px; }
          .rpt-card       { padding: 16px 14px; }
          .rpt-mvp-grid   { grid-template-columns: 1fr; }
          .rpt-tl-grid    { grid-template-columns: 1fr 1fr; }
          .rpt-team-grid  { grid-template-columns: 1fr 1fr; }
          .rpt-cta-wrap   { flex-direction: column; gap: 16px; align-items: flex-start; }
          .rpt-layout     { padding: 0 10px; margin: 16px auto; }
        }
        @media (max-width: 400px) {
          .rpt-tl-grid   { grid-template-columns: 1fr; }
          .rpt-team-grid { grid-template-columns: 1fr; }
        }

        /* Section heading font scaling */
        .rpt-section-h2 { font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .rpt-section-p  { font-size: 0.82rem; color: #64748B; margin-bottom: 20px; }
        @media (max-width: 600px) {
          .rpt-section-h2 { font-size: 0.95rem; }
          .rpt-section-p  { font-size: 0.78rem; margin-bottom: 14px; }
        }
`;
