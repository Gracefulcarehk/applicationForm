// Supplier Type Constants
export const SUPPLIER_TYPE_RN = 'RN';
export const SUPPLIER_TYPE_EN = 'EN';
export const SUPPLIER_TYPE_PCW = 'PCW';
export const SUPPLIER_TYPE_HCA = 'HCA';

// Gender Constants
export const GENDER_M = 'M';
export const GENDER_F = 'F';

// Form data that uses the constants
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

// Type definitions for TypeScript
export type SupplierType = typeof SUPPLIER_TYPE_RN | typeof SUPPLIER_TYPE_EN | typeof SUPPLIER_TYPE_PCW | typeof SUPPLIER_TYPE_HCA;
export type Gender = typeof GENDER_M | typeof GENDER_F; 