import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '800px',
            mb: 6,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              color: theme.palette.primary.main,
            }}
          >
            Welcome to Graceful Care
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Join our network of professional caregivers and make a difference in people's lives
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/apply')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Apply Now
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {[
            {
              title: 'Professional Network',
              description: 'Join a community of dedicated healthcare professionals',
            },
            {
              title: 'Flexible Opportunities',
              description: 'Choose assignments that fit your schedule and expertise',
            },
            {
              title: 'Support & Training',
              description: 'Access ongoing support and professional development',
            },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 