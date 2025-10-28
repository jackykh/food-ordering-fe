import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/api/cart";
import { useAuthStore } from "./useAuthStore";
import { useCartStore } from "./useCartStore";

const useCart = () => {
  const userId = useAuthStore((state) => state.userId);
  const setItems = useCartStore((state) => state.setItems);
  // Get cart data
  const {
    data: cart,
    isLoading,
    error,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartApi.getCart(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // When cart data is successfully loaded, update store
  useEffect(() => {
    if (cart?.items) {
      setItems(cart.items);
    }
  }, [cart, setItems]);

  return {
    isLoading,
    error,
    refetchCart,
  };
};

export { useCart };
