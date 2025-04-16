import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
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

const SupplierForm: React.FC<SupplierFormProps> = ({
  onSubmit,
  initialValues = defaultValues,
  submitButtonText = '提交申請 Submit Application',
}) => {
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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          供應商申請表 Supplier Application Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Company Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    公司資料 Company Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="companyName"
                    label="公司名稱 Company Name"
                    fullWidth
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  />
                </Grid>
                {/* ... rest of the form fields ... */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
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