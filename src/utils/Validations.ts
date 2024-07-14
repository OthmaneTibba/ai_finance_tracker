import { array, number, object, string } from "yup";

export const itemSchema = object({
  name: string().required(),
  price: number().required(),
  quantity: number().required(),
  category: string().required(),
});

export const merchantSchema = object({
  name: string().required(),
});

export const transactionSchema = object({
  category: string().required("category is required"),
  items: array().of(itemSchema).required(),
  merchant: merchantSchema.required(),
  date: string().required(),
  totalPrice: number()
    .required("price is required")
    .positive("the number must be positive"),
  transactionType: string().required(),
});

export const validateTransactionWithoutItemsSchema = object({
  category: string().required("category is required"),
  merchant: merchantSchema.required(),
  date: string().required(),
  totalPrice: number()
    .required("price is required")
    .positive("the number must be positive"),
  transactionType: string().required(),
});
