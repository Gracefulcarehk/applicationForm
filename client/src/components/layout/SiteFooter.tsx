import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { brand } from '../../theme';
import { MAIN_SITE_URL, WHATSAPP_URL } from '../../data/recruitment';

// Same background and logo as the main website footer
const SiteFooter: React.FC = () => (
  <Box
    component="footer"
    sx={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/img/footer-bg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: brand.white,
    }}
  >
    <Box
      sx={{
        maxWidth: 1280,
        mx: 'auto',
        px: { xs: 4, md: 5 },
        py: { xs: 4, md: 5 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      <Box component="img" src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="滿心醫療 GracefulCare" sx={{ width: 144, height: 'auto' }} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1.5, md: 4 } }}>
        <Link href={WHATSAPP_URL} target="_blank" rel="noopener" underline="hover" sx={{ color: brand.white }}>
          WhatsApp 查詢
        </Link>
        <Link href={MAIN_SITE_URL} underline="hover" sx={{ color: brand.white }}>
          滿心醫療官網
        </Link>
      </Box>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        © {new Date().getFullYear()} 滿心醫療 GracefulCare
      </Typography>
    </Box>
  </Box>
);

export default SiteFooter;
