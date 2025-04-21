import { SupplierType, Gender } from './enums';

export const supplierTypeOptions = [
  { value: SupplierType.RN, label: 'Registered Nurse (註冊護士)' },
  { value: SupplierType.EN, label: 'Enrolled Nurse (登記護士)' },
  { value: SupplierType.PCW, label: 'Personal Care Worker (個人護理員)' },
  { value: SupplierType.HCA, label: 'Health Care Assistant (保健員)' }
];

export const genderOptions = [
  { value: Gender.M, label: 'Male (男)' },
  { value: Gender.F, label: 'Female (女)' }
]; 