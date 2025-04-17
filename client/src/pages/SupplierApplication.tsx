import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SupplierForm from '../components/SupplierForm';

const SupplierApplication: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          供應商申請 Supplier Application
        </Typography>
        <SupplierForm />
      </Box>
    </Container>
  );
};

export default SupplierApplication; 