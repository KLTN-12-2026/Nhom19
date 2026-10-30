// src/App.test.js
// Kiểm tra render component App và giao diện Đăng nhập chuẩn hóa theo thiết kế

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page with exact design layout when unauthenticated', () => {
  render(<App />);

  // Tiêu đề thương hiệu và tiêu đề form
  expect(screen.getByText(/QuanLyBaoTriAI/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Đăng nhập tài khoản/i })).toBeInTheDocument();

  // Các trường input theo đúng placeholder từ thiết kế
  expect(screen.getByPlaceholderText(/admin@example\.com/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password123@/i)).toBeInTheDocument();

  // Nút Đăng nhập
  expect(screen.getByRole('button', { name: /^Đăng nhập$/i })).toBeInTheDocument();

  // Khối demo accounts
  expect(screen.getByText(/Điền nhanh tài khoản demo/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Admin \(Quản trị\)/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Kỹ thuật viên \(KTV\)/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Người dùng \(User\)/i })).toBeInTheDocument();
});
