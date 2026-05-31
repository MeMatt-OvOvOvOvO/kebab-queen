import { ObjectValues } from "./typeUtilities";

export const TRANSACTION_TYPE = {
  Earn: "EARN",
  Redeem: "REDEEM",
  Referral: "REFERRAL",
} as const;

export type TransactionTypeEnum = ObjectValues<typeof TRANSACTION_TYPE>;
