import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getExpiryStatus(expiryDate: Date | string): 'expired' | 'critical' | 'warning' | 'caution' | 'safe' {
  const days = daysUntilExpiry(expiryDate)
  if (days <= 0) return 'expired'
  if (days <= 30) return 'critical'
  if (days <= 60) return 'warning'
  if (days <= 90) return 'caution'
  return 'safe'
}

export function getStockStatus(current: number, minimum: number): 'out' | 'critical' | 'low' | 'adequate' | 'surplus' {
  if (current === 0) return 'out'
  if (current <= minimum * 0.25) return 'critical'
  if (current <= minimum) return 'low'
  if (current <= minimum * 3) return 'adequate'
  return 'surplus'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase()
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function calculateGST(amount: number, gstPercent: number): { cgst: number; sgst: number; total: number } {
  const gst = (amount * gstPercent) / 100
  return {
    cgst: gst / 2,
    sgst: gst / 2,
    total: gst,
  }
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}
