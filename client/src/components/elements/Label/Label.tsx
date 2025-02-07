import React from "react";
import "./Label.scss";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: string;
}

export const Label: React.FC<LabelProps> = ({
  variant,
  children,
  className,
  ...rest
}) => {
  const baseClass = "label";
  const classes = [
    baseClass,
    variant ? `${baseClass}--${variant}` : "",
    className || "",
  ]
    .join(" ")
    .trim();

  return (
    <label className={classes} {...rest}>
      {children}
    </label>
  );
};
