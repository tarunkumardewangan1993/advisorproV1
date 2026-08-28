"use client";

import type { FormHTMLAttributes } from "react";

export function ConfirmForm({
  action,
  confirmMessage,
  className = "",
  children,
}: {
  action: FormHTMLAttributes<HTMLFormElement>["action"];
  confirmMessage: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
