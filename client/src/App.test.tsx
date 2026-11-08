import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { roles } from './data/recruitment';

test('renders the recruitment landing page with apply links', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('成為滿心醫療');
  for (const title of ['為何加入我們', '招聘職位', '申請資格及所需文件', '申請流程', '常見問題']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
  screen.getAllByRole('link', { name: '立即申請' }).forEach((link) => expect(link).toHaveAttribute('href', '/apply'));
});

test('lists all six roles and switches the detail panel', () => {
  render(<App />);
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map((tab) => tab.textContent)).toEqual(roles.map((role) => role.name));

  const panel = screen.getByRole('tabpanel');
  expect(within(panel).getByText('香港護士管理局註冊護士（普通科或精神科）')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: '物理治療師' }));
  expect(screen.getByRole('tab', { name: '物理治療師' })).toHaveAttribute('aria-selected', 'true');
  expect(within(screen.getByRole('tabpanel')).getByText('香港物理治療師管理委員會註冊物理治療師')).toBeInTheDocument();
});

test('hides the benefits section until benefits are provided', () => {
  render(<App />);
  expect(screen.queryByRole('heading', { name: '加入滿心醫療的福利' })).not.toBeInTheDocument();
});
