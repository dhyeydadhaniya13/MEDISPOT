"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency, formatDate, getStockStatus } from "@/lib/utils"
import { Package, Search, Plus, Edit, Trash2, X, Save } from "lucide-react"
import { ProductCategory } from "@/lib/types"

const categories: ProductCategory[] = ["Tablets","Capsules","Syrups","Injections","Ointments","Drops","Surgical Products","Ayurvedic Products","Nutraceuticals","Medical Devices"]

export default function ProductsPage() {
  const { products, updateProduct, deleteProduct } = useData()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")
  const [editProduct, setEditProduct] = useState<typeof products[0] | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let list = products
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.manufacturer.toLowerCase().includes(search.toLowerCase()))
    if (catFilter !== "All") list = list.filter(p => p.category === catFilter)
    if (stockFilter === "Low") list = list.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0)
    if (stockFilter === "Out") list = list.filter(p => p.currentStock === 0)
    if (stockFilter === "Adequate") list = list.filter(p => p.currentStock > p.minimumStock)
    return list
  }, [products, search, catFilter, stockFilter])

  const openEdit = (p: typeof products[0]) => {
    setEditProduct(p)
    setEditForm({ name: p.name, sellingPrice: String(p.sellingPrice), purchasePrice: String(p.purchasePrice), mrp: String(p.mrp), minimumStock: String(p.minimumStock), currentStock: String(p.currentStock) })
  }

  const saveEdit = () => {
    if (!editProduct) return
    updateProduct(editProduct.id, {
      name: editForm.name, sellingPrice: parseFloat(editForm.sellingPrice), purchasePrice: parseFloat(editForm.purchasePrice),
      mrp: parseFloat(editForm.mrp), minimumStock: parseInt(editForm.minimumStock), currentStock: parseInt(editForm.currentStock),
    })
    toast("success", "Product Updated", `${editForm.name} has been updated`)
    setEditProduct(null)
  }

  const handleDelete = (p: typeof products[0]) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      deleteProduct(p.id)
      toast("success", "Product Deleted", `${p.name} has been removed`)
    }
  }

  const inputCls = "w-full px-3 py-2 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Package className="w-6 h-6 text-[var(--primary)]" /> Products</h1><p className="text-sm text-[var(--muted-foreground)]">{products.length} products · {products.filter(p => p.currentStock <= p.minimumStock).length} low stock</p></div>
        <Link href="/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> Add Product</Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className={`${inputCls} pl-10`} /></div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className={`${inputCls} sm:w-44`}><option value="All">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className={`${inputCls} sm:w-36`}><option value="All">All Stock</option><option value="Low">Low Stock</option><option value="Out">Out of Stock</option><option value="Adequate">Adequate</option></select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Code</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Category</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Price</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Stock</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => {
                const status = getStockStatus(p.currentStock, p.minimumStock)
                const statusColors: Record<string, string> = { out: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", low: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", adequate: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", surplus: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" }
                return (
                  <tr key={p.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4"><Link href={`/products/${p.id}`} className="hover:text-[var(--primary)]"><p className="font-medium text-foreground">{p.name}</p><p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</p></Link></td>
                    <td className="py-3 px-4 hidden md:table-cell text-[var(--muted-foreground)]">{p.code}</td>
                    <td className="py-3 px-4 hidden lg:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">{p.category}</span></td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(p.sellingPrice)}</td>
                    <td className="py-3 px-4 text-right font-medium">{p.currentStock}</td>
                    <td className="py-3 px-4 text-center hidden sm:table-cell"><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColors[status]}`}>{status.toUpperCase()}</span></td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-[var(--muted-foreground)]">No products found</div>}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditProduct(null)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold">Edit Product</h3><button onClick={() => setEditProduct(null)} className="p-1 rounded-lg hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Name</label><input value={editForm.name || ""} onChange={e => setEditForm(prev => ({...prev, name: e.target.value}))} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Purchase Price</label><input type="number" value={editForm.purchasePrice || ""} onChange={e => setEditForm(prev => ({...prev, purchasePrice: e.target.value}))} className={inputCls} /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Selling Price</label><input type="number" value={editForm.sellingPrice || ""} onChange={e => setEditForm(prev => ({...prev, sellingPrice: e.target.value}))} className={inputCls} /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">MRP</label><input type="number" value={editForm.mrp || ""} onChange={e => setEditForm(prev => ({...prev, mrp: e.target.value}))} className={inputCls} /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Current Stock</label><input type="number" value={editForm.currentStock || ""} onChange={e => setEditForm(prev => ({...prev, currentStock: e.target.value}))} className={inputCls} /></div>
            </div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Minimum Stock</label><input type="number" value={editForm.minimumStock || ""} onChange={e => setEditForm(prev => ({...prev, minimumStock: e.target.value}))} className={inputCls} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
