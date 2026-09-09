import type { ComponentPropsWithoutRef, ReactNode } from "react";

const BTN_CLASS =
  "inline-block border-2 border-line bg-white px-[17px] py-3 font-bold text-ink no-underline hover:bg-accent-green";

type BtnOwnProps = {
  children: ReactNode;
  className?: string;
};

type BtnAnchorProps = BtnOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className"> & {
    href: string;
  };

type BtnButtonProps = BtnOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: never;
  };

export type BtnProps = BtnAnchorProps | BtnButtonProps;

/**
 * The bordered button. Renders an anchor when `href` is passed and a button
 * otherwise, keeping the native props of whichever element it becomes.
 */
export function Btn(props: BtnProps) {
  if (props.href !== undefined) {
    const { children, className, ...anchorProps } = props;
    return (
      <a
        {...anchorProps}
        className={className ? `${BTN_CLASS} ${className}` : BTN_CLASS}
      >
        {children}
      </a>
    );
  }

  const { children, className, type, ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      type={type ?? "button"}
      className={className ? `${BTN_CLASS} ${className}` : BTN_CLASS}
    >
      {children}
    </button>
  );
}
