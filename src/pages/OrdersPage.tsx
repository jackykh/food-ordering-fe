import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import { ordersApi } from "../api/orders";
import type { Order } from "../types/cart";

export default function OrdersPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.userName);

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => ordersApi.getOrders(userId!.toString()),
    enabled: !!userId,
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Order status styles
  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fulfillment type icons
  const getFulfillmentIcon = (type: Order["fulfillmentType"]) => {
    switch (type) {
      case "dine-in":
        return "🍽️";
      case "pickup":
        return "🚶";
      case "delivery":
        return "🚗";
      default:
        return "📦";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">❌ Failed to load orders</p>
          <p className="mt-2 text-sm">{(error as Error).message}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-orange-500 hover:text-orange-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              📋 My Orders
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{userName}</span>
              </div>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <div className="px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">
                You don't have any orders yet
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getFulfillmentIcon(order.fulfillmentType)}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {order.fulfillmentType.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex-1">
                              <span className="text-gray-800">
                                {item.name || `Item ${index + 1}`}
                              </span>
                              <span className="text-gray-500 ml-2">
                                x{item.quantity || 1}
                              </span>
                            </div>
                            {item.price && (
                              <span className="text-gray-600">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">
                        No item details available
                      </p>
                    )}

                    {/* Order Total */}
                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-orange-500">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
