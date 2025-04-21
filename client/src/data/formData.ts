import { SupplierType, Gender } from '../types/enums';

export const supplierTypeOptions = [
  { value: SupplierType.RN, label: 'Registered Nurse' },
  { value: SupplierType.EN, label: 'Enrolled Nurse' },
  { value: SupplierType.PCW, label: 'Personal Care Worker' },
  { value: SupplierType.HCA, label: 'Health Care Assistant' }
];

export const genderOptions = [
  { value: Gender.M, label: 'Male' },
  { value: Gender.F, label: 'Female' }
]; 