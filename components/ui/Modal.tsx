"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** The dialog heading. */
  title: string;
  /** Optional specimen label above the heading. */
  label?: string;
  children: ReactNode;
};

/**
 * An accessible dialog built on the native `<dialog>` element, so focus
 * trapping and Escape-to-close come from the platform. Backdrop clicks close.
 */
export function Modal({ open, onClose, title, label, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
      className="m-auto max-w-[460px] border-0 bg-transparent p-0 text-ink backdrop:bg-mask/70"
    >
      <div className="tone-paper border-2 border-line p-[30px] shadow-stamp">
        <div className="flex items-start justify-between gap-4">
          <div>
            {label ? (
              <div className="font-mono text-specimen font-bold uppercase text-muted">
                {label}
              </div>
            ) : null}
            <h2
              id={titleId}
              className="m-0 mt-1 font-display text-[35px] leading-[1.04] tracking-[-0.035em]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tactile-quiet border-0 bg-transparent px-1 font-mono text-[20px] leading-none text-ink hover:text-mask"
          >
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-[10px]">{children}</div>
      </div>
    </dialog>
  );
}
