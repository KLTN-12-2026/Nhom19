// src/utils/validation.test.js
// Kiểm thử các hàm xác thực dữ liệu đầu vào cho Auth Module

import {
  isValidEmail,
  isValidPhone,
  evaluatePasswordStrength,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
  validateChangePasswordForm,
} from "./validation";

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    it("chấp nhận email hợp lệ", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("engineer.lead@corp.vn")).toBe(true);
    });

    it("từ chối email không hợp lệ hoặc rỗng", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user@.com")).toBe(false);
      expect(isValidEmail("plainaddress")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("chấp nhận số điện thoại Việt Nam hợp lệ 10 số", () => {
      expect(isValidPhone("0912345678")).toBe(true);
      expect(isValidPhone("0389123456")).toBe(true);
      expect(isValidPhone("0868123456")).toBe(true);
    });

    it("từ chối số điện thoại không hợp lệ", () => {
      expect(isValidPhone("123456")).toBe(false);
      expect(isValidPhone("0123456789")).toBe(false);
      expect(isValidPhone("09123456789")).toBe(false); // 11 số
    });
  });

  describe("evaluatePasswordStrength", () => {
    it("tính toán điểm số và mức độ chính xác", () => {
      expect(evaluatePasswordStrength("").score).toBe(0);
      expect(evaluatePasswordStrength("12345").score).toBe(1);
      expect(evaluatePasswordStrength("abcdef12").score).toBeGreaterThanOrEqual(2);
      expect(evaluatePasswordStrength("P@ssw0rd2026!").score).toBe(4);
    });
  });

  describe("validateLoginForm", () => {
    it("báo lỗi khi để trống trường bắt buộc", () => {
      const res = validateLoginForm({ email: "", password: "" });
      expect(res.isValid).toBe(false);
      expect(res.errors.email).toBeDefined();
      expect(res.errors.password).toBeDefined();
    });

    it("hợp lệ khi nhập đúng định dạng", () => {
      const res = validateLoginForm({
        email: "test@example.com",
        password: "password123",
      });
      expect(res.isValid).toBe(true);
    });
  });

  describe("validateRegisterForm", () => {
    it("kiểm tra khớp xác nhận mật khẩu", () => {
      const res = validateRegisterForm({
        fullName: "Nguyễn Văn A",
        email: "a@gmail.com",
        phone: "0912345678",
        password: "secretpassword1",
        confirmPassword: "differentpassword",
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.confirmPassword).toBe("Mật khẩu xác nhận không trùng khớp");
    });
  });

  describe("validateChangePasswordForm", () => {
    it("báo lỗi nếu mật khẩu mới trùng mật khẩu cũ", () => {
      const res = validateChangePasswordForm({
        currentPassword: "password123",
        newPassword: "password123",
        confirmPassword: "password123",
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.newPassword).toBe("Mật khẩu mới không được trùng với mật khẩu hiện tại");
    });
  });
});
