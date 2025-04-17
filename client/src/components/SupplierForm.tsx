import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik, FormikHelpers, Field, FieldArray, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { format, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import { createSupplier, uploadFile } from '../services/api';
import { SupplierFormData, ProfessionalCertification } from '../types/supplier';
import { hongKongBanks, hongKongDistricts, supplierTypes, genderOptions } from '../data/formData';
import { Visibility, VisibilityOff, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

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
  idCardFile: Yup.mixed().required('請上傳身份證文件 Please upload ID card document'),
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
      fileUrl: Yup.mixed().required('請上傳專業認證文件 Please upload professional certification document'),
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
    fileUrl: Yup.mixed().required('請上傳銀行帳戶文件 Please upload bank account document'),
  }).required('請填寫銀行帳戶資料 Please fill in bank account information'),
});

interface SupplierFormProps {
  initialValues?: Omit<SupplierFormData, '_id'>;
  onSubmit?: (values: Omit<SupplierFormData, '_id'>) => Promise<void>;
  submitButtonText?: string;
}

const defaultFormValues: SupplierFormData = {
  supplierType: 'RN',
  contactPerson: {
    nameCn: '',
    nameEn: '',
    email: '',
    phone: '',
  },
  gender: 'M',
  dateOfBirth: {
    day: '',
    month: '',
    year: '',
  },
  hkid: '',
  idCardFile: '',
  address: {
    street: '',
    district: '',
  },
  bankAccount: {
    bank: '',
    bankCode: '',
    accountNumber: '',
    cardHolderName: '',
    fileUrl: '',
  },
  professionalCertifications: [{
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    uploadDate: format(new Date(), 'yyyy-MM-dd'),
    fileUrl: '',
  }],
  status: 'Pending',
};

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialValues = defaultFormValues,
  onSubmit,
  submitButtonText = '提交申請 Submit Application',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedBankFile, setSelectedBankFile] = useState<File | null>(null);
  const [bankFileError, setBankFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isScrolled, setIsScrolled] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [fileErrors, setFileErrors] = useState<Record<string, string | undefined>>({});

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

  const handleIdCardFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: '只接受 JPG、PNG 或 PDF 檔案 Only JPG, PNG or PDF files are accepted',
        severity: 'error'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: '檔案大小不能超過 5MB File size cannot exceed 5MB',
        severity: 'error'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData);
      setFieldValue('idCardFile', response.url);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '上傳檔案時發生錯誤 Error uploading file',
        severity: 'error'
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileErrors((prev) => ({ ...prev, [field]: 'Only JPEG, PNG, and PDF files are allowed' }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFileErrors((prev) => ({ ...prev, [field]: 'File size must be less than 5MB' }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData);
      formik.setFieldValue(field, response.url);
      setFileErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      setFileErrors((prev) => ({ ...prev, [field]: 'Failed to upload file' }));
    }
  };

  const handleBankFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileChange(event, 'bankStatementUrl');
  };

  const handleSubmit = async (
    values: Omit<SupplierFormData, '_id'>,
    { setSubmitting }: FormikHelpers<Omit<SupplierFormData, '_id'>>
  ): Promise<void> => {
    try {
      const formData = new FormData();

      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Append files
      if (selectedBankFile) {
        formData.append('bankFile', selectedBankFile);
      }

      const response = await createSupplier(formData);

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
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '提交申請時發生錯誤 Error submitting application',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<Omit<SupplierFormData, '_id'>>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleDateChange = (date: Date | null, field: string) => {
    if (date) {
      formik.setFieldValue(field, format(date, 'yyyy-MM-dd'));
    } else {
      formik.setFieldValue(field, '');
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
      <form onSubmit={formik.handleSubmit}>
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
              error={formik.touched.supplierType && Boolean(formik.errors.supplierType)}
              helperText={formik.touched.supplierType && formik.errors.supplierType}
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
                  error={formik.touched.contactPerson?.nameCn && Boolean(formik.errors.contactPerson?.nameCn)}
                  helperText={formik.touched.contactPerson?.nameCn && formik.errors.contactPerson?.nameCn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="contactPerson.nameEn"
                  as={TextField}
                  label="Full Name (ENG)"
                  fullWidth
                  error={formik.touched.contactPerson?.nameEn && Boolean(formik.errors.contactPerson?.nameEn)}
                  helperText={formik.touched.contactPerson?.nameEn && formik.errors.contactPerson?.nameEn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="contactPerson.email"
                  as={TextField}
                  label="電郵 Email"
                  fullWidth
                  error={formik.touched.contactPerson?.email && Boolean(formik.errors.contactPerson?.email)}
                  helperText={formik.touched.contactPerson?.email && formik.errors.contactPerson?.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="contactPerson.phone"
                  as={TextField}
                  label="聯絡電話 Phone"
                  fullWidth
                  error={formik.touched.contactPerson?.phone && Boolean(formik.errors.contactPerson?.phone)}
                  helperText={formik.touched.contactPerson?.phone && formik.errors.contactPerson?.phone}
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
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
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
                  error={formik.touched.dateOfBirth?.day && Boolean(formik.errors.dateOfBirth?.day)}
                  helperText={formik.touched.dateOfBirth?.day && formik.errors.dateOfBirth?.day}
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
                  error={formik.touched.dateOfBirth?.month && Boolean(formik.errors.dateOfBirth?.month)}
                  helperText={formik.touched.dateOfBirth?.month && formik.errors.dateOfBirth?.month}
                />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Year"
                    views={['year']}
                    value={formik.values.dateOfBirth.year ? parse(formik.values.dateOfBirth.year, 'yyyy', new Date()) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        formik.setFieldValue('dateOfBirth.year', format(newValue, 'yyyy'));
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dateOfBirth?.year && Boolean(formik.errors.dateOfBirth?.year),
                        helperText: formik.touched.dateOfBirth?.year && formik.errors.dateOfBirth?.year,
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
              error={formik.touched.hkid && Boolean(formik.errors.hkid)}
              helperText={formik.touched.hkid && formik.errors.hkid}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <input
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="id-card-file"
                type="file"
                onChange={(e) => handleIdCardFileChange(e, formik.setFieldValue)}
              />
              <label htmlFor="id-card-file">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ 
                    borderColor: snackbar.severity === 'error' ? 'error.main' : '#5D6D9B',
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
              {formik.values.idCardFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Selected file: {formik.values.idCardFile.split('/').pop()}
                  </Typography>
                </Box>
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
                  error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
                  helperText={formik.touched.address?.street && formik.errors.address?.street}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="address.addressLine2"
                  as={TextField}
                  label="詳細地址 2 Address Line 2"
                  fullWidth
                  error={formik.touched.address?.addressLine2 && Boolean(formik.errors.address?.addressLine2)}
                  helperText={formik.touched.address?.addressLine2 && formik.errors.address?.addressLine2}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="address.district"
                  as={TextField}
                  select
                  label="地區 District"
                  fullWidth
                  error={formik.touched.address?.district && Boolean(formik.errors.address?.district)}
                  helperText={formik.touched.address?.district && formik.errors.address?.district}
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
                  error={formik.touched.bankAccount?.bank && !!formik.errors.bankAccount?.bank}
                  helperText={formik.touched.bankAccount?.bank && formik.errors.bankAccount?.bank}
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
                  error={formik.touched.bankAccount?.bankCode && Boolean(formik.errors.bankAccount?.bankCode)}
                  helperText={formik.touched.bankAccount?.bankCode && formik.errors.bankAccount?.bankCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="bankAccount.accountNumber"
                  as={TextField}
                  label="銀行帳戶號碼 Bank Account Number"
                  fullWidth
                  error={formik.touched.bankAccount?.accountNumber && Boolean(formik.errors.bankAccount?.accountNumber)}
                  helperText={formik.touched.bankAccount?.accountNumber && formik.errors.bankAccount?.accountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="bankAccount.cardHolderName"
                  as={TextField}
                  label="持卡人姓名 Bank Card Holder Name (EN)"
                  fullWidth
                  error={formik.touched.bankAccount?.cardHolderName && Boolean(formik.errors.bankAccount?.cardHolderName)}
                  helperText={formik.touched.bankAccount?.cardHolderName && formik.errors.bankAccount?.cardHolderName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <input
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    id="bank-account-file"
                    type="file"
                    onChange={(e) => handleBankFileChange(e)}
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
                    </Box>
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
                  {formik.values.professionalCertifications.map((_, index) => (
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
                            error={formik.touched.professionalCertifications?.[index]?.name && Boolean((formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name)}
                            helperText={formik.touched.professionalCertifications?.[index]?.name && (formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <input
                              accept="image/*,.pdf"
                              style={{ display: 'none' }}
                              id={`certification-file-${index}`}
                              type="file"
                              onChange={(e) => handleFileChange(e, `professionalCertifications.${index}.fileUrl`)}
                            />
                            <label htmlFor={`certification-file-${index}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{ 
                                  borderColor: fileErrors[`professionalCertifications.${index}.fileUrl`] ? 'error.main' : '#5D6D9B',
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
                            {formik.values.professionalCertifications[index].fileUrl && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                  Selected file: {formik.values.professionalCertifications[index].fileUrl.split('/').pop()}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="認證有效期 Certification Expiry Date"
                              value={formik.values.professionalCertifications[index].expiryDate ? parse(formik.values.professionalCertifications[index].expiryDate, 'dd/MM/yyyy', new Date()) : null}
                              onChange={(newValue) => {
                                if (newValue) {
                                  formik.setFieldValue(`professionalCertifications.${index}.expiryDate`, format(newValue, 'dd/MM/yyyy'));
                                }
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: formik.touched.professionalCertifications?.[index]?.expiryDate && Boolean((formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.expiryDate),
                                  helperText: formik.touched.professionalCertifications?.[index]?.expiryDate && (formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.expiryDate,
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
                disabled={formik.isSubmitting}
                fullWidth={isMobile}
              >
                {formik.isSubmitting ? 'Submitting...' : submitButtonText}
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
      </form>
    </Paper>
  );
};

export default SupplierForm; 