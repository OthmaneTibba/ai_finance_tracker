import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  itemCategories,
  receiptCategories,
  transactionTypes,
} from "../utils/Constants";
import { Item } from "../models/item";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { CalendarIcon, ClipboardMinus, Loader2, Plus } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";
import {
  itemSchema,
  transactionSchema,
  validateTransactionWithoutItemsSchema,
} from "../utils/Validations";
import { useToast } from "../components/ui/use-toast";
import { Transaction } from "../models/transaction";
import {
  deleteTransaction,
  saveTransaction,
  updateTransaction,
} from "../services/ApiService";
import { useTransactionsStore } from "../stores/transaction-store";
import { useSelectedTransactionStore } from "../stores/selected-transaction-store";
import { useNavigate, useParams } from "react-router-dom";
import { loginRequest } from "../authConfig";
import { useMsal } from "@azure/msal-react";
type ErrorTransaction = {
  merchant: string;
  totalPrice: string;
  category: string;
  date: string;
};

export const initialTransactionState: Transaction = {
  category: "",
  date: "",
  items: [],
  merchant: {
    name: "",
  },
  totalPrice: 0,
  transactionType: "",
};
export default function TransactionDetails() {
  const { toast } = useToast();

  const { transactionId } = useParams();
  const [isAddingTransaction, setIsAddingTransaction] =
    useState<boolean>(false);
  const [errorState, setErrorState] = useState<ErrorTransaction>({
    merchant: "",
    totalPrice: "",
    category: "",
    date: "",
  });

  const [createTransaction, setCreateTransaction] = useState<Transaction>(
    initialTransactionState
  );
  const [newItem, setNewItem] = useState<Item>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
  });

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { instance } = useMsal();

  const [isDeleting, setDeleting] = useState<boolean>(false);
  async function getAccessToken() {
    const account = (await instance.getAllAccounts().length) > 0;
    if (account) {
      instance.setActiveAccount(instance.getAllAccounts()[0]);
      const accessToken = (await instance.acquireTokenSilent(loginRequest))
        .accessToken;
      return accessToken;
    }
    return "";
  }
  const onDeleteClicked = async (id: string) => {
    try {
      setDeleting(true);
      const token = await getAccessToken();
      const response = await deleteTransaction(id, token);
      if (response) {
        toast({
          title: "success message",
          description: "transaction deleted successfully",
        });

        transactionsStore.setTransactions(
          transactionsStore.transactions.filter((t) => t.id !== transactionId)
        );
        navigate("/dashboard/receipt");
      } else {
        toast({
          title: "error message",
          description: "please try again!",
          variant: "destructive",
        });
      }

      setDeleting(false);
    } catch (e) {
      setDeleting(false);
      toast({
        title: "error message",
        description: "please try again!",
        variant: "destructive",
      });
    }
  };

  const [date, setDate] = useState<Date>();
  const transactionsStore = useTransactionsStore();
  const selectedTransactionStore = useSelectedTransactionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (transactionId) {
      console.log(transactionId);
    }
    setCreateTransaction(selectedTransactionStore.transaction);
    if (selectedTransactionStore.transaction.date !== "") {
      setDate(new Date(selectedTransactionStore.transaction.date));
    }
  }, []);

  const onDateChanged = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      const d = new Date();
      d.setDate(date.getDate());
      const formmatedDate = d.toISOString().split("T")[0];
      console.log(`formated date is ${formmatedDate}`);
      setCreateTransaction({
        ...createTransaction,
        date: formmatedDate,
      });
    }
  };

  const onFromChanged = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setCreateTransaction({
      ...createTransaction,
      [name]: value,
    });
  };

  const confirmUpdate = async () => {
    setIsUpdating(true);
    const token = await getAccessToken();
    const response = await updateTransaction(createTransaction, token);

    if (response) {
      const updatedTransaction: Transaction[] =
        transactionsStore.transactions.map((t) => {
          if (t.id !== transactionId) {
            return t;
          }
          return response;
        });

      transactionsStore.setTransactions(updatedTransaction);
      toast({
        title: "success message",
        description: "transaction updated successfully",
      });
    }

    setIsUpdating(false);
  };

  const onUpdateClicked = async () => {
    try {
      if (createTransaction.id === undefined || createTransaction.id === null) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "no transaction was found",
        });
        return;
      }

      if (createTransaction.transactionType === "Expense") {
        transactionSchema
          .validate(createTransaction)
          .then(async () => {
            await confirmUpdate();
          })
          .catch(function () {
            toast({
              variant: "destructive",
              title: "error message",
              description: "you must enter all required data",
            });
          });
      } else if (createTransaction.transactionType === "Income") {
        validateTransactionWithoutItemsSchema
          .validate(createTransaction)
          .then(async () => {
            await confirmUpdate();
          })
          .catch(function () {
            toast({
              variant: "destructive",
              title: "error message",
              description: "you must enter all required data",
            });
          });
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "error message",
        description: e.message,
      });
    }
  };

  const onAddNewItemClicked = () => {
    itemSchema
      .validate(newItem, { abortEarly: false })
      .then(() => {
        setCreateTransaction({
          ...createTransaction,
          items: [...createTransaction.items, newItem],
        });

        setNewItem({
          category: "",
          name: "",
          price: 0,
          quantity: 0,
        });
      })
      .catch(function (error) {
        error.inner.forEach((es: any) => {
          console.log(es.path);
        });

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "you must enter all data",
        });
      });
  };

  const onNewItemChanged = (name: string, value: string | number) => {
    setNewItem({ ...newItem, [name]: value });
  };

  const onMerchantDataChanged = (value: string) => {
    setCreateTransaction({
      ...createTransaction,
      merchant: {
        name: value,
      },
    });
  };

  const onItemChanged = (name: string, value: string, i: number) => {
    const updatedItemList: Item[] = createTransaction.items.map(
      (item, index) => {
        if (index !== i) {
          return item;
        }
        return {
          ...item,
          [name]: value,
        };
      }
    );

    setCreateTransaction({
      ...createTransaction,
      items: updatedItemList,
    });
  };

  const deleteItem = (index: number) => {
    const updatedItems: Item[] = createTransaction.items.filter(
      (_, i) => i !== index
    );
    setCreateTransaction({
      ...createTransaction,
      items: updatedItems,
    });
  };

  const onTransactionTypeChanged = (value: string) => {
    setCreateTransaction({ ...createTransaction, transactionType: value });
  };

  const onReceiptCategoryChanged = (value: string) => {
    setCreateTransaction({
      ...createTransaction,
      category: value,
    });
  };

  const saveTransactionToDb = async () => {
    setIsAddingTransaction(true);
    try {
      const token = await getAccessToken();

      const transaction = await saveTransaction(createTransaction, token);

      transactionsStore.setTransactions([
        ...transactionsStore.transactions,
        transaction,
      ]);

      toast({
        title: "success message",
        description: "transaction created successfully",
      });
      setIsAddingTransaction(false);

      setCreateTransaction(initialTransactionState);
      selectedTransactionStore.setTransaction(initialTransactionState);
      navigate("/dashboard/receipt");
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "error message",
        description: e.message,
      });
      setIsAddingTransaction(false);
    }
  };

  // to save the new transaction to the database
  const onSaveClicked = async () => {
    if (transactionId === undefined || transactionId === null) {
      console.log("saved called");
      // reset the errors
      setErrorState({
        merchant: "",
        category: "",
        totalPrice: "",
        date: "",
      });

      if (createTransaction.transactionType === "Income") {
        validateTransactionWithoutItemsSchema
          .validate(createTransaction, { abortEarly: false })
          .then(async () => {
            await saveTransactionToDb();
          })
          .catch(function (error) {
            error.inner.forEach((err: any) => {
              console.log(err.path);
              if (err.path == "merchant.name") {
                setErrorState({
                  ...errorState,
                  merchant: "merchant cannot be null or empty",
                });
              } else {
                setErrorState({ ...errorState, [err.path]: err.message });
              }
            });
          });
      } else {
        transactionSchema
          .validate(createTransaction, { abortEarly: false })
          .then(async () => {
            await saveTransactionToDb();
          })
          .catch(function (error) {
            error.inner.forEach((err: any) => {
              console.log(err.path);
              if (err.path == "merchant.name") {
                setErrorState({
                  ...errorState,
                  merchant: "merchant cannot be null or empty",
                });
              } else {
                setErrorState({ ...errorState, [err.path]: err.message });
              }
            });
          });
      }
    } else {
      await onUpdateClicked();
    }
  };

  return (
    <div className="md:container w-full md:mx-auto">
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
        {(createTransaction.receiptUrl !== undefined &&
          createTransaction.receiptUrl !== null) ||
        (createTransaction.attachment !== null &&
          createTransaction.attachment !== undefined) ? (
          <div className="shadow border rounded-lg">
            <img
              className="object-cover p-2 rounded-lg"
              src={
                createTransaction.attachment == null ||
                createTransaction.attachment == undefined
                  ? createTransaction.receiptUrl
                  : createTransaction.attachment
              }
              alt="receipt"
            />
          </div>
        ) : (
          <div className="shadow border flex flex-col justify-center items-center card rounded-lg">
            <ClipboardMinus className="w-[80px] h-[80px] text-[80px]" />
            <p className="font-bold">No document was attached</p>
          </div>
        )}
        <Card>
          <CardContent className="py-2">
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-bold">Merchant</span>
                <Input
                  placeholder="Merchant"
                  name="merchant"
                  onChange={(e) => onMerchantDataChanged(e.target.value)}
                  value={createTransaction.merchant.name}
                />
                {errorState.merchant !== "" ? (
                  <span className="text-red-500">{errorState.merchant}</span>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-bold">Trnsaction date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => onDateChanged(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errorState.date !== "" ? (
                  <span className="text-red-500">{errorState.date}</span>
                ) : (
                  <></>
                )}
              </div>

              <div>
                <span className="font-bold">Receipt Category</span>
                <Select
                  value={createTransaction.category}
                  onValueChange={(value) => onReceiptCategoryChanged(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {receiptCategories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorState.category !== "" ? (
                  <span className="text-red-500">{errorState.category}</span>
                ) : (
                  <></>
                )}
              </div>

              <div>
                <Select
                  value={createTransaction.transactionType}
                  onValueChange={(value) => onTransactionTypeChanged(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((t, index) => (
                      <SelectItem key={index} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {createTransaction.transactionType === "Expense" ? (
                <div className="flex flex-col gap-2">
                  <span className="font-bold">Items</span>
                  {createTransaction.items.map((item, index) => (
                    <AlertDialog key={index}>
                      <AlertDialogTrigger asChild>
                        <div
                          className="w-full shadow cursor-pointer hover:bg-gray-100 border h-[80px] rounded-md flex justify-between items-center px-3"
                          key={index}
                        >
                          <div className="flex flex-col gap-1  ">
                            <span className="text-sm font-bold">
                              {item.name} x {item.quantity}
                            </span>
                            <div className="bg-gray-100 px-2 py-1 rounded-md w-fit text-[0.7rem] font-bold">
                              {item.category}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm font-bold">
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="flex flex-col gap-2">
                              <div>
                                <Input
                                  onChange={(e) =>
                                    onItemChanged(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    )
                                  }
                                  placeholder="name"
                                  value={item.name}
                                  type="text"
                                  name="name"
                                />
                              </div>

                              <div>
                                <Select
                                  onValueChange={(value) =>
                                    onItemChanged("category", value, index)
                                  }
                                  value={item.category}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {itemCategories.map((category, index) => (
                                      <SelectItem key={index} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Input
                                  type="number"
                                  name="price"
                                  onChange={(e) =>
                                    onItemChanged(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    )
                                  }
                                  value={item.price}
                                  placeholder="price"
                                />
                              </div>

                              <div>
                                <Input
                                  type="number"
                                  name="quantity"
                                  onChange={(e) =>
                                    onItemChanged(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    )
                                  }
                                  value={item.quantity}
                                  placeholder="quantity"
                                />
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button
                            className="w-full"
                            variant="destructive"
                            asChild
                          >
                            <AlertDialogCancel
                              onClick={() => deleteItem(index)}
                            >
                              Delete
                            </AlertDialogCancel>
                          </Button>
                          <AlertDialogAction className="w-full">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ))}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="mr-1 w-6 h-6" />
                        add
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Create Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="flex flex-col gap-2">
                            <div>
                              <Input
                                onChange={(e) =>
                                  onNewItemChanged(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                placeholder="name"
                                type="text"
                                name="name"
                              />
                            </div>

                            <div>
                              <Select
                                value={newItem.category}
                                onValueChange={(value) =>
                                  onNewItemChanged("category", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {itemCategories.map((category, index) => (
                                    <SelectItem key={index} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Input
                                onChange={(e) =>
                                  onNewItemChanged(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                type="number"
                                name="price"
                                placeholder="price"
                              />
                            </div>

                            <div>
                              <Input
                                onChange={(e) =>
                                  onNewItemChanged(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                type="number"
                                name="quantity"
                                placeholder="quantity"
                              />
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button className="w-full" variant="outline" asChild>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </Button>
                        <AlertDialogAction
                          onClick={onAddNewItemClicked}
                          className="w-full"
                        >
                          Save
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <></>
              )}

              <div>
                <label className="font-bold" htmlFor="total price">
                  Total price
                </label>
                <Input
                  name="totalPrice"
                  onChange={(e) => onFromChanged(e)}
                  value={createTransaction.totalPrice}
                  type="number"
                  placeholder="totalPrice"
                />
                {errorState.totalPrice !== "" ? (
                  <span className="text-red-500">{errorState.totalPrice}</span>
                ) : (
                  <></>
                )}
              </div>

              {!isAddingTransaction ? (
                <div className="flex w-full gap-2">
                  {isUpdating === false ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onSaveClicked}
                    >
                      {transactionId ? "Update" : "Save"}
                    </Button>
                  ) : (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  )}

                  {transactionId ? (
                    isDeleting === false ? (
                      <Button
                        onClick={() => onDeleteClicked(transactionId)}
                        variant="destructive"
                        className="flex-1"
                      >
                        Delete
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
                </div>
              ) : (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
