import React, { useState } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import SupplierForm from '../components/SupplierForm';
import FAQSection from '../components/FAQSection';
import { supplierApi } from '../services/api';

const SupplierApplication: React.FC = () => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (values: any) => {
    try {
      await supplierApi.createSupplier(values);
      setSnackbar({
        open: true,
        message: '申請已成功提交 Application submitted successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '提交申請時發生錯誤 Error submitting application',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#000000',
          mb: 4,
        }}
      >
        護理人員申請 Application for Personal Care Worker
      </Typography>
      <SupplierForm onSubmit={handleSubmit} />
      <FAQSection />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupplierApplication; 