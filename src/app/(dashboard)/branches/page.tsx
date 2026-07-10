"use client"

import { branches } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { Building2, Users, ShoppingCart, Package, MapPin, User } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function BranchesPage() {
  const branchTargets: Record<string, number> = { BR001: 5000000, BR002: 3500000, BR003: 3000000, BR004: 2200000, BR005: 1800000 }
  const totalRevenue = branches.reduce((s, b) => s + b.totalRevenue, 0)
  const totalOrders = branches.reduce((s, b) => s + b.totalOrders, 0)
  const totalEmployees = branches.reduce((s, b) => s + b.totalEmployees, 0)

  const chartData = branches.map(b => ({ name: b.name.replace(' Branch', '').replace(' Head Office', ' HQ'), revenue: b.totalRevenue, target: branchTargets[b.id] || b.totalRevenue * 1.2 }))
  const ranked = [...branches].sort((a, b) => b.totalRevenue - a.totalRevenue)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Building2 className="w-6 h-6 text-[var(--primary)]" /> Multi-Branch Management</h1><p className="text-sm text-[var(--muted-foreground)]">Head office & branch performance overview</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Branches", value: branches.length, icon: Building2, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Combined Revenue", value: formatCurrency(totalRevenue), icon: ShoppingCart, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Total Orders", value: totalOrders, icon: Package, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
          { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3"><div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div><div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map((b, i) => {
          const target = branchTargets[b.id] || b.totalRevenue * 1.2
          const achievement = ((b.totalRevenue / target) * 100).toFixed(0)
          const perf = Number(achievement) >= 100 ? "On Track" : Number(achievement) >= 80 ? "Behind" : "Critical"
          const perfColor = perf === "On Track" ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" : perf === "Behind" ? "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" : "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400"
          return (
            <div key={b.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-bold">{b.code}</div><div><h3 className="font-semibold text-foreground">{b.name}</h3><p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.city}, {b.state}</p></div></div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${perfColor}`}>{perf}</span>
              </div>
              <div className="flex items-center gap-2 mb-3 text-xs text-[var(--muted-foreground)]"><User className="w-3.5 h-3.5" /> <span>Manager: <strong className="text-foreground">{b.manager}</strong></span></div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Revenue</p><p className="text-sm font-bold text-foreground">{formatCurrency(b.totalRevenue)}</p></div>
                <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Orders</p><p className="text-sm font-bold text-foreground">{b.totalOrders}</p></div>
                <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Products</p><p className="text-sm font-bold text-foreground">{b.totalProducts}</p></div>
                <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Employees</p><p className="text-sm font-bold text-foreground">{b.totalEmployees}</p></div>
              </div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-[var(--muted-foreground)]">Target Achievement</span><span className="font-semibold">{achievement}%</span></div><div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${perf === "On Track" ? "bg-emerald-500" : perf === "Behind" ? "bg-amber-500" : "bg-red-500"}`} style={{width:`${Math.min(Number(achievement),100)}%`}} /></div></div>
            </div>
          )
        })}
      </div>

      <div className="glass-card p-5"><h3 className="text-sm font-semibold mb-4">Branch Comparison — Revenue vs Target</h3>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" tick={{fontSize:11}} stroke="var(--muted-foreground)"/><YAxis tick={{fontSize:12}} stroke="var(--muted-foreground)" tickFormatter={(v: number)=>`₹${(v/100000).toFixed(0)}L`}/><Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v]}/><Legend/><Bar dataKey="revenue" fill="#4f46e5" name="Revenue" radius={[4,4,0,0]}/><Bar dataKey="target" fill="#06b6d4" name="Target" radius={[4,4,0,0]} opacity={0.4}/></BarChart></ResponsiveContainer></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]"><h3 className="text-sm font-semibold">Performance Ranking</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Rank</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Branch</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Revenue</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Target</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Achievement</th>
            </tr></thead>
            <tbody>
              {ranked.map((b, i) => (
                <tr key={b.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-700" : i === 2 ? "bg-orange-100 text-orange-700" : "text-[var(--muted-foreground)]"}`}>{i+1}</span></td>
                  <td className="py-3 px-4 font-medium text-foreground">{b.name}</td>
                  <td className="py-3 px-4 text-right font-bold">{formatCurrency(b.totalRevenue)}</td>
                  <td className="py-3 px-4 text-right text-[var(--muted-foreground)] hidden sm:table-cell">{formatCurrency(branchTargets[b.id] || b.totalRevenue * 1.2)}</td>
                  <td className="py-3 px-4 text-right hidden md:table-cell"><span className={`font-bold ${(b.totalRevenue/(branchTargets[b.id] || b.totalRevenue * 1.2)*100)>=100?"text-emerald-600":"text-amber-600"}`}>{((b.totalRevenue/(branchTargets[b.id] || b.totalRevenue * 1.2))*100).toFixed(0)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
