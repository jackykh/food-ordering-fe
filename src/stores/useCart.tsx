import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/api/cart";
import { useAuthStore } from "./useAuthStore";

const useCart = () => {
  const userId = useAuthStore((state) => state.userId);
  // Get cart data
  const {
    data: cart = { items: [] },
    isLoading,
    error,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartApi.getCart(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    cart,
    isLoading,
    error,
    refetchCart,
  };
};

export { useCart };
