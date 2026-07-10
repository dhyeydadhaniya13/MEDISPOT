"use client"

import { useState } from "react"
import { salesTargets } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { Target, Building2, Users } from "lucide-react"

export default function TargetsPage() {
  const [tab, setTab] = useState<"branch" | "employee">("branch")

  const branchTargets = salesTargets.filter(t => t.type === "branch")
  const employeeTargets = salesTargets.filter(t => t.type === "employee")
  const active = tab === "branch" ? branchTargets : employeeTargets

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Target className="w-6 h-6 text-[var(--primary)]" /> Sales Targets</h1><p className="text-sm text-[var(--muted-foreground)]">Track branch and employee target progress</p></div>

      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl w-fit">
        <button onClick={() => setTab("branch")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${tab === "branch" ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}><Building2 className="w-4 h-4" /> Branch Targets</button>
        <button onClick={() => setTab("employee")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${tab === "employee" ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}><Users className="w-4 h-4" /> Employee Targets</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {active.map(t => {
          const pct = Math.min((t.achievedAmount / t.targetAmount) * 100, 100)
          const remaining = Math.max(t.targetAmount - t.achievedAmount, 0)
          const perf = pct >= 100 ? "On Track" : pct >= 75 ? "Behind" : "Critical"
          const perfColor = perf === "On Track" ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" : perf === "Behind" ? "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" : "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400"
          const ringColor = perf === "On Track" ? "#10b981" : perf === "Behind" ? "#f59e0b" : "#ef4444"

          const radius = 50; const circumference = 2 * Math.PI * radius; const offset = circumference - (pct / 100) * circumference

          return (
            <div key={t.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="font-semibold text-foreground">{t.targetName}</h3>{t.month && <p className="text-xs text-[var(--muted-foreground)]">{t.month}</p>}</div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${perfColor}`}>{perf}</span>
              </div>

              {/* Circular Progress */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <svg width="120" height="120" className="-rotate-90">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle cx="60" cy="60" r={radius} fill="none" stroke={ringColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{pct.toFixed(0)}%</span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">Achieved</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Target</p><p className="text-xs font-bold text-foreground">{formatCurrency(t.targetAmount)}</p></div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><p className="text-[10px] text-emerald-600">Achieved</p><p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(t.achievedAmount)}</p></div>
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20"><p className="text-[10px] text-red-600">Remaining</p><p className="text-xs font-bold text-red-700 dark:text-red-400">{formatCurrency(remaining)}</p></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
