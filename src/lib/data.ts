import {
  Product, Customer, Distributor, Invoice, Order, Branch, User,
  StockEntry, ReorderSuggestion, SalesTarget, Activity, DemandPrediction,
  ProductRecommendation, InvoiceItem, OrderStatus
} from './types'

// Deterministic PRNG for mock data to avoid SSR hydration mismatches
let seed = 12345;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// ============================================================
// BRANCHES
// ============================================================
export const branches: Branch[] = [
  { id: 'BR001', name: 'Mumbai Head Office', code: 'MUM-HQ', address: '123 Nariman Point', city: 'Mumbai', state: 'Maharashtra', manager: 'Rajesh Sharma', phone: '9876543210', email: 'mumbai@medispot.in', totalRevenue: 4520000, totalOrders: 1250, totalEmployees: 35, totalProducts: 890 },
  { id: 'BR002', name: 'Delhi Branch', code: 'DEL-01', address: '456 Connaught Place', city: 'Delhi', state: 'Delhi', manager: 'Priya Gupta', phone: '9876543211', email: 'delhi@medispot.in', totalRevenue: 3180000, totalOrders: 980, totalEmployees: 22, totalProducts: 750 },
  { id: 'BR003', name: 'Bangalore Branch', code: 'BLR-01', address: '789 MG Road', city: 'Bangalore', state: 'Karnataka', manager: 'Arun Kumar', phone: '9876543212', email: 'bangalore@medispot.in', totalRevenue: 2750000, totalOrders: 820, totalEmployees: 18, totalProducts: 680 },
  { id: 'BR004', name: 'Chennai Branch', code: 'CHE-01', address: '321 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', manager: 'Lakshmi Iyer', phone: '9876543213', email: 'chennai@medispot.in', totalRevenue: 1980000, totalOrders: 650, totalEmployees: 15, totalProducts: 590 },
  { id: 'BR005', name: 'Kolkata Branch', code: 'KOL-01', address: '654 Park Street', city: 'Kolkata', state: 'West Bengal', manager: 'Sanjay Das', phone: '9876543214', email: 'kolkata@medispot.in', totalRevenue: 1650000, totalOrders: 540, totalEmployees: 12, totalProducts: 520 },
]

