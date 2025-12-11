// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import MobileDetailPage from './pages/MobileDetailPage';
import CartPage from './pages/CartPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import EditMobilePage from './pages/EditMobilePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import BrandsPage from './pages/BrandsPage';
import ComparePage from './pages/ComparePage';
import DealsPage from './pages/DealsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { SearchProvider } from './context/SearchContext';
import { UserTypeProvider } from './context/UserTypeContext';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import './styles/darkMode.css';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDetailPage = location.pathname.startsWith('/mobile/');

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      {!isAdminRoute && <Navbar isDetailPage={isDetailPage} />}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage" element={<AdminDashboard />} />
          <Route path="/mobile/:id" element={<MobileDetailPage />} />
          <Route path="/admin/edit/:id" element={<EditMobilePage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}

      {/* ✅ Global toast message container */}
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <UserTypeProvider>
          <SearchProvider>
            <Router>
              <Layout />
            </Router>
          </SearchProvider>
        </UserTypeProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
