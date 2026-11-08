import mongoose, { Document, Schema } from 'mongoose';

export const SUPPLIER_TYPES = ['RN', 'EN', 'PCW', 'HCA', 'PT', 'OT'] as const;
// Shown in notification emails next to the code
export const SUPPLIER_TYPE_LABELS: Record<(typeof SUPPLIER_TYPES)[number], string> = {
  RN: '註冊護士',
  EN: '登記護士',
  PCW: '起居照顧員',
  HCA: '健康服務助理',
  PT: '物理治療師',
  OT: '職業治療師',
};
export const GENDERS = ['M', 'F'] as const;

export interface IProfessionalCertification {
  name: string;
  // Object key in the private R2 bucket
  fileKey: string;
  expiryDate: string;
  uploadDate: Date;
}

export interface IBankAccount {
  bank: string;
  bankCode: string;
  accountNumber: string;
  cardHolderName: string;
  fileKey: string;
}

export interface IAddress {
  street: string;
  addressLine2: string;
  district: string;
}

export interface IContactPerson {
  nameEn: string;
  nameCn: string;
  email: string;
  phone: string;
}

export interface IDateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface SupplierData {
  supplierType: (typeof SUPPLIER_TYPES)[number];
  contactPerson: IContactPerson;
  gender: (typeof GENDERS)[number];
  address: IAddress;
  hkid: string;
  idCardFileKey: string;
  dateOfBirth: IDateOfBirth;
  professionalCertifications: IProfessionalCertification[];
  bankAccount: IBankAccount;
}

export interface ISupplier extends SupplierData, Document {
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    supplierType: {
      type: String,
      required: [true, '請選擇供應商類型 Please select supplier type'],
      enum: SUPPLIER_TYPES,
    },
    contactPerson: {
      nameEn: {
        type: String,
        required: [true, '請輸入英文姓名 Please enter name in English'],
      },
      nameCn: {
        type: String,
        required: [true, '請輸入中文姓名 Please enter name in Chinese'],
      },
      email: {
        type: String,
        required: [true, '請輸入電郵地址 Please enter email address'],
        unique: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, '請輸入聯絡電話 Please enter phone number'],
      },
    },
    gender: {
      type: String,
      required: [true, '請選擇性別 Please select gender'],
      enum: GENDERS,
    },
    address: {
      street: String,
      addressLine2: String,
      district: {
        type: String,
        required: [true, '請選擇地區 Please select district'],
      },
    },
    hkid: {
      type: String,
      required: [true, '請輸入香港身份證號碼 Please enter HKID number'],
      unique: true,
    },
    idCardFileKey: {
      type: String,
      required: [true, '請上傳身份證文件 Please upload ID card document'],
    },
    dateOfBirth: {
      day: {
        type: String,
        required: [true, '請輸入日期 Please enter day'],
      },
      month: {
        type: String,
        required: [true, '請輸入月份 Please enter month'],
      },
      year: {
        type: String,
        required: [true, '請輸入年份 Please enter year'],
      },
    },
    professionalCertifications: [
      {
        name: {
          type: String,
          required: [true, '請輸入認證名稱 Please enter certification name'],
        },
        fileKey: {
          type: String,
          required: [true, '請上傳專業認證文件 Please upload professional certification document'],
        },
        expiryDate: {
          type: String,
          required: [true, '請輸入認證到期日 Please enter certification expiry date'],
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bankAccount: {
      bank: {
        type: String,
        required: [true, '請選擇銀行 Please select bank'],
      },
      bankCode: {
        type: String,
        required: [true, '請輸入銀行代碼 Please enter bank code'],
      },
      accountNumber: {
        type: String,
        required: [true, '請輸入銀行帳戶號碼 Please enter bank account number'],
      },
      cardHolderName: {
        type: String,
        required: [true, '請輸入持卡人姓名 Please enter card holder name'],
      },
      fileKey: {
        type: String,
        required: [true, '請上傳銀行帳戶文件 Please upload bank account document'],
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema, 'applications');
