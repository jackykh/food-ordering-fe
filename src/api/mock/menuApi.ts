import { menuItems } from "./data/menu";
import API_BASE_URL from "@/utils/constant";
import mock from "./lib/mockAdapter";

// GET /api/menu - Get all menu items
mock.onGet(`${API_BASE_URL}/menu`).reply(() => {
  console.log("Getting all menu items");
  return [200, menuItems];
});

// GET /api/menu/:id - Get menu item by ID
mock.onGet(new RegExp(`${API_BASE_URL}/menu/.*`)).reply((config) => {
  const id = config.url?.split("/").pop();
  const item = menuItems.find((item) => item.id === id);

  if (item) {
    console.log("Getting menu item:", item);
    return [200, item];
  }

  return [404, { message: "Menu item not found" }];
});
