export interface Supplier {
  id: string;
  supplierType: string;
  contactPerson: string;
  gender: string;
  dateOfBirth: string;
  hkid: string;
  address: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  idCardFile?: string;
  bankFile?: string;
  uploadDate: string;
  status: string;
}

export interface SupplierFormData {
  supplierType: string;
  contactPerson: string;
  gender: string;
  dateOfBirth: string;
  hkid: string;
  address: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  idCardFile?: File;
  bankFile?: File;
} 