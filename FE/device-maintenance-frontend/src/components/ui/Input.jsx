// src/components/ui/Input.jsx
// Ô nhập liệu chuyên nghiệp phong cách SaaS: hỗ trợ icon, nút hiện/ẩn mật khẩu, báo lỗi trực quan

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";
import "./Input.css";

export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  className = "",
  autoComplete,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  const inputId = id || name;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`form-field ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className={`input-wrapper ${disabled ? "is-disabled" : ""}`}>
        {icon && <span className="input-icon-left">{icon}</span>}

        <input
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`form-input ${icon ? "has-icon-left" : ""} ${isPassword ? "has-icon-right" : ""}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={toggleShowPassword}
            tabIndex="-1"
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="form-error-msg" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="form-helper-text">{helperText}</p>
      ) : null}
    </div>
  );
}
