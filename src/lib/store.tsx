"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import {
  Product, Customer, Distributor, Invoice, InvoiceItem, Order, Branch, User,
  StockEntry, ReorderSuggestion, SalesTarget, Activity, DemandPrediction,
  ProductRecommendation, PurchaseOrder, ProductCategory, OrderStatus, InvoiceStatus
} from "./types"
import {
  products as seedProducts, customers as seedCustomers, distributors as seedDistributors,
  invoices as seedInvoices, orders as seedOrders, branches as seedBranches, users as seedUsers,
  stockEntries as seedStockEntries, reorderSuggestions as seedReorderSuggestions,
  salesTargets as seedSalesTargets, activities as seedActivities,
  demandPredictions as seedDemandPredictions, productRecommendations as seedProductRecommendations,
  monthlySalesData, annualRevenueData, categorySalesData, branchPerformanceData,
  dashboardKPIs as seedKPIs
} from "./data"

// ============================================================
// TYPES
// ============================================================
interface DataStore {
  // Data arrays
  products: Product[]
  customers: Customer[]
  distributors: Distributor[]
  invoices: Invoice[]
  orders: Order[]
  branches: Branch[]
  users: User[]
  stockEntries: StockEntry[]
  purchaseOrders: PurchaseOrder[]
  reorderSuggestions: ReorderSuggestion[]
  salesTargets: SalesTarget[]
  activities: Activity[]
  demandPredictions: DemandPrediction[]
  productRecommendations: ProductRecommendation[]

