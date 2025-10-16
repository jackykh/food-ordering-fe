import { useQuery } from "@tanstack/react-query";
import { menuApi } from "../api/menu";
import { useState, useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const userName = useAuthStore((state) => state.userName);

  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: menuApi.getMenuItems,
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item) => item.category)));
    return ["All", ...cats];
  }, [menuItems]);

  // Filter menu items by selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">❌ Failed to load menu</p>
          <p className="mt-2 text-sm">{(error as Error).message}</p>
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
              🍽️ Restaurant Menu
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{userName}</span>
              </div>
              <button
                className="cursor-pointer"
                onClick={() => useAuthStore.getState().logout()}
              >
                <span className="text-sm text-orange-500 underline cursor-pointer hover:text-orange-600">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-[60px] sm:top-[68px] z-10">
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap transition text-sm cursor-pointer ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items List/Grid */}
      <div className="px-4 py-4 sm:py-6 lg:py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No items in this category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden active:shadow-md transition"
              >
                {/* Mobile: Horizontal Layout */}
                <div className="flex sm:flex-col">
                  {/* Image - Square on mobile, responsive on desktop */}
                  <div className="relative w-24 h-24 sm:w-full sm:aspect-square flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full font-semibold text-xs">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 sm:p-3 flex flex-col justify-between">
                    <div>
                      {/* Name & Price */}
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-sm sm:text-base font-bold text-orange-500 whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Button - Smaller and more compact */}
                    <button
                      disabled={!item.available}
                      className={`self-start px-3 py-1 sm:px-4 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition cursor-pointer ${
                        item.available
                          ? "bg-orange-500 text-white active:bg-orange-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {item.available ? "Add" : "N/A"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
