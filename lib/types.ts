// User & Authentication Types
export interface User {
  id: string
  email: string
  phone: string
  fullName: string
  username: string
  avatar?: string
  kycStatus: "pending" | "verified" | "rejected"
  level: UserLevel
  points: number
  totalTransactions: number
  createdAt: Date
  settings: UserSettings
}

export interface UserSettings {
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  pinEnabled: boolean
  language: "id" | "en"
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
  }
  dailyLimit: number
}

export type UserLevel = "bronze" | "silver" | "gold" | "platinum" | "diamond"

export interface LevelConfig {
  name: UserLevel
  displayName: string
  minPoints: number
  cashbackPercentage: number
  dailyLimit: number
  color: string
  icon: string
}

// Wallet Types
export interface Wallet {
  id: string
  userId: string
  balanceMain: number
  balanceMarket: number
  balanceSavings: number
  balancePoints: number
  currency: string
}

// Transaction Types
export type TransactionType =
  | "topup"
  | "transfer"
  | "payment"
  | "withdraw"
  | "pulsa"
  | "bills"
  | "food"
  | "crypto"
  | "cashback"
  | "reward"

export type TransactionStatus = "pending" | "success" | "failed" | "cancelled"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  fee: number
  status: TransactionStatus
  description: string
  recipient?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Crypto Types
export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  icon: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
}

export interface CryptoWallet {
  id: string
  userId: string
  coinType: string
  balance: number
  walletAddress: string
  valueInIdr: number
}

export interface CryptoTransaction {
  id: string
  userId: string
  type: "buy" | "sell" | "swap" | "stake" | "unstake"
  coin: string
  amount: number
  price: number
  total: number
  fee: number
  status: TransactionStatus
  createdAt: Date
}

// Food Delivery Types
export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  category: string[]
  priceLevel: 1 | 2 | 3
  distance: number
  deliveryTime: string
  deliveryFee: number
  isOpen: boolean
  isFeatured: boolean
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  image: string
  price: number
  category: string
  isPopular: boolean
  isAvailable: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface FoodOrder {
  id: string
  userId: string
  restaurantId: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
  deliveryAddress: string
  driverInfo?: {
    name: string
    phone: string
    vehicle: string
    location: { lat: number; lng: number }
  }
  createdAt: Date
}

// Gamification Types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: "transaction" | "crypto" | "food" | "social" | "special"
  requirement: string
  isEarned: boolean
  earnedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface Mission {
  id: string
  title: string
  description: string
  reward: number
  rewardType: "points" | "cashback" | "voucher"
  progress: number
  target: number
  expiresAt: Date
  isCompleted: boolean
  isClaimed: boolean // Added isClaimed field
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  points: number
  level: UserLevel
}

// Pulsa & Bills Types
export interface PulsaProvider {
  id: string
  name: string
  icon: string
  prefix: string[]
}

export interface PulsaPackage {
  id: string
  providerId: string
  name: string
  price: number
  value: number
  type: "pulsa" | "data" | "combo"
  validity: string
  description: string
}

export interface BillType {
  id: string
  name: string
  icon: string
  category: "electricity" | "water" | "internet" | "tv" | "phone"
}

export interface Bill {
  id: string
  type: string
  name: string
  customerId: string
  customerName: string
  amount: number
  period: string
  dueDate: Date
  status: "pending" | "paid"
  paidAt?: Date
}

export interface Installment {
  id: string
  type: string
  name: string
  partner: string
  contractNumber: string
  totalAmount: number
  paidAmount: number
  monthlyPayment: number
  tenure: number
  paidTenure: number
  nextDueDate: Date
  status: "active" | "completed"
  paymentHistory: { date: Date; amount: number }[]
}

// Promo Types
export interface Promo {
  id: string
  title: string
  description: string
  code?: string
  discount: number
  discountType: "percentage" | "fixed"
  minTransaction: number
  maxDiscount?: number
  validUntil: Date
  category: TransactionType[]
  image?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "transaction" | "promo" | "security" | "system"
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}
