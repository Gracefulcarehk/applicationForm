import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { roles } from './data/recruitment';

test('renders the recruitment landing page with apply links', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('成為滿心醫療');
  for (const title of ['為何加入我們？', '現正招募', '加入團隊需要具備什麼？', '申請流程', '常見問題']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
  screen.getAllByRole('link', { name: '立即申請' }).forEach((link) => expect(link).toHaveAttribute('href', '/apply'));
});

test('lists the four roles and switches the detail panel', () => {
  render(<App />);
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map((tab) => tab.textContent)).toEqual(roles.map((role) => role.name));

  const panel = screen.getByRole('tabpanel');
  expect(within(panel).getByText('家居清潔')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: '輔助醫療人員' }));
  expect(screen.getByRole('tab', { name: '輔助醫療人員' })).toHaveAttribute('aria-selected', 'true');
  const allied = within(screen.getByRole('tabpanel'));
  expect(allied.getByText('持有以下至少一項本地認可資格：')).toBeInTheDocument();
  for (const qualification of ['物理治療師', '職業治療師', '言語治療師']) {
    expect(allied.getByText(qualification)).toBeInTheDocument();
  }
});

test('hides the benefits section until benefits are provided', () => {
  render(<App />);
  expect(screen.queryByRole('heading', { name: '加入滿心醫療的福利' })).not.toBeInTheDocument();
});
