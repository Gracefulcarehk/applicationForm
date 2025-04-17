export type SupplierType = 'RN' | 'EN' | 'PCW' | 'HCA';
export type Gender = 'M' | 'F';

export interface ContactPerson {
  nameCn: string;
  nameEn: string;
  email: string;
  phone: string;
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
  fileUrl?: string;
}

export interface Document {
  type: 'Business License' | 'Tax Certificate' | 'Insurance' | 'Other';
  fileUrl: string;
  uploadDate: Date;
}

export interface ProfessionalCertification {
  name: string;
  expiryDate: string;
  fileUrl?: string;
}

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface SupplierFormData {
  _id?: string;
  supplierType: SupplierType;
  contactPerson: ContactPerson;
  gender: Gender;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  hkid: string;
  idCardFile?: string;
  address: Address;
  bankAccount: BankAccount;
  professionalCertifications: ProfessionalCertification[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Supplier extends SupplierFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
} 