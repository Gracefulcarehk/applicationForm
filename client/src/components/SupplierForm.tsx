import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik, FormikHelpers, Field, FieldArray, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { format, parse } from 'date-fns';
import { createSupplier } from '../services/api';
import { SupplierFormData, ProfessionalCertification } from '../types/supplier';
import { hongKongBanks, hongKongDistricts, supplierTypes, genderOptions } from '../data/formData';
import { Add as AddIcon } from '@mui/icons-material';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedIdCardFile, setSelectedIdCardFile] = useState<File | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setSubmitError(`只接受 JPEG、PNG 或 PDF 檔案 Only JPEG, PNG or PDF files are accepted`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('檔案大小必須小於 5MB File size must be less than 5MB');
      return;
    }

    if (field === 'idCardFile') {
      setSelectedIdCardFile(file);
      formik.setFieldValue('idCardFile', file);
    } else {
      setSelectedFiles([file]);
      formik.setFieldValue(field, file);
    }
    setSubmitError(null);
  };

  const handleSubmit = async (values: SupplierFormData, { setSubmitting }: FormikHelpers<SupplierFormData>) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (selectedFiles.length > 0) {
        formData.append('bankFile', selectedFiles[0]);
      }
      if (selectedIdCardFile) {
        formData.append('idCardFile', selectedIdCardFile);
      }

      if (onSubmit) {
        await onSubmit(values);
      } else {
        await createSupplier(formData);
      }

      setSubmitSuccess(true);
      setSubmitError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('提交申請時發生錯誤 Error submitting application');
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F5F5F5',
        pt: { xs: 2, sm: 4 },
        pb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
          bgcolor: 'white',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: '#5D6D9B',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          供應商申請表 Supplier Application Form
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
                  onChange={(e) => handleFileChange(e, 'idCardFile')}
                />
                <label htmlFor="id-card-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{ 
                      borderColor: submitError ? 'error.main' : '#5D6D9B',
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
                      onChange={(e) => handleFileChange(e, 'bankAccount.fileUrl')}
                    />
                    <label htmlFor="bank-account-file">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        sx={{ 
                          borderColor: submitError ? 'error.main' : '#5D6D9B',
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
                    {selectedFiles.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Selected file: {selectedFiles[0].name}
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
                    {formik.values.professionalCertifications.map((cert, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name={`professionalCertifications.${index}.name`}
                              label="證書名稱 Certificate Name"
                              fullWidth
                              error={formik.touched.professionalCertifications?.[index]?.name && 
                                    Boolean((formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name)}
                              helperText={formik.touched.professionalCertifications?.[index]?.name && 
                                         (formik.errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <input
                              type="file"
                              id={`cert-file-${index}`}
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, `professionalCertifications.${index}.file`)}
                            />
                            <label htmlFor={`cert-file-${index}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{ 
                                  borderColor: submitError ? 'error.main' : '#5D6D9B',
                                  color: '#5D6D9B',
                                  '&:hover': {
                                    borderColor: '#5D6D9B',
                                  },
                                }}
                              >
                                上傳證書 Upload Certificate
                              </Button>
                            </label>
                            {submitError && (
                              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {submitError}
                              </Typography>
                            )}
                          </Grid>
                        </Box>
                      </Grid>
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
                  fullWidth={isMobile}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
          {submitSuccess && (
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={() => {}}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={() => {}}
                severity="success"
                sx={{ width: '100%' }}
              >
                申請已成功提交 Application submitted successfully
              </Alert>
            </Snackbar>
          )}
          {submitError && (
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={() => {}}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={() => {}}
                severity="error"
                sx={{ width: '100%' }}
              >
                {submitError}
              </Alert>
            </Snackbar>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default SupplierForm; 