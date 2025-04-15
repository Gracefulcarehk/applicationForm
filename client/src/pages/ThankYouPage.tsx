import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ThankYouPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        滿心醫療本地護理人員網上登記表格 GracefulCare - Online Registration Form
      </Typography>

      <Box sx={{ 
        mt: 4, 
        p: 4, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        textAlign: 'center'
      }}>
        <Typography variant="h5" component="h2" gutterBottom>
          感謝您的申請，我們的工作人員將盡快與您聯繫
        </Typography>
        <Typography variant="h6" component="h3" color="text.secondary">
          Thank you for your application, our operations will contact you shortly
        </Typography>
      </Box>
    </Container>
  );
};

export default ThankYouPage; 