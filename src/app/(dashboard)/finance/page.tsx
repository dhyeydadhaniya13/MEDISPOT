"use client"

import { customers, distributors, annualRevenueData, invoices } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, CreditCard, Receipt, AlertCircle } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3"><p className="text-xs font-semibold mb-1">{label}</p>{payload.map((p, i) => <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>)}</div>
}

export default function FinancePage() {
  const totalRevenue = annualRevenueData.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = annualRevenueData.reduce((s, d) => s + (d.revenue - d.profit), 0)
  const totalProfit = annualRevenueData.reduce((s, d) => s + d.profit, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  const totalReceivable = customers.reduce((s, c) => s + c.outstandingAmount, 0)
  const totalPayable = distributors.reduce((s, d) => s + d.outstandingAmount, 0)

  const totalGSTCollected = invoices.reduce((s, i) => s + i.gstAmount, 0)
  const gstPaid = totalGSTCollected * 0.6
  const netGST = totalGSTCollected - gstPaid

  const profitData = annualRevenueData.map(d => ({ year: d.year, profit: d.profit, margin: ((d.profit / d.revenue) * 100).toFixed(1) }))

  const agingData = [
    { range: "0-30 Days", amount: totalReceivable * 0.4, count: 6, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
    { range: "30-60 Days", amount: totalReceivable * 0.3, count: 4, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { range: "60-90 Days", amount: totalReceivable * 0.2, count: 3, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
    { range: "90+ Days", amount: totalReceivable * 0.1, count: 2, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
  ]

  const outstandingCustomers = customers.filter(c => c.outstandingAmount > 0).sort((a, b) => b.outstandingAmount - a.outstandingAmount)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Wallet className="w-6 h-6 text-[var(--primary)]" /> Financial Dashboard</h1><p className="text-sm text-[var(--muted-foreground)]">Revenue, expenses, profit, receivables & payables</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: TrendingDown, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Net Profit", value: formatCurrency(totalProfit), icon: ArrowUpRight, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Profit Margin", value: `${profitMargin}%`, icon: Wallet, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3"><div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div><div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Revenue vs Expenses</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={annualRevenueData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="year" tick={{fontSize:12}} stroke="var(--muted-foreground)"/><YAxis tick={{fontSize:12}} stroke="var(--muted-foreground)" tickFormatter={v=>`₹${(v/10000000).toFixed(1)}Cr`}/><Tooltip content={<CustomTooltip/>}/><Legend/><Bar dataKey="revenue" fill="#4f46e5" name="Revenue" radius={[4,4,0,0]}/><Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
        </div>
        <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Profit Trend</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={profitData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="year" tick={{fontSize:12}} stroke="var(--muted-foreground)"/><YAxis tick={{fontSize:12}} stroke="var(--muted-foreground)" tickFormatter={v=>`₹${(v/10000000).toFixed(1)}Cr`}/><Tooltip content={<CustomTooltip/>}/><Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{r:5}} name="Profit"/></LineChart></ResponsiveContainer></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receivables */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-amber-500" /> Receivables Aging</h3>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4"><p className="text-xs text-amber-600">Total Receivable</p><p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(totalReceivable)}</p></div>
          <div className="space-y-2">
            {agingData.map(a => (
              <div key={a.range} className={`flex items-center justify-between p-3 rounded-lg ${a.color}`}>
                <div><p className="text-sm font-semibold">{a.range}</p><p className="text-xs opacity-75">{a.count} customers</p></div>
                <p className="text-sm font-bold">{formatCurrency(a.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payables */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> Payables</h3>
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4"><p className="text-xs text-red-600">Total Payable</p><p className="text-2xl font-bold text-red-700 dark:text-red-400">{formatCurrency(totalPayable)}</p></div>
          <div className="space-y-2">
            {distributors.filter(d => d.outstandingAmount > 0).sort((a,b)=>b.outstandingAmount-a.outstandingAmount).slice(0,5).map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]">
                <p className="text-sm font-medium text-foreground truncate flex-1">{d.name}</p>
                <p className="text-sm font-bold text-red-600 ml-2">{formatCurrency(d.outstandingAmount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GST Summary */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-violet-500" /> GST Summary</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"><p className="text-xs text-emerald-600">GST Collected</p><p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(totalGSTCollected)}</p></div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"><p className="text-xs text-blue-600">GST Paid (Input Credit)</p><p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(gstPaid)}</p></div>
            <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"><p className="text-xs text-violet-600">Net GST Liability</p><p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{formatCurrency(netGST)}</p></div>
          </div>
        </div>
      </div>

      {/* Outstanding Payments Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]"><h3 className="text-sm font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Outstanding Payments</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Store</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Outstanding</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Credit Limit</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Utilization</th>
            </tr></thead>
            <tbody>
              {outstandingCustomers.map(c => {
                const util = ((c.outstandingAmount / c.creditLimit) * 100).toFixed(0)
                return (
                  <tr key={c.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 font-medium text-foreground">{c.name}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)] hidden sm:table-cell">{c.storeName}</td>
                    <td className="py-3 px-4 text-right font-bold text-red-600">{formatCurrency(c.outstandingAmount)}</td>
                    <td className="py-3 px-4 text-right text-[var(--muted-foreground)] hidden md:table-cell">{formatCurrency(c.creditLimit)}</td>
                    <td className="py-3 px-4 text-center hidden md:table-cell"><div className="flex items-center justify-center gap-2"><div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${Number(util) > 80 ? "bg-red-500" : Number(util) > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{width:`${Math.min(Number(util),100)}%`}} /></div><span className="text-xs">{util}%</span></div></td>
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
