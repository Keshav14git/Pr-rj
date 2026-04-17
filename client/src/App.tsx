import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  const location = useLocation();

  // Remove the HTML preloader on ANY route (Home, Admin, etc.)
  useEffect(() => {
    const preloader = document.getElementById('mine-preloader');
    if (preloader) {
      preloader.style.transition = 'opacity 0.6s ease-out';
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 600);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        
        {/* Protected Dashboard */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
