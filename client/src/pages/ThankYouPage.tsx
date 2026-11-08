import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { brand } from '../theme';
import { MAIN_SITE_URL, REVIEW_TIME } from '../data/recruitment';

const ThankYouPage: React.FC = () => (
  <Box sx={{ flex: 1, bgcolor: brand.beige, px: 2, py: { xs: 6, md: 10 } }}>
    <Box
      sx={{
        maxWidth: 640,
        mx: 'auto',
        p: { xs: 4, md: 6 },
        textAlign: 'center',
        bgcolor: brand.white,
        borderRadius: 4,
        boxShadow: '0 8px 24px rgba(27, 36, 59, 0.06)',
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 64, color: brand.orange }} />
      <Typography variant="h1" sx={{ mt: 2, color: brand.textDark, fontSize: { xs: '1.75rem', md: '2rem' } }}>
        感謝你的申請
      </Typography>
      <Typography sx={{ mt: 2, color: brand.text }}>
        我們已收到你的申請，團隊會於 {REVIEW_TIME}內完成審核，並以 WhatsApp 與你聯絡。
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        <Button component={RouterLink} to="/" variant="contained">
          返回招聘首頁
        </Button>
        <Button href={MAIN_SITE_URL} variant="outlined" sx={{ color: brand.textDark }}>
          瀏覽滿心醫療官網
        </Button>
      </Box>
    </Box>
  </Box>
);

export default ThankYouPage;
