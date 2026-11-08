import { buildNotification, MAX_ATTACHMENT_BYTES, StoredFile } from './mailer';
import { SupplierData } from '../models/supplierModel';

const data: SupplierData = {
  supplierType: 'RN',
  gender: 'M',
  hkid: 'A1234563',
  idCardFileKey: 'applications/1/id-card.pdf',
  contactPerson: { nameEn: 'Chan <b>Tai</b> Man', nameCn: '陳大文', email: 'chan@example.com', phone: '91234567' },
  address: { street: '1 Road', addressLine2: '', district: '中西區' },
  dateOfBirth: { day: '5', month: '6', year: '1980' },
  professionalCertifications: [
    { name: 'RN', fileKey: 'applications/1/certification-1.pdf', expiryDate: '31/12/2027', uploadDate: new Date() },
  ],
  bankAccount: {
    bank: 'HSBC',
    bankCode: '004',
    accountNumber: '123456789',
    cardHolderName: 'CHAN TAI MAN',
    fileKey: 'applications/1/bank.pdf',
  },
};

const stored = (label: string, size: number): StoredFile => ({
  label,
  key: `applications/1/${label}.pdf`,
  file: { fieldname: label, originalname: `${label}.pdf`, mimetype: 'application/pdf', size, buffer: Buffer.alloc(1) },
});

describe('buildNotification', () => {
  it('includes the full application and escapes HTML', () => {
    const { subject, html } = buildNotification({ id: 'abc123', data, files: [] });

    expect(subject).toContain('陳大文');
    expect(html).toContain('abc123');
    expect(html).toContain('A1234563');
    expect(html).toContain('123456789');
    expect(html).toContain('Chan &#60;b&#62;Tai&#60;/b&#62; Man');
    expect(html).not.toContain('<b>Tai</b>');
  });

  it('shows the role with its Chinese name', () => {
    const { subject, html } = buildNotification({ id: 'abc123', data: { ...data, supplierType: 'PT' }, files: [] });

    expect(subject).toContain('物理治療師 PT');
    expect(html).toContain('物理治療師 PT');
  });

  it('attaches files up to the size cap and lists the rest by R2 key', () => {
    const files = [stored('id-card', 4 * 1024 * 1024), stored('bank', MAX_ATTACHMENT_BYTES), stored('certification-1', 1024)];

    const { attachments, html } = buildNotification({ id: 'abc123', data, files });

    expect(attachments.map((a) => a.filename)).toEqual(['id-card-id-card.pdf', 'certification-1-certification-1.pdf']);
    expect(html).toContain('applications/1/bank.pdf');
  });
});
