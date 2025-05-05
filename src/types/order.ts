
export type Order = {
  id: string;
  customer: {
    full_name: string | null;
    email: string;
  };
  created_at: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled" | "deleted";
  items_count?: number;
  shipping_address?: string | null;
  notes?: string | null;
};
