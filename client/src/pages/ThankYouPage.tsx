import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4,
          textAlign: 'center',
          '@supports (padding: max(0px))': {
            padding: {
              xs: `max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right))`,
              sm: '32px',
            },
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          感謝您的申請 Thank You for Your Application
        </Typography>
        <Typography variant="body1" paragraph>
          我們已收到您的申請。我們的團隊將盡快審核您的資料並與您聯繫。
        </Typography>
        <Typography variant="body1" paragraph>
          We have received your application. Our team will review your information and contact you shortly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          返回主頁 Return to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default ThankYouPage; 