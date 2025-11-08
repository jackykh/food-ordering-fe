import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { ordersApi } from "@/api/orders";
import { cartApi } from "@/api/cart";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/stores/useCart";
import { getTotalPrice } from "@/utils";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, error, refetchCart } = useCart();
  const userId = useAuthStore((state) => state.userId);

  const [fulfillmentType, setFulfillmentType] = useState<
    "dine-in" | "pickup" | "delivery"
  >("dine-in");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Add to cart mutation
  const { mutate: addToCart, isPending: isAdding } = useMutation({
    mutationFn: (itemId: number) => cartApi.addItemToCart(userId!, itemId),
    onSuccess: () => {
      console.log("✅ Item added to cart");
      refetchCart(); // Refetch Cart Data
    },
    onError: (error) => {
      console.error("❌ Failed to add item:", error);
      alert("Failed to update cart");
    },
  });

  // Update cart item quantity mutation
  const { mutate: updateCartItemQuantity } = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateCartItem(userId!, itemId, quantity),
    onSuccess: () => {
      console.log("✅ Cart item quantity updated");
      refetchCart(); // Refetch Cart Data
    },
    onError: (error) => {
      console.error("❌ Failed to update quantity:", error);
      alert("Failed to update cart item quantity");
    },
  });

  // Delete from cart mutation
  const { mutate: removeFromCart, isPending: isRemoving } = useMutation({
    mutationFn: (itemId: number) => cartApi.removeItemFromCart(userId!, itemId),
    onSuccess: () => {
      console.log("✅ Item removed from cart");
      refetchCart(); // Refetch Cart Data
    },
    onError: (error) => {
      console.error("❌ Failed to remove item:", error);
      alert("Failed to remove item from cart");
    },
  });

  const { mutate: submitOrder, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.createOrder({
        user_id: userId!,
        items: cart.items.map((item) => ({
          menuId: item.items.id,
          quantity: item.quantity,
        })),
        fulfillment_type: fulfillmentType,
      }),
    onSuccess: () => {
      console.log("✅ Order submitted successfully");
      refetchCart(); // Refetch Cart Data
      navigate("/menu");
    },
    onError: (error) => {
      console.error("❌ Failed to submit order:", error);
      alert("Failed to submit order");
    },
  });

  const handleSubmitOrder = () => {
    if (cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = () => {
    submitOrder();
    setShowConfirmDialog(false);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      // If quantity is greater than 1, update local quantity
      updateCartItemQuantity({
        itemId: cartItem.items.id,
        quantity: cartItem.quantity - 1,
      });
    } else {
      // If quantity is 1, remove the item
      removeFromCart(cartItem.items.id);
    }
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (itemId: number) => {
    // Call API to add the same item to the cart
    addToCart(itemId);
  };

  // Handle remove item
  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">❌ Failed to load cart</p>
          <p className="mt-2 text-sm">{(error as Error).message}</p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 text-orange-500 hover:text-orange-600"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🛒 Shopping Cart</h1>
          <button
            onClick={() => navigate("/menu")}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            Back to Menu
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow mb-6">
              {cart.items.map((cartItem) => (
                <div
                  key={cartItem.items.id}
                  className="p-4 border-b last:border-b-0 flex gap-4"
                >
                  <img
                    src={cartItem.items.imageUrl}
                    alt={cartItem.items.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {cartItem.items.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      ${cartItem.items.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecreaseQuantity(cartItem)}
                        disabled={isAdding || isRemoving}
                        className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4">{cartItem.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(cartItem.items.id)
                        }
                        disabled={isAdding}
                        className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(cartItem.items.id)}
                        disabled={isRemoving}
                        className="ml-auto text-red-500 text-sm disabled:opacity-50"
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold text-orange-500">
                    $
                    {(
                      parseFloat(cartItem.items.price) * cartItem.quantity
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Fulfillment Type Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="font-semibold text-gray-800 mb-4">
                Fulfillment Type
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="dine-in"
                    checked={fulfillmentType === "dine-in"}
                    onChange={(e) =>
                      setFulfillmentType(e.target.value as "dine-in")
                    }
                  />
                  <span>Dine In 🍽️</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pickup"
                    checked={fulfillmentType === "pickup"}
                    onChange={(e) =>
                      setFulfillmentType(e.target.value as "pickup")
                    }
                  />
                  <span>Pickup 📦</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="delivery"
                    checked={fulfillmentType === "delivery"}
                    onChange={(e) =>
                      setFulfillmentType(e.target.value as "delivery")
                    }
                  />
                  <span>Delivery 🚚</span>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ${getTotalPrice(cart.items).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-500">
                  ${getTotalPrice(cart.items).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Submit Order"}
            </button>
          </>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Order
              </h2>
              <p className="text-gray-600 mb-6">
                Fulfillment Type:{" "}
                <span className="font-semibold capitalize">
                  {fulfillmentType}
                </span>
              </p>
              <p className="text-gray-600 mb-6">
                Total Amount:{" "}
                <span className="font-semibold text-orange-500">
                  ${getTotalPrice(cart.items).toFixed(2)}
                </span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
