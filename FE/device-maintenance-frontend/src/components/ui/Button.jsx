// src/components/ui/Button.jsx
// Nút bấm SaaS đa năng: variants, loading spinner, icons, fullWidth

import React from "react";
import { Spinner } from "./Icons";
import "./Button.css";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  onClick,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    loading ? "btn-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {loading && <Spinner className="btn-spinner" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      {!loading && iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
      <span className="btn-text">{children}</span>
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
}
