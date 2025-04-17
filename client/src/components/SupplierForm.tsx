import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
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
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  supplierType: Yup.string().required('請選擇供應商類型 Please select supplier type'),
  contactPerson: Yup.object({
    nameEn: Yup.string().required('請輸入英文姓名 Please enter name in English'),
    nameCn: Yup.string().required('請輸入中文姓名 Please enter name in Chinese'),
    email: Yup.string().email('請輸入有效的電郵地址 Please enter a valid email address').required('請輸入電郵地址 Please enter email address'),
    phone: Yup.string().required('請輸入聯絡電話 Please enter phone number'),
  }),
  gender: Yup.string().required('請選擇性別 Please select gender'),
  address: Yup.object({
    street: Yup.string(),
    addressLine2: Yup.string(),
    district: Yup.string().required('請選擇地區 Please select district'),
  }),
  hkid: Yup.string().required('請輸入香港身份證號碼 Please enter HKID number'),
  idCardFileUrl: Yup.string().required('請上傳身份證文件 Please upload ID card document'),
  dateOfBirth: Yup.object({
    day: Yup.string()
      .matches(/^[1-9]|[12][0-9]|3[01]$/, '日期必須在1至31之間 Day must be between 1 and 31')
      .required('請輸入日期 Please enter day'),
    month: Yup.string()
      .matches(/^[1-9]|1[0-2]$/, '月份必須在1至12之間 Month must be between 1 and 12')
      .required('請輸入月份 Please enter month'),
    year: Yup.string()
      .matches(/^19[0-9]{2}|20[0-9]{2}$/, '年份必須在1900至今年之間 Year must be between 1900 and current year')
      .required('請輸入年份 Please enter year'),
  }).required('請輸入出生日期 Please enter date of birth'),
  professionalCertifications: Yup.array().of(
    Yup.object({
      name: Yup.string().required('請輸入認證名稱 Please enter certification name'),
      fileUrl: Yup.string().required('請上傳專業認證文件 Please upload professional certification document'),
      expiryDate: Yup.string().required('請輸入認證到期日 Please enter certification expiry date'),
    })
  ).min(1, '請至少上傳一個專業認證 Please upload at least one professional certification'),
  bankAccount: Yup.object({
    bank: Yup.string().required('請選擇銀行 Please select bank'),
    bankCode: Yup.string().required('請輸入銀行代碼 Please enter bank code'),
    accountNumber: Yup.string()
      .required('請輸入銀行帳戶號碼 Please enter bank account number')
      .matches(/^\d+$/, '銀行帳戶號碼必須為數字 Bank account number must contain only numbers'),
    cardHolderName: Yup.string()
      .required('請輸入持卡人姓名 Please enter card holder name')
      .matches(/^[a-zA-Z\s]+$/, '持卡人姓名必須為英文 Card holder name must be in English'),
    fileUrl: Yup.string().required('請上傳銀行帳戶文件 Please upload bank account document'),
  }).required('請填寫銀行帳戶資料 Please fill in bank account information'),
});

interface SupplierFormProps {
  initialValues?: Omit<Supplier, '_id'>;
  onSubmit?: (values: Omit<Supplier, '_id'>) => Promise<void>;
  submitButtonText?: string;
}

