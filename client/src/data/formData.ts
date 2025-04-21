import { SUPPLIER_TYPE_RN, SUPPLIER_TYPE_EN, SUPPLIER_TYPE_PCW, SUPPLIER_TYPE_HCA, GENDER_M, GENDER_F } from '../types/enums';

export const supplierTypeOptions = [
  { value: SUPPLIER_TYPE_RN, label: 'Registered Nurse (註冊護士)' },
  { value: SUPPLIER_TYPE_EN, label: 'Enrolled Nurse (登記護士)' },
  { value: SUPPLIER_TYPE_PCW, label: 'Personal Care Worker (個人護理員)' },
  { value: SUPPLIER_TYPE_HCA, label: 'Health Care Assistant (保健員)' }
];

export const genderOptions = [
  { value: GENDER_M, label: 'Male (男)' },
  { value: GENDER_F, label: 'Female (女)' }
]; 