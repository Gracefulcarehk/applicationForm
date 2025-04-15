import React from 'react';
import { Container, Typography } from '@mui/material';

const SupplierPortal: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        滿心醫療登記專區 GracefulCare Registration Portal
      </Typography>
    </Container>
  );
};

export default SupplierPortal; 