import nodemailer from 'nodemailer';
import { Config } from '../config';
import { SUPPLIER_TYPE_LABELS, SupplierData } from '../models/supplierModel';
import { UploadedFile } from '../middleware/validateSupplier';

// Gmail rejects messages over 25MB; keep attachments well below that.
export const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;

export interface StoredFile {
  label: string;
  key: string;
  file: UploadedFile;
}

export interface ApplicationNotification {
  id: string;
  data: SupplierData;
  files: StoredFile[];
}

export interface Mailer {
  sendApplicationNotification(notification: ApplicationNotification): Promise<void>;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const row = (label: string, value: string) =>
  `<tr><th align="left" style="padding:4px 12px 4px 0">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;

export const buildNotification = ({ id, data, files }: ApplicationNotification) => {
  const { contactPerson: c, address: a, dateOfBirth: d, bankAccount: b } = data;
  const role = `${SUPPLIER_TYPE_LABELS[data.supplierType]} ${data.supplierType}`;

  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  const notAttached: StoredFile[] = [];
  let total = 0;
  for (const stored of files) {
    if (total + stored.file.size <= MAX_ATTACHMENT_BYTES) {
      total += stored.file.size;
      attachments.push({
        filename: `${stored.label}-${stored.file.originalname}`,
        content: stored.file.buffer,
        contentType: stored.file.mimetype,
      });
    } else {
      notAttached.push(stored);
    }
  }

  const rows = [
    row('申請編號 Application ID', id),
    row('職級 Type', role),
    row('英文姓名 Name (EN)', c.nameEn),
    row('中文姓名 Name (CN)', c.nameCn),
    row('電郵 Email', c.email),
    row('電話 Phone', c.phone),
    row('性別 Gender', data.gender),
    row('地址 Address', [a.street, a.addressLine2].filter(Boolean).join(', ')),
    row('地區 District', a.district),
    row('身份證 HKID', data.hkid),
    row('出生日期 Date of birth', `${d.day}/${d.month}/${d.year}`),
    ...data.professionalCertifications.map((cert, i) =>
      row(`專業認證 ${i + 1} Certification`, `${cert.name}（到期 expiry ${cert.expiryDate}）`),
    ),
    row('銀行 Bank', `${b.bank} (${b.bankCode})`),
    row('帳戶號碼 Account no.', b.accountNumber),
    row('持卡人 Card holder', b.cardHolderName),
  ].join('');

  const missing = notAttached.length
    ? `<p>以下文件超出附件大小上限，請到 Cloudflare R2 下載 These files were too large to attach; download them from Cloudflare R2:</p><ul>${notAttached
        .map((f) => `<li>${escapeHtml(f.label)}: ${escapeHtml(f.key)}</li>`)
        .join('')}</ul>`
    : '';

  return {
    subject: `新護理人員申請 New caregiver application – ${c.nameCn} ${c.nameEn} (${role})`,
    html: `<p>收到新的護理人員申請。A new caregiver application was submitted.</p><table>${rows}</table>${missing}`,
    attachments,
  };
};

export const createGmailMailer = (smtp: Config['smtp'], notifyTo: string): Mailer => {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  return {
    async sendApplicationNotification(notification) {
      await transporter.sendMail({
        from: smtp.user,
        to: notifyTo,
        ...buildNotification(notification),
      });
    },
  };
};
