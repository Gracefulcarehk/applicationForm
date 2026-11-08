import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { brand, sectionInner } from '../../theme';
import { WHATSAPP_URL } from '../../data/recruitment';

const CtaBanner: React.FC = () => (
  <Box component="section" sx={{ bgcolor: brand.orange }}>
    <Box
      sx={{
        ...sectionInner,
        py: { xs: 5, md: 6 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h3" component="h2" sx={{ color: brand.white }}>
          準備好加入滿心醫療？
        </Typography>
        <Typography sx={{ mt: 1, color: brand.white }}>立即遞交申請，與我們一同為長者提供專業、貼心的照顧。</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/apply"
          size="large"
          sx={{ bgcolor: brand.white, color: brand.orange, '&:hover': { bgcolor: brand.beige } }}
        >
          立即申請
        </Button>
        <Button
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          size="large"
          variant="outlined"
          startIcon={<WhatsAppIcon />}
          sx={{ color: brand.white, borderColor: brand.white, bgcolor: 'transparent', '&:hover': { borderColor: brand.white, bgcolor: 'rgba(255, 255, 255, 0.12)' } }}
        >
          WhatsApp 查詢
        </Button>
      </Box>
    </Box>
  </Box>
);

export default CtaBanner;
