import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Helper function to get consistent colors for categories
export function getCategoryColor(category) {
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

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
