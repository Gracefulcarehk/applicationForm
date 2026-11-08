import React from 'react';
import { Box, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import Section from './Section';
import { brand } from '../../theme';
import { whyJoin, WhyIcon } from '../../data/recruitment';

const icons: Record<WhyIcon, typeof ScheduleIcon> = {
  schedule: ScheduleIcon,
  home: HomeOutlinedIcon,
  support: GroupsOutlinedIcon,
  tech: DevicesOtherOutlinedIcon,
};

// Round icon badges, like the "why choose us" row on the main site's CCSV page
const WhyJoin: React.FC = () => (
  <Section id="why" title="為何加入我們">
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 3, md: 4 } }}>
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
            <Box>
              <Typography variant="h4" component="h3" sx={{ color: brand.textDark }}>
                {item.title}
              </Typography>
              <Typography sx={{ mt: 0.5, color: brand.text }}>{item.text}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  </Section>
);

export default WhyJoin;
