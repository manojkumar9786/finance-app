"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { useTheme } from "next-themes"
import { AlertTriangle, CheckCircle } from "lucide-react"

import { Progress } from "@/components/ui/progress"

export function BudgetComparison({ transactions, budgets }) {
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    // Calculate total spent per category
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += amount
      return acc
    }, {})

    // Create data for chart
    return Object.entries(budgets).map(([category, budget]) => ({
      category,
      budget,
      spent: categoryTotals[category] || 0,
      remaining: Math.max(0, budget - (categoryTotals[category] || 0)),
      percentage: Math.min(100, Math.round(((categoryTotals[category] || 0) / budget) * 100)),
    }))
  }, [transactions, budgets])

  const isDark = theme === "dark"

  console.log("chartData", chartData)

  return (
    <div className="space-y-6">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
            />
            <XAxis
              type="number"
              tickFormatter={(value) => `$${value}`}
              stroke={isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={100}
              stroke={isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, "Amount"]}
              contentStyle={{
                backgroundColor: isDark ? "hsl(224, 71%, 4%)" : "white",
                borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                color: isDark ? "white" : "black",
              }}
            />
            <Legend />
            <Bar
              dataKey="spent"
              fill={isDark ? "#60a5fa" : "#3b82f6"}
              name="Spent"
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
            <Bar
              dataKey="remaining"
              fill={isDark ? "#4b5563" : "#EC4899"}
              name="Remaining"
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
              animationBegin={300}
            />
            <ReferenceLine x={0} stroke="#666" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Budget Status</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {chartData.map((item) => {
            const categoryColor = getCategoryColor(item.category)
            return (
              <div key={item.category} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{item.category}</h4>
                  <div className="flex items-center gap-1">
                    {item.percentage >= 90 ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4" style={{ color: categoryColor }} />
                    )}
                    <span className={item.percentage >= 90 ? "text-destructive" : ""}>{item.percentage}%</span>
                  </div>
                </div>
                <Progress
                  value={item.percentage}
                  className="h-2"
                  indicatorClassName={item.percentage >= 90 ? "bg-destructive" : ""}
                  style={{
                    "--progress-background": `${categoryColor}30`,
                    "--progress-foreground": categoryColor,
                  }}
                />
                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Spent: <span className="font-medium">${item.spent.toFixed(2)}</span>
                  </span>
                  <span>
                    Budget: <span className="font-medium">${item.budget}</span>
                  </span>
                </div>
              </div>
            )
          })}
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
