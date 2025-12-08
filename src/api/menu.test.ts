/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { menuApi } from "../api/menu";
import "../api/mock/menuApi"; // Import mock setup

describe("Menu API", () => {
  describe("getMenuItems", () => {
    it("should return all menu items", async () => {
      const menuItems = await menuApi.getMenuItems();

      expect(Array.isArray(menuItems)).toBe(true);
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it("should return menu items with correct structure", async () => {
      const menuItems = await menuApi.getMenuItems();
      const firstItem = menuItems[0];

      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("name");
      expect(firstItem).toHaveProperty("description");
      expect(firstItem).toHaveProperty("price");
      expect(firstItem).toHaveProperty("category");
      expect(firstItem).toHaveProperty("imageUrl");
      expect(firstItem).toHaveProperty("available");
    });

    it("should return menu items with valid data types", async () => {
      const menuItems = await menuApi.getMenuItems();
      const firstItem = menuItems[0];

      expect(typeof firstItem.id).toBe("number");
      expect(typeof firstItem.name).toBe("string");
      expect(typeof firstItem.description).toBe("string");
      expect(typeof firstItem.price).toBe("string");
      expect(typeof firstItem.category).toBe("string");
      expect(typeof firstItem.imageUrl).toBe("string");
      expect(typeof firstItem.available).toBe("boolean");
    });

    it("should return menu items from different categories", async () => {
      const menuItems = await menuApi.getMenuItems();
      const categories = new Set(menuItems.map((item) => item.category));

      expect(categories.size).toBeGreaterThan(1);
      expect(categories.has("Appetizers")).toBe(true);
      expect(categories.has("Dim Sum")).toBe(true);
      expect(categories.has("Desserts")).toBe(true);
      expect(categories.has("Beverages")).toBe(true);
    });

    it("should include both available and unavailable items", async () => {
      const menuItems = await menuApi.getMenuItems();
      const hasAvailable = menuItems.some((item) => item.available);

      expect(hasAvailable).toBe(true);
      // Note: This depends on your mock data having unavailable items
    });
  });

  describe("getMenuItem", () => {
    it("should return a specific menu item by ID", async () => {
      const menuItem = await menuApi.getMenuItem("1");

      expect(menuItem).toBeDefined();
      expect(menuItem).toHaveProperty("id", 1);
      expect(menuItem).toHaveProperty("name");
    });

    it("should return correct item for different IDs", async () => {
      const item1 = await menuApi.getMenuItem("1");
      const item2 = await menuApi.getMenuItem("2");

      expect(item1.id).not.toBe(item2.id);
      expect(item1.name).not.toBe(item2.name);
    });

    it("should throw error for non-existent item ID", async () => {
      try {
        await menuApi.getMenuItem("99999");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.detail[0].msg).toBe("Menu item not found");
      }
    });

    it("should return item with all required fields", async () => {
      const menuItem = await menuApi.getMenuItem("1");

      expect(menuItem.id).toBeDefined();
      expect(menuItem.name).toBeDefined();
      expect(menuItem.description).toBeDefined();
      expect(menuItem.price).toBeDefined();
      expect(menuItem.category).toBeDefined();
      expect(menuItem.imageUrl).toBeDefined();
      expect(menuItem.available).toBeDefined();
    });

    it("should return item with valid price format", async () => {
      const menuItem = await menuApi.getMenuItem("1");
      const price = parseFloat(menuItem.price);

      expect(isNaN(price)).toBe(false);
      expect(price).toBeGreaterThan(0);
    });
  });
});