// ============================================================
// PRODUCTS (50+ realistic pharma products)
// ============================================================
export const products: Product[] = [
  { id: 'P001', name: 'Dolo 650', image: '/products/dolo.png', code: 'DOL650', agencyCode: 'AG-001', hsnCode: '3004', genericName: 'Paracetamol 650mg', brandName: 'Dolo', manufacturer: 'Micro Labs Ltd', category: 'Tablets', batchNumber: 'BT2024A01', gstPercent: 12, purchasePrice: 22, sellingPrice: 28, mrp: 32.5, manufacturingDate: '2025-01-15', expiryDate: '2027-01-15', currentStock: 40, minimumStock: 100, branchId: 'BR001' },
  { id: 'P002', name: 'Azithral 500', image: '/products/azithral.png', code: 'AZI500', agencyCode: 'AG-002', hsnCode: '3004', genericName: 'Azithromycin 500mg', brandName: 'Azithral', manufacturer: 'Alembic Pharma', category: 'Tablets', batchNumber: 'BT2024A02', gstPercent: 12, purchasePrice: 68, sellingPrice: 85, mrp: 98.5, manufacturingDate: '2025-02-10', expiryDate: '2027-02-10', currentStock: 250, minimumStock: 80, branchId: 'BR001' },
  { id: 'P003', name: 'Crocin Advance', image: '/products/crocin.png', code: 'CRO500', agencyCode: 'AG-003', hsnCode: '3004', genericName: 'Paracetamol 500mg', brandName: 'Crocin', manufacturer: 'GSK Pharma', category: 'Tablets', batchNumber: 'BT2024A03', gstPercent: 12, purchasePrice: 18, sellingPrice: 24, mrp: 28, manufacturingDate: '2025-03-05', expiryDate: '2027-03-05', currentStock: 520, minimumStock: 150, branchId: 'BR001' },
  { id: 'P004', name: 'Augmentin 625', image: '/products/augmentin.png', code: 'AUG625', agencyCode: 'AG-004', hsnCode: '3004', genericName: 'Amoxicillin + Clavulanic Acid', brandName: 'Augmentin', manufacturer: 'GSK Pharma', category: 'Tablets', batchNumber: 'BT2024A04', gstPercent: 12, purchasePrice: 145, sellingPrice: 178, mrp: 210, manufacturingDate: '2025-01-20', expiryDate: '2026-07-20', currentStock: 85, minimumStock: 50, branchId: 'BR001' },
  { id: 'P005', name: 'Pan D', image: '/products/pand.png', code: 'PND40', agencyCode: 'AG-005', hsnCode: '3004', genericName: 'Pantoprazole + Domperidone', brandName: 'Pan D', manufacturer: 'Alkem Labs', category: 'Capsules', batchNumber: 'BT2024A05', gstPercent: 12, purchasePrice: 52, sellingPrice: 68, mrp: 78, manufacturingDate: '2025-04-01', expiryDate: '2027-04-01', currentStock: 380, minimumStock: 100, branchId: 'BR001' },
  { id: 'P006', name: 'Shelcal 500', image: '/products/shelcal.png', code: 'SHL500', agencyCode: 'AG-006', hsnCode: '3004', genericName: 'Calcium + Vitamin D3', brandName: 'Shelcal', manufacturer: 'Torrent Pharma', category: 'Tablets', batchNumber: 'BT2024A06', gstPercent: 12, purchasePrice: 95, sellingPrice: 120, mrp: 142, manufacturingDate: '2025-02-15', expiryDate: '2027-02-15', currentStock: 220, minimumStock: 60, branchId: 'BR001' },
  { id: 'P007', name: 'Combiflam', image: '/products/combiflam.png', code: 'CMB400', agencyCode: 'AG-007', hsnCode: '3004', genericName: 'Ibuprofen + Paracetamol', brandName: 'Combiflam', manufacturer: 'Sanofi India', category: 'Tablets', batchNumber: 'BT2024A07', gstPercent: 12, purchasePrice: 25, sellingPrice: 34, mrp: 40, manufacturingDate: '2025-05-10', expiryDate: '2027-05-10', currentStock: 450, minimumStock: 120, branchId: 'BR001' },
  { id: 'P008', name: 'Amoxyclav 625', image: '/products/amoxyclav.png', code: 'AMX625', agencyCode: 'AG-008', hsnCode: '3004', genericName: 'Amoxicillin + Clavulanate', brandName: 'Amoxyclav', manufacturer: 'Cipla Ltd', category: 'Tablets', batchNumber: 'BT2024A08', gstPercent: 12, purchasePrice: 135, sellingPrice: 165, mrp: 195, manufacturingDate: '2025-03-20', expiryDate: '2026-09-20', currentStock: 15, minimumStock: 40, branchId: 'BR001' },
  { id: 'P009', name: 'Benadryl Cough Syrup', image: '/products/benadryl.png', code: 'BEN100', agencyCode: 'AG-009', hsnCode: '3004', genericName: 'Diphenhydramine', brandName: 'Benadryl', manufacturer: 'Johnson & Johnson', category: 'Syrups', batchNumber: 'BT2024A09', gstPercent: 12, purchasePrice: 78, sellingPrice: 98, mrp: 115, manufacturingDate: '2025-01-05', expiryDate: '2026-08-05', currentStock: 180, minimumStock: 50, branchId: 'BR001' },
  { id: 'P010', name: 'Insulin Glargine', image: '/products/insulin.png', code: 'INS100', agencyCode: 'AG-010', hsnCode: '3004', genericName: 'Insulin Glargine 100IU', brandName: 'Lantus', manufacturer: 'Sanofi India', category: 'Injections', batchNumber: 'BT2024A10', gstPercent: 5, purchasePrice: 520, sellingPrice: 650, mrp: 780, manufacturingDate: '2025-06-01', expiryDate: '2026-12-01', currentStock: 65, minimumStock: 30, branchId: 'BR001' },
  { id: 'P011', name: 'Volini Gel', image: '/products/volini.png', code: 'VOL50', agencyCode: 'AG-011', hsnCode: '3004', genericName: 'Diclofenac Gel', brandName: 'Volini', manufacturer: 'Sun Pharma', category: 'Ointments', batchNumber: 'BT2024A11', gstPercent: 18, purchasePrice: 85, sellingPrice: 110, mrp: 130, manufacturingDate: '2025-04-15', expiryDate: '2027-04-15', currentStock: 300, minimumStock: 80, branchId: 'BR001' },
  { id: 'P012', name: 'Ciprodex Ear Drops', image: '/products/ciprodex.png', code: 'CPD10', agencyCode: 'AG-012', hsnCode: '3004', genericName: 'Ciprofloxacin + Dexamethasone', brandName: 'Ciprodex', manufacturer: 'Novartis', category: 'Drops', batchNumber: 'BT2024A12', gstPercent: 12, purchasePrice: 120, sellingPrice: 155, mrp: 180, manufacturingDate: '2025-05-20', expiryDate: '2026-11-20', currentStock: 95, minimumStock: 25, branchId: 'BR001' },
  { id: 'P013', name: 'Betadine Solution', image: '/products/betadine.png', code: 'BTD500', agencyCode: 'AG-013', hsnCode: '3004', genericName: 'Povidone Iodine', brandName: 'Betadine', manufacturer: 'Win Medicare', category: 'Surgical Products', batchNumber: 'BT2024A13', gstPercent: 18, purchasePrice: 62, sellingPrice: 82, mrp: 95, manufacturingDate: '2025-02-28', expiryDate: '2027-02-28', currentStock: 400, minimumStock: 100, branchId: 'BR001' },
  { id: 'P014', name: 'Chyawanprash Special', image: '/products/dabur.png', code: 'CHY1K', agencyCode: 'AG-014', hsnCode: '2106', genericName: 'Herbal Health Tonic', brandName: 'Dabur', manufacturer: 'Dabur India', category: 'Ayurvedic Products', batchNumber: 'BT2024A14', gstPercent: 12, purchasePrice: 180, sellingPrice: 225, mrp: 265, manufacturingDate: '2025-03-10', expiryDate: '2027-03-10', currentStock: 150, minimumStock: 40, branchId: 'BR001' },
  { id: 'P015', name: 'MuscleTech Whey Protein', image: '/products/muscletech.png', code: 'MTP2K', agencyCode: 'AG-015', hsnCode: '2106', genericName: 'Whey Protein Supplement', brandName: 'MuscleTech', manufacturer: 'MuscleTech Inc', category: 'Nutraceuticals', batchNumber: 'BT2024A15', gstPercent: 18, purchasePrice: 2200, sellingPrice: 2800, mrp: 3500, manufacturingDate: '2025-01-25', expiryDate: '2026-07-25', currentStock: 35, minimumStock: 15, branchId: 'BR001' },
  { id: 'P016', name: 'Digital BP Monitor', image: '/products/bpmonitor.png', code: 'BPM01', agencyCode: 'AG-016', hsnCode: '9018', genericName: 'Blood Pressure Monitor', brandName: 'Omron', manufacturer: 'Omron Healthcare', category: 'Medical Devices', batchNumber: 'BT2024A16', gstPercent: 12, purchasePrice: 1200, sellingPrice: 1600, mrp: 1999, manufacturingDate: '2025-04-05', expiryDate: '2030-04-05', currentStock: 42, minimumStock: 10, branchId: 'BR001' },
  { id: 'P017', name: 'Cetirizine 10mg', image: '/products/cetirizine.png', code: 'CET10', agencyCode: 'AG-017', hsnCode: '3004', genericName: 'Cetirizine HCl', brandName: 'Alerid', manufacturer: 'Cipla Ltd', category: 'Tablets', batchNumber: 'BT2024A17', gstPercent: 12, purchasePrice: 15, sellingPrice: 22, mrp: 28, manufacturingDate: '2025-06-15', expiryDate: '2027-06-15', currentStock: 680, minimumStock: 200, branchId: 'BR001' },
  { id: 'P018', name: 'Montelukast 10mg', image: '/products/montair.png', code: 'MNT10', agencyCode: 'AG-018', hsnCode: '3004', genericName: 'Montelukast Sodium', brandName: 'Montair', manufacturer: 'Cipla Ltd', category: 'Tablets', batchNumber: 'BT2024A18', gstPercent: 12, purchasePrice: 85, sellingPrice: 110, mrp: 135, manufacturingDate: '2025-05-01', expiryDate: '2027-05-01', currentStock: 190, minimumStock: 60, branchId: 'BR001' },
  { id: 'P019', name: 'Metformin 500mg', image: '/products/glycomet.png', code: 'MET500', agencyCode: 'AG-019', hsnCode: '3004', genericName: 'Metformin HCl', brandName: 'Glycomet', manufacturer: 'USV Ltd', category: 'Tablets', batchNumber: 'BT2024A19', gstPercent: 5, purchasePrice: 12, sellingPrice: 18, mrp: 22, manufacturingDate: '2025-04-20', expiryDate: '2027-04-20', currentStock: 900, minimumStock: 200, branchId: 'BR001' },
  { id: 'P020', name: 'Atorvastatin 20mg', image: '/products/atorva.png', code: 'ATR20', agencyCode: 'AG-020', hsnCode: '3004', genericName: 'Atorvastatin Calcium', brandName: 'Atorva', manufacturer: 'Zydus Cadila', category: 'Tablets', batchNumber: 'BT2024A20', gstPercent: 12, purchasePrice: 48, sellingPrice: 62, mrp: 75, manufacturingDate: '2025-03-15', expiryDate: '2027-03-15', currentStock: 340, minimumStock: 80, branchId: 'BR001' },
  { id: 'P021', name: 'Allegra 120mg', image: '/products/allegra.png', code: 'ALG120', agencyCode: 'AG-021', hsnCode: '3004', genericName: 'Fexofenadine HCl', brandName: 'Allegra', manufacturer: 'Sanofi India', category: 'Tablets', batchNumber: 'BT2024A21', gstPercent: 12, purchasePrice: 95, sellingPrice: 125, mrp: 148, manufacturingDate: '2025-02-05', expiryDate: '2027-02-05', currentStock: 175, minimumStock: 50, branchId: 'BR001' },
  { id: 'P022', name: 'Becosules Capsules', image: '/products/becosules.png', code: 'BCS01', agencyCode: 'AG-022', hsnCode: '3004', genericName: 'Multivitamin B Complex', brandName: 'Becosules', manufacturer: 'Pfizer Ltd', category: 'Capsules', batchNumber: 'BT2024A22', gstPercent: 12, purchasePrice: 28, sellingPrice: 38, mrp: 45, manufacturingDate: '2025-06-10', expiryDate: '2027-06-10', currentStock: 550, minimumStock: 150, branchId: 'BR001' },
  { id: 'P023', name: 'Zifi 200', image: '/products/zifi.png', code: 'ZIF200', agencyCode: 'AG-023', hsnCode: '3004', genericName: 'Cefixime 200mg', brandName: 'Zifi', manufacturer: 'FDC Ltd', category: 'Tablets', batchNumber: 'BT2024A23', gstPercent: 12, purchasePrice: 72, sellingPrice: 92, mrp: 110, manufacturingDate: '2025-04-10', expiryDate: '2026-10-10', currentStock: 120, minimumStock: 40, branchId: 'BR001' },
  { id: 'P024', name: 'Sinarest Syrup', image: '/products/sinarest.png', code: 'SIN100', agencyCode: 'AG-024', hsnCode: '3004', genericName: 'Chlorpheniramine + Paracetamol', brandName: 'Sinarest', manufacturer: 'Centaur Pharma', category: 'Syrups', batchNumber: 'BT2024A24', gstPercent: 12, purchasePrice: 45, sellingPrice: 58, mrp: 68, manufacturingDate: '2025-05-15', expiryDate: '2026-11-15', currentStock: 200, minimumStock: 60, branchId: 'BR001' },
  { id: 'P025', name: 'Moov Spray', image: '/products/moov.png', code: 'MOV80', agencyCode: 'AG-025', hsnCode: '3004', genericName: 'Diclofenac + Methyl Salicylate', brandName: 'Moov', manufacturer: 'Reckitt Benckiser', category: 'Ointments', batchNumber: 'BT2024A25', gstPercent: 18, purchasePrice: 150, sellingPrice: 195, mrp: 230, manufacturingDate: '2025-03-25', expiryDate: '2027-03-25', currentStock: 260, minimumStock: 70, branchId: 'BR001' },
  { id: 'P026', name: 'ORS Powder', image: '/products/ors.png', code: 'ORS21', agencyCode: 'AG-026', hsnCode: '3004', genericName: 'Oral Rehydration Salts', brandName: 'Electral', manufacturer: 'FDC Ltd', category: 'Tablets', batchNumber: 'BT2024A26', gstPercent: 5, purchasePrice: 18, sellingPrice: 24, mrp: 30, manufacturingDate: '2025-06-01', expiryDate: '2027-06-01', currentStock: 800, minimumStock: 200, branchId: 'BR001' },
  { id: 'P027', name: 'Vitamin C 500mg', image: '/products/vitaminc.png', code: 'VTC500', agencyCode: 'AG-027', hsnCode: '3004', genericName: 'Ascorbic Acid 500mg', brandName: 'Celin', manufacturer: 'GSK Pharma', category: 'Tablets', batchNumber: 'BT2024A27', gstPercent: 12, purchasePrice: 22, sellingPrice: 30, mrp: 36, manufacturingDate: '2025-04-15', expiryDate: '2027-04-15', currentStock: 620, minimumStock: 150, branchId: 'BR001' },
  { id: 'P028', name: 'Zinc Tablets 20mg', image: '/products/zinc.png', code: 'ZNC20', agencyCode: 'AG-028', hsnCode: '3004', genericName: 'Zinc Sulphate 20mg', brandName: 'Zincovit', manufacturer: 'Apex Labs', category: 'Tablets', batchNumber: 'BT2024A28', gstPercent: 12, purchasePrice: 35, sellingPrice: 48, mrp: 55, manufacturingDate: '2025-05-05', expiryDate: '2027-05-05', currentStock: 480, minimumStock: 100, branchId: 'BR001' },
  { id: 'P029', name: 'Aspirin 75mg', image: '/products/aspirin.png', code: 'ASP75', agencyCode: 'AG-029', hsnCode: '3004', genericName: 'Acetylsalicylic Acid', brandName: 'Ecosprin', manufacturer: 'USV Ltd', category: 'Tablets', batchNumber: 'BT2024A29', gstPercent: 12, purchasePrice: 8, sellingPrice: 12, mrp: 15, manufacturingDate: '2025-03-01', expiryDate: '2027-03-01', currentStock: 1200, minimumStock: 300, branchId: 'BR001' },
  { id: 'P030', name: 'Omeprazole 20mg', image: '/products/omez.png', code: 'OMZ20', agencyCode: 'AG-030', hsnCode: '3004', genericName: 'Omeprazole', brandName: 'Omez', manufacturer: 'Dr. Reddys', category: 'Capsules', batchNumber: 'BT2024A30', gstPercent: 12, purchasePrice: 32, sellingPrice: 42, mrp: 52, manufacturingDate: '2025-02-20', expiryDate: '2027-02-20', currentStock: 410, minimumStock: 100, branchId: 'BR001' },
  { id: 'P031', name: 'Rabeprazole 20mg', image: '/products/razo.png', code: 'RBP20', agencyCode: 'AG-031', hsnCode: '3004', genericName: 'Rabeprazole Sodium', brandName: 'Razo', manufacturer: 'Dr. Reddys', category: 'Tablets', batchNumber: 'BT2024A31', gstPercent: 12, purchasePrice: 42, sellingPrice: 58, mrp: 68, manufacturingDate: '2025-05-25', expiryDate: '2026-08-25', currentStock: 280, minimumStock: 80, branchId: 'BR001' },
  { id: 'P032', name: 'Amlodipine 5mg', image: '/products/amlong.png', code: 'AML5', agencyCode: 'AG-032', hsnCode: '3004', genericName: 'Amlodipine Besylate', brandName: 'Amlong', manufacturer: 'Micro Labs', category: 'Tablets', batchNumber: 'BT2024A32', gstPercent: 12, purchasePrice: 18, sellingPrice: 25, mrp: 30, manufacturingDate: '2025-01-10', expiryDate: '2027-01-10', currentStock: 560, minimumStock: 120, branchId: 'BR001' },
  { id: 'P033', name: 'Losartan 50mg', image: '/products/losar.png', code: 'LOS50', agencyCode: 'AG-033', hsnCode: '3004', genericName: 'Losartan Potassium', brandName: 'Losar', manufacturer: 'Unichem Labs', category: 'Tablets', batchNumber: 'BT2024A33', gstPercent: 12, purchasePrice: 35, sellingPrice: 48, mrp: 58, manufacturingDate: '2025-06-05', expiryDate: '2027-06-05', currentStock: 320, minimumStock: 80, branchId: 'BR001' },
  { id: 'P034', name: 'Telmisartan 40mg', image: '/products/telma.png', code: 'TEL40', agencyCode: 'AG-034', hsnCode: '3004', genericName: 'Telmisartan', brandName: 'Telma', manufacturer: 'Glenmark Pharma', category: 'Tablets', batchNumber: 'BT2024A34', gstPercent: 12, purchasePrice: 45, sellingPrice: 60, mrp: 72, manufacturingDate: '2025-04-25', expiryDate: '2027-04-25', currentStock: 290, minimumStock: 70, branchId: 'BR001' },
  { id: 'P035', name: 'Glimepiride 2mg', image: '/products/amaryl.png', code: 'GLM2', agencyCode: 'AG-035', hsnCode: '3004', genericName: 'Glimepiride', brandName: 'Amaryl', manufacturer: 'Sanofi India', category: 'Tablets', batchNumber: 'BT2024A35', gstPercent: 5, purchasePrice: 28, sellingPrice: 38, mrp: 45, manufacturingDate: '2025-03-12', expiryDate: '2027-03-12', currentStock: 350, minimumStock: 80, branchId: 'BR001' },
  { id: 'P036', name: 'Ambroxol Syrup', image: '/products/ambroxol.png', code: 'ABX100', agencyCode: 'AG-036', hsnCode: '3004', genericName: 'Ambroxol HCl', brandName: 'Mucolite', manufacturer: 'Cipla Ltd', category: 'Syrups', batchNumber: 'BT2024A36', gstPercent: 12, purchasePrice: 52, sellingPrice: 68, mrp: 80, manufacturingDate: '2025-02-08', expiryDate: '2026-08-08', currentStock: 160, minimumStock: 40, branchId: 'BR001' },
  { id: 'P037', name: 'Levocetrizine 5mg', image: '/products/levocetirizine.png', code: 'LVC5', agencyCode: 'AG-037', hsnCode: '3004', genericName: 'Levocetirizine', brandName: 'Xyzal', manufacturer: 'Sanofi India', category: 'Tablets', batchNumber: 'BT2024A37', gstPercent: 12, purchasePrice: 25, sellingPrice: 35, mrp: 42, manufacturingDate: '2025-05-18', expiryDate: '2027-05-18', currentStock: 420, minimumStock: 100, branchId: 'BR001' },
  { id: 'P038', name: 'Ranitidine 150mg', image: '/products/rantac.png', code: 'RAN150', agencyCode: 'AG-038', hsnCode: '3004', genericName: 'Ranitidine HCl', brandName: 'Rantac', manufacturer: 'JB Chemicals', category: 'Tablets', batchNumber: 'BT2024A38', gstPercent: 12, purchasePrice: 15, sellingPrice: 22, mrp: 26, manufacturingDate: '2025-01-30', expiryDate: '2026-07-30', currentStock: 8, minimumStock: 50, branchId: 'BR001' },
  { id: 'P039', name: 'Disposable Syringes 5ml', image: '/products/syringe.png', code: 'SYR5', agencyCode: 'AG-039', hsnCode: '9018', genericName: 'Disposable Syringe', brandName: 'BD', manufacturer: 'Becton Dickinson', category: 'Surgical Products', batchNumber: 'BT2024A39', gstPercent: 12, purchasePrice: 5, sellingPrice: 8, mrp: 10, manufacturingDate: '2025-06-01', expiryDate: '2028-06-01', currentStock: 5000, minimumStock: 1000, branchId: 'BR001' },
  { id: 'P040', name: 'Ashwagandha Capsules', image: '/products/ashwagandha.png', code: 'ASH60', agencyCode: 'AG-040', hsnCode: '2106', genericName: 'Withania Somnifera Extract', brandName: 'Himalaya', manufacturer: 'Himalaya Wellness', category: 'Ayurvedic Products', batchNumber: 'BT2024A40', gstPercent: 12, purchasePrice: 145, sellingPrice: 185, mrp: 220, manufacturingDate: '2025-04-08', expiryDate: '2027-04-08', currentStock: 280, minimumStock: 60, branchId: 'BR001' },
  { id: 'P041', name: 'Omega 3 Fish Oil', image: '/products/omega3.png', code: 'OMG60', agencyCode: 'AG-041', hsnCode: '2106', genericName: 'Fish Oil EPA + DHA', brandName: 'HealthKart', manufacturer: 'HealthKart', category: 'Nutraceuticals', batchNumber: 'BT2024A41', gstPercent: 18, purchasePrice: 350, sellingPrice: 450, mrp: 550, manufacturingDate: '2025-03-18', expiryDate: '2026-09-18', currentStock: 95, minimumStock: 25, branchId: 'BR001' },
  { id: 'P042', name: 'Digital Thermometer', image: '/products/thermometer.png', code: 'THR01', agencyCode: 'AG-042', hsnCode: '9025', genericName: 'Digital Thermometer', brandName: 'Dr. Morepen', manufacturer: 'Dr. Morepen', category: 'Medical Devices', batchNumber: 'BT2024A42', gstPercent: 12, purchasePrice: 85, sellingPrice: 120, mrp: 150, manufacturingDate: '2025-05-22', expiryDate: '2030-05-22', currentStock: 78, minimumStock: 20, branchId: 'BR001' },
  { id: 'P043', name: 'N95 Mask (Pack of 10)', image: '/products/n95mask.png', code: 'N9510', agencyCode: 'AG-043', hsnCode: '6307', genericName: 'N95 Respirator Mask', brandName: '3M', manufacturer: '3M India', category: 'Surgical Products', batchNumber: 'BT2024A43', gstPercent: 18, purchasePrice: 180, sellingPrice: 240, mrp: 300, manufacturingDate: '2025-06-10', expiryDate: '2028-06-10', currentStock: 500, minimumStock: 100, branchId: 'BR001' },
  { id: 'P044', name: 'Eye Drops Refresh', image: '/products/refresh.png', code: 'REF10', agencyCode: 'AG-044', hsnCode: '3004', genericName: 'Carboxymethylcellulose', brandName: 'Refresh Tears', manufacturer: 'Allergan India', category: 'Drops', batchNumber: 'BT2024A44', gstPercent: 12, purchasePrice: 95, sellingPrice: 125, mrp: 150, manufacturingDate: '2025-04-28', expiryDate: '2026-10-28', currentStock: 130, minimumStock: 30, branchId: 'BR001' },
  { id: 'P045', name: 'Ciprofloxacin 500mg', image: '/products/cipro.png', code: 'CIP500', agencyCode: 'AG-045', hsnCode: '3004', genericName: 'Ciprofloxacin HCl', brandName: 'Ciplox', manufacturer: 'Cipla Ltd', category: 'Tablets', batchNumber: 'BT2024A45', gstPercent: 12, purchasePrice: 38, sellingPrice: 52, mrp: 62, manufacturingDate: '2025-01-18', expiryDate: '2026-07-18', currentStock: 22, minimumStock: 60, branchId: 'BR001' },
  { id: 'P046', name: 'Prednisolone 10mg', image: '/products/prednisolone.png', code: 'PRD10', agencyCode: 'AG-046', hsnCode: '3004', genericName: 'Prednisolone', brandName: 'Omnacortil', manufacturer: 'Macleods Pharma', category: 'Tablets', batchNumber: 'BT2024A46', gstPercent: 12, purchasePrice: 20, sellingPrice: 28, mrp: 34, manufacturingDate: '2025-02-25', expiryDate: '2027-02-25', currentStock: 380, minimumStock: 80, branchId: 'BR001' },
  { id: 'P047', name: 'Deriphylline Retard', image: '/products/deriphylline.png', code: 'DRP150', agencyCode: 'AG-047', hsnCode: '3004', genericName: 'Theophylline + Etofylline', brandName: 'Deriphylline', manufacturer: 'Zydus Cadila', category: 'Tablets', batchNumber: 'BT2024A47', gstPercent: 12, purchasePrice: 30, sellingPrice: 42, mrp: 50, manufacturingDate: '2025-05-30', expiryDate: '2027-05-30', currentStock: 210, minimumStock: 50, branchId: 'BR001' },
  { id: 'P048', name: 'Triphala Churna', image: '/products/triphala.png', code: 'TRP100', agencyCode: 'AG-048', hsnCode: '2106', genericName: 'Triphala Powder', brandName: 'Patanjali', manufacturer: 'Patanjali Ayurved', category: 'Ayurvedic Products', batchNumber: 'BT2024A48', gstPercent: 12, purchasePrice: 55, sellingPrice: 72, mrp: 85, manufacturingDate: '2025-06-08', expiryDate: '2027-06-08', currentStock: 240, minimumStock: 50, branchId: 'BR001' },
  { id: 'P049', name: 'Pulse Oximeter', image: '/products/oximeter.png', code: 'POX01', agencyCode: 'AG-049', hsnCode: '9018', genericName: 'Fingertip Pulse Oximeter', brandName: 'Dr. Trust', manufacturer: 'Dr. Trust', category: 'Medical Devices', batchNumber: 'BT2024A49', gstPercent: 12, purchasePrice: 650, sellingPrice: 850, mrp: 1100, manufacturingDate: '2025-04-18', expiryDate: '2030-04-18', currentStock: 55, minimumStock: 15, branchId: 'BR001' },
  { id: 'P050', name: 'Dexamethasone Injection', image: '/products/dexameth.png', code: 'DEX4', agencyCode: 'AG-050', hsnCode: '3004', genericName: 'Dexamethasone 4mg', brandName: 'Dexona', manufacturer: 'Zydus Cadila', category: 'Injections', batchNumber: 'BT2024A50', gstPercent: 5, purchasePrice: 12, sellingPrice: 18, mrp: 22, manufacturingDate: '2025-03-08', expiryDate: '2026-09-08', currentStock: 450, minimumStock: 100, branchId: 'BR001' },
]

