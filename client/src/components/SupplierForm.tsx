import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Formik, Form, Field, FieldArray, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { Supplier, SupplierType, Gender, ProfessionalCertification } from '../types/supplier';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supplierApi } from '../services/api';
import { hongKongBanks, HongKongBank } from '../data/hongKongBanks';
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

const supplierTypes: SupplierType[] = ['RN', 'EN', 'PCW', 'HCA'];
const genderOptions: Gender[] = ['M', 'F'];

const hongKongDistricts = [
  { name: 'Central and Western', nameCn: '中西區' },
  { name: 'Eastern', nameCn: '東區' },
  { name: 'Southern', nameCn: '南區' },
  { name: 'Wan Chai', nameCn: '灣仔區' },
  { name: 'Sham Shui Po', nameCn: '深水埗區' },
  { name: 'Kowloon City', nameCn: '九龍城區' },
  { name: 'Wong Tai Sin', nameCn: '黃大仙區' },
  { name: 'Kwun Tong', nameCn: '觀塘區' },
  { name: 'Yau Tsim Mong', nameCn: '油尖旺區' },
  { name: 'Islands', nameCn: '離島區' },
  { name: 'Kwai Tsing', nameCn: '葵青區' },
  { name: 'North', nameCn: '北區' },
  { name: 'Sai Kung', nameCn: '西貢區' },
  { name: 'Sha Tin', nameCn: '沙田區' },
  { name: 'Tai Po', nameCn: '大埔區' },
  { name: 'Tsuen Wan', nameCn: '荃灣區' },
  { name: 'Tuen Mun', nameCn: '屯門區' },
  { name: 'Yuen Long', nameCn: '元朗區' }
];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [fileErrors, setFileErrors] = useState<{ [key: number]: string }>({});
  const [selectedBankFile, setSelectedBankFile] = useState<File | null>(null);
  const [bankFileError, setBankFileError] = useState<string>('');
  const [selectedIdCardFile, setSelectedIdCardFile] = useState<File | null>(null);
  const [idCardFileError, setIdCardFileError] = useState<string>('');
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, setFieldValue: (field: string, value: any) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isPDF = fileType === 'application/pdf';
      
      if (!isImage && !isPDF) {
        setFileErrors(prev => ({ ...prev, [index]: '只接受圖片和PDF文件 Only image and PDF files are allowed' }));
        setSelectedFiles(prev => ({ ...prev, [index]: null }));
        setFieldValue(`professionalCertifications.${index}.fileUrl`, '');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileErrors(prev => ({ ...prev, [index]: '文件大小不能超過5MB File size should be less than 5MB' }));
        setSelectedFiles(prev => ({ ...prev, [index]: null }));
        setFieldValue(`professionalCertifications.${index}.fileUrl`, '');
        return;
      }

      setFileErrors(prev => ({ ...prev, [index]: '' }));
      setSelectedFiles(prev => ({ ...prev, [index]: file }));
      setFieldValue(`professionalCertifications.${index}.fileUrl`, URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = (index: number, setFieldValue: (field: string, value: any) => void) => {
    setSelectedFiles(prev => ({ ...prev, [index]: null }));
    setFileErrors(prev => ({ ...prev, [index]: '' }));
    setFieldValue(`professionalCertifications.${index}.fileUrl`, '');
  };

  const handleBankFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isPDF = fileType === 'application/pdf';
      
      if (!isImage && !isPDF) {
        setBankFileError('只接受圖片和PDF文件 Only image and PDF files are allowed');
        setSelectedBankFile(null);
        setFieldValue('bankAccount.fileUrl', '');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setBankFileError('文件大小不能超過5MB File size should be less than 5MB');
        setSelectedBankFile(null);
        setFieldValue('bankAccount.fileUrl', '');
        return;
      }

      setBankFileError('');
      setSelectedBankFile(file);
      setFieldValue('bankAccount.fileUrl', URL.createObjectURL(file));
    }
  };

  const handleRemoveBankFile = (setFieldValue: (field: string, value: any) => void) => {
    setSelectedBankFile(null);
    setBankFileError('');
    setFieldValue('bankAccount.fileUrl', '');
  };

  const handleIdCardFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isPDF = fileType === 'application/pdf';
      
      if (!isImage && !isPDF) {
        setIdCardFileError('只接受圖片和PDF文件 Only image and PDF files are allowed');
        setSelectedIdCardFile(null);
        setFieldValue('idCardFileUrl', '');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setIdCardFileError('文件大小不能超過5MB File size should be less than 5MB');
        setSelectedIdCardFile(null);
        setFieldValue('idCardFileUrl', '');
        return;
      }

      setIdCardFileError('');
      setSelectedIdCardFile(file);
      setFieldValue('idCardFileUrl', URL.createObjectURL(file));
    }
  };

  const handleRemoveIdCardFile = (setFieldValue: (field: string, value: any) => void) => {
    setSelectedIdCardFile(null);
    setIdCardFileError('');
    setFieldValue('idCardFileUrl', '');
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const selectedBank = hongKongBanks.find(bank => bank.name === event.target.value);
    if (selectedBank) {
      setFieldValue('bankAccount.bank', selectedBank.name);
      setFieldValue('bankAccount.bankCode', selectedBank.code);
    }
  };

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
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          供應商申請表 Supplier Application Form
        </Typography>
        <Formik<SupplierFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="companyName"
                    label="公司名稱 Company Name"
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="contactPerson"
                    label="聯絡人姓名 Contact Person"
                    error={touched.contactPerson && Boolean(errors.contactPerson)}
                    helperText={touched.contactPerson && errors.contactPerson}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label="電郵地址 Email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="phone"
                    label="電話號碼 Phone"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="address"
                    label="地址 Address"
                    multiline
                    rows={2}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="businessRegistrationNumber"
                    label="商業登記號碼 Business Registration Number"
                    error={touched.businessRegistrationNumber && Boolean(errors.businessRegistrationNumber)}
                    helperText={touched.businessRegistrationNumber && errors.businessRegistrationNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.bankName && Boolean(errors.bankName)}>
                    <InputLabel>銀行名稱 Bank Name</InputLabel>
                    <Select
                      name="bankName"
                      value={values.bankName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {hongKongBanks.map((bank: HongKongBank) => (
                        <MenuItem key={bank.code} value={bank.name}>
                          {bank.nameCn} {bank.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.bankName && errors.bankName && (
                      <FormHelperText>{errors.bankName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="bankBranch"
                    label="銀行分行 Bank Branch"
                    error={touched.bankBranch && Boolean(errors.bankBranch)}
                    helperText={touched.bankBranch && errors.bankBranch}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="bankCode"
                    label="銀行代碼 Bank Code"
                    error={touched.bankCode && Boolean(errors.bankCode)}
                    helperText={touched.bankCode && errors.bankCode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="bankAccountNumber"
                    label="銀行帳戶號碼 Bank Account Number"
                    error={touched.bankAccountNumber && Boolean(errors.bankAccountNumber)}
                    helperText={touched.bankAccountNumber && errors.bankAccountNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="swiftCode"
                    label="SWIFT代碼 SWIFT Code"
                    error={touched.swiftCode && Boolean(errors.swiftCode)}
                    helperText={touched.swiftCode && errors.swiftCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="idCardNumber"
                    label="身份證號碼 ID Card Number"
                    error={touched.idCardNumber && Boolean(errors.idCardNumber)}
                    helperText={touched.idCardNumber && errors.idCardNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="idCardExpiryDate"
                    label="身份證到期日 ID Card Expiry Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={touched.idCardExpiryDate && Boolean(errors.idCardExpiryDate)}
                    helperText={touched.idCardExpiryDate && errors.idCardExpiryDate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    上傳身份證副本 Upload ID Card Copy
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleIdCardFileChange(e, setFieldValue);
                        setFieldValue('idCardCopy', e.target.files?.[0] || null);
                      }}
                    />
                  </Button>
                  {selectedIdCardFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      已選擇文件: {selectedIdCardFile.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    上傳銀行月結單 Upload Bank Statement
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleBankFileChange(e, setFieldValue);
                        setFieldValue('bankStatement', e.target.files?.[0] || null);
                      }}
                    />
                  </Button>
                  {selectedBankFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      已選擇文件: {selectedBankFile.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    上傳商業登記證 Upload Business Registration Certificate
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleFileChange(e, 0, setFieldValue);
                        setFieldValue('businessRegistrationCertificate', e.target.files?.[0] || null);
                      }}
                    />
                  </Button>
                  {selectedFiles[0] && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      已選擇文件: {selectedFiles[0]?.name}
                    </Typography>
                  )}
                </Grid>
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default SupplierForm; 