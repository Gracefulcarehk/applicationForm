import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { brand, HEADER_HEIGHT } from '../../theme';
import { MAIN_SITE_URL } from '../../data/recruitment';

// Landing page sections; absolute so they also work from /apply and /thank-you
export const navLinks = [
  { label: '為何加入', href: '/#why' },
  { label: '招聘職位', href: '/#roles' },
  { label: '申請流程', href: '/#steps' },
  { label: '常見問題', href: '/#faq' },
];

const SiteHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Box
      component="header"
      sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: brand.white, boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)' }}
    >
      <Box
        component="nav"
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, md: 5 },
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            aria-label={open ? '關閉選單' : '開啟選單'}
            onClick={() => setOpen(!open)}
            sx={{ display: { md: 'none' }, color: brand.textDark, ml: -1 }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <RouterLink to="/" onClick={close} style={{ display: 'flex' }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/img/logo.png`}
              alt="滿心醫療 GracefulCare"
              sx={{ height: { xs: 32, md: 48 }, width: 'auto' }}
            />
          </RouterLink>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, ml: 5 }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} underline="none" sx={{ color: brand.textDark, '&:hover': { color: brand.orange } }}>
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link
            href={MAIN_SITE_URL}
            underline="none"
            sx={{ display: { xs: 'none', md: 'inline' }, color: brand.text, fontSize: '0.875rem', '&:hover': { color: brand.orange } }}
          >
            返回滿心醫療官網
          </Link>
          <Button component={RouterLink} to="/apply" variant="contained" onClick={close} sx={{ whiteSpace: 'nowrap' }}>
            立即申請
          </Button>
        </Box>
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
            px: 2,
            py: 1,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
          }}
        >
          {[...navLinks, { label: '返回滿心醫療官網', href: MAIN_SITE_URL }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              underline="none"
              sx={{ display: 'block', p: 1.5, color: brand.darkBlue }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SiteHeader;
