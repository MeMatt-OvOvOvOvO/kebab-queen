export type User = {
  id: string;
  phone: string;
  name: string | null;
  referralCode: string;
  createdAt: string;
  loyalty: { balance: number; tier: number };
};
