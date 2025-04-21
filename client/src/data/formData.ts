import { SupplierType, Gender } from '../types/enums';

export const supplierTypeOptions = [
  { value: SupplierType.RN, label: 'Registered Nurse (RN)' },
  { value: SupplierType.EN, label: 'Enrolled Nurse (EN)' },
  { value: SupplierType.PCW, label: 'Personal Care Worker (PCW)' },
  { value: SupplierType.HCA, label: 'Health Care Assistant (HCA)' }
];

export const genderOptions = [
  { value: Gender.M, label: 'Male' },
  { value: Gender.F, label: 'Female' }
]; 