"use client"

import { useState } from "react"
import { demandPredictions } from "@/lib/data"
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function DemandForecastPage() {
  const [trendFilter, setTrendFilter] = useState("all")

  const upCount = demandPredictions.filter(d => d.trend === "up").length
  const downCount = demandPredictions.filter(d => d.trend === "down").length
  const stableCount = demandPredictions.filter(d => d.trend === "stable").length

  const filteredPredictions = demandPredictions.filter(d => trendFilter === "all" || d.trend === trendFilter)

  const chartData = filteredPredictions.map(d => ({ name: d.productName.length > 12 ? d.productName.slice(0, 12) + '…' : d.productName, current: d.currentStock, recommended: d.recommendedStock }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-6 h-6 text-[var(--primary)]" /> AI Demand Prediction</h1><p className="text-sm text-[var(--muted-foreground)]">Machine-learning powered demand forecasting</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Products Analyzed", value: demandPredictions.length, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Demand Up", value: upCount, icon: TrendingUp, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Demand Down", value: downCount, icon: TrendingDown, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Stable", value: stableCount, icon: Minus, color: "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4"><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color.split(" ")[0]}`}>{s.value}</p></div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Current Stock vs Recommended Stock</h3>
        <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" tick={{fontSize:10}} stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={80}/><YAxis tick={{fontSize:12}} stroke="var(--muted-foreground)"/><Tooltip/><Legend/><Bar dataKey="current" fill="#4f46e5" name="Current Stock" radius={[4,4,0,0]}/><Bar dataKey="recommended" fill="#10b981" name="Recommended" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="text-sm font-semibold">Forecast Details</h3>
          <div className="flex gap-2">
            <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} className="px-3 py-1.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option value="all">All Trends</option>
              <option value="up">Demand Up</option>
              <option value="down">Demand Down</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Category</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Stock</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Avg Sales</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Predicted</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Change</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Rec. Stock</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Confidence</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Trend</th>
            </tr></thead>
            <tbody>
              {filteredPredictions.map(dp => {
                const TIcon = dp.trend === "up" ? TrendingUp : dp.trend === "down" ? TrendingDown : Minus
                const tColor = dp.trend === "up" ? "text-emerald-600" : dp.trend === "down" ? "text-red-600" : "text-gray-500"
                const confColor = dp.confidence >= 85 ? "bg-emerald-500" : dp.confidence >= 70 ? "bg-amber-500" : "bg-red-500"
                return (
                  <tr key={dp.productId} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 font-medium text-foreground">{dp.productName}</td>
                    <td className="py-3 px-4 hidden sm:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{dp.category}</span></td>
                    <td className="py-3 px-4 text-right">{dp.currentStock}</td>
                    <td className="py-3 px-4 text-right text-[var(--muted-foreground)] hidden md:table-cell">{dp.avgMonthlySales}</td>
                    <td className="py-3 px-4 text-right font-semibold">{dp.predictedDemand}</td>
                    <td className="py-3 px-4 text-center"><span className={`text-xs font-bold ${tColor}`}>{dp.changePercent > 0 ? "+" : ""}{dp.changePercent}%</span></td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--primary)] hidden lg:table-cell">{dp.recommendedStock}</td>
                    <td className="py-3 px-4 hidden md:table-cell"><div className="flex items-center justify-center gap-2"><div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${confColor}`} style={{width:`${dp.confidence}%`}} /></div><span className="text-xs">{dp.confidence}%</span></div></td>
                    <td className="py-3 px-4 text-center"><TIcon className={`w-4 h-4 mx-auto ${tColor}`} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
