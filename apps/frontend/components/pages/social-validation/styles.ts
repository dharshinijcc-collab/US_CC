export const sveStyles = `
  .sve-root {
    background-color: #F8FAFC;
    min-height: 100vh;
    padding-top: 170px;
    padding-bottom: 80px;
    color: #0F172A;
    font-family: 'Inter', sans-serif;
  }
  .sve-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .sve-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .sve-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #E6EFFF;
    color: #005AE2;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 6px 12px;
    border-radius: 100px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .sve-header h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 12px;
    letter-spacing: -0.03em;
    font-family: 'Manrope', sans-serif;
  }
  .sve-header p {
    color: #64748B;
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .sve-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
  }
  
  /* Form components */
  .sve-main-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #334155;
  }
  .form-group label .req {
    color: #EF4444;
  }
  .form-group textarea, .form-group input {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1.5px solid #E2E8F0;
    outline: none;
    font-size: 0.925rem;
    font-family: inherit;
    transition: all 0.2s;
  }
  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }
  .form-group textarea:focus, .form-group input:focus {
    border-color: #005AE2;
    box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.08);
  }
  .form-group small {
    color: #94A3B8;
    font-size: 0.775rem;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }

  /* Auth Wall */
  .sve-auth-gate {
    max-width: 420px;
    margin: 0 auto;
    padding: 10px 0;
  }
  .auth-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .auth-header h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0 0 6px;
  }
  .auth-header p {
    font-size: 0.875rem;
    color: #64748B;
    margin: 0;
  }
  .auth-tabs {
    display: flex;
    background-color: #F1F5F9;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  .auth-tabs button {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    color: #64748B;
    border-radius: 6px;
    cursor: pointer;
  }
  .auth-tabs button.active {
    background-color: #FFFFFF;
    color: #0F172A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Buttons */
  .sve-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 14px 28px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sve-btn.primary {
    background-color: #005AE2;
    color: #FFFFFF;
  }
  .sve-btn.primary:hover {
    background-color: #004ac2;
    transform: translateY(-1px);
  }
  .sve-btn.secondary {
    background-color: #F1F5F9;
    color: #475569;
  }
  .sve-btn.secondary:hover {
    background-color: #E2E8F0;
  }
  .glow-btn {
    box-shadow: 0 8px 20px -6px rgba(0, 90, 226, 0.35);
  }
  .glow-btn:hover {
    box-shadow: 0 12px 24px -6px rgba(0, 90, 226, 0.5);
  }

  /* Loader */
  .loader-panel {
    text-align: center;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pulse-spinner {
    width: 72px;
    height: 72px;
    border-radius: 100px;
    background-color: #E6EFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #005AE2;
    margin-bottom: 24px;
    box-shadow: 0 0 0 10px rgba(0, 90, 226, 0.04);
    animation: pulseGlow 1.5s infinite ease-in-out;
  }
  .spin-icon {
    animation: rotate 2s infinite linear;
  }
  .loader-panel h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 8px;
  }
  .loader-panel p {
    color: #64748B;
    margin: 0 0 32px;
    font-size: 0.95rem;
    max-width: 380px;
  }
  /* ── Pipeline Loader (Light Theme) ────────────────────────────── */
  .sve-pipeline-loader {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
  }

  /* Header */
  .pipeline-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  .pipeline-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #F0F7FF;
    border: 1px solid #DBEAFE;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #005AE2;
    flex-shrink: 0;
  }
  .pipeline-header > div:nth-child(2) {
    flex: 1;
  }
  .pipeline-header h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 2px;
  }
  .pipeline-header > div:nth-child(2) p {
    font-size: 0.8rem;
    color: #64748B;
    margin: 0;
  }
  .pipeline-timer {
    text-align: right;
    flex-shrink: 0;
  }
  .pipeline-timer span {
    font-size: 1.3rem;
    font-weight: 700;
    color: #005AE2;
    display: block;
    font-variant-numeric: tabular-nums;
    font-family: Menlo, Monaco, Consolas, monospace;
  }
  .pipeline-timer small {
    font-size: 0.68rem;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Progress bar */
  .pipeline-progress-track {
    background: #F1F5F9;
    border-radius: 100px;
    height: 6px;
    position: relative;
    margin-bottom: 6px;
    overflow: hidden;
  }
  .pipeline-progress-fill {
    height: 100%;
    border-radius: 100px;
    background: #005AE2;
    transition: width 1s ease;
  }
  .pipeline-progress-label {
    font-size: 0.72rem;
    color: #64748B;
    display: block;
    text-align: right;
    margin-bottom: 20px;
    font-weight: 600;
  }

  /* Steps */
  .pipeline-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }
  .pipeline-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: all 0.3s ease;
  }
  .pipeline-step.step-done {
    background: #F0FDF4;
    border-color: #DCFCE7;
  }
  .pipeline-step.step-active {
    background: #F0F7FF;
    border-color: #DBEAFE;
  }
  .pipeline-step.step-pending {
    background: #F8FAFC;
    border-color: #F1F5F9;
    opacity: 0.6;
  }

  /* Step icon */
  .step-icon-wrap {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .step-done .step-icon-wrap {
    background: #DCFCE7;
    color: #10B981;
  }
  .step-active .step-icon-wrap {
    background: #DBEAFE;
    color: #005AE2;
  }
  .step-pending .step-icon-wrap {
    background: #E2E8F0;
    color: #94A3B8;
  }

  /* Step body */
  .step-body {
    flex: 1;
    min-width: 0;
  }
  .step-label {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .step-label span {
    font-size: 0.85rem;
    font-weight: 700;
  }
  .step-done .step-label span { color: #334155; }
  .step-active .step-label span { color: #0F172A; }
  .step-pending .step-label span { color: #94A3B8; }

  .step-sub {
    font-size: 0.75rem;
    color: #64748B;
    margin: 3px 0 0;
    line-height: 1.4;
  }
  .step-active .step-sub { color: #475569; }

  /* Badges */
  .step-badge {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .step-badge.done {
    background: #DCFCE7;
    color: #15803D;
  }
  .step-badge.active {
    background: #DBEAFE;
    color: #1D4ED8;
    animation: pulse-badge 1.5s ease-in-out infinite;
  }
  @keyframes pulse-badge {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* Bottom notice */
  .pipeline-current-action {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    color: #64748B;
    background: #F8FAFC;
    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
  }
  .pipeline-current-action strong { color: #334155; }

  /* Errors */
  .sve-error-banner {
    display: flex;
    gap: 12px;
    align-items: center;
    background-color: #FEF2F2;
    border: 1px solid #FCA5A5;
    color: #991B1B;
    padding: 16px;
    border-radius: 12px;
    font-size: 0.9rem;
    margin-bottom: 24px;
    font-weight: 600;
  }

  /* Dashboard Panel */
  .sve-dashboard {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .score-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 36px;
  }
  .score-header {
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
  }
  .score-wheel {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background: radial-gradient(circle, #FFFFFF 60%, transparent 62%), conic-gradient(#005AE2 0% 80%, #E2E8F0 80% 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
  .score-num {
    font-size: 2.25rem;
    font-weight: 800;
    color: #0F172A;
  }
  .score-max {
    font-size: 0.85rem;
    color: #94A3B8;
    margin-top: 10px;
    font-weight: 600;
  }
  .score-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .score-label {
    font-size: 0.725rem;
    font-weight: 800;
    color: #64748B;
    letter-spacing: 0.1em;
  }
  .score-meta h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .score-reasoning {
    color: #475569;
    line-height: 1.7;
    margin: 0;
    font-size: 0.95rem;
    white-space: pre-line;
  }

  /* Grid details */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  @media(max-width: 800px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
  .grid-cell {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .grid-cell.full-width {
    grid-column: 1 / -1;
  }
  .cell-header {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1.5px solid #F1F5F9;
    padding-bottom: 16px;
    margin-bottom: -4px;
  }
  .cell-header h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0;
  }
  .blue-icon {
    color: #005AE2;
  }

  /* Pain Points List */
  .pain-points-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .pain-point-item {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    background-color: #FFFFFF;
    overflow: hidden;
  }
  .pp-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }
  .pp-summary:hover {
    background-color: #F8FAFC;
  }
  .pp-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .pp-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1E293B;
  }
  .pp-mentions {
    font-size: 0.725rem;
    color: #64748B;
    background-color: #F1F5F9;
    padding: 2px 8px;
    border-radius: 100px;
    width: fit-content;
    font-weight: 600;
  }
  .pp-side {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pp-badge {
    font-size: 0.725rem;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .pp-badge.severity-5 { background: #FEE2E2; color: #991B1B; }
  .pp-badge.severity-4 { background: #FEE2E2; color: #991B1B; }
  .pp-badge.severity-3 { background: #FEF3C7; color: #92400E; }
  .pp-badge.severity-2 { background: #DBEAFE; color: #1E40AF; }
  .pp-badge.severity-1 { background: #DBEAFE; color: #1E40AF; }
  .arrow {
    color: #94A3B8;
    transition: transform 0.2s;
  }
  .arrow.expanded {
    transform: rotate(90deg);
  }
  .pp-details {
    padding: 16px;
    background-color: #F8FAFC;
    border-top: 1px solid #E2E8F0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .evidence-title {
    font-size: 0.7rem;
    font-weight: 800;
    color: #94A3B8;
    text-transform: uppercase;
  }
  .pp-details ul {
    margin: 0;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pp-details li a {
    color: #005AE2;
    font-size: 0.775rem;
    text-decoration: none;
    word-break: break-all;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .pp-details li a:hover {
    text-decoration: underline;
  }
  .no-sources {
    font-size: 0.8rem;
    color: #94A3B8;
    font-style: italic;
    margin: 0;
  }

  /* Competitors List */
  .competitors-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .competitor-item {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .comp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .comp-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1E293B;
  }
  .comp-link {
    font-size: 0.75rem;
    color: #005AE2;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .comp-link:hover {
    text-decoration: underline;
  }
  .comp-web {
    font-size: 0.8rem;
    color: #94A3B8;
  }
  .comp-gaps {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gaps-title {
    font-size: 0.725rem;
    font-weight: 700;
    color: #64748B;
  }
  .gap-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .gap-badge {
    background-color: #FFF8E1;
    color: #B7791F;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid #FFE082;
  }

  /* Feature Grid */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media(max-width: 600px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  .feature-item {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .feat-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .feat-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1E293B;
  }
  .feat-mentions {
    font-size: 0.7rem;
    color: #94A3B8;
    font-weight: 600;
  }
  .feat-priority {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .feat-priority.prio-high { background-color: #FEE2E2; color: #991B1B; }
  .feat-priority.prio-medium { background-color: #FEF3C7; color: #92400E; }
  .feat-priority.prio-low { background-color: #F1F5F9; color: #475569; }

  /* Animation Utils */
  .fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 10px rgba(0, 90, 226, 0.04); }
    50% { box-shadow: 0 0 0 20px rgba(0, 90, 226, 0.08); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
