import React, { useState } from 'react';
import { Container, Typography, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import SupplierForm from '../components/SupplierForm';
import FAQSection from '../components/FAQSection';
import { supplierApi } from '../services/api';

const SupplierApplication: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      <SupplierForm onSubmit={handleSubmit} />
      <FAQSection />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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