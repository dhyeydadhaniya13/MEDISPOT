"use client"

import { useState } from "react"
import { monthlySalesData, categorySalesData, products, customers, orders, branches } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const COLORS = ["#4f46e5","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1"]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3"><p className="text-xs font-semibold text-foreground mb-1">{label}</p>{payload.map((p, i) => <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>)}</div>
}

export default function SalesPage() {
  const [period, setPeriod] = useState("Monthly")
  const [analysisTab, setAnalysisTab] = useState("product")

  const totalSales = monthlySalesData.reduce((s, d) => s + d.sales, 0)
  const totalTarget = monthlySalesData.reduce((s, d) => s + d.target, 0)
  const totalProfit = monthlySalesData.reduce((s, d) => s + d.profit, 0)
  const growth = 15.2

  const productSales = products.slice(0, 10).map(p => ({ name: p.name.length > 15 ? p.name.slice(0,15) + '…' : p.name, revenue: p.sellingPrice * p.currentStock, units: p.currentStock }))
    .sort((a, b) => b.revenue - a.revenue)
  const customerSales = customers.slice(0, 10).map(c => ({ name: c.name, revenue: c.totalRevenue, orders: c.totalOrders }))
    .sort((a, b) => b.revenue - a.revenue)
  const branchSales = branches.map(b => ({ name: b.name.replace(' Branch','').replace(' Head Office',' HQ'), revenue: b.totalRevenue, orders: b.totalOrders }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><TrendingUp className="w-6 h-6 text-[var(--primary)]" /> Sales Analytics</h1><p className="text-sm text-[var(--muted-foreground)]">Comprehensive sales performance analysis</p></div>

      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl w-fit">
        {["Daily","Weekly","Monthly","Quarterly","Annual"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>{p}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: formatCurrency(totalSales), trend: growth, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Total Orders", value: orders.length.toString(), trend: 8.5, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
          { label: "Avg Order Value", value: formatCurrency(totalSales / orders.length), trend: 5.2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Profit", value: formatCurrency(totalProfit), trend: 12.8, color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 ${s.color}`}>
            <p className="text-xs opacity-75">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${s.trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {s.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {Math.abs(s.trend)}%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Sales Trend</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlySalesData}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="var(--muted-foreground)"/><YAxis tick={{fontSize:12}} stroke="var(--muted-foreground)" tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/><Tooltip content={<CustomTooltip/>}/><Legend/><Area type="monotone" dataKey="sales" stroke="#4f46e5" fill="url(#sg)" strokeWidth={2} name="Sales"/><Area type="monotone" dataKey="target" stroke="#06b6d4" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Target"/></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Sales by Category</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="sales" nameKey="category" label={({ name, value }) => `${name} ${value}%`}>{categorySalesData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v]}/></PieChart></ResponsiveContainer></div>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-[var(--border)]">
          {[{key:"product",label:"By Product"},{key:"customer",label:"By Customer"},{key:"branch",label:"By Branch"}].map(t=>(
            <button key={t.key} onClick={()=>setAnalysisTab(t.key)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${analysisTab===t.key?"border-[var(--primary)] text-[var(--primary)]":"border-transparent text-[var(--muted-foreground)] hover:text-foreground"}`}>{t.label}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">#</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Name</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Revenue</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">{analysisTab === "product" ? "Units" : "Orders"}</th>
            </tr></thead>
            <tbody>
              {(analysisTab==="product"?productSales:analysisTab==="customer"?customerSales:branchSales).map((r,i)=>(
                <tr key={i} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">{i+1}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{r.name}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(r.revenue)}</td>
                  <td className="py-3 px-4 text-right text-[var(--muted-foreground)]">{"units" in r ? r.units : r.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
