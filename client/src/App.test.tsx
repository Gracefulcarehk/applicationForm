import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the recruitment landing page with apply links', () => {
  render(<App />);
  expect(screen.getByText('護理人員招聘')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /立即申請 Apply Now/ })[0]).toHaveAttribute('href', '/apply');
});
