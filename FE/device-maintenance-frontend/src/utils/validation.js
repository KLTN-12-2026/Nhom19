// src/utils/validation.js
// Tiện ích validation chuẩn cho form đăng nhập, đăng ký, đổi/quên mật khẩu

export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  // RFC 5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  // Định dạng số điện thoại Việt Nam 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09
  const phoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone.trim().replace(/\s+/g, ""));
};

export const evaluatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: "Trống", color: "#cbd5e1" };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: "Yếu", color: "#ef4444" };
  } else if (score <= 2) {
    return { score: 2, label: "Trung bình", color: "#f59e0b" };
  } else if (score <= 4) {
    return { score: 3, label: "Khá", color: "#3b82f6" };
  } else {
    return { score: 4, label: "Rất mạnh", color: "#10b981" };
  }
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = "Vui lòng nhập địa chỉ email";
  } else if (!isValidEmail(email)) {
    errors.email = "Email không đúng định dạng (ví dụ: user@example.com)";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = ({ fullName, email, phone, password, confirmPassword }) => {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  } else if (fullName.trim().length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
  }

  if (!email || !email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!isValidEmail(email)) {
    errors.email = "Email không hợp lệ (ví dụ: user@company.com)";
  }

  if (!phone || !phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận lại mật khẩu";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPasswordForm = ({ email }) => {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = "Vui lòng nhập email tài khoản của bạn";
  } else if (!isValidEmail(email)) {
    errors.email = "Email không hợp lệ";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPasswordForm = ({ token, newPassword, confirmPassword }) => {
  const errors = {};

  if (!token || !token.trim()) {
    errors.token = "Mã xác thực (Token) không được để trống";
  }

  if (!newPassword) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới";
  } else if (newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateChangePasswordForm = ({ currentPassword, newPassword, confirmPassword }) => {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
  }

  if (!newPassword) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới";
  } else if (newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
  } else if (newPassword === currentPassword) {
    errors.newPassword = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
