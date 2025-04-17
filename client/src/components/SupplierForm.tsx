import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Theme,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface SupplierFormValues {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  businessRegistrationNumber: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  bankCode: string;
  swiftCode: string;
  idCardNumber: string;
  idCardExpiryDate: string;
  idCardCopy: File | null;
  bankStatement: File | null;
  businessRegistrationCertificate: File | null;
}

interface SupplierFormProps {
  onSubmit?: (values: SupplierFormValues) => void;
  initialValues?: SupplierFormValues;
  submitButtonText?: string;
}

const validationSchema = Yup.object({
  companyName: Yup.string().required('請輸入公司名稱 Company name is required'),
  contactPerson: Yup.string().required('請輸入聯絡人姓名 Contact person is required'),
  email: Yup.string().email('請輸入有效的電郵地址 Please enter a valid email').required('請輸入電郵地址 Email is required'),
  phone: Yup.string().required('請輸入電話號碼 Phone number is required'),
  address: Yup.string().required('請輸入地址 Address is required'),
  businessRegistrationNumber: Yup.string().required('請輸入商業登記號碼 Business registration number is required'),
  bankAccountNumber: Yup.string().required('請輸入銀行帳戶號碼 Bank account number is required'),
  bankName: Yup.string().required('請選擇銀行 Please select a bank'),
  bankBranch: Yup.string().required('請輸入銀行分行 Please enter bank branch'),
  bankCode: Yup.string().required('請輸入銀行代碼 Please enter bank code'),
  swiftCode: Yup.string().required('請輸入SWIFT代碼 Please enter SWIFT code'),
  idCardNumber: Yup.string().required('請輸入身份證號碼 ID card number is required'),
  idCardExpiryDate: Yup.string().required('請輸入身份證到期日 ID card expiry date is required'),
  idCardCopy: Yup.mixed().required('請上傳身份證副本 Please upload ID card copy'),
  bankStatement: Yup.mixed().required('請上傳銀行月結單 Please upload bank statement'),
  businessRegistrationCertificate: Yup.mixed().required('請上傳商業登記證 Please upload business registration certificate'),
});

const defaultValues: SupplierFormValues = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  businessRegistrationNumber: '',
  bankAccountNumber: '',
  bankName: '',
  bankBranch: '',
  bankCode: '',
  swiftCode: '',
  idCardNumber: '',
  idCardExpiryDate: '',
  idCardCopy: null,
  bankStatement: null,
  businessRegistrationCertificate: null,
};

// Responsive styles using theme breakpoints
const getResponsiveStyles = (theme: Theme) => ({
  container: {
    py: { xs: 2, sm: 3, md: 4 },
    px: { xs: 2, sm: 3, md: 4 },
    minHeight: '100vh',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    // Add safe area insets for modern browsers
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    // Fallback for older browsers
    '@supports not (padding: env(safe-area-inset-top))': {
      paddingTop: { xs: 'calc(2rem + env(safe-area-inset-top))', sm: '3rem', md: '4rem' },
      paddingBottom: { xs: 'calc(2rem + env(safe-area-inset-bottom))', sm: '3rem', md: '4rem' },
    },
  },
  paper: {
    p: { xs: 2, sm: 3, md: 4 },
    mt: { xs: 1, sm: 2, md: 4 },
    width: '100%',
    maxWidth: '100%',
    mx: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: { xs: 'auto', sm: '80vh' },
    // Ensure content doesn't get cut off by browser UI
    maxHeight: { xs: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))', sm: 'none' },
    overflowY: 'auto',
    // Hide scrollbar but keep functionality
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    // Prevent form from being cut off
    minHeight: 'fit-content',
  },
  formContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    // Add padding to prevent content from being hidden behind browser UI
    paddingBottom: { xs: 'env(safe-area-inset-bottom)', sm: 0 },
  },
  title: {
    mb: { xs: 2, sm: 3, md: 4 },
    // Ensure title is always visible
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: 'background.paper',
    paddingTop: { xs: 'env(safe-area-inset-top)', sm: 0 },
  },
  sectionTitle: {
    fontWeight: 'bold',
    // Keep section titles visible while scrolling
    position: 'sticky',
    top: { xs: 'calc(3.5rem + env(safe-area-inset-top))', sm: '4rem' },
    zIndex: 1,
    backgroundColor: 'background.paper',
    paddingTop: 1,
    marginTop: -1,
  },
  textField: {
    size: { xs: 'small', sm: 'medium' } as const,
  },
  button: {
    py: { xs: 1, sm: 1.25, md: 1.5 },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    mt: 'auto',
    // Ensure button is always visible and not hidden by browser UI
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'background.paper',
    paddingBottom: { xs: 'env(safe-area-inset-bottom)', sm: 0 },
  },
  gridSpacing: { xs: 2, sm: 3 },
  multilineRows: { xs: 2, sm: 3 },
  gridContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
});

const SupplierForm: React.FC<SupplierFormProps> = ({
  onSubmit,
  initialValues = defaultValues,
  submitButtonText = '提交申請 Submit Application',
}) => {
  const theme = useTheme();
  const styles = getResponsiveStyles(theme);
  
  // Consistent breakpoint detection
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Add viewport height detection for mobile browsers
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  const handleSubmit = async (values: SupplierFormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setSnackbar({
        open: true,
        message: '申請已成功提交 Application submitted successfully',
        severity: 'success',
      });
      navigate('/success');
    } catch (error) {
      setSnackbar({
        open: true,
        message: '提交申請時發生錯誤 Error submitting application',
        severity: 'error',
      });
    }
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{
        ...styles.container,
        // Dynamic height adjustment for mobile browsers
        minHeight: isMobile ? `${viewportHeight}px` : '100vh',
      }}
    >
      <Paper elevation={3} sx={styles.paper}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          gutterBottom
          align="center"
          sx={styles.title}
        >
          供應商申請表 Supplier Application Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form style={styles.form}>
              <Grid container spacing={styles.gridSpacing} sx={styles.gridContainer}>
                {/* Company Information */}
                <Grid item xs={12}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    gutterBottom
                    sx={styles.sectionTitle}
                  >
                    公司資料 Company Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="companyName"
                    label="公司名稱 Company Name"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="contactPerson"
                    label="聯絡人姓名 Contact Person"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    error={touched.contactPerson && Boolean(errors.contactPerson)}
                    helperText={touched.contactPerson && errors.contactPerson}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="電郵地址 Email"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="電話號碼 Phone"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="地址 Address"
                    fullWidth
                    multiline
                    rows={styles.multilineRows}
                    size={isMobile ? "small" : "medium"}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                {/* ... rest of the form fields ... */}
                <Grid item xs={12} sx={styles.button}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      py: styles.button.py,
                      fontSize: styles.button.fontSize,
                    }}
                  >
                    {submitButtonText}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{
          vertical: isMobile ? 'bottom' : 'top',
          horizontal: 'center',
        }}
        // Adjust snackbar position to account for browser UI
        sx={{
          bottom: { xs: 'env(safe-area-inset-bottom)', sm: 0 },
        }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupplierForm; 