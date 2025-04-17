import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, ThemeProvider, createTheme, Box, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SupplierApplication from './pages/SupplierApplication';
import ThankYouPage from './pages/ThankYouPage';
import HomePage from './pages/HomePage';

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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/apply" onClick={handleDrawerToggle}>
        <ListItemText primary="Apply" />
      </ListItem>
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              滿心醫療登記專區 GracefulCare Registration Portal
            </Typography>
            {!isMobile && (
              <>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/apply">
                  Apply
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          px: { xs: 2, sm: 4 },
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <img 
            src={process.env.PUBLIC_URL + "/GC_logo_GC_Logo_Horizontal_Color.png"} 
            alt="GracefulCare Logo" 
            style={{ 
              height: isMobile ? '100px' : '150px',
              width: 'auto',
              marginBottom: isMobile ? '1rem' : 0
            }}
          />
          <Typography 
            variant={isMobile ? "h5" : "h3"} 
            sx={{ 
              color: '#5D6D9B', 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 'bold',
              px: { xs: 2, sm: 4 }
            }}
          >
            歡迎加入滿心醫療 Welcome to GracefulCare
          </Typography>
          {!isMobile && <Box sx={{ width: '150px' }} />}
        </Box>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 } }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<SupplierApplication />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
