import { Bot, FileInput, Loader2 } from "lucide-react";
import { TransactionDatatable } from "../Tables/transaction-data-table";

import { Transaction } from "../models/transaction";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllTransactions, scanReceipt } from "../services/ApiService";
import { useTransactionsStore } from "../stores/transaction-store";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSelectedTransactionStore } from "../stores/selected-transaction-store";
import { getTransactionsColumns } from "../Tables/transaction-columns";
import { loginRequest } from "../authConfig";
import { useMsal } from "@azure/msal-react";

function Receipt() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const transactionsStore = useTransactionsStore();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isPorcessing, setProcessing] = useState<boolean>(false);
  const [, setAiResponse] = useState<Transaction | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const slectedTransactionStore = useSelectedTransactionStore();
  const onUploadFileClicked = () => {
    document.getElementById("receipt-input")?.click();
  };

  const { instance } = useMsal();

  async function getAccessToken() {
    const account = (await instance.getAllAccounts().length) > 0;
    if (account) {
      instance.setActiveAccount(instance.getAllAccounts()[0]);
      const account = await instance.acquireTokenSilent(loginRequest);

      return account.accessToken;
    }
    return "";
  }
  const getTransactions = async () => {
    if (transactionsStore.transactions.length === 0) {
      const token = await getAccessToken();
      const data = await getAllTransactions(token);
      transactionsStore.setTransactions(data);
      setTransactions(data);
    } else {
      setTransactions(transactionsStore.transactions);
    }
  };

  const onCreateTransactionMannuaalyClicked = () => {
    navigate("/dashboard/transactions/deltails");
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0] !== undefined && files[0] !== null) {
        setReceiptFile(files[0]);
      }
    }
  };

  const onScanReceiptClicked = async () => {
    if (receiptFile === null) {
      console.log("receipt file is null");
      toast({
        variant: "destructive",
        title: "error message",
        description: "you must select a file first",
      });
      return;
    }
    setProcessing(true);
    try {
      const token = await getAccessToken();

      const formData = new FormData();
      formData.append("receiptFile", receiptFile);
      const data = await scanReceipt(formData, token);
      setProcessing(false);
      setAiResponse(data);
      slectedTransactionStore.setTransaction({
        ...data,
        attachment: URL.createObjectURL(receiptFile),
      });

      navigate("/dashboard/transactions/deltails");

      toast({
        title: "error message",
        description: "receipt scanned successfully",
      });
    } catch (e: any) {
      setProcessing(false);
      toast({
        variant: "destructive",
        title: "error message",
        description: e.message,
      });
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  const onShowMoreClicked = useCallback((transaction: Transaction) => {
    slectedTransactionStore.setTransaction(transaction);
    navigate(`/dashboard/transactions/deltails/${transaction.id}`);
  }, []);
  const columns = useMemo(
    () => getTransactionsColumns({ onShowClicked: onShowMoreClicked }),
    []
  );
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">Ai Receipt Scanner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          onClick={onUploadFileClicked}
          className="card cursor-pointer w-full h-[150px] shadow border-2 border-gray-300 border-dashed flex flex-col justify-center items-center"
        >
          <FileInput className="h-[40px] w-[40px] text-[40px]" />
          <p className="text-black font-bold">Upload from you device</p>
          <input
            onChange={onFileSelected}
            type="file"
            id="receipt-input"
            className="hidden"
          />
        </div>
        <Card>
          <CardContent className="p-3 flex flex-col gap-2">
            <span className="font-bold">Create a transaction manually</span>
            <p className="text-sm">
              You can create a manual transaction by click the button bellow{" "}
            </p>
            <Button onClick={onCreateTransactionMannuaalyClicked}>
              Create
            </Button>
          </CardContent>
        </Card>
      </div>

      {receiptFile !== null ? (
        !isPorcessing ? (
          <Button onClick={onScanReceiptClicked}>
            <Bot className="mr-2 h-6 w-6" />
            Scan
          </Button>
        ) : (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )
      ) : (
        <></>
      )}

      <div>
        <span>Transactions</span>
        <TransactionDatatable columns={columns} data={transactions} />
      </div>
    </div>
  );
}

export default Receipt;
