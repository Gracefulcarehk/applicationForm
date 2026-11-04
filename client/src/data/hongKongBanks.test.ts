import { hongKongBanks } from './hongKongBanks';

test('bank codes are three-digit HKICL clearing codes', () => {
  hongKongBanks.forEach((bank) => expect(bank.code).toMatch(/^\d{3}$/));
});

test('bank codes and names are unique (names are used as select values)', () => {
  const codes = hongKongBanks.map((bank) => bank.code);
  const names = hongKongBanks.map((bank) => bank.name);
  expect(new Set(codes).size).toBe(codes.length);
  expect(new Set(names).size).toBe(names.length);
});
