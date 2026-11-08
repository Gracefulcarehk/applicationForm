import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Section from './Section';
import { brand } from '../../theme';
import { steps } from '../../data/recruitment';

const Steps: React.FC = () => (
  <Section id="steps" bg={brand.beige} title="申請流程" intro="全程網上進行，填妥表格及上載文件即可。">
    <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
      {steps.map((step, index) => (
        <Box component="li" key={step.title} sx={{ p: 3, borderRadius: 4, bgcolor: brand.white }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: brand.orange,
              color: brand.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
            }}
          >
            {index + 1}
          </Box>
          <Typography variant="h4" component="h3" sx={{ mt: 2, color: brand.textDark }}>
            {step.title}
          </Typography>
          <Typography sx={{ mt: 0.5, color: brand.text }}>{step.text}</Typography>
        </Box>
      ))}
    </Box>
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Button component={RouterLink} to="/apply" variant="contained" size="large">
        開始申請
      </Button>
    </Box>
  </Section>
);

export default Steps;
