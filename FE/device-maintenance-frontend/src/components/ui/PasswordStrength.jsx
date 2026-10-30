// src/components/ui/PasswordStrength.jsx
// Chỉ báo độ mạnh của mật khẩu

import React from "react";
import { evaluatePasswordStrength } from "../../utils/validation";
import "./PasswordStrength.css";

export default function PasswordStrength({ password = "" }) {
  if (!password) return null;

  const { score, label } = evaluatePasswordStrength(password);

  return (
    <div className="password-strength-container">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`strength-bar-step ${step <= score ? `active level-${score}` : ""}`}
          />
        ))}
      </div>
      <div className="strength-meta">
        <span className="strength-hint">Độ mạnh: </span>
        <span className={`strength-label level-${score}`}>{label}</span>
      </div>
    </div>
  );
}
