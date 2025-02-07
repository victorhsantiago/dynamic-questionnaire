import "./Button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary"; // this is just an example, I haven't styled the button variants
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  className,
  ...rest
}) => {
  const baseClass = "button";
  const classes = [
    baseClass,
    variant ? `${baseClass}--${variant}` : "",
    className || "",
  ]
    .join(" ")
    .trim();

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};
