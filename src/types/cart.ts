export interface CartItem {
  id: number;
  quantity: number;
  items: {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    available: boolean;
  };
}

export interface Cart {
  id: number;
  user: {
    id: number;
    name: string;
  };
  items: CartItem[];
}

export interface Order {
  user_id: number;
  item_id: number;
  quantity: number;
  total_price: number;
  status: string;
  fulfillment_type: "dine-in" | "takeaway";
}
