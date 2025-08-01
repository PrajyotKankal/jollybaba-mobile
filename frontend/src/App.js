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
import EditMobilePage from './pages/EditMobilePage';
import { SearchProvider } from './context/SearchContext';
import { UserTypeProvider } from './context/UserTypeContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {!isAdminRoute && <Navbar />}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
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
    <UserTypeProvider>
      <SearchProvider>
        <Router>
          <Layout />
        </Router>
      </SearchProvider>
    </UserTypeProvider>
  );
}

export default App;
