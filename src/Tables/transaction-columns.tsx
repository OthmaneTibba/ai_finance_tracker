import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "../models/transaction";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";

type TransactionColumnProps = {
  onShowClicked: (transaction: Transaction) => void;
};

export const getTransactionsColumns = ({
  onShowClicked,
}: TransactionColumnProps): ColumnDef<Transaction>[] => [
  {
    id: "merchant",
    header: "Merchant",
    cell: ({ row }) => {
      const transaction = row.original;
      return <span>{transaction.merchant.name.substring(0, 10)}...</span>;
    },
  },

  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <>
          {transaction.transactionType == "Expense" ? (
            <div className="flex gap-1 items-center">
              <TrendingDown className="text-red-500" />
              <span>{transaction.transactionType}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TrendingUp className="text-green-500" />
              <span>{transaction.transactionType}</span>
            </div>
          )}
        </>
      );
    },
  },

  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;
      return <span className="flex">{transaction.totalPrice}</span>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Button onClick={() => onShowClicked(row.original)}>Show</Button>;
    },
  },
];
