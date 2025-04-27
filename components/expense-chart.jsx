"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

export function ExpenseChart({ transactions }) {
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    // Group transactions by day
    const groupedByDay = transactions.reduce((acc, transaction) => {
      const date = transaction.date
      if (!acc[date]) {
        acc[date] = { date, total: 0 }
        // Initialize each category
        categories.forEach((cat) => {
          acc[date][cat] = 0
        })
      }

      // Add to total
      acc[date].total += transaction.amount

      // Add to category
      if (transaction.category) {
        acc[date][transaction.category] += transaction.amount
      }

      return acc
    }, {})

    // Convert to array and sort by date
    return Object.values(groupedByDay).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [transactions])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            stroke={isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            stroke={isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
          />
          <Tooltip
            formatter={(value, name) => [`$${value}`, name === "total" ? "Total" : name]}
            labelFormatter={formatDate}
            contentStyle={{
              backgroundColor: isDark ? "hsl(224, 71%, 4%)" : "white",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              color: isDark ? "white" : "black",
            }}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// List of categories
const categories = ["Food", "Transportation", "Utilities", "Entertainment", "Shopping", "Health", "Education", "Other"]
