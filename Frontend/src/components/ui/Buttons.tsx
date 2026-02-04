import type { ReactElement } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
}

const variantStyles = {
  primary: "bg-primary text-inline font-serif hover:bg-primary-hover",
  secondary: "bg-secondary text-white font-serif hover:bg-secondary-hover",
};

const sizeStyles = {
  sm: "py-1 px-2 text-sm h-8",
  md: "py-2 px-4 text-md h-10",
  lg: "py-4 px-8 text-xl h-12",
};

const defaultStyles = "rounded-md m-2 flex items-center justify-center ";

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${variantStyles[props.variant]} ${defaultStyles} ${
        sizeStyles[props.size]
      } ${props.className || ''}`}
      onClick={props.onClick}
    >
      {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
      {props.text}{" "}
      {props.endIcon ? <div className="pr-2">{props.endIcon}</div> : null}
    </button>
  );
};
