"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function DeleteModal({ isOpen, onClose, onConfirm, title, description }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-md mx-auto" // Constrain max width and center horizontally
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content */}
              <div className="bg-background rounded-lg border shadow-lg overflow-hidden">
                {/* Modal header */}
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center sm:text-left">
                    {title || "Are you sure?"}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    {description || "This action cannot be undone. This will permanently delete the transaction."}
                  </p>
                </div>
                
                {/* Modal footer */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end p-6 pt-0">
                  <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto">
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}