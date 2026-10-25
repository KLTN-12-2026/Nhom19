// File test gốc của App (giữ nguyên, cập nhật nội dung cho khớp trang chủ).

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page', () => {
  render(<App />);
  const heading = screen.getByText(/Trang chủ/i);
  expect(heading).toBeInTheDocument();
});
