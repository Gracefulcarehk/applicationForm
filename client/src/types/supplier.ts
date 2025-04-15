export interface ContactPerson {
  nameEn: string;
  nameCn: string;
  email: string;
  phone: string;
}

export interface Address {
  street: string;
  addressLine2: string;
  district: string;
}

export interface BankAccount {
  bank: string;
  bankCode: string;
  accountNumber: string;
  cardHolderName: string;
  fileUrl: string;
}

export interface Document {
  type: 'Business License' | 'Tax Certificate' | 'Insurance' | 'Other';
  fileUrl: string;
  uploadDate: Date;
}

export interface ProfessionalCertification {
  name: string;
  fileUrl: string;
  expiryDate: string; // Format: DD/MM/YYYY
  uploadDate: Date;
}

export type SupplierType = 'RN' | 'EN' | 'PCW' | 'HCA';
export type Gender = 'M' | 'F';

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface Supplier {
  _id?: string;
  supplierType: SupplierType;
  contactPerson: ContactPerson;
  gender: Gender;
  address: Address;
  hkid: string;
  idCardFileUrl: string;
  dateOfBirth: DateOfBirth;
  documents: Document[];
  professionalCertifications: ProfessionalCertification[];
  bankAccount: BankAccount;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: Date;
  updatedAt?: Date;
} 