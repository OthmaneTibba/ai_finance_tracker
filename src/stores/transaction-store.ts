import { create } from "zustand";
import { Transaction } from "../models/transaction";

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionsStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
}));