// ============================================================
// CUSTOMERS
// ============================================================
export const customers: Customer[] = [
  { id: 'C001', name: 'Ramesh Patel', storeName: 'Patel Medical Store', gstNumber: '27AABCP1234A1Z5', drugLicense: 'MH-MUM-123456', address: '45 Station Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', phone: '9898765432', email: 'patel.medical@gmail.com', creditLimit: 200000, paymentTerms: 'Net 30', segment: 'Gold', totalOrders: 156, totalRevenue: 1850000, avgOrderValue: 11859, outstandingAmount: 45000, lastPurchaseDate: '2026-06-28', joinedDate: '2022-03-15' },
  { id: 'C002', name: 'Suresh Kumar', storeName: 'Kumar Pharma', gstNumber: '07AABCK5678B2Z3', drugLicense: 'DL-DEL-654321', address: '12 Karol Bagh', city: 'Delhi', state: 'Delhi', phone: '9876123456', email: 'kumar.pharma@gmail.com', creditLimit: 150000, paymentTerms: 'Net 15', segment: 'Gold', totalOrders: 134, totalRevenue: 1520000, avgOrderValue: 11343, outstandingAmount: 28000, lastPurchaseDate: '2026-06-30', joinedDate: '2021-08-20' },
  { id: 'C003', name: 'Anita Deshmukh', storeName: 'Shree Medical Agency', gstNumber: '27AABCD9012C3Z1', drugLicense: 'MH-PUN-789012', address: '78 FC Road, Deccan', city: 'Pune', state: 'Maharashtra', phone: '9765432187', email: 'shreemedical@gmail.com', creditLimit: 300000, paymentTerms: 'Net 30', segment: 'Gold', totalOrders: 189, totalRevenue: 2340000, avgOrderValue: 12381, outstandingAmount: 62000, lastPurchaseDate: '2026-07-01', joinedDate: '2020-11-10' },
  { id: 'C004', name: 'Vijay Reddy', storeName: 'Reddy Health Mart', gstNumber: '29AABCR3456D4Z8', drugLicense: 'KA-BLR-345678', address: '234 Jayanagar', city: 'Bangalore', state: 'Karnataka', phone: '9845678901', email: 'reddy.health@gmail.com', creditLimit: 100000, paymentTerms: 'Net 15', segment: 'Silver', totalOrders: 82, totalRevenue: 680000, avgOrderValue: 8293, outstandingAmount: 15000, lastPurchaseDate: '2026-06-25', joinedDate: '2023-01-05' },
  { id: 'C005', name: 'Meera Sharma', storeName: 'Sharma Medicos', gstNumber: '08AABCS7890E5Z6', drugLicense: 'RJ-JAI-901234', address: '56 MI Road', city: 'Jaipur', state: 'Rajasthan', phone: '9912345678', email: 'sharma.medicos@gmail.com', creditLimit: 80000, paymentTerms: 'Net 7', segment: 'Silver', totalOrders: 67, totalRevenue: 520000, avgOrderValue: 7761, outstandingAmount: 8500, lastPurchaseDate: '2026-06-20', joinedDate: '2023-06-18' },
  { id: 'C006', name: 'Arjun Nair', storeName: 'Nair Pharmacy', gstNumber: '32AABCN2345F6Z4', drugLicense: 'KL-EKM-567890', address: '89 MG Road', city: 'Kochi', state: 'Kerala', phone: '9847654321', email: 'nair.pharmacy@gmail.com', creditLimit: 120000, paymentTerms: 'Net 15', segment: 'Silver', totalOrders: 93, totalRevenue: 780000, avgOrderValue: 8387, outstandingAmount: 22000, lastPurchaseDate: '2026-06-27', joinedDate: '2022-09-12' },
  { id: 'C007', name: 'Priya Iyer', storeName: 'Sri Lakshmi Medical', gstNumber: '33AABCI6789G7Z2', drugLicense: 'TN-CHE-234567', address: '123 T Nagar', city: 'Chennai', state: 'Tamil Nadu', phone: '9876543210', email: 'srilakshmi@gmail.com', creditLimit: 180000, paymentTerms: 'Net 30', segment: 'Gold', totalOrders: 145, totalRevenue: 1680000, avgOrderValue: 11586, outstandingAmount: 38000, lastPurchaseDate: '2026-07-02', joinedDate: '2021-04-22' },
  { id: 'C008', name: 'Deepak Gupta', storeName: 'Gupta Medicines', gstNumber: '09AABCG1234H8Z0', drugLicense: 'UP-LKO-890123', address: '45 Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', phone: '9889012345', email: 'gupta.medicines@gmail.com', creditLimit: 60000, paymentTerms: 'Net 7', segment: 'Bronze', totalOrders: 38, totalRevenue: 245000, avgOrderValue: 6447, outstandingAmount: 5200, lastPurchaseDate: '2026-06-15', joinedDate: '2024-02-10' },
  { id: 'C009', name: 'Kavita Joshi', storeName: 'Joshi Drug House', gstNumber: '27AABCJ5678I9Z8', drugLicense: 'MH-NGP-456789', address: '67 Sitabuldi', city: 'Nagpur', state: 'Maharashtra', phone: '9823456789', email: 'joshi.drugs@gmail.com', creditLimit: 90000, paymentTerms: 'Net 15', segment: 'Silver', totalOrders: 71, totalRevenue: 590000, avgOrderValue: 8310, outstandingAmount: 12000, lastPurchaseDate: '2026-06-22', joinedDate: '2023-03-28' },
  { id: 'C010', name: 'Sanjay Verma', storeName: 'Verma Healthcare', gstNumber: '23AABCV9012J0Z6', drugLicense: 'MP-BPL-012345', address: '234 New Market', city: 'Bhopal', state: 'Madhya Pradesh', phone: '9834567890', email: 'verma.health@gmail.com', creditLimit: 50000, paymentTerms: 'Net 7', segment: 'Bronze', totalOrders: 29, totalRevenue: 185000, avgOrderValue: 6379, outstandingAmount: 3800, lastPurchaseDate: '2026-06-10', joinedDate: '2024-05-15' },
  { id: 'C011', name: 'Neha Singh', storeName: 'Singh Medical Center', gstNumber: '06AABCS3456K1Z4', drugLicense: 'HR-GGN-678901', address: '12 DLF Phase 3', city: 'Gurugram', state: 'Haryana', phone: '9912345670', email: 'singh.medical@gmail.com', creditLimit: 250000, paymentTerms: 'Net 30', segment: 'Gold', totalOrders: 167, totalRevenue: 2100000, avgOrderValue: 12575, outstandingAmount: 55000, lastPurchaseDate: '2026-07-01', joinedDate: '2021-01-08' },
  { id: 'C012', name: 'Mahesh Bhat', storeName: 'Bhat Pharmacy Plus', gstNumber: '29AABCB7890L2Z2', drugLicense: 'KA-MYS-234567', address: '56 Sayyaji Rao Road', city: 'Mysore', state: 'Karnataka', phone: '9845670123', email: 'bhat.pharmacy@gmail.com', creditLimit: 70000, paymentTerms: 'Net 15', segment: 'Bronze', totalOrders: 45, totalRevenue: 320000, avgOrderValue: 7111, outstandingAmount: 7800, lastPurchaseDate: '2026-06-18', joinedDate: '2023-11-20' },
  { id: 'C013', name: 'Ravi Shankar', storeName: 'Shankar Drug Store', gstNumber: '33AABCS2345M3Z0', drugLicense: 'TN-MDU-890123', address: '89 East Veli Street', city: 'Madurai', state: 'Tamil Nadu', phone: '9867890123', email: 'shankar.drugs@gmail.com', creditLimit: 100000, paymentTerms: 'Net 15', segment: 'Silver', totalOrders: 78, totalRevenue: 650000, avgOrderValue: 8333, outstandingAmount: 18000, lastPurchaseDate: '2026-06-26', joinedDate: '2022-07-14' },
  { id: 'C014', name: 'Sunita Agarwal', storeName: 'Agarwal Medical Hub', gstNumber: '19AABCA6789N4Z8', drugLicense: 'WB-KOL-456789', address: '34 Park Street', city: 'Kolkata', state: 'West Bengal', phone: '9830123456', email: 'agarwal.medical@gmail.com', creditLimit: 140000, paymentTerms: 'Net 30', segment: 'Gold', totalOrders: 112, totalRevenue: 1280000, avgOrderValue: 11429, outstandingAmount: 32000, lastPurchaseDate: '2026-06-29', joinedDate: '2022-02-05' },
  { id: 'C015', name: 'Ashok Pillai', storeName: 'Pillai Medicals', gstNumber: '32AABCP1234O5Z6', drugLicense: 'KL-TVM-012345', address: '12 MG Road', city: 'Thiruvananthapuram', state: 'Kerala', phone: '9847012345', email: 'pillai.medicals@gmail.com', creditLimit: 85000, paymentTerms: 'Net 15', segment: 'Silver', totalOrders: 64, totalRevenue: 480000, avgOrderValue: 7500, outstandingAmount: 9500, lastPurchaseDate: '2026-06-21', joinedDate: '2023-08-30' },
]

