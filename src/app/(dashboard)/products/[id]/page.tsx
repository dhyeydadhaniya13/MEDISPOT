"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { products } from "@/lib/data"
import { formatCurrency, formatDate, getStockStatus, getExpiryStatus, daysUntilExpiry } from "@/lib/utils"
import { ArrowLeft, Package, Tag, Factory, Hash, Calendar, BarChart3, IndianRupee, AlertTriangle } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const product = products.find(p => p.id === params.id)

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h2 className="text-xl font-bold text-foreground">Product Not Found</h2>
          <Link href="/products" className="text-[var(--primary)] text-sm mt-2 inline-block">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus(product.currentStock, product.minimumStock)
  const expiryStatus = getExpiryStatus(product.expiryDate)
  const daysLeft = daysUntilExpiry(product.expiryDate)
  const margin = ((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)
  const stockPercent = Math.min((product.currentStock / (product.minimumStock * 3)) * 100, 100)

  const stockColors: Record<string, string> = { surplus: "bg-emerald-500", adequate: "bg-blue-500", low: "bg-amber-500", critical: "bg-red-500", out: "bg-gray-400" }
  const statusBadge: Record<string, string> = {
    surplus: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400",
    adequate: "text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400",
    low: "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
    critical: "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400",
    out: "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/products" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{product.genericName} • {product.manufacturer}</p>
        </div>
        <span className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="w-full h-48 rounded-xl gradient-bg flex items-center justify-center text-white text-5xl font-bold mb-4">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${statusBadge[stockStatus]}`}>{stockStatus}</span>
              {daysLeft <= 90 && daysLeft > 0 && <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Expiring Soon</span>}
              {daysLeft <= 0 && <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">EXPIRED</span>}
            </div>
            {/* Stock Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--muted-foreground)]">Stock Level</span>
                <span className="font-semibold">{product.currentStock} / {product.minimumStock * 3}</span>
              </div>
              <div className="w-full h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${stockColors[stockStatus]}`} style={{ width: `${stockPercent}%` }} />
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Minimum stock: {product.minimumStock} units</p>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-[var(--primary)]" /> Basic Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Product Name", value: product.name },
                { label: "Generic Name", value: product.genericName },
                { label: "Brand", value: product.brandName },
                { label: "Manufacturer", value: product.manufacturer },
                { label: "Category", value: product.category },
                { label: "HSN Code", value: product.hsnCode },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-[var(--muted-foreground)]">{f.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-emerald-600" /> Pricing Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Purchase Price", value: formatCurrency(product.purchasePrice) },
                { label: "Selling Price", value: formatCurrency(product.sellingPrice) },
                { label: "MRP", value: formatCurrency(product.mrp) },
                { label: "Margin", value: `${margin}%` },
                { label: "GST", value: `${product.gstPercent}%` },
              ].map(f => (
                <div key={f.label} className="p-3 rounded-lg bg-[var(--muted)]">
                  <p className="text-xs text-[var(--muted-foreground)]">{f.label}</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-600" /> Stock & Batch Info</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Current Stock", value: `${product.currentStock} units` },
                { label: "Minimum Stock", value: `${product.minimumStock} units` },
                { label: "Batch Number", value: product.batchNumber },
                { label: "Stock Status", value: stockStatus.toUpperCase() },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-[var(--muted-foreground)]">{f.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-600" /> Dates</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Manufacturing Date</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(product.manufacturingDate)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Expiry Date</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(product.expiryDate)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Days Until Expiry</p>
                <p className={`text-sm font-bold mt-0.5 ${daysLeft <= 30 ? "text-red-600" : daysLeft <= 90 ? "text-amber-600" : "text-emerald-600"}`}>
                  {daysLeft <= 0 ? "EXPIRED" : `${daysLeft} days`}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-amber-600" /> Identification Codes</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Product Code", value: product.code },
                { label: "Agency Code", value: product.agencyCode },
                { label: "HSN Code", value: product.hsnCode },
              ].map(f => (
                <div key={f.label} className="p-3 rounded-lg bg-[var(--muted)]">
                  <p className="text-xs text-[var(--muted-foreground)]">{f.label}</p>
                  <p className="text-sm font-mono font-bold text-foreground mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
