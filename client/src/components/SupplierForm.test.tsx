import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupplierForm, {
  HKID_FORMAT_MESSAGE,
  HKID_PLACEHOLDER,
  HKID_REQUIRED_MESSAGE,
  validationSchema,
} from './SupplierForm';

const validateHkid = (hkid: string) =>
  validationSchema.validateAt('hkid', { hkid }).then(
    () => null,
    (error) => error.message
  );

describe('HKID validation', () => {
  test.each([
    ['one letter', 'A123456(3)'],
    ['lowercase letter', 'z987654(6)'],
    ['two letters', 'XA123456(8)'],
    ['check digit A', 'A123458(A)'],
  ])('accepts %s: %s', async (_, hkid) => {
    expect(await validateHkid(hkid)).toBeNull();
  });

  test('requires a value', async () => {
    expect(await validateHkid('')).toBe(HKID_REQUIRED_MESSAGE);
  });

  test.each([
    ['first character is not a letter', '1123456(3)'],
    ['three letters', 'XYA123456(3)'],
    ['no brackets', 'A1234563'],
    ['letters where digits belong', 'A12345X(3)'],
    ['letter and 9 other characters', 'A12345678X'],
    ['wrong check digit', 'A123456(4)'],
  ])('rejects when %s', async (_, hkid) => {
    expect(await validateHkid(hkid)).toBe(HKID_FORMAT_MESSAGE);
  });
});

describe('HKID field', () => {
  const renderField = () => {
    render(
      <MemoryRouter>
        <SupplierForm />
      </MemoryRouter>
    );
    return screen.getByPlaceholderText(HKID_PLACEHOLDER);
  };

  test('shows the empty-field message when left blank', async () => {
    const input = renderField();
    fireEvent.blur(input);
    expect(await screen.findByText(HKID_REQUIRED_MESSAGE)).toBeInTheDocument();
  });

  test('checks the format on blur, not while typing', async () => {
    const input = renderField();
    fireEvent.change(input, { target: { value: '1123456(3)' } });
    expect(screen.queryByText(HKID_FORMAT_MESSAGE)).not.toBeInTheDocument();

    fireEvent.blur(input);
    expect(await screen.findByText(HKID_FORMAT_MESSAGE)).toBeInTheDocument();

    // The message stays until the field is left again
    fireEvent.change(input, { target: { value: 'A123456(3)' } });
    expect(screen.getByText(HKID_FORMAT_MESSAGE)).toBeInTheDocument();
    fireEvent.blur(input);
    await waitFor(() => expect(screen.queryByText(HKID_FORMAT_MESSAGE)).not.toBeInTheDocument());
  });
});

describe('Position field', () => {
  test('offers the four recruited roles', () => {
    render(
      <MemoryRouter>
        <SupplierForm />
      </MemoryRouter>
    );
    // MUI renders the clickable select just before its hidden input
    const select = document.querySelector('input[name="supplierType"]')?.previousElementSibling;
    if (!select) throw new Error('position select not found');
    fireEvent.mouseDown(select);
    const options = screen.getAllByRole('option').map((option) => option.getAttribute('data-value'));
    expect(options).toEqual(['HH', 'PCW', 'RN', 'AH']);
    expect(screen.getByRole('option', { name: '輔助醫療人員 Allied Health Professional (AH)' })).toBeInTheDocument();
  });
});
