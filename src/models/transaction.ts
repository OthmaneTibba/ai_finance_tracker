import { Item } from "./item";
import { Merchant } from "./merchant";

export interface Transaction {
  id?: string;
  category: string;
  items: Item[];
  merchant: Merchant;
  date: string;
  totalPrice: number;
  transactionType: string;
  attachment?: string;
}
