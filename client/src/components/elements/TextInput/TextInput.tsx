import React from "react";
import "./TextInput.scss";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "small" | "large";
}

export const TextInput: React.FC<TextInputProps> = ({
  variant,
  className,
  ...rest
}) => {
  const baseClass = "text-input";
  const classes = [
    baseClass,
    variant ? `${baseClass}--${variant}` : "",
    className || "",
  ]
    .join(" ")
    .trim();

  return <input className={classes} {...rest} />;
};
