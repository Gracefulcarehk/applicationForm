export enum SupplierType {
  RN = 'RN',
  EN = 'EN',
  PCW = 'PCW',
  HCA = 'HCA',
}

export enum Gender {
  M = 'M',
  F = 'F',
}

export const supplierTypeOptions = [
  { value: SupplierType.RN, label: 'Registered Nurse' },
  { value: SupplierType.EN, label: 'Enrolled Nurse' },
  { value: SupplierType.PCW, label: 'Personal Care Worker' },
  { value: SupplierType.HCA, label: 'Health Care Assistant' },
];

export const genderOptions = [
  { value: Gender.M, label: 'Male' },
  { value: Gender.F, label: 'Female' },
]; 