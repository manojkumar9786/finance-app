"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function DeleteModal({ isOpen, onClose, onConfirm, title, description }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold">{title || "Are you sure?"}</h2>
              <p className="text-sm text-muted-foreground">
                {description || "This action cannot be undone. This will permanently delete the transaction."}
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