const hongKongBanks = [
  { name: 'HSBC (Hongkong and Shanghai Banking Corporation)', nameCn: '滙豐銀行', code: '004' },
  { name: 'Bank of China (Hong Kong)', nameCn: '中國銀行(香港)', code: '012' },
  { name: 'Standard Chartered Bank (Hong Kong)', nameCn: '渣打銀行(香港)', code: '003' },
  { name: 'Hang Seng Bank', nameCn: '恒生銀行', code: '024' },
  { name: 'Bank of East Asia', nameCn: '東亞銀行', code: '015' },
  { name: 'DBS Bank (Hong Kong)', nameCn: '星展銀行(香港)', code: '016' },
  { name: 'Citibank (Hong Kong)', nameCn: '花旗銀行(香港)', code: '006' },
  { name: 'China Construction Bank (Asia)', nameCn: '中國建設銀行(亞洲)', code: '009' },
  { name: 'Industrial and Commercial Bank of China (Asia)', nameCn: '中國工商銀行(亞洲)', code: '072' },
  { name: 'Agricultural Bank of China (Hong Kong)', nameCn: '中國農業銀行(香港)', code: '010' },
  { name: 'Bank of Communications (Hong Kong)', nameCn: '交通銀行(香港)', code: '027' },
  { name: 'China Merchants Bank (Hong Kong)', nameCn: '招商銀行(香港)', code: '238' },
  { name: 'Nanyang Commercial Bank', nameCn: '南洋商業銀行', code: '025' },
  { name: 'Wing Lung Bank', nameCn: '永隆銀行', code: '020' },
  { name: 'Chiyu Banking Corporation', nameCn: '集友銀行', code: '039' },
  { name: 'Public Bank (Hong Kong)', nameCn: '大眾銀行(香港)', code: '026' },
  { name: 'Chong Hing Bank', nameCn: '創興銀行', code: '041' },
  { name: 'Shanghai Commercial Bank', nameCn: '上海商業銀行', code: '025' },
  { name: 'Tai Sang Bank', nameCn: '大生銀行', code: '052' },
  { name: 'Tai Yau Bank', nameCn: '大有銀行', code: '053' },
  { name: 'Wing Hang Bank', nameCn: '永亨銀行', code: '035' },
  { name: 'CITIC Bank International', nameCn: '中信銀行國際', code: '018' },
  { name: 'China CITIC Bank International', nameCn: '中信銀行國際', code: '018' },
  { name: 'China Minsheng Banking Corporation (Hong Kong)', nameCn: '中國民生銀行(香港)', code: '353' },
  { name: 'China Zheshang Bank (Hong Kong)', nameCn: '浙商銀行(香港)', code: '365' },
  { name: 'China Guangfa Bank (Hong Kong)', nameCn: '廣發銀行(香港)', code: '358' },
  { name: 'China Everbright Bank (Hong Kong)', nameCn: '中國光大銀行(香港)', code: '359' },
  { name: 'China Bohai Bank (Hong Kong)', nameCn: '渤海銀行(香港)', code: '361' },
  { name: 'China Huishang Bank (Hong Kong)', nameCn: '徽商銀行(香港)', code: '362' },
];

