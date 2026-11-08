import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { brand, sectionInner } from '../../theme';
import { hero, WHATSAPP_URL } from '../../data/recruitment';

// Orange dot grid and half ring, like the decorations on the main site's photos
const dots = `radial-gradient(${brand.orange} 2px, transparent 2px)`;

const Hero: React.FC = () => (
  <Box component="section" sx={{ bgcolor: brand.beige, overflow: 'hidden' }}>
    <Box
      sx={{
        ...sectionInner,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: { xs: 5, md: 8 },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          component="p"
          sx={{
            display: 'inline-block',
            px: 2,
            py: 0.5,
            borderRadius: 100,
            bgcolor: brand.white,
            color: brand.orange,
            fontWeight: 500,
          }}
        >
          {hero.eyebrow}
        </Typography>
        <Typography
          variant="h1"
          sx={{ mt: 2, color: brand.textDark, whiteSpace: 'pre-line', fontSize: { xs: '2rem', md: '2.75rem' } }}
        >
          {hero.title}
        </Typography>
        <Typography sx={{ mt: 2, color: brand.text, fontSize: { md: '1.125rem' } }}>{hero.subtitle}</Typography>
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button component={RouterLink} to="/apply" variant="contained" size="large">
            立即申請
          </Button>
          <Button
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            variant="outlined"
            size="large"
            startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
            sx={{ color: brand.textDark }}
          >
            WhatsApp 查詢
          </Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1, position: 'relative', width: '100%', maxWidth: 560 }}>
        <Box
          aria-hidden
          sx={{ position: 'absolute', left: -24, bottom: -24, width: 96, height: 96, backgroundImage: dots, backgroundSize: '16px 16px' }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: -28,
            top: -28,
            width: 96,
            height: 96,
            borderRadius: '50%',
            border: `18px solid ${brand.blue}`,
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: 'rotate(-45deg)',
          }}
        />
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL}/img/hero-team.jpg`}
          alt="滿心醫療護理團隊"
          sx={{ position: 'relative', display: 'block', width: '100%', height: 'auto', borderRadius: 4 }}
        />
      </Box>
    </Box>
  </Box>
);

export default Hero;
