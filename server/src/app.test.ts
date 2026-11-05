import request from 'supertest';
import { createApp } from './app';
import { Supplier } from './models/supplierModel';
import { FileStorage } from './services/storage';
import { Mailer } from './services/mailer';

jest.mock('./utils/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const ORIGIN = 'https://apply.gracefulcarehk.com';
const pdf = Buffer.from('%PDF-1.4 test');

const setup = () => {
  const storage: jest.Mocked<FileStorage> = {
    upload: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const mailer: jest.Mocked<Mailer> = {
    sendApplicationNotification: jest.fn().mockResolvedValue(undefined),
  };
  const app = createApp({ corsOrigins: [ORIGIN], trustProxy: 0, storage, mailer });
  return { app, storage, mailer };
};

// Mirrors the FormData built by client/src/components/SupplierForm.tsx
const validSubmission = (app: ReturnType<typeof setup>['app']) =>
  request(app)
    .post('/api/suppliers')
    .set('Origin', ORIGIN)
    .field('supplierType', 'PCW')
    .field('gender', 'F')
    .field('hkid', 'A123456(3)')
    .field('status', 'Approved')
    .field('contactPerson[nameEn]', 'Chan Tai Man')
    .field('contactPerson[nameCn]', '陳大文')
    .field('contactPerson[email]', 'chan@example.com')
    .field('contactPerson[phone]', '91234567')
    .field('address[street]', "1 Queen's Road")
    .field('address[addressLine2]', '')
    .field('address[district]', '中西區')
    .field('dateOfBirth[day]', '5')
    .field('dateOfBirth[month]', '6')
    .field('dateOfBirth[year]', '1980')
    .attach('idCardFile', pdf, { filename: 'id.pdf', contentType: 'application/pdf' })
    .field('bankAccount[bank]', 'HSBC')
    .field('bankAccount[bankCode]', '004')
    .field('bankAccount[accountNumber]', '123456789')
    .field('bankAccount[cardHolderName]', 'CHAN TAI MAN')
    .attach('bankFile', pdf, { filename: 'bank.pdf', contentType: 'application/pdf' })
    .field('professionalCertifications[0][name]', 'PCW 證書')
    .field('professionalCertifications[0][expiryDate]', '31/12/2027')
    .field('professionalCertifications[0][uploadDate]', '2026-11-01T00:00:00.000Z')
    .attach('certificationFiles[0]', pdf, { filename: 'cert.pdf', contentType: 'application/pdf' });

describe('POST /api/suppliers', () => {
  let save: jest.SpyInstance;

  beforeEach(() => {
    save = jest.spyOn(Supplier.prototype, 'save').mockImplementation(function (this: unknown) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stores files in R2, saves the application and sends the notification', async () => {
    const { app, storage, mailer } = setup();

    const res = await validSubmission(app);

    expect(res.status).toBe(201);
    expect(Object.keys(res.body)).toEqual(['id']);
    const { id } = res.body;

    expect(storage.upload.mock.calls.map(([key]) => key)).toEqual([
      `applications/${id}/id-card.pdf`,
      `applications/${id}/bank.pdf`,
      `applications/${id}/certification-1.pdf`,
    ]);

    const saved = save.mock.contexts[0] as InstanceType<typeof Supplier>;
    expect(saved.id).toBe(id);
    expect(saved.status).toBe('Pending');
    expect(saved.hkid).toBe('A1234563');
    expect(saved.idCardFileKey).toBe(`applications/${id}/id-card.pdf`);
    expect(saved.bankAccount.fileKey).toBe(`applications/${id}/bank.pdf`);
    expect(saved.professionalCertifications[0].fileKey).toBe(`applications/${id}/certification-1.pdf`);

    expect(mailer.sendApplicationNotification).toHaveBeenCalledTimes(1);
    expect(mailer.sendApplicationNotification.mock.calls[0][0].id).toBe(id);
  });

  it('still succeeds when the notification email fails', async () => {
    const { app, mailer } = setup();
    mailer.sendApplicationNotification.mockRejectedValueOnce(new Error('SMTP down'));

    const res = await validSubmission(app);

    expect(res.status).toBe(201);
  });

  it('returns 409 and removes uploaded files for a duplicate application', async () => {
    const { app, storage, mailer } = setup();
    save.mockRejectedValueOnce(Object.assign(new Error('E11000 duplicate key'), { code: 11000 }));

    const res = await validSubmission(app);

    expect(res.status).toBe(409);
    expect(storage.remove).toHaveBeenCalledWith(storage.upload.mock.calls.map(([key]) => key));
    expect(mailer.sendApplicationNotification).not.toHaveBeenCalled();
  });

  it('does not save when a file upload fails', async () => {
    const { app, storage } = setup();
    storage.upload.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('R2 down'));

    const res = await validSubmission(app);

    expect(res.status).toBe(500);
    expect(save).not.toHaveBeenCalled();
    expect(storage.remove).toHaveBeenCalledWith([expect.stringMatching(/id-card\.pdf$/)]);
  });

  it('rejects an invalid application with 400 before touching storage', async () => {
    const { app, storage } = setup();

    const res = await request(app)
      .post('/api/suppliers')
      .field('supplierType', 'PCW')
      .attach('idCardFile', pdf, { filename: 'id.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(400);
    expect(storage.upload).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects files larger than 5MB', async () => {
    const { app, storage } = setup();

    const res = await request(app)
      .post('/api/suppliers')
      .attach('idCardFile', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'big.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/5MB/);
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('limits repeated submissions from the same client', async () => {
    const { app } = setup();

    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/suppliers').field('supplierType', 'PCW');
    }
    const res = await request(app).post('/api/suppliers').field('supplierType', 'PCW');

    expect(res.status).toBe(429);
  });
});

describe('public surface', () => {
  it.each([
    ['get', '/api/suppliers'],
    ['get', '/api/suppliers/123'],
    ['put', '/api/suppliers/123'],
    ['patch', '/api/suppliers/123'],
    ['delete', '/api/suppliers/123'],
    ['post', '/api/auth/login'],
  ] as const)('does not expose %s %s', async (method, path) => {
    const { app } = setup();
    const res = await request(app)[method](path);
    expect(res.status).toBe(404);
  });

  it('only allows CORS from configured origins', async () => {
    const { app } = setup();

    const allowed = await request(app).options('/api/suppliers').set('Origin', ORIGIN);
    const blocked = await request(app).options('/api/suppliers').set('Origin', 'https://evil.example');

    expect(allowed.headers['access-control-allow-origin']).toBe(ORIGIN);
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('serves a health check', async () => {
    const { app } = setup();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
