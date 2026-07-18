export const estimatorStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', sans-serif; }
        .bte-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .bte-btn { transition: all 0.15s; }

        /* Option buttons (Single & Multi Select Cards) */
        .bte-option-btn {
          padding: 16px 20px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 125px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          position: relative;
          box-sizing: border-box;
        }
        .bte-option-btn:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }
        .bte-option-btn.selected {
          border-color: #005AE2 !important;
          background: #F0F6FF !important;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.08) !important;
        }
        .bte-option-icon {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .bte-option-btn .bte-option-icon {
          color: #64748B;
        }
        .bte-option-btn.selected .bte-option-icon {
          color: #005AE2 !important;
        }
        .bte-option-label {
          font-weight: 700;
          font-size: 0.85rem;
          transition: color 0.2s;
          color: #0F172A;
        }
        .bte-option-btn.selected .bte-option-label {
          color: #005AE2 !important;
        }
        .bte-option-desc {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 4px;
          line-height: 1.4;
        }

        /* Multi-select pills (horizontal style) */
        .bte-multi-btn {
          padding: 14px 18px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          outline: none;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 14px;
          height: 100%;
          min-height: 58px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }
        .bte-multi-btn:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }
        .bte-multi-btn.selected {
          border-color: #005AE2 !important;
          background: #F0F6FF !important;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.08) !important;
        }
        .bte-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #CBD5E1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .bte-multi-btn.selected .bte-checkbox,
        .bte-option-btn.selected .bte-checkbox {
          border-color: #005AE2 !important;
          background: #005AE2 !important;
        }
        .bte-multi-icon {
          display: inline-flex;
          align-items: center;
          color: #64748B;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .bte-multi-btn.selected .bte-multi-icon {
          color: #005AE2 !important;
        }
        .bte-multi-label {
          font-weight: 500;
          font-size: 0.875rem;
          color: #334155;
          transition: color 0.2s;
          line-height: 1.3;
        }
        /* Option B: Premium Floating Tooltip for Multi-select Cards */
        .bte-multi-btn {
          position: relative;
        }
        .bte-card-tooltip {
          visibility: hidden;
          width: 190px;
          background-color: #0F172A;
          color: #FFFFFF;
          text-align: center;
          border-radius: 8px;
          padding: 8px 12px;
          position: absolute;
          z-index: 20;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 0.72rem;
          line-height: 1.4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: none;
          font-weight: 500;
        }
        .bte-card-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #0F172A transparent transparent transparent;
        }
        .bte-multi-btn:hover .bte-card-tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .bte-multi-btn.selected .bte-multi-label {
          font-weight: 600;
          color: #005AE2 !important;
        }
        @media (max-width: 600px) {
          .bte-step-label {
            display: none !important;
          }
        }

        /* Questionnaire Responsive */
        .bte-main {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFF 0%, #EFF6FF 100%);
          padding: 170px 16px 80px;
        }
        .bte-container { max-width: 780px; margin: 0 auto; }
        .bte-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .bte-step-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
        }
        .bte-step-desc {
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 20px;
        }
        .bte-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E2E8F0; }

        @media (max-width: 600px) {
          .bte-main { padding: 130px 12px 60px; }
          .bte-card { padding: 20px 14px; }
          .bte-step-heading { font-size: 1rem; }
          .bte-step-desc { font-size: 0.78rem; }
          .bte-progress-label { display: none; }
          .bte-nav { gap: 8px; }
        }

        /* Option grids */
        .bte-grid-single {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        .bte-grid-multi {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 8px;
        }
        @media (max-width: 480px) {
          .bte-grid-single { grid-template-columns: 1fr 1fr; }
          .bte-grid-multi  { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 360px) {
          .bte-grid-single { grid-template-columns: 1fr; }
          .bte-grid-multi  { grid-template-columns: 1fr; }
        }
`;
