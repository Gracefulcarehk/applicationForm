import { AppError } from './errorHandler';
import { normaliseHkid, parseApplication, UploadedFile } from './validateSupplier';

const file = (fieldname: string, overrides: Partial<UploadedFile> = {}): UploadedFile => ({
  fieldname,
  originalname: `${fieldname}.pdf`,
  mimetype: 'application/pdf',
  size: 1024,
  buffer: Buffer.from('%PDF-1.4'),
  ...overrides,
});

const validBody = () => ({
  supplierType: 'PCW',
  gender: 'F',
  hkid: 'a123456(3)',
  status: 'Approved',
  contactPerson: { nameEn: 'Chan Tai Man', nameCn: '陳大文', email: 'Chan@Example.com', phone: '91234567' },
  address: { street: '1 Queen\'s Road', addressLine2: '', district: '中西區' },
  dateOfBirth: { day: '5', month: '6', year: '1980' },
  professionalCertifications: [{ name: 'PCW 證書', expiryDate: '31/12/2027', uploadDate: '2020-01-01' }],
  bankAccount: { bank: 'HSBC', bankCode: '004', accountNumber: '123456789', cardHolderName: 'CHAN TAI MAN' },
});

const validFiles = () => [file('idCardFile'), file('bankFile'), file('certificationFiles[0]')];

const expectRejected = (body: unknown, files: UploadedFile[], message: RegExp) => {
  try {
    parseApplication(body, files);
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(400);
    expect((error as AppError).message).toMatch(message);
    return;
  }
  throw new Error('expected parseApplication to throw');
};

describe('normaliseHkid', () => {
  it.each([
    ['A123456(3)', 'A1234563'],
    ['a123456 (3)', 'A1234563'],
    ['A1234563', 'A1234563'],
  ])('accepts %s', (input, expected) => {
    expect(normaliseHkid(input)).toBe(expected);
  });

  it.each(['A123456(4)', 'A12345(3)', '1234567(3)', 'ABC123456(3)', ''])('rejects %s', (input) => {
    expect(normaliseHkid(input)).toBeNull();
  });
});

describe('parseApplication', () => {
  it('returns whitelisted, normalised fields and sorted files', () => {
    const { fields, files } = parseApplication(validBody(), validFiles());

    expect(fields.hkid).toBe('A1234563');
    expect(fields.contactPerson.email).toBe('chan@example.com');
    expect(fields).not.toHaveProperty('status');
    expect(fields.professionalCertifications).toEqual([
      { name: 'PCW 證書', expiryDate: '31/12/2027', uploadDate: expect.any(Date) },
    ]);
    expect(files.idCard.fieldname).toBe('idCardFile');
    expect(files.bank.fieldname).toBe('bankFile');
    expect(files.certifications.map((f) => f.fieldname)).toEqual(['certificationFiles[0]']);
  });

  it('rejects an invalid HKID check digit', () => {
    expectRejected({ ...validBody(), hkid: 'A123456(4)' }, validFiles(), /HKID/);
  });

  it('rejects an impossible date of birth', () => {
    expectRejected({ ...validBody(), dateOfBirth: { day: '31', month: '2', year: '1980' } }, validFiles(), /date of birth/);
  });

  it.each(['HH', 'PCW', 'RN', 'AH'])('accepts the role %s', (supplierType) => {
    expect(parseApplication({ ...validBody(), supplierType }, validFiles()).fields.supplierType).toBe(supplierType);
  });

  it.each(['Admin', 'EN', 'HCA'])('rejects the unknown supplier type %s', (supplierType) => {
    expectRejected({ ...validBody(), supplierType }, validFiles(), /supplier type/);
  });

  it('requires the ID card file', () => {
    expectRejected(validBody(), [file('bankFile'), file('certificationFiles[0]')], /ID card/);
  });

  it('requires a file for every certification', () => {
    expectRejected(validBody(), [file('idCardFile'), file('bankFile')], /certification document/);
  });

  it('rejects unexpected file fields', () => {
    expectRejected(validBody(), [...validFiles(), file('extra')], /Invalid file upload/);
  });

  it('rejects files that are not images or PDFs', () => {
    expectRejected(validBody(), [file('idCardFile', { mimetype: 'text/html' }), file('bankFile'), file('certificationFiles[0]')], /image and PDF/);
  });

  it('rejects a non-English card holder name', () => {
    expectRejected(
      { ...validBody(), bankAccount: { ...validBody().bankAccount, cardHolderName: '陳大文' } },
      validFiles(),
      /Card holder/,
    );
  });
});
