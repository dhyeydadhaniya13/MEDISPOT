export type ProductCategory =
  | 'Tablets'
  | 'Capsules'
  | 'Syrups'
  | 'Injections'
  | 'Ointments'
  | 'Drops'
  | 'Surgical Products'
  | 'Ayurvedic Products'
  | 'Nutraceuticals'
  | 'Medical Devices'

export type CustomerSegment = 'Gold' | 'Silver' | 'Bronze'

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue'

export type StockMovement = 'Stock In' | 'Stock Out' | 'Adjustment' | 'Return' | 'Transfer'

export type UserRole = 'Super Admin' | 'Admin' | 'Branch Manager' | 'Sales Manager' | 'Inventory Manager' | 'Accountant' | 'Sales Executive'

export interface Product {
  id: string
  name: string
  image: string
  code: string
  agencyCode: string
  hsnCode: string
  genericName: string
  brandName: string
  manufacturer: string
  category: ProductCategory
  batchNumber: string
  gstPercent: number
  purchasePrice: number
  sellingPrice: number
  mrp: number
  manufacturingDate: string
  expiryDate: string
  currentStock: number
  minimumStock: number
  branchId: string
}

export interface Customer {
  id: string
  name: string
  storeName: string
  gstNumber: string
  drugLicense: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  creditLimit: number
  paymentTerms: string
  segment: CustomerSegment
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  outstandingAmount: number
  lastPurchaseDate: string
  joinedDate: string
}

export interface Distributor {
  id: string
  name: string
  agencyCode: string
  gstNumber: string
  drugLicense: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  totalPurchases: number
  outstandingAmount: number
  rating: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  storeName: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  discountAmount: number
  gstAmount: number
  grandTotal: number
  status: InvoiceStatus
  paymentStatus: PaymentStatus
  branchId: string
}

export interface InvoiceItem {
  productId: string
  productName: string
  batchNumber: string
  quantity: number
  unitPrice: number
  discount: number
  gstPercent: number
  gstAmount: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  date: string
  items: { productName: string; quantity: number; price: number }[]
  total: number
  status: OrderStatus
  branchId: string
}

export interface Branch {
  id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  manager: string
  phone: string
  email: string
  totalRevenue: number
  totalOrders: number
  totalEmployees: number
  totalProducts: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  branchId: string
  branchName: string
  avatar: string
  phone: string
  isActive: boolean
  lastLogin: string
}

export interface StockEntry {
  id: string
  productId: string
  productName: string
  type: StockMovement
  quantity: number
  batchNumber: string
  date: string
  reference: string
  branchId: string
  notes: string
}

export interface ReorderSuggestion {
  customerId: string
  customerName: string
  storeName: string
  productId: string
  productName: string
  lastOrderDate: string
  avgInterval: number
  expectedReorderDate: string
  recommendedQty: number
  lastQty: number
  confidence: number
}

export interface SalesTarget {
  id: string
  type: 'branch' | 'employee'
  targetId: string
  targetName: string
  month: string
  targetAmount: number
  achievedAmount: number
  percentage: number
}

export interface Activity {
  id: string
  type: 'order' | 'payment' | 'stock' | 'customer' | 'alert' | 'invoice'
  title: string
  description: string
  timestamp: string
  user: string
  icon: string
}

export interface DemandPrediction {
  productId: string
  productName: string
  category: ProductCategory
  currentStock: number
  avgMonthlySales: number
  predictedDemand: number
  changePercent: number
  recommendedStock: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  seasonalFactor: string
}

export interface ProductRecommendation {
  triggerProduct: string
  recommendations: {
    productName: string
    confidence: number
    reason: string
  }[]
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  distributorId: string
  distributorName: string
  date: string
  expectedDelivery: string
  items: { productId: string; productName: string; quantity: number; unitPrice: number; total: number }[]
  subtotal: number
  gstAmount: number
  total: number
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled'
  branchId: string
  notes: string
}
