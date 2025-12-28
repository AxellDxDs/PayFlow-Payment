"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User,
  Wallet,
  Transaction,
  CryptoWallet,
  CartItem,
  Notification,
  Mission,
  Bill,
  Installment,
  UserLevel,
} from "./types"
import {
  mockWallet,
  mockTransactions,
  mockCryptoWallets,
  mockNotifications,
  mockMissions,
  LEVEL_CONFIGS,
} from "./mock-data"

const defaultWallet: Wallet = {
  id: "wallet-new",
  userId: "",
  balanceMain: 0,
  balanceMarket: 0,
  balanceSavings: 0,
  balancePoints: 0,
  currency: "IDR",
}

const defaultBills: Bill[] = [
  {
    id: "bill-1",
    type: "pln",
    name: "Listrik PLN",
    customerId: "123456789012",
    customerName: "Ahmad Santoso",
    amount: 385000,
    period: "Desember 2024",
    dueDate: new Date("2025-01-10"),
    status: "pending",
  },
  {
    id: "bill-2",
    type: "pdam",
    name: "PDAM Jakarta",
    customerId: "987654321",
    customerName: "Ahmad Santoso",
    amount: 125000,
    period: "Desember 2024",
    dueDate: new Date("2025-01-15"),
    status: "pending",
  },
  {
    id: "bill-3",
    type: "internet",
    name: "IndiHome",
    customerId: "IND123456",
    customerName: "Ahmad Santoso",
    amount: 450000,
    period: "Januari 2025",
    dueDate: new Date("2025-01-20"),
    status: "pending",
  },
]

const defaultInstallments: Installment[] = [
  {
    id: "inst-1",
    type: "vehicle",
    name: "Honda Vario 160",
    partner: "Adira Finance",
    contractNumber: "ADR/2024/123456",
    totalAmount: 28000000,
    paidAmount: 14000000,
    monthlyPayment: 1200000,
    tenure: 24,
    paidTenure: 12,
    nextDueDate: new Date("2025-01-25"),
    status: "active",
    paymentHistory: [],
  },
  {
    id: "inst-2",
    type: "electronics",
    name: "MacBook Pro M3",
    partner: "BCA Finance",
    contractNumber: "BCA/2024/789012",
    totalAmount: 35000000,
    paidAmount: 10000000,
    monthlyPayment: 2100000,
    tenure: 12,
    paidTenure: 5,
    nextDueDate: new Date("2025-01-20"),
    status: "active",
    paymentHistory: [],
  },
  {
    id: "inst-3",
    type: "phone",
    name: "iPhone 15 Pro Max",
    partner: "FIF Group",
    contractNumber: "FIF/2024/345678",
    totalAmount: 22000000,
    paidAmount: 16500000,
    monthlyPayment: 1850000,
    tenure: 12,
    paidTenure: 9,
    nextDueDate: new Date("2025-01-15"),
    status: "active",
    paymentHistory: [],
  },
]

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isProfileComplete: boolean
  isNewUser: boolean
  hasHydrated: boolean

  // Wallet
  wallet: Wallet
  cryptoWallets: CryptoWallet[]

  // Transactions
  transactions: Transaction[]

  // Cart (Food)
  cart: CartItem[]

  // Notifications
  notifications: Notification[]
  unreadCount: number

  // UI State
  sidebarOpen: boolean

  missions: Mission[]
  bills: Bill[]
  installments: Installment[]

  // Actions
  setHasHydrated: (state: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
  updateUser: (userData: Partial<User>) => void
  completeProfile: (profileData: { fullName: string; phone: string; username: string }) => void
  updateWallet: (wallet: Partial<Wallet>) => void
  addTransaction: (transaction: Transaction) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (menuItemId: string) => void
  updateCartQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  toggleSidebar: () => void

  updateMissionProgress: (missionId: string, progress: number) => void
  claimMissionReward: (missionId: string) => void
  resetDailyMissions: () => void

  payBill: (billId: string) => void
  generateNextMonthBill: (billType: string) => void

  payInstallment: (installmentId: string) => void

  addPoints: (points: number) => void
  checkAndUpdateLevel: () => void
}

