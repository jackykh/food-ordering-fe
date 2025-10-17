import { useQuery } from "@tanstack/react-query";
import { menuApi } from "../api/menu";
import { useState, useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import MenuItem from "@/components/MenuItem";

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
        {/* Logo, User Name and Logout Button */}
        <div className="px-4 py-3">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              🍽️ <span className="hidden sm:inline">Restaurant Menu</span>
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
        {/* Category Filter */}
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
      </header>

      {/* Menu Items List/Grid */}
      <div className="px-4 py-4 sm:py-6 lg:py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No items in this category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
