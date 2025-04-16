import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import SupplierApplication from './pages/SupplierApplication';
import ThankYouPage from './pages/ThankYouPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F5883B',
    },
    secondary: {
      main: '#dc004e',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#F5883B',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#e67a2e',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5D6D9B',
            },
            '&:hover fieldset': {
              borderColor: '#5D6D9B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5D6D9B',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000000',
          '&.Mui-focused': {
            color: '#000000',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              滿心醫療登記專區 GracefulCare Registration Portal
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/apply">
              Apply
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          px: 4
        }}>
          <img 
            src={process.env.PUBLIC_URL + "/GC_logo_GC_Logo_Horizontal_Color.png"} 
            alt="GracefulCare Logo" 
            style={{ 
              height: '150px',
              width: 'auto'
            }}
          />
          <Typography variant="h3" sx={{ 
            color: '#5D6D9B', 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            歡迎加入滿心醫療 Welcome to GracefulCare
          </Typography>
          <Box sx={{ width: '150px' }} /> {/* Spacer to balance the logo */}
        </Box>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center' }}>
                {/* Slogan Section */}
                <Box sx={{ 
                  px: 4,
                  py: 4,
                  mt: 4
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#5D6D9B',
                      fontWeight: 700,
                      mb: 2,
                      textAlign: 'left'
                    }}
                  >
                    護理人員招聘
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#5D6D9B',
                      lineHeight: 1.8,
                      textAlign: 'left'
                    }}
                  >
                    滿心關愛，專業護理。加入滿心醫療，為長者及有需要人士獻上溫暖照顧。
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#5D6D9B',
                      lineHeight: 1.8,
                      textAlign: 'left',
                      mt: 1
                    }}
                  >
                    您的愛心與專業，讓生命綻放光彩。成為我們的一員，共創有意義的護理事業！
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/apply"
                      size="large"
                      sx={{
                        backgroundColor: '#F5883B',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#e67a2e',
                        },
                        fontSize: '1.1rem',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      立即申請 Apply Now
                    </Button>
                  </Box>
                </Box>

                {/* Banner Section */}
                <Box 
                  sx={{ 
                    width: '100%',
                    my: 4,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    minHeight: '600px',
                    '@media (min-width: 1400px)': {
                      '& > *': {
                        width: '25%',
                        minHeight: '8px',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }
                    }
                  }}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/HomePage_Banner_Desktop.png"}
                    alt="GracefulCare Banner"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '600px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 8,
                  mb: 8
                }}>
                  <Button
                    component={Link}
                    to="/apply"
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#F5883B',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#e67a2e',
                      },
                      fontSize: '1.1rem',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    立即申請 Apply Now
                  </Button>
                </Box>
              </div>
            } />
            <Route path="/apply" element={<SupplierApplication />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
