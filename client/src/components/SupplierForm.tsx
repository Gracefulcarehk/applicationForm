import React, { useState, useEffect, useCallback } from 'react';
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
  Alert
} from '@mui/material';
import { Formik, Form, Field, FieldArray, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { SupplierFormData, Certification } from '../types/supplier';
import { SUPPLIER_TYPE_RN, GENDER_M, supplierTypeOptions, genderOptions } from '../types/enums';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supplierApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import UploadProgress from './UploadProgress';
import { config } from '../config';

interface SupplierFormProps {
  initialValues?: SupplierFormData;
  onSubmit?: (values: SupplierFormData) => Promise<void>;
  submitButtonText?: string;
}

const validationSchema = Yup.object({
  supplierType: Yup.string().required('Required'),
  contactPerson: Yup.object({
    nameEn: Yup.string().required('Required'),
    nameCn: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
  }),
  gender: Yup.string().required('Required'),
  dateOfBirth: Yup.object({
    day: Yup.string().required('Required'),
    month: Yup.string().required('Required'),
    year: Yup.string().required('Required'),
  }),
  hkid: Yup.string().required('Required'),
  address: Yup.object({
    street: Yup.string().required('Required'),
    addressLine2: Yup.string(),
    district: Yup.string().required('Required'),
  }),
  bankAccount: Yup.object({
    bank: Yup.string().required('Required'),
    bankCode: Yup.string().required('Required'),
    accountNumber: Yup.string().required('Required'),
    cardHolderName: Yup.string().required('Required'),
  }),
  certifications: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Required'),
      issuingOrganization: Yup.string().required('Required'),
      issueDate: Yup.string().required('Required'),
      file: Yup.mixed(),
    })
  ),
});

const defaultFormValues: SupplierFormData = {
  supplierType: SUPPLIER_TYPE_RN,
  contactPerson: {
    nameEn: '',
    nameCn: '',
    email: '',
    phone: '',
  },
  gender: GENDER_M,
  dateOfBirth: {
    day: '',
    month: '',
    year: '',
  },
  hkid: '',
  address: {
    street: '',
    addressLine2: '',
    district: '',
  },
  bankAccount: {
    bank: '',
    bankCode: '',
    accountNumber: '',
    cardHolderName: '',
  },
  status: 'Pending',
  certifications: [],
  idCardFile: undefined,
  bankFile: undefined,
};

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
  initialValues = defaultFormValues,
  onSubmit,
  submitButtonText = 'Submit',
}) => {
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
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
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleSubmit = useCallback(async (values: SupplierFormData) => {
    try {
      setUploadProgress(0);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, format(value, 'yyyy-MM-dd'));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await supplierApi.createSupplier(formData, (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        setUploadProgress(progress);
      });

      if (response.success) {
        navigate('/thank-you');
      } else {
        setSnackbar({
          open: true,
          message: response.error || config.messages.errors.uploadFailed,
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : config.messages.errors.uploadFailed,
        severity: 'error'
      });
    }
  }, [navigate]);

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
        供應商申請表 Supplier Application Form
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          const certErrors = errors.certifications as FormikErrors<Certification>[] | undefined;
          const certTouched = touched.certifications as FormikTouched<Certification>[] | undefined;

          return (
            <Form>
              <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Supplier Type
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="supplierType"
                        label="Supplier Type"
                        select
                        fullWidth
                        error={touched.supplierType && Boolean(errors.supplierType)}
                        helperText={touched.supplierType && errors.supplierType}
                      >
                        {supplierTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  </Grid>
                </Paper>
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
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
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
                    <FieldArray name="certifications">
                      {({ push, remove }) => (
                        <Grid item xs={12}>
                          <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                              Certifications
                            </Typography>
                            {values.certifications.map((cert, index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Field
                                      as={TextField}
                                      name={`certifications.${index}.name`}
                                      label="Certification Name"
                                      fullWidth
                                      error={certTouched?.[index]?.name && Boolean(certErrors?.[index]?.name)}
                                      helperText={certTouched?.[index]?.name && certErrors?.[index]?.name}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Field
                                      as={TextField}
                                      name={`certifications.${index}.issuingOrganization`}
                                      label="Issuing Organization"
                                      fullWidth
                                      error={certTouched?.[index]?.issuingOrganization && Boolean(certErrors?.[index]?.issuingOrganization)}
                                      helperText={certTouched?.[index]?.issuingOrganization && certErrors?.[index]?.issuingOrganization}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <Field
                                        component={DatePicker}
                                        name={`certifications.${index}.issueDate`}
                                        label="Issue Date"
                                        format="yyyy-MM-dd"
                                        slotProps={{
                                          textField: {
                                            fullWidth: true,
                                            error: certTouched?.[index]?.issueDate && Boolean(certErrors?.[index]?.issueDate),
                                            helperText: certTouched?.[index]?.issueDate && certErrors?.[index]?.issueDate,
                                          },
                                        }}
                                      />
                                    </LocalizationProvider>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                      <IconButton
                                        onClick={() => remove(index)}
                                        color="error"
                                        sx={{ ml: 1 }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => push({ name: '', issuingOrganization: '', issueDate: null })}
                              variant="outlined"
                              sx={{ mt: 2 }}
                            >
                              Add Certification
                            </Button>
                          </Paper>
                        </Grid>
                      )}
                    </FieldArray>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ 
                          minWidth: 200,
                          backgroundColor: '#5D6D9B',
                          '&:hover': {
                            backgroundColor: '#4a5778',
                          },
                        }}
                      >
                        {submitButtonText}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Snackbar
                  open={snackbar.open}
                  autoHideDuration={6000}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                  >
                    {snackbar.message}
                  </Alert>
                </Snackbar>
              </Box>
            </Form>
          );
        }}
      </Formik>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <UploadProgress progress={uploadProgress} />
      )}
    </Paper>
  );
};

export default SupplierForm; 