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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 bottom-0  right-0 z-50 mx-auto flex w-full max-w-md min-h-screen flex-col  bg-white"
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
    <div className="flex flex-col justify-center   pt-3"> 
      <button className="h-10 w-10 flex justify-center items-center rounded-sm bg-border  ml-5 "  > &lsaquo; </button>
    </div>
  );
}

BottomSheet.Handle = SheetHandle;
