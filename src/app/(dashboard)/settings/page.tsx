"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/lib/toast"
import { Settings as SettingsIcon, Building2, Palette, Bell, Monitor, Sun, Moon, Save, Database, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [tab, setTab] = useState<"company" | "appearance" | "notifications" | "system">("company")
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({ email: true, sms: false, lowStock: true, expiry: true, payments: true, orders: true })
  const [company, setCompany] = useState({
    name: 'MediSpot Pharma Pvt. Ltd.', gst: '27AABCM1234A1Z5', drugLicense: 'MH-WS-000001', pan: 'AABCM1234A',
    address: '123 Nariman Point, Mumbai - 400021, Maharashtra', phone: '+91 98765 43210', email: 'admin@medispot.in', website: 'www.medispot.in'
  })
  const [primaryColor, setPrimaryColor] = useState('#4f46e5')

  const inputCls = "w-full px-3 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"

  const handleSave = () => {
    toast("success", "Settings Saved", "Your changes have been saved successfully")
  }

  const handleBackup = () => {
    // Export all localStorage data as JSON backup
    const backup: Record<string, string | null> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("medispot_")) backup[key] = localStorage.getItem(key)
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `medispot_backup_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(link.href)
    toast("success", "Backup Complete", "Database backup downloaded successfully")
  }

  const handleClearCache = () => {
    if (window.confirm("Are you sure? This will reset all data to defaults.")) {
      Object.keys(localStorage).filter(k => k.startsWith("medispot_")).forEach(k => localStorage.removeItem(k))
      toast("success", "Cache Cleared", "Application data has been reset. Refresh the page to see changes.")
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-[var(--primary)]" /> Settings</h1><p className="text-sm text-[var(--muted-foreground)]">Configure your application preferences</p></div>

      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl overflow-x-auto">
        {([["company","Company Profile",Building2],["appearance","Appearance",Palette],["notifications","Notifications",Bell],["system","System",Monitor]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all ${tab === key ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}><Icon className="w-4 h-4" /> {label}</button>
        ))}
      </div>

      {tab === "company" && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-semibold">Company Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Company Name</label><input value={company.name} onChange={e => setCompany(prev => ({...prev, name: e.target.value}))} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">GST Number</label><input value={company.gst} onChange={e => setCompany(prev => ({...prev, gst: e.target.value}))} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Drug License</label><input value={company.drugLicense} onChange={e => setCompany(prev => ({...prev, drugLicense: e.target.value}))} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">PAN Number</label><input value={company.pan} onChange={e => setCompany(prev => ({...prev, pan: e.target.value}))} className={inputCls} /></div>
            <div className="md:col-span-2"><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Address</label><textarea value={company.address} onChange={e => setCompany(prev => ({...prev, address: e.target.value}))} className={`${inputCls} h-20 resize-none`} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Phone</label><input value={company.phone} onChange={e => setCompany(prev => ({...prev, phone: e.target.value}))} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Email</label><input value={company.email} onChange={e => setCompany(prev => ({...prev, email: e.target.value}))} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Website</label><input value={company.website} onChange={e => setCompany(prev => ({...prev, website: e.target.value}))} className={inputCls} /></div>
          </div>
          <div className="flex justify-end"><button onClick={handleSave} className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90"><Save className="w-4 h-4" /> Save Changes</button></div>
        </div>
      )}

      {tab === "appearance" && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-semibold">Theme & Appearance</h3>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-3">Theme Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ key: "light", label: "Light", icon: Sun, preview: "bg-white border-gray-200" }, { key: "dark", label: "Dark", icon: Moon, preview: "bg-gray-900 border-gray-700" }, { key: "system", label: "System", icon: Monitor, preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" }].map(t => (
                <button key={t.key} onClick={() => { setTheme(t.key); toast("info", "Theme Changed", `Switched to ${t.label} mode`) }} className={`p-4 rounded-xl border-2 transition-all ${theme === t.key ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"}`}>
                  <div className={`w-full h-16 rounded-lg mb-2 border ${t.preview}`} />
                  <div className="flex items-center gap-2"><t.icon className="w-4 h-4" /><span className="text-sm font-medium">{t.label}</span></div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-3">Primary Color</label>
            <div className="flex gap-3">
              {["#4f46e5","#06b6d4","#10b981","#8b5cf6","#f59e0b","#ef4444","#ec4899"].map(c => (
                <button key={c} onClick={() => { setPrimaryColor(c); toast("info", "Color Updated") }} className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${primaryColor === c ? 'border-foreground ring-2 ring-foreground/20' : 'border-transparent'}`} style={{backgroundColor: c}} />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-semibold">Notification Preferences</h3>
          <div className="space-y-4">
            {([
              { key: "email" as const, label: "Email Notifications", desc: "Receive email for important updates" },
              { key: "sms" as const, label: "SMS Alerts", desc: "Get SMS for critical alerts" },
              { key: "lowStock" as const, label: "Low Stock Alerts", desc: "Alert when products reach minimum stock" },
              { key: "expiry" as const, label: "Expiry Reminders", desc: "Notify about products nearing expiry" },
              { key: "payments" as const, label: "Payment Reminders", desc: "Remind about pending payments" },
              { key: "orders" as const, label: "Order Updates", desc: "Notifications for new orders and status changes" },
            ]).map(n => (
              <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]">
                <div><p className="text-sm font-medium text-foreground">{n.label}</p><p className="text-xs text-[var(--muted-foreground)]">{n.desc}</p></div>
                <button onClick={() => { setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] })); toast("info", `${n.label} ${notifications[n.key] ? "disabled" : "enabled"}`) }} className={`relative w-12 h-6 rounded-full transition-colors ${notifications[n.key] ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications[n.key] ? "translate-x-6" : ""}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end"><button onClick={handleSave} className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90"><Save className="w-4 h-4" /> Save Preferences</button></div>
        </div>
      )}

      {tab === "system" && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-semibold">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]">
              <div><p className="text-sm font-medium text-foreground">Backup Data</p><p className="text-xs text-[var(--muted-foreground)]">Download a full backup of all application data</p></div>
              <button onClick={handleBackup} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--card)] transition-colors flex items-center gap-2"><Database className="w-4 h-4" /> Backup Now</button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]">
              <div><p className="text-sm font-medium text-foreground">Clear Cache & Reset Data</p><p className="text-xs text-[var(--muted-foreground)]">Reset all data to factory defaults</p></div>
              <button onClick={handleClearCache} className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> Reset Data</button>
            </div>
            <div className="p-4 rounded-xl bg-[var(--muted)]">
              <p className="text-sm font-medium text-foreground">About MediSpot</p>
              <div className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
                <p>Version: 1.0.0</p><p>Platform: Next.js 16 + TypeScript</p><p>License: Enterprise</p>
                <p>© 2026 MediSpot Pharma Pvt. Ltd. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
