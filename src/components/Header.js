import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ currentPage }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-wrapper { 
          position: fixed; 
          top: 24px; 
          left: 0; 
          width: 100%; 
          display: flex; 
          justify-content: center; 
          z-index: 100; 
          padding: 0 24px; 
        }
        .navbar { 
          background: linear-gradient(135deg, rgba(10, 15, 28, 0.95), rgba(10, 15, 28, 0.85));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--white); 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 8px 8px 8px 32px; 
          width: 100%; 
          max-width: 1152px; 
          border-radius: 100px; 
          box-shadow: 
            0 10px 30px -10px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateZ(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .navbar:hover {
          transform: translateY(-2px) translateZ(0);
          box-shadow: 
            0 20px 40px -10px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .navbar-brand { 
          font-weight: 800; 
          font-size: 1rem; 
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateZ(10px);
        }
        .navbar-links { display: none; }
        @media(min-width: 768px) { 
          .navbar-links { 
            display: flex; 
            gap: 32px; 
            font-size: 0.875rem; 
            font-weight: 600; 
          } 
        }
        .navbar-links a { 
          color: var(--text-muted); 
          text-decoration: none; 
          padding-bottom: 4px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          transform: translateZ(5px);
        }
        .navbar-links a:hover { 
          color: var(--white);
          transform: translateY(-1px) translateZ(5px);
        }
        .navbar-links a.active-link { 
          color: var(--white) !important; 
          border-bottom: 2px solid var(--primary-blue); 
          text-shadow: 0 0 10px rgba(0, 90, 226, 0.5);
        }
        
        /* Enhanced Dropdown Menu */
        .dropdown { 
          position: relative; 
          display: inline-block; 
          transform: translateZ(10px);
        }
        .dropdown-toggle { 
          color: var(--text-muted); 
          text-decoration: none; 
          padding-bottom: 4px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          transform: translateZ(5px);
        }
        .dropdown-toggle:hover { 
          color: var(--white);
          transform: translateY(-1px) translateZ(5px);
        }
        .dropdown-menu { 
          position: absolute; 
          top: 100%; 
          right: 0; 
          background: linear-gradient(135deg, rgba(10, 15, 28, 0.98), rgba(10, 15, 28, 0.95));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px; 
          padding: 12px 0; 
          min-width: 180px; 
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) translateZ(20px) rotateX(-10deg);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropdown:hover .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateY(8px) translateZ(20px) rotateX(0deg);
        }
        .dropdown-item { 
          display: block; 
          padding: 14px 24px; 
          color: var(--text-muted); 
          text-decoration: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.875rem;
          font-weight: 600;
          position: relative;
          transform: translateZ(5px);
        }
        .dropdown-item:hover { 
          color: var(--white); 
          background: linear-gradient(135deg, rgba(0, 90, 226, 0.1), rgba(0, 132, 255, 0.05));
          transform: translateX(4px) translateZ(5px);
        }
        .dropdown-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: linear-gradient(135deg, var(--primary-blue), var(--bright-blue));
          transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropdown-item:hover::before {
          height: 20px;
        }

        /* 3D Button Effects */
        .btn-nav { 
          padding: 10px 24px; 
          font-size: 14px; 
          border-radius: 100px; 
          background: linear-gradient(135deg, var(--primary-blue), var(--bright-blue));
          border: none;
          color: var(--white);
          font-weight: 700;
          cursor: pointer;
          transform: translateZ(20px);
          box-shadow: 
            0 4px 15px rgba(0, 90, 226, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .btn-nav:hover {
          transform: translateY(-3px) translateZ(25px) scale(1.05);
          box-shadow: 
            0 8px 25px rgba(0, 90, 226, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.3);
        }
        .btn-nav:hover::before {
          left: 100%;
        }
        .btn-nav:active {
          transform: translateY(-1px) translateZ(20px) scale(0.98);
        }

        /* Responsive Design */
        @media (max-width: 767px) {
          .navbar {
            padding: 12px 16px;
            border-radius: 16px;
          }
          .navbar-brand {
            font-size: 0.9rem;
          }
        }
      `}} />

      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="navbar-brand">Crestcode Product Studio</div>
          <div className="navbar-links">
            <Link to="/" className={currentPage === 'home' ? 'active-link' : ''}>Home</Link>
            <Link to="/studio" className={currentPage === 'studio' ? 'active-link' : ''}>Studio</Link>
            <a href="#company">Company</a>
            <div className="dropdown">
              <button className="dropdown-toggle">Our Model &#x25BC;</button>
              <div className="dropdown-menu">
                <Link to="/careers" className="dropdown-item">Careers</Link>
                <Link to="/faq" className="dropdown-item">FAQ</Link>
                <Link to="/contact" className="dropdown-item">Contact</Link>
                <Link to="/privacy" className="dropdown-item">Privacy Policy</Link>
                <Link to="/terms" className="dropdown-item">Terms of Use</Link>
              </div>
            </div>
          </div>
          <button className="btn-nav">Enquire</button>
        </nav>
      </div>
    </>
  );
}