const defaultValues: Omit<Supplier, '_id'> = {
  supplierType: 'RN',
  contactPerson: {
    nameEn: '',
    nameCn: '',
    email: '',
    phone: '',
  },
  gender: 'M',
  address: {
    street: '',
    addressLine2: '',
    district: '',
  },
  hkid: '',
  idCardFileUrl: '',
  dateOfBirth: {
    day: '',
    month: '',
    year: '',
  },
  documents: [],
  professionalCertifications: [{
    name: '',
    fileUrl: '',
    expiryDate: '',
    uploadDate: new Date(),
  }],
  bankAccount: {
    bank: '',
    bankCode: '',
    accountNumber: '',
    cardHolderName: '',
    fileUrl: '',
  },
  status: 'Pending',
};

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

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  submitButtonText = '提交申請 Submit Application',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Track viewport height changes
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Track scroll position for sticky elements
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleSubmit = async (values: Omit<Supplier, '_id'>) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await supplierApi.createSupplier(values);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: '申請已成功提交 Application submitted successfully',
        severity: 'success',
      });

      // Navigate to thank you page after a short delay
      setTimeout(() => {
        navigate('/thank-you');
      }, 2000);

    } catch (error) {
      console.error('Form submission error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '提交申請時發生錯誤 Error submitting application',
        severity: 'error',
      });
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        minHeight: { xs: '100vh', sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        '@supports (padding: max(0px))': {
          padding: {
            xs: `max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right))`,
            sm: '24px',
          },
        },
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          fontWeight: 700,
          color: '#000000',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'background.paper',
          padding: { xs: '16px 0', sm: '24px 0' },
          marginBottom: { xs: '16px', sm: '24px' },
          borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        }}
      >
        申請人資料 Applicant Information
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form>
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }}
              sx={{
                flex: 1,
                minHeight: { xs: `calc(${viewportHeight}px - 200px)`, sm: 'auto' },
                '@supports (min-height: -webkit-fill-available)': {
                  minHeight: { xs: '-webkit-fill-available', sm: 'auto' },
                },
              }}
            >
              <Grid item xs={12}>
                <Field
                  name="supplierType"
                  as={TextField}
                  select
                  label="Supplier Type"
                  fullWidth
                  error={touched.supplierType && Boolean(errors.supplierType)}
                  helperText={touched.supplierType && errors.supplierType}
                >
                  {supplierTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    color: '#000000',
                    position: 'sticky',
                    top: { xs: '60px', sm: '80px' },
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    padding: { xs: '8px 0', sm: '16px 0' },
                    marginBottom: { xs: '8px', sm: '16px' },
                  }}
                >
                  個人資料 Personal Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="contactPerson.nameCn"
                      as={TextField}
                      label="姓名 (中)"
                      fullWidth
                      error={touched.contactPerson?.nameCn && Boolean(errors.contactPerson?.nameCn)}
                      helperText={touched.contactPerson?.nameCn && errors.contactPerson?.nameCn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="contactPerson.nameEn"
                      as={TextField}
                      label="Full Name (ENG)"
                      fullWidth
                      error={touched.contactPerson?.nameEn && Boolean(errors.contactPerson?.nameEn)}
                      helperText={touched.contactPerson?.nameEn && errors.contactPerson?.nameEn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="contactPerson.email"
                      as={TextField}
                      label="電郵 Email"
                      fullWidth
                      error={touched.contactPerson?.email && Boolean(errors.contactPerson?.email)}
                      helperText={touched.contactPerson?.email && errors.contactPerson?.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="contactPerson.phone"
                      as={TextField}
                      label="聯絡電話 Phone"
                      fullWidth
                      error={touched.contactPerson?.phone && Boolean(errors.contactPerson?.phone)}
                      helperText={touched.contactPerson?.phone && errors.contactPerson?.phone}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="gender"
                  as={TextField}
                  select
                  label="性別 Gender"
                  fullWidth
                  error={touched.gender && Boolean(errors.gender)}
                  helperText={touched.gender && errors.gender}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  出生日期 Birthday
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      name="dateOfBirth.day"
                      as={TextField}
                      label="Day"
                      type="number"
                      inputProps={{ min: 1, max: 31 }}
                      fullWidth
                      error={touched.dateOfBirth?.day && Boolean(errors.dateOfBirth?.day)}
                      helperText={touched.dateOfBirth?.day && errors.dateOfBirth?.day}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      name="dateOfBirth.month"
                      as={TextField}
                      label="Month"
                      type="number"
                      inputProps={{ min: 1, max: 12 }}
                      fullWidth
                      error={touched.dateOfBirth?.month && Boolean(errors.dateOfBirth?.month)}
                      helperText={touched.dateOfBirth?.month && errors.dateOfBirth?.month}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Year"
                        views={['year']}
                        value={values.dateOfBirth.year ? parse(values.dateOfBirth.year, 'yyyy', new Date()) : null}
                        onChange={(newValue) => {
                          if (newValue) {
                            setFieldValue('dateOfBirth.year', format(newValue, 'yyyy'));
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: touched.dateOfBirth?.year && Boolean(errors.dateOfBirth?.year),
                            helperText: touched.dateOfBirth?.year && errors.dateOfBirth?.year,
                          },
                        }}
                        minDate={new Date(1900, 0, 1)}
                        maxDate={new Date()}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="hkid"
                  as={TextField}
                  label="香港身份證 HKID"
                  fullWidth
                  error={touched.hkid && Boolean(errors.hkid)}
                  helperText={touched.hkid && errors.hkid}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <input
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    id="id-card-file"
                    type="file"
                    onChange={(e) => handleIdCardFileChange(e, setFieldValue)}
                  />
                  <label htmlFor="id-card-file">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{ 
                        borderColor: idCardFileError ? 'error.main' : '#5D6D9B',
                        color: '#5D6D9B',
                        '&:hover': {
                          borderColor: '#5D6D9B',
                          backgroundColor: 'rgba(93, 109, 155, 0.04)',
                        },
                      }}
                    >
                      上傳香港身份證 Upload HKID Card
                    </Button>
                  </label>
                  {selectedIdCardFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Selected file: {selectedIdCardFile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveIdCardFile(setFieldValue)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                  {idCardFileError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {idCardFileError}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    color: '#000000',
                    position: 'sticky',
                    top: { xs: '60px', sm: '80px' },
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    padding: { xs: '8px 0', sm: '16px 0' },
                    marginBottom: { xs: '8px', sm: '16px' },
                  }}
                >
                  住址 Address
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12}>
                    <Field
                      name="address.street"
                      as={TextField}
                      label="詳細地址 1 Address Line 1"
                      fullWidth
                      error={touched.address?.street && Boolean(errors.address?.street)}
                      helperText={touched.address?.street && errors.address?.street}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="address.addressLine2"
                      as={TextField}
                      label="詳細地址 2 Address Line 2"
                      fullWidth
                      error={touched.address?.addressLine2 && Boolean(errors.address?.addressLine2)}
                      helperText={touched.address?.addressLine2 && errors.address?.addressLine2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="address.district"
                      as={TextField}
                      select
                      label="地區 District"
                      fullWidth
                      error={touched.address?.district && Boolean(errors.address?.district)}
                      helperText={touched.address?.district && errors.address?.district}
                    >
                      {hongKongDistricts.map((district) => (
                        <MenuItem key={district.name} value={district.name}>
                          {district.nameCn} {district.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    color: '#000000',
                    position: 'sticky',
                    top: { xs: '60px', sm: '80px' },
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    padding: { xs: '8px 0', sm: '16px 0' },
                    marginBottom: { xs: '8px', sm: '16px' },
                  }}
                >
                  銀行轉帳資料 Bank Account for Fund Transfer
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      select
                      label="銀行名稱 Bank"
                      name="bankAccount.bank"
                      error={touched.bankAccount?.bank && !!errors.bankAccount?.bank}
                      helperText={touched.bankAccount?.bank && errors.bankAccount?.bank}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBankChange(e, setFieldValue)}
                    >
                      {hongKongBanks.map((bank) => (
                        <MenuItem key={bank.code} value={bank.name}>
                          {bank.nameCn} {bank.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="bankAccount.bankCode"
                      as={TextField}
                      label="銀行代碼 Bank Code"
                      fullWidth
                      disabled
                      error={touched.bankAccount?.bankCode && Boolean(errors.bankAccount?.bankCode)}
                      helperText={touched.bankAccount?.bankCode && errors.bankAccount?.bankCode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="bankAccount.accountNumber"
                      as={TextField}
                      label="銀行帳戶號碼 Bank Account Number"
                      fullWidth
                      error={touched.bankAccount?.accountNumber && Boolean(errors.bankAccount?.accountNumber)}
                      helperText={touched.bankAccount?.accountNumber && errors.bankAccount?.accountNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="bankAccount.cardHolderName"
                      as={TextField}
                      label="持卡人姓名 Bank Card Holder Name (EN)"
                      fullWidth
                      error={touched.bankAccount?.cardHolderName && Boolean(errors.bankAccount?.cardHolderName)}
                      helperText={touched.bankAccount?.cardHolderName && errors.bankAccount?.cardHolderName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <input
                        accept="image/*,.pdf"
                        style={{ display: 'none' }}
                        id="bank-account-file"
                        type="file"
                        onChange={(e) => handleBankFileChange(e, setFieldValue)}
                      />
                      <label htmlFor="bank-account-file">
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth
                          sx={{ 
                            borderColor: bankFileError ? 'error.main' : '#5D6D9B',
                            color: '#5D6D9B',
                            '&:hover': {
                              borderColor: '#5D6D9B',
                              backgroundColor: 'rgba(93, 109, 155, 0.04)',
                            },
                          }}
                        >
                          上傳銀行卡副本 Upload Bank Card Copy
                        </Button>
                      </label>
                      {selectedBankFile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            Selected file: {selectedBankFile.name}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveBankFile(setFieldValue)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                      {bankFileError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                          {bankFileError}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    color: '#000000',
                    position: 'sticky',
                    top: { xs: '60px', sm: '80px' },
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    padding: { xs: '8px 0', sm: '16px 0' },
                    marginBottom: { xs: '8px', sm: '16px' },
                  }}
                >
                  專業認證/資格 Professional Certification / Qualification
                </Typography>
                <FieldArray name="professionalCertifications">
                  {({ push, remove }) => (
                    <div>
                      {values.professionalCertifications.map((_, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            mb: { xs: 2, sm: 3 }, 
                            p: { xs: 1, sm: 2 }, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 1,
                            '@supports (padding: max(0px))': {
                              padding: {
                                xs: `max(8px, env(safe-area-inset-left)) max(8px, env(safe-area-inset-right))`,
                                sm: '16px',
                              },
                            },
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Field
                                name={`professionalCertifications.${index}.name`}
                                as={TextField}
                                label="認證名稱 Name of certification"
                                fullWidth
                                error={touched.professionalCertifications?.[index]?.name && Boolean((errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name)}
                                helperText={touched.professionalCertifications?.[index]?.name && (errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box>
                                <input
                                  accept="image/*,.pdf"
                                  style={{ display: 'none' }}
                                  id={`certification-file-${index}`}
                                  type="file"
                                  onChange={(e) => handleFileChange(e, index, setFieldValue)}
                                />
                                <label htmlFor={`certification-file-${index}`}>
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    sx={{ 
                                      borderColor: fileErrors[index] ? 'error.main' : '#5D6D9B',
                                      color: '#5D6D9B',
                                      '&:hover': {
                                        borderColor: '#5D6D9B',
                                        backgroundColor: 'rgba(93, 109, 155, 0.04)',
                                      },
                                    }}
                                  >
                                    上傳專業認證/資格 Upload Professional Certification / Qualification
                                  </Button>
                                </label>
                                {selectedFiles[index] && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                      Selected file: {selectedFiles[index]?.name}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleRemoveFile(index, setFieldValue)}
                                      sx={{ ml: 1 }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                )}
                                {fileErrors[index] && (
                                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {fileErrors[index]}
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  label="認證有效期 Certification Expiry Date"
                                  value={values.professionalCertifications[index].expiryDate ? parse(values.professionalCertifications[index].expiryDate, 'dd/MM/yyyy', new Date()) : null}
                                  onChange={(newValue) => {
                                    if (newValue) {
                                      setFieldValue(`professionalCertifications.${index}.expiryDate`, format(newValue, 'dd/MM/yyyy'));
                                    }
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      error: touched.professionalCertifications?.[index]?.expiryDate && Boolean((errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.expiryDate),
                                      helperText: touched.professionalCertifications?.[index]?.expiryDate && (errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.expiryDate,
                                    },
                                  }}
                                  minDate={new Date()}
                                />
                              </LocalizationProvider>
                            </Grid>
                            {index > 0 && (
                              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => remove(index)}
                                  startIcon={<DeleteIcon />}
                                >
                                  Remove Certification
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => push({ name: '', fileUrl: '', expiryDate: '', uploadDate: new Date() })}
                        sx={{ mt: 2 }}
                        startIcon={<AddIcon />}
                      >
                        Add Another Certification
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    mt: { xs: 2, sm: 4 }, 
                    display: 'flex', 
                    justifyContent: 'center',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    padding: { xs: '16px 0', sm: '24px 0' },
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    '@supports (padding: max(0px))': {
                      padding: {
                        xs: `max(16px, env(safe-area-inset-bottom)) 0`,
                        sm: '24px 0',
                      },
                    },
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    fullWidth={isMobile}
                  >
                    {isSubmitting ? 'Submitting...' : submitButtonText}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default SupplierForm; 