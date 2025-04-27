"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { PlusCircle, Moon, Sun, BarChart3, PieChart, Wallet, ArrowUpDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionModal } from "@/components/transaction-modal"
import { DeleteModal } from "@/components/delete-modal"
import { TransactionList } from "@/components/transaction-list"
import { ExpenseChart } from "@/components/expense-chart"
import { CategoryChart } from "@/components/category-chart"
import { BudgetComparison } from "@/components/budget-comparison"
import { DashboardCards } from "@/components/dashboard-cards"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TransactionForm } from "@/components/transaction-form"

const categories = ["Food", "Transportation", "Utilities", "Entertainment", "Shopping", "Health", "Education", "Other"]

const budgets = {
  Food: 300,
  Transportation: 150,
  Utilities: 400,
  Entertainment: 100,
  Shopping: 200,
  Health: 150,
  Education: 100,
  Other: 100,
}

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/transactions")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchTransactions()
  }, [])

  const handleAddTransaction = async (transaction) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        })

        if (!response.ok) throw new Error("Failed to update transaction")

        toast({
          title: "Success",
          description: "Transaction updated successfully",
        })
      } else {
        // Add new transaction
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        })

        if (!response.ok) throw new Error("Failed to add transaction")

        toast({
          title: "Success",
          description: "Transaction added successfully",
        })
      }

      // Refresh transactions
      fetchTransactions()
      closeModal()
    } catch (error) {
      console.error("Error saving transaction:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save transaction",
        variant: "destructive",
      })
    }
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (transaction) => {
    setDeletingTransaction(transaction)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return

    try {
      const response = await fetch(`/api/transactions/${deletingTransaction._id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete transaction")

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })

      // Refresh transactions
      fetchTransactions()
      setIsDeleteModalOpen(false)
      setDeletingTransaction(null)
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <h1 className="text-xl font-bold">Finance Visualizer</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <button
              onClick={() => {
                setEditingTransaction(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
      <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</CardTitle>
                  <CardDescription>
                    {editingTransaction
                      ? "Update the transaction details below"
                      : "Enter the details of your transaction below"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm
                    onSubmit={handleAddTransaction}
                    onCancel={() => {
                      setIsModalOpen(false)
                      setEditingTransaction(null)
                    }}
                    categories={categories}
                    initialData={editingTransaction}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Budgets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardCards transactions={transactions} />

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Expenses</CardTitle>
                    <CardDescription>Your spending over the last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart transactions={transactions} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>How your money is distributed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryChart transactions={transactions} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteClick}
                    isLoading={isLoading}
                  />
                </CardContent>
                {/* <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="transactions"]').click()}
                  >
                    View All Transactions
                  </Button>
                </CardFooter> */}
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="transactions">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>Manage your financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteClick}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="categories">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Category Analysis</CardTitle>
                  <CardDescription>Breakdown of your spending by category</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Distribution</h3>
                    <div className="h-[300px]">
                      <CategoryChart transactions={transactions} />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Category Details</h3>
                    {categories.map((category) => {
                      const categoryTotal = transactions
                        .filter((t) => t.category === category)
                        .reduce((sum, t) => sum + t.amount, 0)

                      return (
                        <div key={category} className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: getCategoryColor(category) }}
                            />
                            <span>{category}</span>
                          </div>
                          <span className="font-medium">${categoryTotal.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="budgets">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Budget Tracking</CardTitle>
                  <CardDescription>Monitor your spending against budget limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetComparison transactions={transactions} budgets={budgets} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Transaction Modal */}
      {/* <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddTransaction}
        initialData={editingTransaction}
        categories={categories}
      /> */}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingTransaction(null)
        }}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />

      <Toaster />
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
