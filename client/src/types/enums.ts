export enum SupplierType {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  RN = 'RN',
  EN = 'EN',
  PCW = 'PCW',
  HCA = 'HCA'
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export enum Gender {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  M = 'M',
  F = 'F'
  /* eslint-enable @typescript-eslint/no-unused-vars */
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