import React from "react";
import "./RadioInput.scss";

export const RadioInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className, ...rest }) => {
  const baseClass = "radio-input";
  const classes = [baseClass, className || ""].join(" ").trim();

  return <input type="radio" className={classes} {...rest} />;
};
