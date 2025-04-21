import { SUPPLIER_TYPE_RN, SUPPLIER_TYPE_EN, SUPPLIER_TYPE_PCW, SUPPLIER_TYPE_HCA, GENDER_M, GENDER_F } from './enums';

export interface ContactPerson {
  nameEn: string;
  nameCn: string;
  email: string;
  phone: string;
}

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface Address {
  street: string;
  addressLine2?: string;
  district: string;
}

export interface BankAccount {
  bank: string;
  bankCode: string;
  accountNumber: string;
  cardHolderName: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  file?: File;
}

export interface Document {
  type: string;
  fileUrl: string;
  uploadDate: string;
}

export interface Supplier {
  _id?: string;
  supplierType: typeof SUPPLIER_TYPE_RN | typeof SUPPLIER_TYPE_EN | typeof SUPPLIER_TYPE_PCW | typeof SUPPLIER_TYPE_HCA;
  contactPerson: ContactPerson;
  gender: typeof GENDER_M | typeof GENDER_F;
  dateOfBirth: DateOfBirth;
  hkid: string;
  address: Address;
  bankAccount: BankAccount;
  status: string;
  idCardFile?: File;
  bankFile?: File;
  certifications: Certification[];
  documents?: Document[];
}

export type SupplierFormData = Omit<Supplier, '_id'>; 