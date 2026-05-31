export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  tags: string[];
  imageUrl: string | null;
  isAvailable: boolean;
};
