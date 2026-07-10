"use client"

import { useState, useMemo } from "react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { exportReport } from "@/lib/export"
import { ClipboardList, TrendingUp, Warehouse, Clock, Users, Truck, Receipt, Wallet, ShoppingBag, Building2, Download, FileSpreadsheet, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

const reportCategories = [
  { title: "Sales Reports", description: "Daily, weekly, monthly sales summaries", icon: TrendingUp, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
  { title: "Inventory Reports", description: "Stock levels, valuations, movements", icon: Warehouse, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
  { title: "Expiry Reports", description: "Expiring products, risk analysis", icon: Clock, color: "text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400" },
  { title: "Customer Reports", description: "Customer analytics, segmentation", icon: Users, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
  { title: "Distributor Reports", description: "Supplier performance, purchases", icon: Truck, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
  { title: "GST Reports", description: "GSTR-1, GSTR-3B, Input/Output", icon: Receipt, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
  { title: "Financial Reports", description: "P&L, Balance Sheet, Cash Flow", icon: Wallet, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
  { title: "Purchase Reports", description: "Purchase orders, supplier invoices", icon: ShoppingBag, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
  { title: "Branch Reports", description: "Branch-wise performance comparison", icon: Building2, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
]

export default function ReportsPage() {
  const { products, customers, distributors, orders, invoices, purchaseOrders } = useData()
  const { toast } = useToast()
  
  const [selected, setSelected] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">("PDF")

  // Generate dynamic data depending on selected category
  const reportData = useMemo(() => {
    if (!selected) return { columns: [], rows: [], previewRows: [] }

    let columns: string[] = []
    let rows: (string | number)[][] = []

    if (selected === "Sales Reports") {
      columns = ["Order Number", "Customer Name", "Date", "Total", "Status"]
      let filteredOrders = [...orders]
      if (fromDate) filteredOrders = filteredOrders.filter(o => o.date >= fromDate)
      if (toDate) filteredOrders = filteredOrders.filter(o => o.date <= toDate)
      rows = filteredOrders.map(o => [o.orderNumber, o.customerName, formatDate(o.date), formatCurrency(o.total), o.status])
    } else if (selected === "Inventory Reports") {
      columns = ["Product Code", "Product Name", "Category", "Price", "Current Stock", "Min Stock"]
      rows = products.map(p => [p.code, p.name, p.category, formatCurrency(p.sellingPrice), p.currentStock, p.minimumStock])
    } else if (selected === "Expiry Reports") {
      columns = ["Product Name", "Batch Number", "Expiry Date", "Current Stock", "Days Left"]
      const now = new Date()
      rows = products.map(p => {
        const days = Math.ceil((new Date(p.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return [p.name, p.batchNumber || "N/A", formatDate(p.expiryDate), p.currentStock, days]
      })
    } else if (selected === "Customer Reports") {
      columns = ["Customer Name", "Store Name", "Phone", "Segment", "Total Revenue", "Outstanding"]
      rows = customers.map(c => [c.name, c.storeName, c.phone, c.segment, formatCurrency(c.totalRevenue), formatCurrency(c.outstandingAmount)])
    } else if (selected === "Distributor Reports") {
      columns = ["Supplier Name", "Contact Person", "Phone", "Rating", "Total Purchases"]
      rows = distributors.map(d => [d.name, d.contactPerson, d.phone, d.rating, formatCurrency(d.totalPurchases)])
    } else if (selected === "Purchase Reports") {
      columns = ["PO Number", "Supplier Name", "Date", "Expected Delivery", "Total Amount", "Status"]
      rows = purchaseOrders.map(po => [po.poNumber, po.distributorName, formatDate(po.date), formatDate(po.expectedDelivery), formatCurrency(po.total), po.status])
    } else {
      // Fallback
      columns = ["Item", "Category", "Date", "Amount", "Status"]
      rows = [
        ["GST Quarterly Return", "Tax", "2026-06-30", "₹1,24,500", "Submitted"],
        ["Input Tax Credit Summary", "Tax", "2026-06-15", "₹85,200", "Processed"],
        ["General Ledger Audit", "Financial", "2026-06-10", "₹4,50,000", "Verified"],
      ]
    }

    return {
      columns,
      rows,
      previewRows: rows.slice(0, 5) // Show top 5 in preview table
    }
  }, [selected, orders, products, customers, distributors, purchaseOrders, fromDate, toDate])

  const handleExport = () => {
    if (!selected) return
    if (reportData.rows.length === 0) {
      toast("warning", "No Data", "There is no data to export in the selected range")
      return
    }
    exportReport(format, selected, reportData.columns, reportData.rows)
    toast("success", "Export Complete", `${selected} successfully downloaded in ${format} format.`)
  }

  const inputCls = "w-full px-3 py-2 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ClipboardList className="w-6 h-6 text-[var(--primary)]" /> Reports Hub</h1><p className="text-sm text-[var(--muted-foreground)]">Generate and export business reports</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCategories.map(r => (
          <div key={r.title} onClick={() => setSelected(selected === r.title ? null : r.title)} className={`cursor-pointer glass-card p-5 text-left hover:shadow-lg transition-all group ${selected === r.title ? "ring-2 ring-[var(--primary)]" : ""}`}>
            <div className={`p-3 rounded-xl w-fit mb-3 ${r.color}`}><r.icon className="w-6 h-6" /></div>
            <h3 className="font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors">{r.title}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{r.description}</p>
            <button onClick={(e) => { e.stopPropagation(); setSelected(selected === r.title ? null : r.title); }} className="mt-3 px-4 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Generate</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="glass-card p-6 border-2 border-[var(--primary)]/30 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Generate {selected}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">From Date</label><input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">To Date</label><input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Format</label>
              <div className="flex gap-2">{["PDF","Excel","CSV"].map(f => (
                <button key={f} onClick={() => setFormat(f as any)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${format === f ? "gradient-bg text-white" : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"}`}>
                  {f === "PDF" ? <FileText className="w-3.5 h-3.5" /> : f === "Excel" ? <FileSpreadsheet className="w-3.5 h-3.5" /> : <ClipboardList className="w-3.5 h-3.5" />} {f}
                </button>
              ))}</div>
            </div>
            <div className="flex items-end"><button onClick={handleExport} className="w-full px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"><Download className="w-4 h-4" /> Export Report</button></div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-3">Report Preview (Showing first 5 rows)</p>
            {reportData.previewRows.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[var(--border)]">
                  {reportData.columns.map((col, idx) => (
                    <th key={col} className={`py-2 px-2 text-xs text-[var(--muted-foreground)] ${idx === reportData.columns.length - 1 ? "text-center" : "text-left"}`}>{col}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {reportData.previewRows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-[var(--border)] last:border-0">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-2 px-2 ${cIdx === row.length - 1 ? "text-center" : "text-left"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-6 text-sm text-[var(--muted-foreground)]">No data fits the selected filters</p>
            )}
            <p className="text-[10px] text-center text-[var(--muted-foreground)] mt-3 italic">Export to get the full report with all pages and records</p>
          </div>
        </div>
      )}
    </div>
  )
}
