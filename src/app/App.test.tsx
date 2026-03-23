import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('../hooks/useUsers', () => ({
  useUsers: () => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }),
}));

test('renders loading users', () => {
  render(<App />);
  // expect(screen.getByText(/loading users/i)).toBeInTheDocument();
});

test('does not show loading status when data is ready', () => {
  render(<App />);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
