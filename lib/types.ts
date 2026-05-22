// lib/types.ts - Shared type definitions

export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: {
    name: string;
    description?: string | null;
  };
}

export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE";

export interface Invoice {
  id: string;
  invoiceNumber: number;
  customerId: string;
  storeId: string;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: Date | string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
  store?: {
    id: string;
    name: string;
  };
  items: InvoiceItem[];
}

export interface InvoiceItemInput {
  productId: string;
  quantity: number;
}

export interface StoreStats {
  name: string;
  totalSales: number;
  monthlySales: number;
  orders: number;
  customers: number;
  inventory: number;
  recentTransactions: {
    id: string;
    invoiceNumber: number;
    customerName: string;
    amount: number;
    date: Date | string;
  }[];
}
