import React from 'react';
import { Box, Typography } from '@mui/material';
import Section from './Section';
import { brand } from '../../theme';
import { benefits } from '../../data/recruitment';

// Hidden until benefit details are added to data/recruitment.ts
const Benefits: React.FC = () => {
  if (!benefits.length) return null;

  return (
    <Section id="benefits" title="加入滿心醫療的福利">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {benefits.map((benefit) => (
          <Box key={benefit.title} sx={{ p: 3, borderRadius: 4, bgcolor: brand.beige }}>
            <Typography variant="h4" component="h3" sx={{ color: brand.orange }}>
              {benefit.title}
            </Typography>
            <Typography sx={{ mt: 1, color: brand.text }}>{benefit.text}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
};

export default Benefits;
