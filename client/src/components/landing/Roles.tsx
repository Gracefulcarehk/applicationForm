import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ElderlyIcon from '@mui/icons-material/Elderly';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import Section from './Section';
import { brand } from '../../theme';
import { roles, RoleIcon } from '../../data/recruitment';

const icons: Record<RoleIcon, typeof ElderlyIcon> = {
  housework: CleaningServicesOutlinedIcon,
  care: ElderlyIcon,
  nurse: MedicalServicesOutlinedIcon,
  rehab: AccessibilityNewIcon,
};

const List: React.FC<{ title: string; intro?: string; items: string[]; check?: boolean }> = ({ title, intro, items, check }) => (
  <Box>
    <Typography variant="h5" component="h4" sx={{ color: brand.blue }}>
      {title}
    </Typography>
    {intro && <Typography sx={{ mt: 1, color: brand.text }}>{intro}</Typography>}
    <Box component="ul" sx={{ m: 0, mt: 1, p: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <Box component="li" key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.5, color: brand.text }}>
          {check ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 20, mt: '2px', color: brand.orange }} />
          ) : (
            <Box sx={{ flexShrink: 0, width: 6, height: 6, mt: '10px', mx: '7px', borderRadius: '50%', bgcolor: brand.orange }} />
          )}
          <Typography>{item}</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

// Pill tabs and a detail card, like the service scope section on the main site's CCSV page
const Roles: React.FC = () => {
  const [selected, setSelected] = useState(roles[0].code);
  const role = roles.find((r) => r.code === selected) ?? roles[0];
  const Icon = icons[role.icon];

  return (
    <Section id="roles" bg={brand.beige} title="現正招募" intro="選擇職位，了解入職要求及工作內容。">
      <Box
        role="tablist"
        aria-label="現正招募"
        sx={{
          display: 'flex',
          gap: 1.5,
          justifyContent: { md: 'center' },
          overflowX: 'auto',
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
          pb: 1,
        }}
      >
        {roles.map((r) => {
          const active = r.code === selected;
          return (
            <Box
              key={r.code}
              component="button"
              role="tab"
              id={`role-tab-${r.code}`}
              aria-selected={active}
              aria-controls="role-panel"
              onClick={() => setSelected(r.code)}
              sx={{
                flexShrink: 0,
                border: 0,
                cursor: 'pointer',
                borderRadius: 100,
                px: 3,
                py: 1,
                font: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 500,
                bgcolor: active ? brand.white : brand.outline,
                color: active ? brand.orange : brand.greyTab,
                boxShadow: active ? '1px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
              }}
            >
              {r.name}
            </Box>
          );
        })}
      </Box>

      <Box
        id="role-panel"
        role="tabpanel"
        aria-labelledby={`role-tab-${role.code}`}
        sx={{
          mt: 3,
          bgcolor: brand.white,
          borderRadius: 4,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
        }}
      >
        {role.image ? (
          // Kept at the photo's 3:2 ratio so long role descriptions don't crop people out
          <Box sx={{ p: { xs: 0, md: 4 }, pr: { md: 0 } }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/img/roles/${role.image}`}
              alt={role.name}
              sx={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', display: 'block', borderRadius: { md: 3 } }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: brand.blue,
              color: brand.white,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: { xs: 4, md: 6 },
            }}
          >
            <Icon sx={{ fontSize: { xs: 56, md: 80 } }} />
            <Typography variant="h3" component="p" sx={{ color: brand.white }}>
              {role.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>{role.englishName}</Typography>
          </Box>
        )}
        <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h3" sx={{ color: brand.textDark }}>
            {role.name}
            <Box component="span" sx={{ ml: 1, fontSize: '1rem', color: brand.grey }}>
              {role.englishName}
            </Box>
          </Typography>
          <List title="入職要求" intro={role.qualificationsIntro} items={role.qualifications} check />
          <List title="工作內容" items={role.scope} />
          <Box>
            <Button component={RouterLink} to="/apply" variant="contained">
              申請此職位
            </Button>
          </Box>
        </Box>
      </Box>
    </Section>
  );
};

export default Roles;
