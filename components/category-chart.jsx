"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useTheme } from "next-themes"

export function CategoryChart({ transactions }) {
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    // Group transactions by category
    const groupedByCategory = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += amount
      return acc
    }, {})

    // Convert to array and sort by amount
    return Object.entries(groupedByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const COLORS = [
    "#4f46e5", // indigo
    "#0ea5e9", // sky
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#10b981", // emerald
    "#f59e0b", // amber
    "#6b7280", // gray
  ]

  const getCategoryColor = (name) => {
    const index = categories.indexOf(name)
    return index >= 0 ? COLORS[index % COLORS.length] : COLORS[0]
  }

  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
            animationBegin={300}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
            contentStyle={{
              backgroundColor: isDark ? "hsl(224, 71%, 4%)" : "white",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              color: isDark ? "white" : "black",
            }}
          />
          <Legend formatter={(value) => <span style={{ color: isDark ? "white" : "black" }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// List of categories
const categories = ["Food", "Transportation", "Utilities", "Entertainment", "Shopping", "Health", "Education", "Other"]