// ============================================================
// DISTRIBUTORS
// ============================================================
export const distributors: Distributor[] = [
  { id: 'D001', name: 'ABC Pharma Distributors', agencyCode: 'APD-001', gstNumber: '27AABCA1234P1Z5', drugLicense: 'MH-WS-001234', contactPerson: 'Rajiv Mehta', phone: '9876543201', email: 'abc.pharma@gmail.com', address: '456 MIDC, Andheri East', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 8500000, outstandingAmount: 125000, rating: 4.8 },
  { id: 'D002', name: 'National Drug House', agencyCode: 'NDH-002', gstNumber: '07AABCN5678Q2Z3', drugLicense: 'DL-WS-005678', contactPerson: 'Amit Singh', phone: '9876543202', email: 'ndh.delhi@gmail.com', address: '789 Darya Ganj', city: 'Delhi', state: 'Delhi', totalPurchases: 6200000, outstandingAmount: 85000, rating: 4.5 },
  { id: 'D003', name: 'Southern Pharma Supplies', agencyCode: 'SPS-003', gstNumber: '33AABCS9012R3Z1', drugLicense: 'TN-WS-009012', contactPerson: 'Karthik Rajan', phone: '9876543203', email: 'sps.chennai@gmail.com', address: '321 Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', totalPurchases: 4800000, outstandingAmount: 65000, rating: 4.3 },
  { id: 'D004', name: 'Western Drug Corporation', agencyCode: 'WDC-004', gstNumber: '24AABCW3456S4Z9', drugLicense: 'GJ-WS-003456', contactPerson: 'Hitesh Shah', phone: '9876543204', email: 'wdc.ahmedabad@gmail.com', address: '567 CG Road', city: 'Ahmedabad', state: 'Gujarat', totalPurchases: 5500000, outstandingAmount: 92000, rating: 4.6 },
  { id: 'D005', name: 'Eastern Medicorp', agencyCode: 'EMC-005', gstNumber: '19AABCE7890T5Z7', drugLicense: 'WB-WS-007890', contactPerson: 'Debashish Roy', phone: '9876543205', email: 'emc.kolkata@gmail.com', address: '890 Salt Lake', city: 'Kolkata', state: 'West Bengal', totalPurchases: 3800000, outstandingAmount: 48000, rating: 4.2 },
  { id: 'D006', name: 'Cipla Distribution Network', agencyCode: 'CDN-006', gstNumber: '27AABCC2345U6Z5', drugLicense: 'MH-WS-012345', contactPerson: 'Manish Jain', phone: '9876543206', email: 'cdn.mumbai@gmail.com', address: '123 Worli', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 12500000, outstandingAmount: 180000, rating: 4.9 },
  { id: 'D007', name: 'Sun Pharma Wholesale', agencyCode: 'SPW-007', gstNumber: '24AABCS6789V7Z3', drugLicense: 'GJ-WS-056789', contactPerson: 'Dilip Patel', phone: '9876543207', email: 'spw.baroda@gmail.com', address: '456 Alkapuri', city: 'Vadodara', state: 'Gujarat', totalPurchases: 9200000, outstandingAmount: 135000, rating: 4.7 },
  { id: 'D008', name: 'Karnataka Drug Warehouse', agencyCode: 'KDW-008', gstNumber: '29AABCK1234W8Z1', drugLicense: 'KA-WS-001234', contactPerson: 'Nagesh Rao', phone: '9876543208', email: 'kdw.bangalore@gmail.com', address: '789 Koramangala', city: 'Bangalore', state: 'Karnataka', totalPurchases: 4100000, outstandingAmount: 55000, rating: 4.4 },
  { id: 'D009', name: 'Punjab Pharma Agency', agencyCode: 'PPA-009', gstNumber: '03AABCP5678X9Z9', drugLicense: 'PB-WS-005678', contactPerson: 'Gurpreet Sandhu', phone: '9876543209', email: 'ppa.ludhiana@gmail.com', address: '321 GT Road', city: 'Ludhiana', state: 'Punjab', totalPurchases: 3200000, outstandingAmount: 42000, rating: 4.1 },
  { id: 'D010', name: 'Rajasthan Medical Suppliers', agencyCode: 'RMS-010', gstNumber: '08AABCR9012Y0Z7', drugLicense: 'RJ-WS-009012', contactPerson: 'Anil Rathore', phone: '9876543210', email: 'rms.jaipur@gmail.com', address: '567 Johri Bazar', city: 'Jaipur', state: 'Rajasthan', totalPurchases: 2800000, outstandingAmount: 38000, rating: 4.0 },
]

