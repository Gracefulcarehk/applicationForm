import React, { useState } from 'react';
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (onSubmit) {
            await onSubmit(values);
          }
          setSubmitting(false);
        } catch (error) {
          setSubmitting(false);
          setSnackbar({
            open: true,
            message: '提交申請時發生錯誤 Error submitting application',
            severity: 'error',
          });
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
              基本資料 Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="supplierType"
                  label="供應商類型 Supplier Type"
                  select
                  fullWidth
                  variant="outlined"
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
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="gender"
                  label="性別 Gender"
                  select
                  fullWidth
                  variant="outlined"
                  error={touched.gender && Boolean(errors.gender)}
                  helperText={touched.gender && errors.gender}
                >
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender === 'M' ? '男 Male' : '女 Female'}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="contactPerson.nameEn"
                  label="英文姓名 Name in English"
                  fullWidth
                  variant="outlined"
                  error={touched.contactPerson?.nameEn && Boolean(errors.contactPerson?.nameEn)}
                  helperText={touched.contactPerson?.nameEn && errors.contactPerson?.nameEn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="contactPerson.nameCn"
                  label="中文姓名 Name in Chinese"
                  fullWidth
                  variant="outlined"
                  error={touched.contactPerson?.nameCn && Boolean(errors.contactPerson?.nameCn)}
                  helperText={touched.contactPerson?.nameCn && errors.contactPerson?.nameCn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="contactPerson.email"
                  label="電郵地址 Email Address"
                  fullWidth
                  variant="outlined"
                  error={touched.contactPerson?.email && Boolean(errors.contactPerson?.email)}
                  helperText={touched.contactPerson?.email && errors.contactPerson?.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="contactPerson.phone"
                  label="聯絡電話 Phone Number"
                  fullWidth
                  variant="outlined"
                  error={touched.contactPerson?.phone && Boolean(errors.contactPerson?.phone)}
                  helperText={touched.contactPerson?.phone && errors.contactPerson?.phone}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
              地址資料 Address Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.street"
                  label="街道地址 Street Address"
                  fullWidth
                  variant="outlined"
                  error={touched.address?.street && Boolean(errors.address?.street)}
                  helperText={touched.address?.street && errors.address?.street}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.addressLine2"
                  label="地址第二行 Address Line 2"
                  fullWidth
                  variant="outlined"
                  error={touched.address?.addressLine2 && Boolean(errors.address?.addressLine2)}
                  helperText={touched.address?.addressLine2 && errors.address?.addressLine2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="address.district"
                  label="地區 District"
                  select
                  fullWidth
                  variant="outlined"
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
          </Paper>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
              身份證明文件 Identity Document
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="hkid"
                  label="香港身份證號碼 HKID Number"
                  fullWidth
                  variant="outlined"
                  error={touched.hkid && Boolean(errors.hkid)}
                  helperText={touched.hkid && errors.hkid}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleIdCardFileChange(e, setFieldValue)}
                    style={{ display: 'none' }}
                    id="id-card-file-input"
                  />
                  <label htmlFor="id-card-file-input">
                    <Button
                      variant="contained"
                      component="span"
                      size={isMobile ? "small" : "medium"}
                    >
                      上傳身份證 Upload ID Card
                    </Button>
                  </label>
                  {selectedIdCardFile && (
                    <Typography variant="body2">
                      {selectedIdCardFile.name}
                    </Typography>
                  )}
                  {idCardFileError && (
                    <Typography color="error" variant="body2">
                      {idCardFileError}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
              專業認證 Professional Certifications
            </Typography>
            <FieldArray name="professionalCertifications">
              {({ push, remove }) => (
                <>
                  {values.professionalCertifications.map((_, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            name={`professionalCertifications.${index}.name`}
                            label="認證名稱 Certification Name"
                            fullWidth
                            variant="outlined"
                            error={touched.professionalCertifications?.[index]?.name && Boolean((errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name)}
                            helperText={touched.professionalCertifications?.[index]?.name && (errors.professionalCertifications?.[index] as FormikErrors<ProfessionalCertification>)?.name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, index, setFieldValue)}
                              style={{ display: 'none' }}
                              id={`cert-file-input-${index}`}
                            />
                            <label htmlFor={`cert-file-input-${index}`}>
                              <Button
                                variant="contained"
                                component="span"
                                size={isMobile ? "small" : "medium"}
                              >
                                上傳認證 Upload Certification
                              </Button>
                            </label>
                            {selectedFiles[index] && (
                              <Typography variant="body2">
                                {selectedFiles[index]?.name}
                              </Typography>
                            )}
                            {fileErrors[index] && (
                              <Typography color="error" variant="body2">
                                {fileErrors[index]}
                              </Typography>
                            )}
                            {index > 0 && (
                              <IconButton
                                onClick={() => remove(index)}
                                color="error"
                                size={isMobile ? "small" : "medium"}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => push({ name: '', fileUrl: '', expiryDate: '', uploadDate: new Date() })}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ mt: 2 }}
                  >
                    添加認證 Add Certification
                  </Button>
                </>
              )}
            </FieldArray>
          </Paper>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
              銀行帳戶資料 Bank Account Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="bankAccount.bank"
                  label="銀行 Bank"
                  select
                  fullWidth
                  variant="outlined"
                  error={touched.bankAccount?.bank && Boolean(errors.bankAccount?.bank)}
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
                  as={TextField}
                  name="bankAccount.bankCode"
                  label="銀行代碼 Bank Code"
                  fullWidth
                  variant="outlined"
                  error={touched.bankAccount?.bankCode && Boolean(errors.bankAccount?.bankCode)}
                  helperText={touched.bankAccount?.bankCode && errors.bankAccount?.bankCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="bankAccount.accountNumber"
                  label="銀行帳戶號碼 Bank Account Number"
                  fullWidth
                  variant="outlined"
                  error={touched.bankAccount?.accountNumber && Boolean(errors.bankAccount?.accountNumber)}
                  helperText={touched.bankAccount?.accountNumber && errors.bankAccount?.accountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="bankAccount.cardHolderName"
                  label="持卡人姓名 Card Holder Name"
                  fullWidth
                  variant="outlined"
                  error={touched.bankAccount?.cardHolderName && Boolean(errors.bankAccount?.cardHolderName)}
                  helperText={touched.bankAccount?.cardHolderName && errors.bankAccount?.cardHolderName}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleBankFileChange(e, setFieldValue)}
                    style={{ display: 'none' }}
                    id="bank-file-input"
                  />
                  <label htmlFor="bank-file-input">
                    <Button
                      variant="contained"
                      component="span"
                      size={isMobile ? "small" : "medium"}
                    >
                      上傳銀行文件 Upload Bank Document
                    </Button>
                  </label>
                  {selectedBankFile && (
                    <Typography variant="body2">
                      {selectedBankFile.name}
                    </Typography>
                  )}
                  {bankFileError && (
                    <Typography color="error" variant="body2">
                      {bankFileError}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              disabled={isSubmitting}
              sx={{
                minWidth: isMobile ? '200px' : '300px',
                fontSize: isMobile ? '1rem' : '1.1rem',
                padding: isMobile ? '8px 16px' : '12px 24px',
              }}
            >
              {submitButtonText}
            </Button>
          </Box>

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
  );
};

export default SupplierForm; 