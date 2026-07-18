import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Providers } from '@/components/Providers';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Import all Page Components directly from app
import AboutPage from '../app/about/page';
import AdminDashboardPage from '../app/admin/dashboard/page';
import AdminLoginPage from '../app/admin/login/page';
import DynamicBlogArticlePage from '../app/blogs/[slug]/page';
import BlogsPage from '../app/blogs/page';
import BuildTimeEstimatorPage from '../app/build-time-estimator/page';
import CareersPage from '../app/careers/page';
import CompanyPage from '../app/company/page';
import ContactPage from '../app/contact/page';
import FaqPage from '../app/faq/page';
import ForgotPasswordPage from '../app/founder/idea-validator/forgot-password/page';
import ValidatorPage from '../app/founder/idea-validator/page';
import ReportPage from '../app/founder/idea-validator/report/page';
import ResetPasswordPage from '../app/founder/idea-validator/reset-password/page';
import LandingPage from '../app/founder/page';
import InvestorsPage from '../app/investors/page';
import OurModelPage from '../app/playbook/page';
import PrivacyPolicyPage from '../app/privacy/page';
import ProgressPage from '../app/progress/page';
import ResourcesPage from '../app/resources/page';
// import SocialValidationPage from '../app/resources/social-validation/page'; // DISABLED
import StudioPage from '../app/studio/page';
import TermsOfUsePage from '../app/terms/page';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Providers>
        <Routes>
          {/* Main Venture Studio Pages */}
          <Route path="/" element={<Navigate to="/founder" replace />} />
          <Route path="/founder" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/investors" element={<InvestorsPage />} />
          <Route path="/playbook" element={<OurModelPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />

          {/* Blogs */}
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<DynamicBlogArticlePage />} />

          {/* Resource & Validation Tools */}
          {/* <Route path="/resources/social-validation" element={<SocialValidationPage />} /> DISABLED */}
          <Route path="/build-time-estimator" element={<BuildTimeEstimatorPage />} />
          
          {/* Idea Validator & Account Actions */}
          <Route path="/founder/idea-validator" element={<ValidatorPage />} />
          <Route path="/founder/idea-validator/report" element={<ReportPage />} />
          <Route path="/founder/idea-validator/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/founder/idea-validator/reset-password" element={<ResetPasswordPage />} />

          {/* Administrative Portal */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Default fallback redirects to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </Router>
  );
}
