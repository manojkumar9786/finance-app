"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TransactionForm } from "./transaction-form"

export function TransactionModal({ isOpen, onClose, onSubmit, initialData, categories }) {
  // Close modal when clicking outside
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [onClose])

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
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {initialData ? "Edit Transaction" : "Add New Transaction"}
                </h2>
                <button className="rounded-full p-1.5 hover:bg-muted" onClick={onClose}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {initialData ? "Update the transaction details below" : "Enter the details of your transaction below"}
              </p>
            </div>
            <TransactionForm onSubmit={onSubmit} onCancel={onClose} categories={categories} initialData={initialData} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
