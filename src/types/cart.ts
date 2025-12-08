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
  userId: number;
  userName: string;
  totalPrice: number;
  status: "pending" | "completed" | "canceled";
  fulfillmentType: "dine-in" | "pickup" | "delivery";
  items: {
    name: string;
    quantity: number;
    price: string;
  }[];
  id: number;
  createdAt: string;
  updatedAt: string;
}
