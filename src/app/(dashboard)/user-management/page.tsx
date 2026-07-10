"use client"

import { useState } from "react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatDate } from "@/lib/utils"
import { UserCog, Plus, Shield, Check, Minus, X, Save } from "lucide-react"

const roleBadge: Record<string, string> = {
  "Super Admin": "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
  "Admin": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  "Branch Manager": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  "Sales Manager": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "Inventory Manager": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "Accountant": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  "Sales Executive": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
}

const modules = ["Dashboard", "Products", "Inventory", "Customers", "Billing", "Sales", "Reports", "AI Insights", "Branches", "Settings", "Users"]
const roles = ["Super Admin", "Admin", "Branch Manager", "Sales Manager", "Inventory Manager", "Accountant", "Sales Executive"]

const permMatrix: Record<string, boolean[]> = {
  "Super Admin":       [true, true, true, true, true, true, true, true, true, true, true],
  "Admin":             [true, true, true, true, true, true, true, true, true, true, false],
  "Branch Manager":    [true, true, true, true, true, true, true, true, false, false, false],
  "Sales Manager":     [true, true, false, true, true, true, true, false, false, false, false],
  "Inventory Manager": [true, true, true, false, false, false, true, false, false, false, false],
  "Accountant":        [true, false, false, false, true, true, true, false, false, false, false],
  "Sales Executive":   [true, true, false, true, true, true, false, false, false, false, false],
}

export default function UserManagementPage() {
  const { users, addUser, updateUser, deleteUser, logActivity } = useData()
  const { toast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null)
  
  const [form, setForm] = useState({
    name: "", email: "", role: "Sales Executive" as import("@/lib/types").UserRole, branchName: "Mumbai HQ", isActive: true
  })

  const handleOpenAdd = () => {
    setForm({ name: "", email: "", role: "Sales Executive" as import("@/lib/types").UserRole, branchName: "Mumbai HQ", isActive: true })
    setEditingUser(null)
    setShowAddModal(true)
  }

  const handleOpenEdit = (u: typeof users[0]) => {
    setEditingUser(u)
    setForm({ name: u.name, email: u.email, role: u.role, branchName: u.branchName, isActive: u.isActive })
    setShowAddModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) {
      toast("error", "Validation Error", "Name and email are required")
      return
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        branchName: form.branchName,
        isActive: form.isActive
      })
      logActivity({
        type: "alert",
        title: "User Updated",
        description: `Updated user details for ${form.name}`,
        user: "Rajesh Sharma",
        icon: "UserCog"
      })
      toast("success", "User Updated", `${form.name} details updated successfully.`)
    } else {
      // Check duplicate email
      if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
        toast("error", "Error", "Email already exists")
        return
      }
      const newUser = addUser({
        name: form.name,
        email: form.email,
        role: form.role,
        branchName: form.branchName,
        isActive: form.isActive,
        lastLogin: new Date().toISOString(),
        branchId: "BR001",
        phone: "",
        avatar: ""
      })
      logActivity({
        type: "alert",
        title: "New User Added",
        description: `Created user ${newUser.name} with role ${newUser.role}`,
        user: "Rajesh Sharma",
        icon: "UserPlus"
      })
      toast("success", "User Created", `${newUser.name} has been added successfully.`)
    }
    setShowAddModal(false)
  }

  const handleDelete = (u: typeof users[0]) => {
    if (window.confirm(`Are you sure you want to delete ${u.name}?`)) {
      deleteUser(u.id)
      logActivity({
        type: "alert",
        title: "User Deleted",
        description: `Deleted user ${u.name}`,
        user: "Rajesh Sharma",
        icon: "UserCog"
      })
      toast("success", "User Deleted", `${u.name} deleted successfully.`)
    }
  }

  const activeUsers = users.filter(u => u.isActive)
  const inactiveUsers = users.filter(u => !u.isActive)
  const uniqueRoles = new Set(users.map(u => u.role))
  const inputCls = "w-full px-3 py-2 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><UserCog className="w-6 h-6 text-[var(--primary)]" /> User & Role Management</h1><p className="text-sm text-[var(--muted-foreground)]">Manage users, roles, and permissions</p></div>
        <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> Add User</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Active", value: activeUsers.length, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Inactive", value: inactiveUsers.length, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Roles", value: uniqueRoles.size, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4"><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color.split(" ")[0]}`}>{s.value}</p></div>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]"><h3 className="text-sm font-semibold">All Users</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Email</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Role</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Branch</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Last Login</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] hidden md:table-cell">{u.email}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleBadge[u.role] || "bg-gray-100"}`}>{u.role}</span></td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] hidden lg:table-cell">{u.branchName}</td>
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${u.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-gray-400"}`} /> {u.isActive ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] text-xs hidden lg:table-cell">{formatDate(u.lastLogin)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(u)} className="text-sm text-[var(--primary)] hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(u)} className="text-sm text-[var(--destructive)] hover:underline font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[var(--primary)]" /> Role-Based Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b border-[var(--border)]"><th className="py-2 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Module</th>{roles.map(r => <th key={r} className="py-2 px-3 text-center text-xs font-semibold text-[var(--muted-foreground)] uppercase whitespace-nowrap">{r}</th>)}</tr></thead>
            <tbody>
              {modules.map((m, idx) => (
                <tr key={m} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5 px-3 font-medium text-foreground">{m}</td>
                  {roles.map(r => {
                    const hasPerm = permMatrix[r]?.[idx]
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <div className="flex justify-center">
                          {hasPerm ? <Check className="w-4 h-4 text-emerald-500" /> : <Minus className="w-4 h-4 text-gray-300 dark:text-gray-700" />}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingUser ? "Edit User" : "Add User"}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="User's full name" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="user@medispot.in" disabled={!!editingUser} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as import("@/lib/types").UserRole }))} className={inputCls}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Branch</label>
              <select value={form.branchName} onChange={e => setForm(p => ({ ...p, branchName: e.target.value }))} className={inputCls}>
                <option>Mumbai HQ</option>
                <option>Delhi Branch</option>
                <option>Bangalore Branch</option>
                <option>Chennai Branch</option>
                <option>Kolkata Branch</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]">
              <div>
                <p className="text-sm font-semibold">Active Status</p>
                <p className="text-xs text-[var(--muted-foreground)]">Enable/disable user login access</p>
              </div>
              <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
