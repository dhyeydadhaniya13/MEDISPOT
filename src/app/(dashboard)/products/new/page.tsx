"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { ProductCategory } from "@/lib/types"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"

const categories: ProductCategory[] = ["Tablets","Capsules","Syrups","Injections","Ointments","Drops","Surgical Products","Ayurvedic Products","Nutraceuticals","Medical Devices"]
const gstRates = [0, 5, 12, 18, 28]

export default function NewProductPage() {
  const { addProduct, logActivity } = useData()
  const { toast } = useToast()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "", genericName: "", brandName: "", manufacturer: "", category: "Tablets" as ProductCategory,
    code: "PRD0000", agencyCode: "", hsnCode: "3004", batchNumber: "",
    purchasePrice: "", sellingPrice: "", mrp: "", gstPercent: "12",
    currentStock: "", minimumStock: "",
    manufacturingDate: "", expiryDate: "",
  })

  // Generate random product code on client only to avoid SSR hydration mismatch
  useEffect(() => {
    setForm(prev => ({ ...prev, code: `PRD${Math.random().toString(36).substring(2,6).toUpperCase()}` }))
  }, [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n })
  }

  const margin = form.purchasePrice && form.sellingPrice
    ? (((parseFloat(form.sellingPrice) - parseFloat(form.purchasePrice)) / parseFloat(form.purchasePrice)) * 100).toFixed(1)
    : "0.0"

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = "Product name is required"
    if (!form.agencyCode) newErrors.agencyCode = "Agency code is required"
    if (!form.purchasePrice) newErrors.purchasePrice = "Required"
    if (!form.sellingPrice) newErrors.sellingPrice = "Required"
    if (!form.mrp) newErrors.mrp = "Required"
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setSaving(true)

    const newProduct = addProduct({
      name: form.name,
      genericName: form.genericName,
      brandName: form.brandName,
      manufacturer: form.manufacturer,
      category: form.category,
      code: form.code,
      agencyCode: form.agencyCode,
      hsnCode: form.hsnCode,
      batchNumber: form.batchNumber,
      purchasePrice: parseFloat(form.purchasePrice),
      sellingPrice: parseFloat(form.sellingPrice),
      mrp: parseFloat(form.mrp),
      gstPercent: parseInt(form.gstPercent),
      currentStock: parseInt(form.currentStock) || 0,
      minimumStock: parseInt(form.minimumStock) || 0,
      manufacturingDate: form.manufacturingDate,
      expiryDate: form.expiryDate,
      image: "",
      branchId: "BR001",
    })

    logActivity({
      type: "stock",
      title: "New Product Added",
      description: `Added product: ${newProduct.name} (${newProduct.code})`,
      user: "Admin",
      icon: "📦",
    })

    toast("success", "Product Created", `${newProduct.name} has been added to the catalog.`)
    router.push("/products")
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 bg-[var(--muted)] border ${errors[field] ? "border-red-500 ring-2 ring-red-200" : "border-transparent"} rounded-lg text-sm focus:ring-2 focus:ring-[var(--ring)] outline-none transition-all`

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/products" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Plus className="w-6 h-6 text-[var(--primary)]" /> Add New Product</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Fill in the product details below</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Product Name *</label><input value={form.name} onChange={e => handleChange("name", e.target.value)} className={inputClass("name")} placeholder="e.g. Dolo 650" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Generic Name</label><input value={form.genericName} onChange={e => handleChange("genericName", e.target.value)} className={inputClass("genericName")} placeholder="e.g. Paracetamol 650mg" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Brand Name</label><input value={form.brandName} onChange={e => handleChange("brandName", e.target.value)} className={inputClass("brandName")} placeholder="e.g. Dolo" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Manufacturer</label><input value={form.manufacturer} onChange={e => handleChange("manufacturer", e.target.value)} className={inputClass("manufacturer")} placeholder="e.g. Micro Labs Ltd" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Category</label><select value={form.category} onChange={e => handleChange("category", e.target.value)} className={inputClass("category")}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Identification Codes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Product Code</label><input value={form.code} readOnly className={`${inputClass("code")} opacity-60`} /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Agency Code *</label><input value={form.agencyCode} onChange={e => handleChange("agencyCode", e.target.value)} className={inputClass("agencyCode")} placeholder="AG-XXX" />{errors.agencyCode && <p className="text-xs text-red-500 mt-1">{errors.agencyCode}</p>}</div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">HSN Code</label><input value={form.hsnCode} onChange={e => handleChange("hsnCode", e.target.value)} className={inputClass("hsnCode")} /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Batch Number</label><input value={form.batchNumber} onChange={e => handleChange("batchNumber", e.target.value)} className={inputClass("batchNumber")} placeholder="BT2024XXXX" /></div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Purchase Price *</label><input type="number" value={form.purchasePrice} onChange={e => handleChange("purchasePrice", e.target.value)} className={inputClass("purchasePrice")} placeholder="₹0.00" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Selling Price *</label><input type="number" value={form.sellingPrice} onChange={e => handleChange("sellingPrice", e.target.value)} className={inputClass("sellingPrice")} placeholder="₹0.00" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">MRP *</label><input type="number" value={form.mrp} onChange={e => handleChange("mrp", e.target.value)} className={inputClass("mrp")} placeholder="₹0.00" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">GST %</label><select value={form.gstPercent} onChange={e => handleChange("gstPercent", e.target.value)} className={inputClass("gstPercent")}>{gstRates.map(r => <option key={r} value={r}>{r}%</option>)}</select></div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex flex-col justify-center"><p className="text-xs text-emerald-600 dark:text-emerald-400">Margin</p><p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{margin}%</p></div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Stock & Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Current Stock</label><input type="number" value={form.currentStock} onChange={e => handleChange("currentStock", e.target.value)} className={inputClass("currentStock")} placeholder="0" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Minimum Stock Limit</label><input type="number" value={form.minimumStock} onChange={e => handleChange("minimumStock", e.target.value)} className={inputClass("minimumStock")} placeholder="0" /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Manufacturing Date</label><input type="date" value={form.manufacturingDate} onChange={e => handleChange("manufacturingDate", e.target.value)} className={inputClass("manufacturingDate")} /></div>
          <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Expiry Date</label><input type="date" value={form.expiryDate} onChange={e => handleChange("expiryDate", e.target.value)} className={inputClass("expiryDate")} /></div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/products" className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-colors">Cancel</Link>
        <button onClick={handleSubmit} disabled={saving} className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-md flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  )
}
