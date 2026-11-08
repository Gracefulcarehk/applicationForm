import React from 'react';
import { Box, Typography } from '@mui/material';
import { brand, HEADER_HEIGHT, sectionInner } from '../../theme';

type Props = {
  id?: string;
  bg?: string;
  title?: string;
  intro?: string;
  children: React.ReactNode;
};

const Section: React.FC<Props> = ({ id, bg = brand.white, title, intro, children }) => (
  <Box
    component="section"
    id={id}
    sx={{ bgcolor: bg, scrollMarginTop: { xs: HEADER_HEIGHT.xs, md: HEADER_HEIGHT.md } }}
  >
    <Box sx={sectionInner}>
      {title && (
        <Box sx={{ textAlign: { md: 'center' }, mb: { xs: 3, md: 5 } }}>
          <Typography variant="h2" sx={{ color: brand.text, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            {title}
          </Typography>
          {intro && (
            <Typography sx={{ mt: 1, color: brand.text, maxWidth: 720, mx: { md: 'auto' } }}>{intro}</Typography>
          )}
        </Box>
      )}
      {children}
    </Box>
  </Box>
);

export default Section;
