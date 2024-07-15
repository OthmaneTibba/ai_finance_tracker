import { CategoryItemAnalytics } from "../models/category_item_analytics";
import { TotalTarnsactionAnalytics } from "../models/total_transaction_analytics";

import { Transaction } from "../models/transaction";
import { msalInstance } from "../main";
import { loginRequest } from "../authConfig";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function getAllTransactions(): Promise<Transaction[]> {
  const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
    .accessToken;

  const request = await fetch(`${BASE_URL}/GetTrancations`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-functions-key": import.meta.env.VITE_GET_ALL_TRANSACTION,
    },
  });
  const data: Transaction[] = await request.json();
  return data;
}

export async function scanReceipt(formData: FormData): Promise<Transaction> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;

    const request = await fetch(`${BASE_URL}/ReadReceipt`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-functions-key": import.meta.env.VITE_READ_RECEIPT,
      },
      body: formData,
    });

    if (request.status !== 200)
      throw new Error("error occured please try again");

    const data: Transaction = await request.json();
    return data;
  } catch (e) {
    throw new Error("error occured please try again");
  }
}

export async function saveTransaction(
  createTransaction: Transaction
): Promise<Transaction> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;
    const request = await fetch(`${BASE_URL}/CreateTransactions`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-functions-key": import.meta.env.VITE_CREATE_TRANSACTION,
      },
      body: JSON.stringify(createTransaction),
    });

    if (request.status !== 200)
      throw new Error("error occured please try again");

    const transaction: Transaction = await request.json();
    return transaction;
  } catch (e) {
    throw new Error("error occured please try again");
  }
}

export async function deleteTransaction(
  transactionId: string
): Promise<boolean> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;
    const request = await fetch(
      `${BASE_URL}/DeleteTransaction?transactionId=${transactionId}`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-functions-key": import.meta.env.VITE_DELETE_TRANSACTION,
        },
      }
    );

    if (request.status !== 200)
      throw new Error("error occured please try again");

    return true;
  } catch (e) {
    throw new Error("error occured please try again");
  }
}

export async function updateTransaction(
  transaction: Transaction
): Promise<Transaction> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;
    const request = await fetch(
      `${BASE_URL}/UpdateTransaction?transactionId=${transaction.id}`,
      {
        method: "put",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-functions-key": import.meta.env.VITE_UPDATE_TRANSACTION,
        },
        body: JSON.stringify(transaction),
      }
    );

    if (request.status !== 200)
      throw new Error("error occured please try again");

    const data: Transaction = await request.json();

    return data;
  } catch (e) {
    throw new Error("error occured please try again");
  }
}

export async function getDailyExpenseAnalytics(
  startDate: string,
  endDate: string,
  transactionType: string
): Promise<TotalTarnsactionAnalytics[]> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;

    const request = await fetch(
      `${BASE_URL}/GetTotalTransactionAnalytics?transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-functions-key": import.meta.env.VITE_ANALYSIS,
        },
      }
    );

    const data: TotalTarnsactionAnalytics[] = await request.json();

    return data;
  } catch {
    throw new Error("error occured please try again");
  }
}

export async function getTopCategoryItemAnalytics(
  startDate: string,
  endDate: string,
  transactionType: string
): Promise<CategoryItemAnalytics[]> {
  try {
    const accessToken = (await msalInstance.acquireTokenSilent(loginRequest))
      .accessToken;

    const request = await fetch(
      `${BASE_URL}/GetCategoryItemExpenseAnalytics?transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-functions-key": import.meta.env.VITE_CATEGORY_ANALYSIS,
        },
      }
    );

    const data: CategoryItemAnalytics[] = await request.json();

    return data;
  } catch {
    throw new Error("error occured please try again");
  }
}
