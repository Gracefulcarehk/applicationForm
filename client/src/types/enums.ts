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

// Form data that uses the enums
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