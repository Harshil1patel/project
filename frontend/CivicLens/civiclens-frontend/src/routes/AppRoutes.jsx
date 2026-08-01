import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/common/ScrollToTop';

// Import all pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CitizenDashboard from '../pages/CitizenDashboard';
import OfficerDashboard from '../pages/OfficerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ReportIssue from '../pages/ReportIssue';
import TrackComplaint from '../pages/TrackComplaint';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import CameraPage from '../pages/CameraPage';
import StaffLogin from '../pages/StaffLogin';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        {/* Citizen Routes */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        
        {/* Officer Routes */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        
        <Route path="/profile" element={<Profile />} />
        
        {/* Privacy & Terms */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;