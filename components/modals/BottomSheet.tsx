"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}

export function BottomSheet({ open, onClose, children, maxHeight = "85vh" }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-2xl flex-col rounded-t-[20px] bg-white"
            style={{ maxHeight }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetHandle() {
  return (
    <div className="flex justify-center pt-3">
      <div className="h-1 w-10 rounded-sm bg-border" />
    </div>
  );
}

BottomSheet.Handle = SheetHandle;
