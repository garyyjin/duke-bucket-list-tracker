"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative bg-card text-card-foreground rounded-lg shadow-lg max-w-md w-full m-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center border-b px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function DialogContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 py-4", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex justify-end gap-2 border-t px-6 py-4", className)} {...props} />
  );
}

function DialogClose({ className, onClick, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn("absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground", className)}
      onClick={onClick}
      {...props}
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose };

