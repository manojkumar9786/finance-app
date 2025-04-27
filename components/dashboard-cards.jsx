"use client"

import { useMemo } from "react"
import { ArrowDownRight, ArrowUpRight, DollarSign, CreditCard, PieChart, Calendar } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCards({ transactions }) {
  const stats = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

    // Get categories with highest spending
    const categoryTotals = transactions.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0
      acc[t.category] += t.amount
      return acc
    }, {})

    const topCategory =
      Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category]) => category)[0] || "None"

    // Calculate average transaction
    const avgTransaction = transactions.length ? (totalSpent / transactions.length).toFixed(2) : 0

    // Get most recent transaction date
    const dates = transactions.map((t) => new Date(t.date))
    const mostRecentDate = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date()

    const formattedDate = mostRecentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    return {
      totalSpent,
      topCategory,
      avgTransaction,
      mostRecentDate: formattedDate,
      transactionCount: transactions.length,
    }
  }, [transactions])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.transactionCount} transactions</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgTransaction}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span>From previous period</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCategory}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              <span>Highest spending area</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostRecentDate}</div>
            <p className="text-xs text-muted-foreground">Most recent activity</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
