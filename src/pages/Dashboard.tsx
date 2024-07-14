import { useUserStore } from "../stores/user-store";

import DashboardCard from "../components/DashboardCard";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FileScan } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllTransactions } from "../services/ApiService";

import { TransactionDatatable } from "../Tables/transaction-data-table";
import { Transaction } from "../models/transaction";
import { useTransactionsStore } from "../stores/transaction-store";
import { getTransactionsColumns } from "../Tables/transaction-columns";
import { useSelectedTransactionStore } from "../stores/selected-transaction-store";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const userStore = useUserStore();
  const transactionsStore = useTransactionsStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { setTransaction } = useSelectedTransactionStore();
  const navigate = useNavigate();
  const getTransactions = async () => {
    if (transactionsStore.transactions.length === 0) {
      const data = await getAllTransactions();
      transactionsStore.setTransactions(data);
      setTransactions(data);
    } else {
      setTransactions(transactionsStore.transactions);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  const onShowMoreClicked = useCallback((transaction: Transaction) => {
    setTransaction(transaction);
    navigate(`/dashboard/transactions/deltails/${transaction.id}`);
  }, []);
  const columns = useMemo(
    () => getTransactionsColumns({ onShowClicked: onShowMoreClicked }),
    []
  );
  return (
    <div className="flex flex-col gap-5">
      <div className="py-2">
        <h1 className="font-extrabold text-3xl">
          Hi {userStore.user.email} 👋
        </h1>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Card className="md:w-[500px] w-full">
          <CardHeader>
            <small className="text-black font-extrabold">Receipt Scanner</small>
            <p>
              Upload and scan your receipt now! track and organize your expenses
            </p>
          </CardHeader>
          <CardContent>
            <Button>
              <FileScan className="mr-2 h-4 w-4" />
              Scan now
            </Button>
          </CardContent>
        </Card>
        <DashboardCard />
        <DashboardCard />
      </div>

      <div>
        <TransactionDatatable columns={columns} data={transactions} />
      </div>
    </div>
  );
}
