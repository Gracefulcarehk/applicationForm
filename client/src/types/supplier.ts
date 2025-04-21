import { SupplierType, Gender } from './enums';

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

export interface Supplier {
  _id?: string;
  supplierType: SupplierType;
  contactPerson: ContactPerson;
  gender: Gender;
  dateOfBirth: DateOfBirth;
  hkid: string;
  address: Address;
  bankAccount: BankAccount;
  status: string;
  idCardFile?: File;
  bankFile?: File;
  certifications: Certification[];
}

export type SupplierFormData = Omit<Supplier, '_id'>; 