import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ISupplier } from '../models/supplierModel';

export const validateSupplier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      supplierType,
      contactPerson,
      gender,
      address,
      hkid,
      idCardFileUrl,
      dateOfBirth,
      professionalCertifications,
      bankAccount,
    } = req.body as ISupplier;

    // Validate required fields
    if (!supplierType) {
      throw new AppError('請選擇供應商類型 Please select supplier type', 400);
    }

    if (!contactPerson?.nameEn || !contactPerson?.nameCn) {
      throw new AppError('請輸入姓名 Please enter name', 400);
    }

    if (!contactPerson?.email) {
      throw new AppError('請輸入電郵地址 Please enter email address', 400);
    }

    if (!contactPerson?.phone) {
      throw new AppError('請輸入聯絡電話 Please enter phone number', 400);
    }

    if (!gender) {
      throw new AppError('請選擇性別 Please select gender', 400);
    }

    if (!address?.district) {
      throw new AppError('請選擇地區 Please select district', 400);
    }

    if (!hkid) {
      throw new AppError('請輸入香港身份證號碼 Please enter HKID number', 400);
    }

    if (!idCardFileUrl) {
      throw new AppError('請上傳身份證文件 Please upload ID card document', 400);
    }

    if (!dateOfBirth?.day || !dateOfBirth?.month || !dateOfBirth?.year) {
      throw new AppError('請輸入出生日期 Please enter date of birth', 400);
    }

    if (!professionalCertifications?.length) {
      throw new AppError('請至少上傳一個專業認證 Please upload at least one professional certification', 400);
    }

    if (!bankAccount?.bank || !bankAccount?.bankCode || !bankAccount?.accountNumber || !bankAccount?.cardHolderName || !bankAccount?.fileUrl) {
      throw new AppError('請填寫完整的銀行帳戶資料 Please fill in complete bank account information', 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}; 