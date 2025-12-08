import { useState } from "react";
import type { MenuItem as MenuItemType } from "../types/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart";
import { useAuthStore } from "../stores/useAuthStore";

export default function MenuItem({
  id,
  name,
  description,
  price,
  imageUrl,
  available,
}: MenuItemType) {
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: () => cartApi.addItemToCart(userId!, id),
    onSuccess: (cartItem) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      // Show success toast or notification
      console.log("✅ Added to cart:", cartItem);
    },
    onError: (error) => {
      console.error("❌ Failed to add to cart:", error);
    },
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddToCart = () => {
    if (userId && available) {
      addToCart();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden active:shadow-md transition">
      {/* Mobile: Horizontal Layout */}
      <div className="flex sm:flex-col">
        {/* Image - Square on mobile, responsive on desktop */}
        <div className="relative w-24 h-24 sm:w-full sm:aspect-square flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          {!available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full font-semibold text-xs">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-3 flex flex-col justify-between">
          <div onClick={toggleExpand} className="cursor-pointer">
            {/* Name & Price */}
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3
                className={`text-sm sm:text-base font-semibold text-gray-800 ${
                  isExpanded ? "" : "truncate"
                }`}
                title={name}
              >
                {name}
              </h3>
              <span className="text-sm sm:text-base font-bold text-orange-500 whitespace-nowrap">
                ${price}
              </span>
            </div>

            {/* Description */}
            <p
              className={`text-gray-600 text-xs sm:text-sm mb-2 ${
                isExpanded ? "" : "truncate"
              }`}
              title={description}
            >
              {description}
            </p>

            {/* Expand/Collapse Indicator */}
            {(name.length > 20 || description.length > 50) && (
              <p className="text-xs text-orange-500 mb-1">
                {isExpanded ? "Click to collapse ▲" : "Click to expand ▼"}
              </p>
            )}
          </div>

          {/* Button - Smaller and more compact */}
          <button
            disabled={!available || isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className={`self-start px-3 py-1 sm:px-4 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition ${
              available && !isPending
                ? "bg-orange-500 text-white active:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPending ? "Adding..." : available ? "Add" : "N/A"}
          </button>
        </div>
      </div>
    </div>
  );
}
