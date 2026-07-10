"use client"

import { useState } from "react"
import { demandPredictions, productRecommendations, customers } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { Brain, TrendingUp, TrendingDown, Minus, Lightbulb, Users, Crown, Medal, Award } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const trendIcon: Record<string, React.ElementType> = { up: TrendingUp, down: TrendingDown, stable: Minus }
const trendColor: Record<string, string> = { up: "text-emerald-600", down: "text-red-600", stable: "text-gray-500" }

export default function AIInsightsPage() {
  const [tab, setTab] = useState<"demand" | "recommendations" | "segmentation">("demand")

  const goldCustomers = customers.filter(c => c.segment === "Gold")
  const silverCustomers = customers.filter(c => c.segment === "Silver")
  const bronzeCustomers = customers.filter(c => c.segment === "Bronze")
  const segmentData = [
    { name: "Gold", value: goldCustomers.length, color: "#f59e0b" },
    { name: "Silver", value: silverCustomers.length, color: "#94a3b8" },
    { name: "Bronze", value: bronzeCustomers.length, color: "#d97706" },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="w-6 h-6 text-[var(--primary)]" /> <span className="gradient-text">AI-Powered Insights</span></h1><p className="text-sm text-[var(--muted-foreground)]">Machine learning predictions for demand, recommendations & customer intelligence</p></div>

      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl w-fit">
        {([["demand","Demand Forecast"],["recommendations","Product Recommendations"],["segmentation","Customer Segmentation"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>{label}</button>
        ))}
      </div>

      {tab === "demand" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demandPredictions.map(dp => {
            const TIcon = trendIcon[dp.trend]
            const confColor = dp.confidence >= 85 ? "bg-emerald-500" : dp.confidence >= 70 ? "bg-amber-500" : "bg-red-500"
            const stockPct = Math.min((dp.currentStock / dp.recommendedStock) * 100, 100)
            return (
              <div key={dp.productId} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="font-semibold text-foreground">{dp.productName}</h3><span className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">{dp.category}</span></div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${trendColor[dp.trend]}`}><TIcon className="w-4 h-4" /> {dp.changePercent > 0 ? "+" : ""}{dp.changePercent}%</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-[var(--muted)] text-center"><p className="text-[10px] text-[var(--muted-foreground)]">Current</p><p className="text-sm font-bold">{dp.currentStock}</p></div>
                  <div className="p-2 rounded-lg bg-[var(--muted)] text-center"><p className="text-[10px] text-[var(--muted-foreground)]">Avg/Month</p><p className="text-sm font-bold">{dp.avgMonthlySales}</p></div>
                  <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-center"><p className="text-[10px] text-[var(--primary)]">Predicted</p><p className="text-sm font-bold text-[var(--primary)]">{dp.predictedDemand}</p></div>
                </div>
                <div className="mb-2"><div className="flex justify-between text-xs mb-1"><span className="text-[var(--muted-foreground)]">Stock vs Recommended</span><span className="font-medium">{dp.currentStock} / {dp.recommendedStock}</span></div><div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${stockPct < 50 ? "bg-red-500" : stockPct < 80 ? "bg-amber-500" : "bg-emerald-500"}`} style={{width:`${stockPct}%`}} /></div></div>
                <div className="flex items-center gap-2 mb-2"><div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${confColor}`} style={{width:`${dp.confidence}%`}} /></div><span className="text-xs text-[var(--muted-foreground)]">{dp.confidence}% confidence</span></div>
                <p className="text-xs text-[var(--muted-foreground)] italic">📊 {dp.seasonalFactor}</p>
              </div>
            )
          })}
        </div>
      )}

      {tab === "recommendations" && (
        <div className="space-y-4">
          {productRecommendations.map((pr, i) => (
            <div key={i} className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> When customer buys <span className="gradient-text">{pr.triggerProduct}</span></h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-4">Recommend these products based on purchase pattern analysis:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pr.recommendations.map((r, j) => (
                  <div key={j} className="p-4 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors">
                    <p className="text-sm font-semibold text-foreground">{r.productName}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{r.reason}</p>
                    <div className="flex items-center gap-2 mt-2"><div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-[var(--primary)] rounded-full" style={{width:`${r.confidence}%`}} /></div><span className="text-xs font-semibold">{r.confidence}%</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "segmentation" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { segment: "Gold", customers: goldCustomers, revenue: goldCustomers.reduce((s, c) => s + c.totalRevenue, 0), avgOrder: Math.round(goldCustomers.reduce((s, c) => s + c.avgOrderValue, 0) / (goldCustomers.length || 1)), icon: Crown, style: "segment-gold" },
              { segment: "Silver", customers: silverCustomers, revenue: silverCustomers.reduce((s, c) => s + c.totalRevenue, 0), avgOrder: Math.round(silverCustomers.reduce((s, c) => s + c.avgOrderValue, 0) / (silverCustomers.length || 1)), icon: Medal, style: "segment-silver" },
              { segment: "Bronze", customers: bronzeCustomers, revenue: bronzeCustomers.reduce((s, c) => s + c.totalRevenue, 0), avgOrder: Math.round(bronzeCustomers.reduce((s, c) => s + c.avgOrderValue, 0) / (bronzeCustomers.length || 1)), icon: Award, style: "segment-bronze" },
            ].map(seg => (
              <div key={seg.segment} className={`glass-card p-5 ${seg.style} text-white`}>
                <div className="flex items-center gap-2 mb-3"><seg.icon className="w-6 h-6" /><h3 className="text-lg font-bold">{seg.segment} Segment</h3></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="opacity-80">Customers</span><span className="font-bold">{seg.customers.length}</span></div>
                  <div className="flex justify-between"><span className="opacity-80">Total Revenue</span><span className="font-bold">{formatCurrency(seg.revenue)}</span></div>
                  <div className="flex justify-between"><span className="opacity-80">Avg Order Value</span><span className="font-bold">{formatCurrency(seg.avgOrder)}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Segment Distribution</h3>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={segmentData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} dataKey="value" label={({name, value}) => `${name}: ${value}`}>{segmentData.map((s, i) => <Cell key={i} fill={s.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            </div>
            <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Segmentation Criteria</h3>
              <div className="space-y-4">
                {[
                  { segment: "Gold", criteria: "Revenue > ₹10L OR Orders > 100", icon: Crown, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40" },
                  { segment: "Silver", criteria: "Revenue > ₹5L OR Orders > 50", icon: Medal, color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
                  { segment: "Bronze", criteria: "All other customers", icon: Award, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/40" },
                ].map(s => (
                  <div key={s.segment} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                    <div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
                    <div><p className="text-sm font-semibold text-foreground">{s.segment}</p><p className="text-xs text-[var(--muted-foreground)]">{s.criteria}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
