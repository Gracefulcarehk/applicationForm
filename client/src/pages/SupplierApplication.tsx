import React from 'react';
import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import SupplierForm from '../components/SupplierForm';
import FAQSection from '../components/FAQSection';

const SupplierApplication: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 }
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        gutterBottom
        sx={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 700,
          color: '#000000',
          mb: { xs: 2, sm: 4 },
        }}
      >
        護理人員申請 Application for Personal Care Worker
      </Typography>
      {/* SupplierForm builds the multipart FormData (including files) and submits it itself */}
      <SupplierForm />
      <FAQSection />
    </Container>
  );
};

export default SupplierApplication;
