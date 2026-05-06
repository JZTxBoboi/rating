import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import RatingPage from './pages/RatingPage';
import TechnicianSelection from './pages/TechnicianSelection';
import ThankYouPage from './pages/ThankYouPage';

function AdminGate() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('adminAuthenticated') === 'true',
  );

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAuthenticated(true);
          navigate('/admin', { replace: true });
        }}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={() => {
        setIsAuthenticated(false);
        navigate('/admin', { replace: true });
      }}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TechnicianSelection />} />
      <Route path="/rating" element={<RatingPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/admin" element={<AdminGate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
