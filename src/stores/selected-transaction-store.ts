import { create } from "zustand";
import { Transaction } from "../models/transaction";

interface SelectedTransactionStore {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
}

export const useSelectedTransactionStore = create<SelectedTransactionStore>(
  (set) => ({
    transaction: {
      category: "",
      date: "",
      items: [],
      merchant: {
        name: "",
      },
      totalPrice: 0,
      transactionType: "",
      id: undefined,
    },
    setTransaction: (transaction: Transaction) => set({ transaction }),
  })
);