const calculateLevel = (points: number): UserLevel => {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_CONFIGS[i].minPoints) {
      return LEVEL_CONFIGS[i].name
    }
  }
  return "bronze"
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isProfileComplete: false,
      isNewUser: false,
      hasHydrated: false,
      wallet: defaultWallet,
      cryptoWallets: [],
      transactions: [],
      cart: [],
      notifications: [],
      unreadCount: 0,
      sidebarOpen: true,
      missions: mockMissions.map((m) => ({ ...m, isClaimed: m.isCompleted })),
      bills: defaultBills,
      installments: defaultInstallments,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Auth Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (email && password) {
          const existingUser = get().user

          if (existingUser && existingUser.email === email) {
            const isComplete = existingUser.fullName !== "" && existingUser.phone !== ""
            set({
              wallet: get().wallet.balanceMain > 0 ? get().wallet : mockWallet,
              cryptoWallets: mockCryptoWallets,
              transactions: get().transactions.length > 0 ? get().transactions : mockTransactions,
              notifications: get().notifications.length > 0 ? get().notifications : mockNotifications,
              unreadCount:
                get().notifications.filter((n) => !n.isRead).length ||
                mockNotifications.filter((n) => !n.isRead).length,
              isAuthenticated: true,
              isLoading: false,
              isNewUser: !isComplete,
              isProfileComplete: isComplete,
            })
          } else {
            const newUser: User = {
              id: `user-${Date.now()}`,
              email: email,
              phone: "",
              fullName: "",
              username: email.split("@")[0],
              avatar: "",
              kycStatus: "pending",
              level: "bronze",
              points: 0,
              totalTransactions: 0,
              createdAt: new Date(),
              settings: {
                twoFactorEnabled: false,
                biometricEnabled: false,
                pinEnabled: false,
                language: "id",
                notifications: { push: true, email: true, sms: false },
                dailyLimit: 5000000,
              },
            }

            set({
              user: newUser,
              wallet: { ...defaultWallet, userId: newUser.id },
              cryptoWallets: [],
              transactions: [],
              notifications: [],
              unreadCount: 0,
              isAuthenticated: true,
              isLoading: false,
              isNewUser: true,
              isProfileComplete: false,
              missions: mockMissions.map((m) => ({ ...m, isClaimed: false, isCompleted: false, progress: 0 })),
              bills: defaultBills,
              installments: defaultInstallments,
            })
          }
          return true
        }

        set({ isLoading: false })
        return false
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (email && password) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: email,
            phone: "",
            fullName: "",
            username: email.split("@")[0],
            avatar: "",
            kycStatus: "pending",
            level: "bronze",
            points: 0,
            totalTransactions: 0,
            createdAt: new Date(),
            settings: {
              twoFactorEnabled: false,
              biometricEnabled: false,
              pinEnabled: false,
              language: "id",
              notifications: { push: true, email: true, sms: false },
              dailyLimit: 5000000,
            },
          }

          set({
            user: newUser,
            wallet: { ...defaultWallet, userId: newUser.id },
            cryptoWallets: [],
            transactions: [],
            notifications: [],
            unreadCount: 0,
            isAuthenticated: true,
            isLoading: false,
            isNewUser: true,
            isProfileComplete: false,
            missions: mockMissions.map((m) => ({ ...m, isClaimed: false, isCompleted: false, progress: 0 })),
            bills: defaultBills,
            installments: defaultInstallments,
          })
          return true
        }

        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({
          user: null,
          wallet: defaultWallet,
          cryptoWallets: [],
          transactions: [],
          cart: [],
          notifications: [],
          unreadCount: 0,
          isAuthenticated: false,
          isProfileComplete: false,
          isNewUser: false,
        })
      },

      setUser: (user) => set({ user }),

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          set({
            user: updatedUser,
            isProfileComplete: updatedUser.fullName !== "" && updatedUser.phone !== "",
          })
        }
      },

      completeProfile: (profileData) => {
        const currentUser = get().user
        const currentWallet = get().wallet
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            fullName: profileData.fullName,
            phone: profileData.phone,
            username: profileData.username || currentUser.username,
          }
          set({
            user: updatedUser,
            isProfileComplete: true,
            isNewUser: false,
            wallet: {
              ...currentWallet,
              balanceMain: currentWallet.balanceMain + 50000,
              balancePoints: currentWallet.balancePoints + 100,
            },
            notifications: [
              {
                id: `notif-welcome-${Date.now()}`,
                userId: currentUser.id,
                title: "Selamat Datang di PayFlow!",
                message: "Anda mendapatkan bonus saldo Rp50.000 untuk transaksi pertama Anda.",
                type: "promo",
                isRead: false,
                createdAt: new Date(),
              },
              ...get().notifications,
            ],
            unreadCount: get().unreadCount + 1,
          })
        }
      },

      updateWallet: (walletUpdate) => {
        const currentWallet = get().wallet
        set({ wallet: { ...currentWallet, ...walletUpdate } })
      },

      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }))
      },

      // Cart Actions
      addToCart: (item) => {
        set((state) => {
          const existingIndex = state.cart.findIndex((cartItem) => cartItem.menuItem.id === item.menuItem.id)

          if (existingIndex > -1) {
            const newCart = [...state.cart]
            newCart[existingIndex].quantity += item.quantity
            return { cart: newCart }
          }

          return { cart: [...state.cart, item] }
        })
      },

      removeFromCart: (menuItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.menuItem.id !== menuItemId),
        }))
      },

      updateCartQuantity: (menuItemId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) => (item.menuItem.id === menuItemId ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => set({ cart: [] }),

      // Notification Actions
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: state.notifications.filter((n) => !n.isRead && n.id !== id).length,
        }))
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))
      },

      // UI Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      updateMissionProgress: (missionId, progress) => {
        set((state) => ({
          missions: state.missions.map((m) => {
            if (m.id === missionId) {
              const newProgress = Math.min(progress, m.target)
              const isCompleted = newProgress >= m.target
              return { ...m, progress: newProgress, isCompleted }
            }
            return m
          }),
        }))
      },

      claimMissionReward: (missionId) => {
        const state = get()
        const mission = state.missions.find((m) => m.id === missionId)

        if (!mission || mission.isClaimed || !mission.isCompleted) return

        const currentWallet = state.wallet
        const currentUser = state.user

        // Add points reward
        let newPoints = currentWallet.balancePoints
        let newUserPoints = currentUser?.points || 0

        if (mission.rewardType === "points") {
          newPoints += mission.reward
          newUserPoints += mission.reward
        }

        // Calculate new level
        const newLevel = calculateLevel(newUserPoints)

        set({
          missions: state.missions.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m)),
          wallet: {
            ...currentWallet,
            balancePoints: newPoints,
          },
          user: currentUser
            ? {
                ...currentUser,
                points: newUserPoints,
                level: newLevel,
              }
            : null,
          notifications: [
            {
              id: `notif-mission-${Date.now()}`,
              userId: currentUser?.id || "",
              title: "Misi Selesai!",
              message: `Anda mendapatkan ${mission.reward} ${mission.rewardType === "points" ? "poin" : mission.rewardType} dari misi "${mission.title}"`,
              type: "transaction",
              isRead: false,
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })
      },

      resetDailyMissions: () => {
        set((state) => ({
          missions: state.missions.map((m) => ({
            ...m,
            progress: 0,
            isCompleted: false,
            isClaimed: false,
            expiresAt: new Date(new Date().setHours(23, 59, 59, 999)),
          })),
        }))
      },

      payBill: (billId) => {
        const state = get()
        const bill = state.bills.find((b) => b.id === billId)

        if (!bill || bill.status === "paid") return
        if ((state.wallet?.balanceMain || 0) < bill.amount) return

        const newBalance = state.wallet.balanceMain - bill.amount
        const pointsEarned = Math.floor(bill.amount / 10000) * 10 // 10 points per 10k

        // Generate next month bill
        const nextMonth = new Date(bill.dueDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        const nextPeriod = nextMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })

        const newBill: Bill = {
          ...bill,
          id: `bill-${Date.now()}`,
          period: nextPeriod,
          dueDate: nextMonth,
          status: "pending",
          amount: bill.amount + Math.floor(Math.random() * 50000) - 25000, // Vary amount slightly
        }

        set({
          bills: [
            ...state.bills.filter((b) => b.id !== billId),
            { ...bill, status: "paid", paidAt: new Date() },
            newBill,
          ].sort((a, b) => {
            if (a.status === "paid" && b.status !== "paid") return 1
            if (a.status !== "paid" && b.status === "paid") return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          }),
          wallet: {
            ...state.wallet,
            balanceMain: newBalance,
            balancePoints: state.wallet.balancePoints + pointsEarned,
          },
          user: state.user
            ? {
                ...state.user,
                points: state.user.points + pointsEarned,
                level: calculateLevel(state.user.points + pointsEarned),
              }
            : null,
          transactions: [
            {
              id: `tx-${Date.now()}`,
              userId: state.user?.id || "",
              type: "bills",
              amount: -bill.amount,
              fee: 2500,
              status: "success",
              description: `Pembayaran ${bill.name} - ${bill.period}`,
              createdAt: new Date(),
            },
            ...state.transactions,
          ],
          notifications: [
            {
              id: `notif-bill-${Date.now()}`,
              userId: state.user?.id || "",
              title: "Pembayaran Berhasil",
              message: `Tagihan ${bill.name} sebesar Rp${bill.amount.toLocaleString()} telah dibayar. Anda mendapat ${pointsEarned} poin!`,
              type: "transaction",
              isRead: false,
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })
      },

      generateNextMonthBill: (billType) => {
        // This is handled automatically in payBill
      },

      payInstallment: (installmentId) => {
        const state = get()
        const installment = state.installments.find((i) => i.id === installmentId)

        if (!installment || installment.status === "completed") return
        if ((state.wallet?.balanceMain || 0) < installment.monthlyPayment) return

        const newBalance = state.wallet.balanceMain - installment.monthlyPayment
        const newPaidAmount = installment.paidAmount + installment.monthlyPayment
        const newPaidTenure = installment.paidTenure + 1
        const isCompleted = newPaidTenure >= installment.tenure
        const pointsEarned = Math.floor(installment.monthlyPayment / 10000) * 15 // 15 points per 10k for installments

        // Calculate next due date (1 month later)
        const nextDueDate = new Date(installment.nextDueDate)
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)

        set({
          installments: state.installments.map((i) =>
            i.id === installmentId
              ? {
                  ...i,
                  paidAmount: newPaidAmount,
                  paidTenure: newPaidTenure,
                  nextDueDate: isCompleted ? i.nextDueDate : nextDueDate,
                  status: isCompleted ? "completed" : "active",
                  paymentHistory: [...i.paymentHistory, { date: new Date(), amount: installment.monthlyPayment }],
                }
              : i,
          ),
          wallet: {
            ...state.wallet,
            balanceMain: newBalance,
            balancePoints: state.wallet.balancePoints + pointsEarned,
          },
          user: state.user
            ? {
                ...state.user,
                points: state.user.points + pointsEarned,
                level: calculateLevel(state.user.points + pointsEarned),
              }
            : null,
          transactions: [
            {
              id: `tx-${Date.now()}`,
              userId: state.user?.id || "",
              type: "payment",
              amount: -installment.monthlyPayment,
              fee: 2500,
              status: "success",
              description: `Cicilan ${installment.name} - ${installment.partner} (${newPaidTenure}/${installment.tenure})`,
              createdAt: new Date(),
            },
            ...state.transactions,
          ],
          notifications: [
            {
              id: `notif-inst-${Date.now()}`,
              userId: state.user?.id || "",
              title: isCompleted ? "Cicilan Lunas!" : "Pembayaran Cicilan Berhasil",
              message: isCompleted
                ? `Selamat! Cicilan ${installment.name} telah lunas!`
                : `Cicilan ${installment.name} bulan ke-${newPaidTenure} berhasil dibayar. Anda mendapat ${pointsEarned} poin!`,
              type: "transaction",
              isRead: false,
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })
      },

      addPoints: (points) => {
        const state = get()
        const currentWallet = state.wallet
        const currentUser = state.user

        const newWalletPoints = currentWallet.balancePoints + points
        const newUserPoints = (currentUser?.points || 0) + points
        const newLevel = calculateLevel(newUserPoints)

        set({
          wallet: {
            ...currentWallet,
            balancePoints: newWalletPoints,
          },
          user: currentUser
            ? {
                ...currentUser,
                points: newUserPoints,
                level: newLevel,
              }
            : null,
        })
      },

      checkAndUpdateLevel: () => {
        const state = get()
        if (!state.user) return

        const newLevel = calculateLevel(state.user.points)
        if (newLevel !== state.user.level) {
          set({
            user: {
              ...state.user,
              level: newLevel,
            },
            notifications: [
              {
                id: `notif-level-${Date.now()}`,
                userId: state.user.id,
                title: "Level Up!",
                message: `Selamat! Anda naik ke level ${newLevel.charAt(0).toUpperCase() + newLevel.slice(1)}!`,
                type: "system",
                isRead: false,
                createdAt: new Date(),
              },
              ...state.notifications,
            ],
            unreadCount: state.unreadCount + 1,
          })
        }
      },
    }),
    {
      name: "payflow-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isProfileComplete: state.isProfileComplete,
        isNewUser: state.isNewUser,
        wallet: state.wallet,
        transactions: state.transactions,
        notifications: state.notifications,
        missions: state.missions,
        bills: state.bills,
        installments: state.installments,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
