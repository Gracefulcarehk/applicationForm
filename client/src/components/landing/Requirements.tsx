import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Section from './Section';
import { brand } from '../../theme';
import { requirements } from '../../data/recruitment';

const Requirements: React.FC = () => (
  <Section id="requirements" title="申請資格及所需文件" intro="申請前請準備好以下資料及文件。">
    <Box
      component="ul"
      sx={{
        m: 0,
        p: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 2,
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      {requirements.map((item) => (
        <Box
          component="li"
          key={item}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2.5, borderRadius: 3, bgcolor: brand.beige }}
        >
          <CheckCircleIcon sx={{ color: brand.orange }} />
          <Typography sx={{ color: brand.textDark }}>{item}</Typography>
        </Box>
      ))}
    </Box>
  </Section>
);

export default Requirements;
