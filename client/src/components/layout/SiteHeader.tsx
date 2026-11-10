import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { brand, HEADER_HEIGHT } from '../../theme';
import { MAIN_SITE_URL, WHATSAPP_URL } from '../../data/recruitment';

// Landing page sections; absolute so they also work from /apply and /thank-you
export const navLinks = [
  { label: '為何加入', href: '/#why' },
  { label: '現正招募', href: '/#roles' },
  { label: '申請流程', href: '/#steps' },
  { label: '常見問題', href: '/#faq' },
];

// Same white pill as the main site's 長者社區券 / 加入我們 navbar buttons
const pillSx = {
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  border: `1px solid ${brand.greyBg}`,
  borderRadius: '24px',
  bgcolor: brand.white,
  px: 1.5,
  py: 1,
  fontSize: '0.875rem',
  lineHeight: '20px',
  fontWeight: 600,
  color: brand.orange,
  textDecoration: 'none',
  boxShadow: '1px 2px 4px 0px rgba(0, 0, 0, 0.1)',
} as const;

// Mirrors the main site's navbar (web-app src/app/[locale]/components/Navbar) so both sites look the same
const SiteHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: brand.white }}>
      <Box
        component="nav"
        sx={{
          position: 'relative',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: brand.textDark,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label={open ? '關閉選單' : '開啟選單'}
            onClick={() => setOpen(!open)}
            sx={{ display: { md: 'none' }, color: brand.textDark, p: 0, mr: 0.5 }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <RouterLink to="/" onClick={close} style={{ display: 'flex', margin: 12 }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/img/logo.png`}
              alt="滿心醫療 GracefulCare"
              sx={{ width: { xs: 95, md: 120 }, height: 'auto' }}
            />
          </RouterLink>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3 }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} underline="none" sx={{ m: 1.5, color: 'inherit', fontSize: '1rem', lineHeight: 1.5 }}>
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* No room on phones; shown in the mobile menu instead */}
          <Link href={MAIN_SITE_URL} sx={{ ...pillSx, display: { xs: 'none', md: 'flex' } }}>
            返回滿心醫療官網
          </Link>
          <Box component={RouterLink} to="/apply" onClick={close} sx={pillSx}>
            立即申請
          </Box>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}
          >
            <Box component="img" src={`${process.env.PUBLIC_URL}/img/whatsapp_logo.png`} alt="WhatsApp" sx={{ width: 30, height: 30 }} />
          </Link>
        </Box>

        {open && (
          <Box
            sx={{
              display: { md: 'none' },
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              bgcolor: brand.white,
              p: 2,
              color: brand.darkBlue,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={close} underline="none" sx={{ display: 'block', p: 1.5, color: 'inherit' }}>
                {link.label}
              </Link>
            ))}
            <Link
              href={MAIN_SITE_URL}
              onClick={close}
              underline="none"
              sx={{ display: 'block', p: 1.5, fontWeight: 600, color: brand.orange }}
            >
              返回滿心醫療官網
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SiteHeader;