  // Product CRUD
  addProduct: (p: Omit<Product, "id">) => Product
  updateProduct: (id: string, p: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Customer CRUD
  addCustomer: (c: Omit<Customer, "id">) => Customer
  updateCustomer: (id: string, c: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Distributor CRUD
  addDistributor: (d: Omit<Distributor, "id">) => Distributor
  updateDistributor: (id: string, d: Partial<Distributor>) => void
  deleteDistributor: (id: string) => void

  // Invoice CRUD
  addInvoice: (inv: Omit<Invoice, "id">) => Invoice
  updateInvoice: (id: string, inv: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // Order CRUD
  addOrder: (o: Omit<Order, "id">) => Order
  updateOrder: (id: string, o: Partial<Order>) => void
  deleteOrder: (id: string) => void

  // User CRUD
  addUser: (u: Omit<User, "id">) => User
  updateUser: (id: string, u: Partial<User>) => void
  deleteUser: (id: string) => void

  // Stock operations
  addStockEntry: (entry: Omit<StockEntry, "id">) => StockEntry

  // Purchase Order CRUD
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id">) => PurchaseOrder
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void
  deletePurchaseOrder: (id: string) => void

  // Activity log
  logActivity: (a: Omit<Activity, "id" | "timestamp">) => void

  // Dashboard
  getDashboardKPIs: (period: string) => typeof seedKPIs & { filteredOrders: Order[]; filteredInvoices: Invoice[] }

  // Search
  globalSearch: (query: string) => SearchResult[]
}

export interface SearchResult {
  type: "product" | "customer" | "distributor" | "order" | "invoice" | "user"
  id: string
  title: string
  subtitle: string
  href: string
}

// ============================================================
// HELPERS
// ============================================================
let idCounter = 1000

function genId(prefix: string): string {
  idCounter++
  return `${prefix}${String(idCounter).padStart(4, "0")}`
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const stored = localStorage.getItem(`medispot_${key}`)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return fallback
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`medispot_${key}`, JSON.stringify(data))
  } catch { /* ignore */ }
}

// ============================================================
// CONTEXT
// ============================================================
const DataContext = createContext<DataStore | null>(null)

export function useData(): DataStore {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}

// ============================================================
// PROVIDER
// ============================================================
export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage("products", seedProducts))
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage("customers", seedCustomers))
  const [distributors, setDistributors] = useState<Distributor[]>(() => loadFromStorage("distributors", seedDistributors))
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage("invoices", seedInvoices))
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage("orders", seedOrders))
  const [users, setUsers] = useState<User[]>(() => loadFromStorage("users", seedUsers))
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(() => loadFromStorage("stockEntries", seedStockEntries))
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadFromStorage("purchaseOrders", []))
  const [activities, setActivities] = useState<Activity[]>(() => loadFromStorage("activities", seedActivities))

  // Persist to localStorage
  useEffect(() => { saveToStorage("products", products) }, [products])
  useEffect(() => { saveToStorage("customers", customers) }, [customers])
  useEffect(() => { saveToStorage("distributors", distributors) }, [distributors])
  useEffect(() => { saveToStorage("invoices", invoices) }, [invoices])
  useEffect(() => { saveToStorage("orders", orders) }, [orders])
  useEffect(() => { saveToStorage("users", users) }, [users])
  useEffect(() => { saveToStorage("stockEntries", stockEntries) }, [stockEntries])
  useEffect(() => { saveToStorage("purchaseOrders", purchaseOrders) }, [purchaseOrders])
  useEffect(() => { saveToStorage("activities", activities) }, [activities])

  // ---- PRODUCT CRUD ----
  const addProduct = useCallback((p: Omit<Product, "id">): Product => {
    const newP = { ...p, id: genId("P") } as Product
    setProducts(prev => [newP, ...prev])
    return newP
  }, [])

  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- CUSTOMER CRUD ----
  const addCustomer = useCallback((c: Omit<Customer, "id">): Customer => {
    const newC = { ...c, id: genId("C") } as Customer
    setCustomers(prev => [newC, ...prev])
    return newC
  }, [])

  const updateCustomer = useCallback((id: string, c: Partial<Customer>) => {
    setCustomers(prev => prev.map(x => x.id === id ? { ...x, ...c } : x))
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- DISTRIBUTOR CRUD ----
  const addDistributor = useCallback((d: Omit<Distributor, "id">): Distributor => {
    const newD = { ...d, id: genId("D") } as Distributor
    setDistributors(prev => [newD, ...prev])
    return newD
  }, [])

  const updateDistributor = useCallback((id: string, d: Partial<Distributor>) => {
    setDistributors(prev => prev.map(x => x.id === id ? { ...x, ...d } : x))
  }, [])

  const deleteDistributor = useCallback((id: string) => {
    setDistributors(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- INVOICE CRUD ----
  const addInvoice = useCallback((inv: Omit<Invoice, "id">): Invoice => {
    const newInv = { ...inv, id: genId("INV") } as Invoice
    setInvoices(prev => [newInv, ...prev])
    return newInv
  }, [])

  const updateInvoice = useCallback((id: string, inv: Partial<Invoice>) => {
    setInvoices(prev => prev.map(x => x.id === id ? { ...x, ...inv } : x))
  }, [])

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- ORDER CRUD ----
  const addOrder = useCallback((o: Omit<Order, "id">): Order => {
    const newO = { ...o, id: genId("ORD") } as Order
    setOrders(prev => [newO, ...prev])
    // Update customer stats
    setCustomers(prev => prev.map(c =>
      c.id === o.customerId
        ? { ...c, totalOrders: c.totalOrders + 1, totalRevenue: c.totalRevenue + o.total, lastPurchaseDate: o.date }
        : c
    ))
    return newO
  }, [])

  const updateOrder = useCallback((id: string, o: Partial<Order>) => {
    setOrders(prev => prev.map(x => x.id === id ? { ...x, ...o } : x))
  }, [])

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- USER CRUD ----
  const addUser = useCallback((u: Omit<User, "id">): User => {
    const newU = { ...u, id: genId("U") } as User
    setUsers(prev => [newU, ...prev])
    return newU
  }, [])

  const updateUser = useCallback((id: string, u: Partial<User>) => {
    setUsers(prev => prev.map(x => x.id === id ? { ...x, ...u } : x))
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- STOCK ENTRY ----
  const addStockEntry = useCallback((entry: Omit<StockEntry, "id">): StockEntry => {
    const newEntry = { ...entry, id: genId("SE") } as StockEntry
    setStockEntries(prev => [newEntry, ...prev])

    // Update product stock
    setProducts(prev => prev.map(p => {
      if (p.id !== entry.productId) return p
      let newStock = p.currentStock
      if (entry.type === "Stock In") newStock += entry.quantity
      else if (entry.type === "Stock Out") newStock -= entry.quantity
      else if (entry.type === "Adjustment") newStock += entry.quantity // qty can be negative
      else if (entry.type === "Return") newStock += entry.quantity
      return { ...p, currentStock: Math.max(0, newStock) }
    }))

    return newEntry
  }, [])

  // ---- PURCHASE ORDER CRUD ----
  const addPurchaseOrder = useCallback((po: Omit<PurchaseOrder, "id">): PurchaseOrder => {
    const newPO = { ...po, id: genId("PO") } as PurchaseOrder
    setPurchaseOrders(prev => [newPO, ...prev])
    return newPO
  }, [])

  const updatePurchaseOrder = useCallback((id: string, po: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(x => x.id === id ? { ...x, ...po } : x))
  }, [])

  const deletePurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders(prev => prev.filter(x => x.id !== id))
  }, [])

  // ---- ACTIVITY LOG ----
  const logActivity = useCallback((a: Omit<Activity, "id" | "timestamp">) => {
    const newA: Activity = { ...a, id: genId("A"), timestamp: new Date().toISOString() }
    setActivities(prev => [newA, ...prev].slice(0, 50))
  }, [])

  // ---- DASHBOARD KPIs ----
  const getDashboardKPIs = useCallback((period: string) => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "this-week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "this-quarter":
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    const filteredOrders = orders.filter(o => new Date(o.date) >= startDate)
    const filteredInvoices = invoices.filter(i => new Date(i.date) >= startDate)
    const paidInvoices = filteredInvoices.filter(i => i.status === "Paid")

    const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0)
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.grandTotal, 0)
    const totalProfit = Math.round(totalRevenue * 0.195) // ~19.5% margin

    return {
      todaysSales: totalSales || seedKPIs.todaysSales,
      weeklySales: totalSales || seedKPIs.weeklySales,
      monthlySales: totalSales || seedKPIs.monthlySales,
      annualSales: totalSales || seedKPIs.annualSales,
      totalRevenue: totalRevenue || seedKPIs.totalRevenue,
      totalProfit: totalProfit || seedKPIs.totalProfit,
      totalCustomers: customers.length,
      totalDistributors: distributors.length,
      totalProducts: products.length,
      totalOrders: filteredOrders.length || orders.length,
      outstandingPayments: customers.reduce((sum, c) => sum + c.outstandingAmount, 0),
      lowStockProducts: products.filter(p => p.currentStock <= p.minimumStock).length,
      expiringProducts: products.filter(p => {
        const days = Math.ceil((new Date(p.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return days > 0 && days <= 90
      }).length,
      todaysTrend: 12.5,
      weeklyTrend: 8.3,
      monthlyTrend: 15.2,
      annualTrend: 22.1,
      filteredOrders,
      filteredInvoices,
    }
  }, [orders, invoices, customers, distributors, products])

  // ---- GLOBAL SEARCH ----
  const globalSearch = useCallback((query: string): SearchResult[] => {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()
    const results: SearchResult[] = []

    products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.manufacturer.toLowerCase().includes(q)).slice(0, 5)
      .forEach(p => results.push({ type: "product", id: p.id, title: p.name, subtitle: `${p.category} · ${p.manufacturer}`, href: `/products/${p.id}` }))

    customers.filter(c => c.name.toLowerCase().includes(q) || c.storeName.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 5)
      .forEach(c => results.push({ type: "customer", id: c.id, title: c.name, subtitle: c.storeName, href: `/customers/${c.id}` }))

    distributors.filter(d => d.name.toLowerCase().includes(q) || d.contactPerson.toLowerCase().includes(q)).slice(0, 5)
      .forEach(d => results.push({ type: "distributor", id: d.id, title: d.name, subtitle: d.contactPerson, href: `/distributors/${d.id}` }))

    orders.filter(o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)).slice(0, 5)
      .forEach(o => results.push({ type: "order", id: o.id, title: o.orderNumber, subtitle: o.customerName, href: `/orders` }))

    invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)).slice(0, 5)
      .forEach(i => results.push({ type: "invoice", id: i.id, title: i.invoiceNumber, subtitle: i.customerName, href: `/billing/${i.id}` }))

    users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 3)
      .forEach(u => results.push({ type: "user", id: u.id, title: u.name, subtitle: u.role, href: `/user-management` }))

    return results.slice(0, 15)
  }, [products, customers, distributors, orders, invoices, users])

  const value: DataStore = {
    products, customers, distributors, invoices, orders, branches: seedBranches, users,
    stockEntries, purchaseOrders, reorderSuggestions: seedReorderSuggestions,
    salesTargets: seedSalesTargets, activities, demandPredictions: seedDemandPredictions,
    productRecommendations: seedProductRecommendations,
    addProduct, updateProduct, deleteProduct,
    addCustomer, updateCustomer, deleteCustomer,
    addDistributor, updateDistributor, deleteDistributor,
    addInvoice, updateInvoice, deleteInvoice,
    addOrder, updateOrder, deleteOrder,
    addUser, updateUser, deleteUser,
    addStockEntry,
    addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
    logActivity, getDashboardKPIs, globalSearch,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