// ============================================================
// INVOICES
// ============================================================
function generateInvoiceItems(count: number): InvoiceItem[] {
  const items: InvoiceItem[] = []
  const sampleProducts = products.slice(0, 20)
  for (let i = 0; i < count; i++) {
    const product = sampleProducts[Math.floor(pseudoRandom() * sampleProducts.length)]
    const qty = Math.floor(pseudoRandom() * 50) + 5
    const discount = pseudoRandom() > 0.6 ? Math.floor(pseudoRandom() * 10) + 2 : 0
    const unitPrice = product.sellingPrice
    const discountedPrice = unitPrice * (1 - discount / 100)
    const gstAmt = (discountedPrice * qty * product.gstPercent) / 100
    items.push({
      productId: product.id,
      productName: product.name,
      batchNumber: product.batchNumber,
      quantity: qty,
      unitPrice,
      discount,
      gstPercent: product.gstPercent,
      gstAmount: Math.round(gstAmt * 100) / 100,
      total: Math.round((discountedPrice * qty + gstAmt) * 100) / 100,
    })
  }
  return items
}

export const invoices: Invoice[] = Array.from({ length: 50 }, (_, i) => {
  const customer = customers[i % customers.length]
  const items = generateInvoiceItems(Math.floor(pseudoRandom() * 4) + 2)
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discountAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.discount / 100), 0)
  const gstAmount = items.reduce((sum, item) => sum + item.gstAmount, 0)
  const grandTotal = subtotal - discountAmount + gstAmount
  const statuses: Invoice['status'][] = ['Paid', 'Paid', 'Paid', 'Sent', 'Overdue', 'Draft']
  const status = statuses[i % statuses.length]
  const date = new Date(2026, 5 - Math.floor(i / 10), 28 - (i % 28))
  const dueDate = new Date(date)
  dueDate.setDate(dueDate.getDate() + 30)
  return {
    id: `INV${String(i + 1).padStart(3, '0')}`,
    invoiceNumber: `MS-2026-${String(i + 1).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    storeName: customer.storeName,
    date: date.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    items,
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    gstAmount: Math.round(gstAmount),
    grandTotal: Math.round(grandTotal),
    status,
    paymentStatus: status === 'Paid' ? 'Paid' : status === 'Overdue' ? 'Overdue' : 'Pending',
    branchId: 'BR001',
  }
})

// ============================================================
// ORDERS
// ============================================================
export const orders: Order[] = Array.from({ length: 80 }, (_, i) => {
  const customer = customers[i % customers.length]
  const orderProducts = products.slice(Math.floor(pseudoRandom() * 10), Math.floor(pseudoRandom() * 10) + 5)
  const items = orderProducts.map(p => ({
    productName: p.name,
    quantity: Math.floor(pseudoRandom() * 30) + 5,
    price: p.sellingPrice,
  }))
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const statuses: OrderStatus[] = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled']
  const date = new Date(2026, 5 - Math.floor(i / 15), 30 - (i % 28))
  return {
    id: `ORD${String(i + 1).padStart(3, '0')}`,
    orderNumber: `ORD-2026-${String(i + 1).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    date: date.toISOString().split('T')[0],
    items,
    total: Math.round(total),
    status: statuses[i % statuses.length],
    branchId: branches[i % branches.length].id,
  }
})

