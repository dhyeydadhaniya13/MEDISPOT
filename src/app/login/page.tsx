"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/lib/toast"
import { Pill, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [email, setEmail] = useState("admin@medispot.in")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("medispot_authenticated")
      if (auth === "true") {
        router.push("/dashboard")
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast("error", "Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      if (email === "admin@medispot.in" && password === "admin123") {
        localStorage.setItem("medispot_authenticated", "true")
        toast("success", "Login Successful", "Welcome back to MediSpot ERP!")
        router.push("/dashboard")
      } else {
        toast("error", "Access Denied", "Invalid email or password. Hint: admin@medispot.in / admin123")
        setLoading(false)
      }
    }, 1200)
  }

  const inputCls = "w-full pl-10 pr-10 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all placeholder:text-[var(--sidebar-text-muted)]"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--primary)]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-bg text-white shadow-lg shadow-[var(--primary)]/20 mb-4">
            <Pill className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">MediSpot ERP</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">Enterprise CRM, Billing & Inventory Management</p>
        </div>

        <div className="glass-card p-8 border border-[var(--border)] shadow-xl bg-[var(--card)]/90">
          <h2 className="text-lg font-bold text-foreground mb-6">Sign In to Dashboard</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--sidebar-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@medispot.in"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--sidebar-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sidebar-text-muted)] hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]" />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 gradient-bg hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[var(--border)] text-xs text-center text-[var(--muted-foreground)]">
          <p className="font-semibold text-foreground mb-1">Demo Credentials</p>
          <p>Email: <span className="font-mono text-foreground font-medium">admin@medispot.in</span></p>
          <p>Password: <span className="font-mono text-foreground font-medium">admin123</span></p>
        </div>
      </div>
    </div>
  )
}
