import { loginRequest, msalInstance } from "../authConfig";

import { Transaction } from "../models/transaction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getAccessToken() {
  const account = await msalInstance.acquireTokenSilent(loginRequest);
  const accessToken = account.accessToken;
  return accessToken;
}
export async function getAllTransactions(): Promise<Transaction[]> {
  const accessToken = await getAccessToken();
  const request = await fetch(`${BASE_URL}/GetTrancations`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: Transaction[] = await request.json();
  return data;
}

export async function scanReceipt(formData: FormData): Promise<Transaction> {
  try {
    const accessToken = await getAccessToken();
    const request = await fetch(`${BASE_URL}/ReadReceipt`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    const accessToken = await getAccessToken();
    const request = await fetch(`${BASE_URL}/CreateTransactions`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
    const accessToken = await getAccessToken();
    const request = await fetch(
      `${BASE_URL}/DeleteTransaction?transactionId=${transactionId}`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
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