// ============================================================
// USERS
// ============================================================
export const users: User[] = [
  { id: 'U001', name: 'Rajesh Sharma', email: 'rajesh@medispot.in', role: 'Super Admin', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543210', isActive: true, lastLogin: '2026-07-02T09:30:00' },
  { id: 'U002', name: 'Priya Gupta', email: 'priya@medispot.in', role: 'Branch Manager', branchId: 'BR002', branchName: 'Delhi Branch', avatar: '', phone: '9876543211', isActive: true, lastLogin: '2026-07-02T08:45:00' },
  { id: 'U003', name: 'Arun Kumar', email: 'arun@medispot.in', role: 'Branch Manager', branchId: 'BR003', branchName: 'Bangalore Branch', avatar: '', phone: '9876543212', isActive: true, lastLogin: '2026-07-01T16:20:00' },
  { id: 'U004', name: 'Lakshmi Iyer', email: 'lakshmi@medispot.in', role: 'Sales Manager', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543213', isActive: true, lastLogin: '2026-07-02T10:00:00' },
  { id: 'U005', name: 'Amit Singh', email: 'amit@medispot.in', role: 'Inventory Manager', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543214', isActive: true, lastLogin: '2026-07-02T07:30:00' },
  { id: 'U006', name: 'Kavita Desai', email: 'kavita@medispot.in', role: 'Accountant', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543215', isActive: true, lastLogin: '2026-07-01T18:00:00' },
  { id: 'U007', name: 'Rohit Verma', email: 'rohit@medispot.in', role: 'Sales Executive', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543216', isActive: true, lastLogin: '2026-07-02T09:15:00' },
  { id: 'U008', name: 'Sneha Patil', email: 'sneha@medispot.in', role: 'Sales Executive', branchId: 'BR002', branchName: 'Delhi Branch', avatar: '', phone: '9876543217', isActive: true, lastLogin: '2026-07-01T14:00:00' },
  { id: 'U009', name: 'Vikram Joshi', email: 'vikram@medispot.in', role: 'Admin', branchId: 'BR001', branchName: 'Mumbai Head Office', avatar: '', phone: '9876543218', isActive: true, lastLogin: '2026-07-02T11:00:00' },
  { id: 'U010', name: 'Sanjay Das', email: 'sanjay@medispot.in', role: 'Branch Manager', branchId: 'BR005', branchName: 'Kolkata Branch', avatar: '', phone: '9876543219', isActive: false, lastLogin: '2026-06-28T12:00:00' },
]

// ============================================================
// STOCK ENTRIES
// ============================================================
export const stockEntries: StockEntry[] = [
  { id: 'SE001', productId: 'P001', productName: 'Dolo 650', type: 'Stock In', quantity: 500, batchNumber: 'BT2024A01', date: '2026-06-15', reference: 'PO-2026-0045', branchId: 'BR001', notes: 'Regular purchase from Micro Labs' },
  { id: 'SE002', productId: 'P001', productName: 'Dolo 650', type: 'Stock Out', quantity: 200, batchNumber: 'BT2024A01', date: '2026-06-18', reference: 'INV-2026-0012', branchId: 'BR001', notes: 'Sold to Patel Medical Store' },
  { id: 'SE003', productId: 'P008', productName: 'Amoxyclav 625', type: 'Stock In', quantity: 100, batchNumber: 'BT2024A08', date: '2026-06-20', reference: 'PO-2026-0048', branchId: 'BR001', notes: 'Urgent restock from Cipla' },
  { id: 'SE004', productId: 'P008', productName: 'Amoxyclav 625', type: 'Stock Out', quantity: 85, batchNumber: 'BT2024A08', date: '2026-06-25', reference: 'INV-2026-0018', branchId: 'BR001', notes: 'Multiple customer orders' },
  { id: 'SE005', productId: 'P010', productName: 'Insulin Glargine', type: 'Stock In', quantity: 50, batchNumber: 'BT2024A10', date: '2026-06-22', reference: 'PO-2026-0050', branchId: 'BR001', notes: 'Cold chain delivery from Sanofi' },
  { id: 'SE006', productId: 'P003', productName: 'Crocin Advance', type: 'Adjustment', quantity: -20, batchNumber: 'BT2024A03', date: '2026-06-28', reference: 'ADJ-2026-0005', branchId: 'BR001', notes: 'Damage during transit' },
  { id: 'SE007', productId: 'P015', productName: 'MuscleTech Whey Protein', type: 'Transfer', quantity: 10, batchNumber: 'BT2024A15', date: '2026-06-30', reference: 'TRF-BR002-001', branchId: 'BR002', notes: 'Transfer from Mumbai to Delhi' },
  { id: 'SE008', productId: 'P038', productName: 'Ranitidine 150mg', type: 'Return', quantity: 50, batchNumber: 'BT2024A38', date: '2026-07-01', reference: 'RET-2026-0003', branchId: 'BR001', notes: 'Customer return - near expiry' },
]

// ============================================================
// REORDER SUGGESTIONS
// ============================================================
export const reorderSuggestions: ReorderSuggestion[] = [
  { customerId: 'C001', customerName: 'Ramesh Patel', storeName: 'Patel Medical Store', productId: 'P001', productName: 'Dolo 650', lastOrderDate: '2026-06-15', avgInterval: 15, expectedReorderDate: '2026-07-01', recommendedQty: 200, lastQty: 180, confidence: 92 },
  { customerId: 'C002', customerName: 'Suresh Kumar', storeName: 'Kumar Pharma', productId: 'P003', productName: 'Crocin Advance', lastOrderDate: '2026-06-20', avgInterval: 10, expectedReorderDate: '2026-07-01', recommendedQty: 150, lastQty: 140, confidence: 88 },
  { customerId: 'C003', customerName: 'Anita Deshmukh', storeName: 'Shree Medical Agency', productId: 'P005', productName: 'Pan D', lastOrderDate: '2026-06-18', avgInterval: 12, expectedReorderDate: '2026-07-01', recommendedQty: 100, lastQty: 95, confidence: 85 },
  { customerId: 'C001', customerName: 'Ramesh Patel', storeName: 'Patel Medical Store', productId: 'P007', productName: 'Combiflam', lastOrderDate: '2026-06-22', avgInterval: 20, expectedReorderDate: '2026-07-12', recommendedQty: 120, lastQty: 110, confidence: 78 },
  { customerId: 'C007', customerName: 'Priya Iyer', storeName: 'Sri Lakshmi Medical', productId: 'P002', productName: 'Azithral 500', lastOrderDate: '2026-06-25', avgInterval: 14, expectedReorderDate: '2026-07-09', recommendedQty: 80, lastQty: 75, confidence: 82 },
  { customerId: 'C004', customerName: 'Vijay Reddy', storeName: 'Reddy Health Mart', productId: 'P017', productName: 'Cetirizine 10mg', lastOrderDate: '2026-06-10', avgInterval: 21, expectedReorderDate: '2026-07-01', recommendedQty: 250, lastQty: 230, confidence: 75 },
  { customerId: 'C011', customerName: 'Neha Singh', storeName: 'Singh Medical Center', productId: 'P019', productName: 'Metformin 500mg', lastOrderDate: '2026-06-28', avgInterval: 7, expectedReorderDate: '2026-07-05', recommendedQty: 300, lastQty: 280, confidence: 95 },
  { customerId: 'C014', customerName: 'Sunita Agarwal', storeName: 'Agarwal Medical Hub', productId: 'P029', productName: 'Aspirin 75mg', lastOrderDate: '2026-06-20', avgInterval: 14, expectedReorderDate: '2026-07-04', recommendedQty: 500, lastQty: 450, confidence: 90 },
]

// ============================================================
// SALES TARGETS
// ============================================================
export const salesTargets: SalesTarget[] = [
  { id: 'ST001', type: 'branch', targetId: 'BR001', targetName: 'Mumbai Head Office', month: '2026-07', targetAmount: 5000000, achievedAmount: 1250000, percentage: 25 },
  { id: 'ST002', type: 'branch', targetId: 'BR002', targetName: 'Delhi Branch', month: '2026-07', targetAmount: 3500000, achievedAmount: 420000, percentage: 12 },
  { id: 'ST003', type: 'branch', targetId: 'BR003', targetName: 'Bangalore Branch', month: '2026-07', targetAmount: 3000000, achievedAmount: 380000, percentage: 12.7 },
  { id: 'ST004', type: 'branch', targetId: 'BR004', targetName: 'Chennai Branch', month: '2026-07', targetAmount: 2200000, achievedAmount: 290000, percentage: 13.2 },
  { id: 'ST005', type: 'branch', targetId: 'BR005', targetName: 'Kolkata Branch', month: '2026-07', targetAmount: 1800000, achievedAmount: 195000, percentage: 10.8 },
  { id: 'ST006', type: 'employee', targetId: 'U007', targetName: 'Rohit Verma', month: '2026-07', targetAmount: 800000, achievedAmount: 245000, percentage: 30.6 },
  { id: 'ST007', type: 'employee', targetId: 'U008', targetName: 'Sneha Patil', month: '2026-07', targetAmount: 600000, achievedAmount: 168000, percentage: 28 },
  { id: 'ST008', type: 'employee', targetId: 'U004', targetName: 'Lakshmi Iyer', month: '2026-07', targetAmount: 1200000, achievedAmount: 380000, percentage: 31.7 },
]

// ============================================================
// ACTIVITIES
// ============================================================
export const activities: Activity[] = [
  { id: 'A001', type: 'order', title: 'New Order Received', description: 'Order #ORD-2026-0080 from Patel Medical Store — ₹24,500', timestamp: '2026-07-02T10:30:00', user: 'Rohit Verma', icon: 'ShoppingCart' },
  { id: 'A002', type: 'payment', title: 'Payment Received', description: '₹45,000 received from Kumar Pharma — Invoice MS-2026-0042', timestamp: '2026-07-02T09:45:00', user: 'Kavita Desai', icon: 'CreditCard' },
  { id: 'A003', type: 'stock', title: 'Stock Updated', description: '500 units of Dolo 650 added to inventory — Batch BT2024A01', timestamp: '2026-07-02T09:15:00', user: 'Amit Singh', icon: 'Package' },
  { id: 'A004', type: 'alert', title: 'Low Stock Alert', description: 'Amoxyclav 625 stock is critically low — 15 units remaining (Min: 40)', timestamp: '2026-07-02T08:30:00', user: 'System', icon: 'AlertTriangle' },
  { id: 'A005', type: 'customer', title: 'New Customer Added', description: 'Raj Medical Store — GST: 27AABCR1234Z1Z5 — Added by Sneha Patil', timestamp: '2026-07-02T08:00:00', user: 'Sneha Patil', icon: 'UserPlus' },
  { id: 'A006', type: 'invoice', title: 'Invoice Generated', description: 'Invoice MS-2026-0050 for ₹18,750 — Shree Medical Agency', timestamp: '2026-07-01T17:30:00', user: 'Lakshmi Iyer', icon: 'FileText' },
  { id: 'A007', type: 'alert', title: 'Expiry Warning', description: 'Ranitidine 150mg — Batch BT2024A38 expiring on 30-Jul-2026 (28 days)', timestamp: '2026-07-01T16:00:00', user: 'System', icon: 'Clock' },
  { id: 'A008', type: 'order', title: 'Order Dispatched', description: 'Order #ORD-2026-0078 shipped to Reddy Health Mart via BlueDart', timestamp: '2026-07-01T14:30:00', user: 'Arun Kumar', icon: 'Truck' },
  { id: 'A009', type: 'payment', title: 'Payment Overdue', description: '₹32,000 overdue from Joshi Drug House — Invoice MS-2026-0035', timestamp: '2026-07-01T12:00:00', user: 'System', icon: 'AlertCircle' },
  { id: 'A010', type: 'stock', title: 'Stock Transfer', description: '10 units of MuscleTech Whey Protein transferred to Delhi Branch', timestamp: '2026-07-01T10:00:00', user: 'Amit Singh', icon: 'ArrowRightLeft' },
]

// ============================================================
// DEMAND PREDICTIONS
// ============================================================
export const demandPredictions: DemandPrediction[] = [
  { productId: 'P001', productName: 'Dolo 650', category: 'Tablets', currentStock: 40, avgMonthlySales: 850, predictedDemand: 1037, changePercent: 22, recommendedStock: 500, confidence: 89, trend: 'up', seasonalFactor: 'Monsoon flu season drives higher demand' },
  { productId: 'P003', productName: 'Crocin Advance', category: 'Tablets', currentStock: 520, avgMonthlySales: 620, predictedDemand: 732, changePercent: 18, recommendedStock: 400, confidence: 85, trend: 'up', seasonalFactor: 'Seasonal fever increase' },
  { productId: 'P017', productName: 'Cetirizine 10mg', category: 'Tablets', currentStock: 680, avgMonthlySales: 450, predictedDemand: 585, changePercent: 30, recommendedStock: 300, confidence: 92, trend: 'up', seasonalFactor: 'Allergy season approaching' },
  { productId: 'P019', productName: 'Metformin 500mg', category: 'Tablets', currentStock: 900, avgMonthlySales: 380, predictedDemand: 395, changePercent: 4, recommendedStock: 200, confidence: 94, trend: 'stable', seasonalFactor: 'Consistent chronic medication demand' },
  { productId: 'P009', productName: 'Benadryl Cough Syrup', category: 'Syrups', currentStock: 180, avgMonthlySales: 120, predictedDemand: 168, changePercent: 40, recommendedStock: 100, confidence: 87, trend: 'up', seasonalFactor: 'Monsoon respiratory issues' },
  { productId: 'P015', productName: 'MuscleTech Whey Protein', category: 'Nutraceuticals', currentStock: 35, avgMonthlySales: 25, predictedDemand: 22, changePercent: -12, recommendedStock: 15, confidence: 72, trend: 'down', seasonalFactor: 'Post-summer decline in fitness supplements' },
  { productId: 'P029', productName: 'Aspirin 75mg', category: 'Tablets', currentStock: 1200, avgMonthlySales: 320, predictedDemand: 336, changePercent: 5, recommendedStock: 200, confidence: 91, trend: 'stable', seasonalFactor: 'Consistent cardiovascular medication' },
  { productId: 'P040', productName: 'Ashwagandha Capsules', category: 'Ayurvedic Products', currentStock: 280, avgMonthlySales: 95, predictedDemand: 114, changePercent: 20, recommendedStock: 60, confidence: 78, trend: 'up', seasonalFactor: 'Growing ayurvedic wellness trend' },
]

// ============================================================
// PRODUCT RECOMMENDATIONS
// ============================================================
export const productRecommendations: ProductRecommendation[] = [
  { triggerProduct: 'Dolo 650', recommendations: [{ productName: 'Vitamin C 500mg', confidence: 85, reason: 'Frequently bought together for fever & immunity' }, { productName: 'Zinc Tablets 20mg', confidence: 78, reason: 'Common immunity booster combination' }, { productName: 'ORS Powder', confidence: 72, reason: 'Hydration support during fever' }] },
  { triggerProduct: 'Azithral 500', recommendations: [{ productName: 'Pan D', confidence: 82, reason: 'Gastric protection with antibiotics' }, { productName: 'Becosules Capsules', confidence: 75, reason: 'Probiotic support during antibiotic course' }, { productName: 'Combiflam', confidence: 68, reason: 'Pain & inflammation relief' }] },
  { triggerProduct: 'Metformin 500mg', recommendations: [{ productName: 'Glimepiride 2mg', confidence: 88, reason: 'Combined diabetes management' }, { productName: 'Atorvastatin 20mg', confidence: 82, reason: 'Diabetic patients often need cholesterol control' }, { productName: 'Aspirin 75mg', confidence: 76, reason: 'Cardiovascular protection for diabetics' }] },
  { triggerProduct: 'Amlodipine 5mg', recommendations: [{ productName: 'Losartan 50mg', confidence: 80, reason: 'Combined hypertension management' }, { productName: 'Atorvastatin 20mg', confidence: 75, reason: 'Cardiac risk factor management' }, { productName: 'Aspirin 75mg', confidence: 72, reason: 'Cardiovascular protection' }] },
  { triggerProduct: 'Cetirizine 10mg', recommendations: [{ productName: 'Montelukast 10mg', confidence: 84, reason: 'Combined allergy management' }, { productName: 'Levocetrizine 5mg', confidence: 70, reason: 'Alternative/upgraded antihistamine' }, { productName: 'Eye Drops Refresh', confidence: 65, reason: 'Allergy-related eye irritation' }] },
]

// ============================================================
// ANALYTICS DATA
// ============================================================
export const monthlySalesData = [
  { month: 'Jan', sales: 2800000, target: 3000000, profit: 520000 },
  { month: 'Feb', sales: 3200000, target: 3000000, profit: 610000 },
  { month: 'Mar', sales: 2950000, target: 3200000, profit: 545000 },
  { month: 'Apr', sales: 3500000, target: 3200000, profit: 680000 },
  { month: 'May', sales: 3800000, target: 3500000, profit: 720000 },
  { month: 'Jun', sales: 4200000, target: 3500000, profit: 810000 },
  { month: 'Jul', sales: 1250000, target: 4000000, profit: 245000 },
]

export const annualRevenueData = [
  { year: '2022', revenue: 28000000, profit: 5200000, expenses: 22800000 },
  { year: '2023', revenue: 35000000, profit: 6800000, expenses: 28200000 },
  { year: '2024', revenue: 42000000, profit: 8400000, expenses: 33600000 },
  { year: '2025', revenue: 48000000, profit: 9600000, expenses: 38400000 },
  { year: '2026', revenue: 21700000, profit: 4130000, expenses: 17570000 },
]

export const categorySalesData = [
  { category: 'Tablets', sales: 8500000, percentage: 42 },
  { category: 'Capsules', sales: 3200000, percentage: 16 },
  { category: 'Syrups', sales: 2400000, percentage: 12 },
  { category: 'Injections', sales: 1800000, percentage: 9 },
  { category: 'Ointments', sales: 1200000, percentage: 6 },
  { category: 'Surgical', sales: 1000000, percentage: 5 },
  { category: 'Ayurvedic', sales: 800000, percentage: 4 },
  { category: 'Nutra', sales: 600000, percentage: 3 },
  { category: 'Devices', sales: 400000, percentage: 2 },
  { category: 'Drops', sales: 200000, percentage: 1 },
]

export const branchPerformanceData = branches.map(b => ({
  branch: b.name.replace(' Branch', '').replace(' Head Office', ' HQ'),
  revenue: b.totalRevenue,
  orders: b.totalOrders,
  target: b.totalRevenue * 1.2,
}))

// ============================================================
// DASHBOARD KPIs
// ============================================================
export const dashboardKPIs = {
  todaysSales: 185000,
  weeklySales: 1250000,
  monthlySales: 4200000,
  annualSales: 21700000,
  totalRevenue: 48000000,
  totalProfit: 9600000,
  totalCustomers: customers.length,
  totalDistributors: distributors.length,
  totalProducts: products.length,
  totalOrders: orders.length,
  outstandingPayments: customers.reduce((sum, c) => sum + c.outstandingAmount, 0),
  lowStockProducts: products.filter(p => p.currentStock <= p.minimumStock).length,
  expiringProducts: products.filter(p => {
    const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date("2026-07-07T00:00:00Z").getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 && days <= 90
  }).length,
  todaysTrend: 12.5,
  weeklyTrend: 8.3,
  monthlyTrend: 15.2,
  annualTrend: 22.1,
}
