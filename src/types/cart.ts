
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  total: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}
