import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import SupplierForm from '../components/SupplierForm';
import { brand } from '../theme';
import { REVIEW_TIME } from '../data/recruitment';

const SupplierApplication: React.FC = () => (
  <Box sx={{ flex: 1, bgcolor: brand.beige, pb: { xs: 4, md: 8 } }}>
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 5 }, pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 4 } }}>
      <Typography variant="h1" sx={{ color: brand.textDark, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        護理人員申請表
      </Typography>
      <Typography sx={{ mt: 1, color: brand.text }}>
        請填妥以下資料並上載所需文件，我們會於 {REVIEW_TIME}內完成審核。有疑問？
        <Link href="/#faq" sx={{ color: brand.orange }}>
          查看常見問題
        </Link>
      </Typography>
    </Box>
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 5 } }}>
      {/* SupplierForm builds the multipart FormData (including files) and submits it itself */}
      <SupplierForm />
    </Box>
  </Box>
);

export default SupplierApplication;
