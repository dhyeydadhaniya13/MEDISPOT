/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { Invoice } from "./types"
import { formatCurrency, formatDate } from "./utils"

// ============================================================
// PDF EXPORT
// ============================================================
export function exportToPDF(title: string, columns: string[], rows: (string | number)[][]) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(18)
  doc.setTextColor(79, 70, 229)
  doc.text("MediSpot Pharma Pvt. Ltd.", 14, 20)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("123 Nariman Point, Mumbai - 400021 | GST: 27AABCM1234A1Z5", 14, 27)
  doc.setDrawColor(79, 70, 229)
  doc.setLineWidth(0.5)
  doc.line(14, 30, 196, 30)

  // Title
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(title, 14, 40)
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 46)

  // Table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 52,
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8, fontStyle: "bold" },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    margin: { left: 14, right: 14 },
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" })
    doc.text("© MediSpot Pharma Pvt. Ltd.", 14, doc.internal.pageSize.getHeight() - 10)
  }

  doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)
}

// ============================================================
// INVOICE PDF
// ============================================================
export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF()

  // Company Header
  doc.setFontSize(20)
  doc.setTextColor(79, 70, 229)
  doc.text("MediSpot Pharma Pvt. Ltd.", 14, 20)
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text("123 Nariman Point, Mumbai - 400021, Maharashtra", 14, 26)
  doc.text("Phone: +91 98765 43210 | Email: admin@medispot.in", 14, 31)
  doc.text("GST: 27AABCM1234A1Z5 | Drug License: MH-WS-000001", 14, 36)

  // Invoice title
  doc.setDrawColor(79, 70, 229)
  doc.setLineWidth(0.8)
  doc.line(14, 40, 196, 40)
  doc.setFontSize(16)
  doc.setTextColor(0)
  doc.text("TAX INVOICE", 14, 50)
  doc.setFontSize(10)
  doc.setTextColor(79, 70, 229)
  doc.text(invoice.invoiceNumber, 196, 50, { align: "right" })

  // Invoice details
  doc.setFontSize(9)
  doc.setTextColor(60)
  doc.text(`Date: ${formatDate(invoice.date)}`, 14, 58)
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 14, 63)
  doc.text(`Status: ${invoice.status}`, 196, 58, { align: "right" })

  // Bill To
  doc.setFontSize(10)
  doc.setTextColor(0)
  doc.text("Bill To:", 14, 75)
  doc.setFontSize(9)
  doc.setTextColor(60)
  doc.text(invoice.customerName, 14, 81)
  doc.text(invoice.storeName, 14, 86)

  // Items table
  const itemRows = invoice.items.map((item, i) => [
    i + 1,
    item.productName,
    item.batchNumber,
    item.quantity,
    formatCurrency(item.unitPrice),
    `${item.discount}%`,
    `${item.gstPercent}%`,
    formatCurrency(item.total),
  ])

  autoTable(doc, {
    head: [["#", "Product", "Batch", "Qty", "Unit Price", "Disc%", "GST%", "Total"]],
    body: itemRows as any,
    startY: 94,
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8, fontStyle: "bold" },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      7: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  })

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(9)
  doc.setTextColor(60)
  const totalsX = 140
  doc.text("Subtotal:", totalsX, finalY)
  doc.text(formatCurrency(invoice.subtotal), 196, finalY, { align: "right" })
  doc.text("Discount:", totalsX, finalY + 6)
  doc.text(`- ${formatCurrency(invoice.discountAmount)}`, 196, finalY + 6, { align: "right" })
  doc.text("GST:", totalsX, finalY + 12)
  doc.text(formatCurrency(invoice.gstAmount), 196, finalY + 12, { align: "right" })
  doc.setDrawColor(79, 70, 229)
  doc.line(totalsX, finalY + 15, 196, finalY + 15)
  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.text("Grand Total:", totalsX, finalY + 22)
  doc.setTextColor(79, 70, 229)
  doc.text(formatCurrency(invoice.grandTotal), 196, finalY + 22, { align: "right" })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text("Thank you for your business!", 14, doc.internal.pageSize.getHeight() - 20)
  doc.text("© MediSpot Pharma Pvt. Ltd.", 14, doc.internal.pageSize.getHeight() - 14)

  doc.save(`Invoice_${invoice.invoiceNumber}.pdf`)
}

// ============================================================
// EXCEL EXPORT
// ============================================================
export function exportToExcel(title: string, columns: string[], rows: (string | number)[][]) {
  const worksheetData = [columns, ...rows]
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // Set column widths
  worksheet["!cols"] = columns.map(() => ({ wch: 18 }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31))
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`)
}

// ============================================================
// CSV EXPORT
// ============================================================
export function exportToCSV(title: string, columns: string[], rows: (string | number)[][]) {
  const csvContent = [
    columns.join(","),
    ...rows.map(row => row.map(cell => {
      const str = String(cell)
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(","))
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// ============================================================
// UNIFIED EXPORT
// ============================================================
export function exportReport(
  format: "PDF" | "Excel" | "CSV",
  title: string,
  columns: string[],
  rows: (string | number)[][]
) {
  switch (format) {
    case "PDF": return exportToPDF(title, columns, rows)
    case "Excel": return exportToExcel(title, columns, rows)
    case "CSV": return exportToCSV(title, columns, rows)
  }
}
