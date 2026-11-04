import { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';
import { GENDERS, SUPPLIER_TYPES, SupplierData } from '../models/supplierModel';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_CERTIFICATIONS = 10;
const MAX_TEXT_LENGTH = 200;

export type UploadedFile = Pick<Express.Multer.File, 'fieldname' | 'originalname' | 'mimetype' | 'size' | 'buffer'>;

export interface ApplicationFiles {
  idCard: UploadedFile;
  bank: UploadedFile;
  certifications: UploadedFile[];
}

// Application data without file keys; keys are assigned once the files are stored.
export type ApplicationFields = Omit<SupplierData, 'idCardFileKey' | 'professionalCertifications' | 'bankAccount'> & {
  professionalCertifications: { name: string; expiryDate: string; uploadDate: Date }[];
  bankAccount: Omit<SupplierData['bankAccount'], 'fileKey'>;
};

export interface ParsedApplication {
  fields: ApplicationFields;
  files: ApplicationFiles;
}

export const isAllowedFileType = (mimetype: string) =>
  mimetype.startsWith('image/') || mimetype === 'application/pdf';

const fail = (message: string): never => {
  throw new AppError(message, 400);
};

const text = (value: unknown, message: string, { optional = false } = {}): string => {
  if (value === undefined || value === null || value === '') {
    return optional ? '' : fail(message);
  }
  if (typeof value !== 'string' || value.length > MAX_TEXT_LENGTH) {
    return fail(message);
  }
  const trimmed = value.trim();
  return trimmed || optional ? trimmed : fail(message);
};

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const HKID_LETTER_OFFSET = 'A'.charCodeAt(0) - 10;

// HKID such as A123456(7) or AB987654(A); normalised to uppercase without spaces or brackets.
export const normaliseHkid = (value: string): string | null => {
  const hkid = value.toUpperCase().replace(/[\s()]/g, '');
  const match = /^([A-Z]{1,2})(\d{6})([0-9A])$/.exec(hkid);
  if (!match) return null;

  const [, letters, digits, check] = match;
  const prefix = letters.length === 1 ? [36, letters.charCodeAt(0) - HKID_LETTER_OFFSET] : [...letters].map((c) => c.charCodeAt(0) - HKID_LETTER_OFFSET);
  const values = [...prefix, ...[...digits].map(Number)];
  const sum = values.reduce((total, v, i) => total + v * (9 - i), 0);
  const expected = (11 - (sum % 11)) % 11;
  const expectedChar = expected === 10 ? 'A' : String(expected);
  return check === expectedChar ? hkid : null;
};

const parseDateOfBirth = (value: unknown) => {
  const dob = record(value);
  const message = '請輸入有效的出生日期 Please enter a valid date of birth';
  const day = Number(text(dob.day, message));
  const month = Number(text(dob.month, message));
  const year = Number(text(dob.year, message));
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    Number.isInteger(day) &&
    Number.isInteger(month) &&
    Number.isInteger(year) &&
    year >= 1900 &&
    date <= new Date() &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!valid) fail(message);
  return { day: String(day), month: String(month), year: String(year) };
};

const sortFiles = (files: UploadedFile[]) => {
  let idCard: UploadedFile | undefined;
  let bank: UploadedFile | undefined;
  const certifications: Record<number, UploadedFile> = {};

  for (const file of files) {
    if (!isAllowedFileType(file.mimetype) || file.size > MAX_FILE_SIZE) {
      fail('只接受5MB以下的圖片和PDF文件 Only image and PDF files under 5MB are allowed');
    }
    const certMatch = /^certificationFiles\[(\d+)\]$/.exec(file.fieldname);
    if (file.fieldname === 'idCardFile' && !idCard) {
      idCard = file;
    } else if (file.fieldname === 'bankFile' && !bank) {
      bank = file;
    } else if (certMatch && !certifications[Number(certMatch[1])]) {
      certifications[Number(certMatch[1])] = file;
    } else {
      fail('上傳的文件無效 Invalid file upload');
    }
  }

  return {
    idCard: idCard ?? fail('請上傳身份證文件 Please upload ID card document'),
    bank: bank ?? fail('請上傳銀行帳戶文件 Please upload bank account document'),
    certifications,
  };
};

