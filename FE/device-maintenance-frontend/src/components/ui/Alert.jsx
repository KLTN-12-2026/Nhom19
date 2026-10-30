// src/components/ui/Alert.jsx
// Khung thông báo lỗi / thành công phong cách SaaS hiện đại

import React from "react";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
} from "./Icons";
import "./Alert.css";

export default function Alert({
  type = "info",
  title,
  message,
  children,
  onClose,
  className = "",
}) {
  const content = message || children;
  if (!content && !title) return null;

  const renderIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircleIcon className="alert-icon" size={20} />;
      case "success":
        return <CheckCircleIcon className="alert-icon" size={20} />;
      case "warning":
        return <AlertTriangleIcon className="alert-icon" size={20} />;
      case "info":
      default:
        return <InfoIcon className="alert-icon" size={20} />;
    }
  };

  return (
    <div className={`alert-box alert-${type} ${className}`} role="alert">
      <div className="alert-leading">{renderIcon()}</div>
      <div className="alert-body">
        {title && <h4 className="alert-title">{title}</h4>}
        {content && <div className="alert-text">{content}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close-btn"
          aria-label="Đóng thông báo"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
}
