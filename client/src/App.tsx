import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import LandingPage from './pages/LandingPage';
import SupplierApplication from './pages/SupplierApplication';
import ThankYouPage from './pages/ThankYouPage';

// New pages start at the top; links like /#roles from another page scroll to that section once rendered
const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollManager />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <SiteHeader />
          {/* Pages stretch so short ones (thank-you) don't leave a gap above the footer */}
          <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/apply" element={<SupplierApplication />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
          </Box>
          <SiteFooter />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
