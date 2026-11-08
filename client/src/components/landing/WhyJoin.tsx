import React from 'react';
import { Box, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Section from './Section';
import { brand } from '../../theme';
import { whyJoin, WhyIcon } from '../../data/recruitment';

const icons: Record<WhyIcon, typeof ScheduleIcon> = {
  schedule: ScheduleIcon,
  support: SupportAgentOutlinedIcon,
  training: SchoolOutlinedIcon,
};

// Round icon badges, like the "why choose us" row on the main site's CCSV page
const WhyJoin: React.FC = () => (
  <Section id="why" title="為何加入我們？">
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${whyJoin.length}, 1fr)` }, maxWidth: 960, mx: 'auto', gap: { xs: 3, md: 4 } }}>
      {whyJoin.map((item) => {
        const Icon = icons[item.icon];
        return (
          <Box
            key={item.title}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              alignItems: 'center',
              textAlign: { md: 'center' },
              gap: 2,
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 72, md: 94 },
                height: { xs: 72, md: 94 },
                borderRadius: '50%',
                bgcolor: brand.beige,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: { xs: 32, md: 40 }, color: brand.orange }} />
            </Box>
            <Typography variant="h4" component="h3" sx={{ color: brand.textDark }}>
              {item.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Section>
);

export default WhyJoin;