export const parseApplication = (rawBody: unknown, files: UploadedFile[]): ParsedApplication => {
  const body = record(rawBody);
  const sorted = sortFiles(files);

  const supplierType = body.supplierType;
  if (!SUPPLIER_TYPES.includes(supplierType as (typeof SUPPLIER_TYPES)[number])) {
    fail('請選擇供應商類型 Please select supplier type');
  }
  const gender = body.gender;
  if (!GENDERS.includes(gender as (typeof GENDERS)[number])) {
    fail('請選擇性別 Please select gender');
  }

  const contact = record(body.contactPerson);
  const email = text(contact.email, '請輸入有效的電郵地址 Please enter a valid email address').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail('請輸入有效的電郵地址 Please enter a valid email address');
  }

  const address = record(body.address);

  const hkid = normaliseHkid(text(body.hkid, '請輸入香港身份證號碼 Please enter HKID number'));
  if (!hkid) {
    fail('請輸入有效的香港身份證號碼 Please enter a valid HKID number');
  }

  const rawCerts = Array.isArray(body.professionalCertifications) ? body.professionalCertifications : [];
  if (!rawCerts.length) {
    fail('請至少上傳一個專業認證 Please upload at least one professional certification');
  }
  if (rawCerts.length > MAX_CERTIFICATIONS) {
    fail(`最多上傳${MAX_CERTIFICATIONS}個專業認證 At most ${MAX_CERTIFICATIONS} professional certifications`);
  }
  const certificationFiles: UploadedFile[] = [];
  const professionalCertifications = rawCerts.map((raw, index) => {
    const cert = record(raw);
    const file =
      sorted.certifications[index] ??
      fail('請上傳專業認證文件 Please upload professional certification document');
    certificationFiles.push(file);
    return {
      name: text(cert.name, '請輸入認證名稱 Please enter certification name'),
      expiryDate: text(cert.expiryDate, '請輸入認證到期日 Please enter certification expiry date'),
      uploadDate: new Date(),
    };
  });
  if (Object.keys(sorted.certifications).length !== certificationFiles.length) {
    fail('上傳的文件無效 Invalid file upload');
  }

  const bank = record(body.bankAccount);
  const bankMessage = '請填寫完整的銀行帳戶資料 Please fill in complete bank account information';
  const bankAccount = {
    bank: text(bank.bank, bankMessage),
    bankCode: text(bank.bankCode, bankMessage),
    accountNumber: text(bank.accountNumber, bankMessage),
    cardHolderName: text(bank.cardHolderName, bankMessage),
  };
  if (!/^\d{3}$/.test(bankAccount.bankCode)) fail(bankMessage);
  if (!/^\d{1,20}$/.test(bankAccount.accountNumber)) {
    fail('銀行帳戶號碼必須為數字 Bank account number must contain only numbers');
  }
  if (!/^[a-zA-Z\s]+$/.test(bankAccount.cardHolderName)) {
    fail('持卡人姓名必須為英文 Card holder name must be in English');
  }

  return {
    fields: {
      supplierType: supplierType as ApplicationFields['supplierType'],
      gender: gender as ApplicationFields['gender'],
      contactPerson: {
        nameEn: text(contact.nameEn, '請輸入英文姓名 Please enter name in English'),
        nameCn: text(contact.nameCn, '請輸入中文姓名 Please enter name in Chinese'),
        email,
        phone: text(contact.phone, '請輸入聯絡電話 Please enter phone number'),
      },
      address: {
        street: text(address.street, '地址無效 Invalid address', { optional: true }),
        addressLine2: text(address.addressLine2, '地址無效 Invalid address', { optional: true }),
        district: text(address.district, '請選擇地區 Please select district'),
      },
      hkid: hkid as string,
      dateOfBirth: parseDateOfBirth(body.dateOfBirth),
      professionalCertifications,
      bankAccount,
    },
    files: { idCard: sorted.idCard, bank: sorted.bank, certifications: certificationFiles },
  };
};

export const validateSupplier = (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    res.locals.application = parseApplication(req.body, files);
    next();
  } catch (error) {
    next(error);
  }
};
