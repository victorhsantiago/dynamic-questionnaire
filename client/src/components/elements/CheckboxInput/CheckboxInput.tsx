import "./CheckboxInput.scss";

export const CheckboxInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className, ...rest }) => {
  const baseClass = "checkbox-input";
  const classes = [baseClass, className || ""].join(" ").trim();

  return <input type="checkbox" className={classes} {...rest} />;
};
