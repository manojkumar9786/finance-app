"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit2, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionList({ transactions, onEdit, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else if (sortField === "date") {
      return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    } else {
      return sortDirection === "asc"
        ? a[sortField]?.localeCompare(b[sortField])
        : b[sortField]?.localeCompare(a[sortField])
    }
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        {/* Table container with horizontal scrolling */}
        <div className="overflow-x-auto">
          {/* Table with fixed width to ensure columns don't collapse */}
          <div className="min-w-[800px]">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-2 text-sm font-medium">
              <div className="col-span-2 flex items-center gap-1 sm:col-span-1">
                <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleSort("date")}>
                  Date
                  {sortField === "date" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </div>
              <div className="col-span-4 sm:col-span-5">
                <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleSort("description")}>
                  Description
                  {sortField === "description" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleSort("category")}>
                  Category
                  {sortField === "category" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </div>
              <div className="col-span-2 text-right sm:col-span-2">
                <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleSort("amount")}>
                  Amount
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </div>
              <div className="col-span-1 sm:col-span-2"></div>
            </div>

            <AnimatePresence>
              {isLoading ? (
                // Loading skeletons
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="grid grid-cols-12 items-center gap-2 border-b p-4 last:border-0">
                      <div className="col-span-2 sm:col-span-1">
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <div className="col-span-4 sm:col-span-5">
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="col-span-2 text-right sm:col-span-2">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </div>
                      <div className="col-span-1 flex justify-end gap-1 sm:col-span-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  ))
              ) : sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-12 items-center gap-2 border-b p-4 last:border-0"
                  >
                    <div className="col-span-2 text-sm sm:col-span-1">{format(new Date(transaction.date), "MM/dd")}</div>
                    <div className="col-span-4 sm:col-span-5 truncate">{transaction.description}</div>
                    <div className="col-span-3 sm:col-span-2">
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: `${getCategoryColor(transaction.category)}20`,
                          color: getCategoryColor(transaction.category),
                          borderColor: getCategoryColor(transaction.category),
                          padding: '5px 10px'
                        }}
                      >
                        {transaction.category}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-right font-medium sm:col-span-2">${transaction.amount.toFixed(2)}</div>
                    <div className="col-span-1 flex justify-end gap-1 sm:col-span-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          onEdit(transaction);
                        }}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No transactions found</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get consistent colors for categories
function getCategoryColor(category) {
  const colorMap = {
    Food: "#4f46e5", // indigo
    Transportation: "#0ea5e9", // sky
    Utilities: "#3b82f6", // blue
    Entertainment: "#8b5cf6", // violet
    Shopping: "#ec4899", // pink
    Health: "#10b981", // emerald
    Education: "#f59e0b", // amber
    Other: "#6b7280", // gray
  }

  return colorMap[category] || "#3b82f6"
}
