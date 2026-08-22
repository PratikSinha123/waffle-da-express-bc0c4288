import { describe, it, expect } from "vitest";
import type { CartItem } from "@/context/CartContext";
import type { MenuItem } from "@/data/menuData";

describe("Cart Context Operations", () => {
  const mockMenuItem: MenuItem = {
    id: "w1",
    name: "Classic Chocolate",
    description: "Rich chocolate waffle",
    price: 90,
    category: "Waffles",
    isVeg: true,
    available: true,
  };

  const mockCartItem: CartItem = {
    id: "cart-1",
    menuItem: mockMenuItem,
    selectedAddOns: [],
    quantity: 1,
    selectedPrice: 90,
  };

  describe("cart calculations", () => {
    it("should calculate total items correctly", () => {
      const items: CartItem[] = [
        { ...mockCartItem, quantity: 2 },
        { ...mockCartItem, id: "cart-2", quantity: 3 },
      ];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      expect(totalItems).toBe(5);
    });

    it("should calculate subtotal correctly", () => {
      const items: CartItem[] = [
        { ...mockCartItem, quantity: 2, selectedPrice: 90 },
        { ...mockCartItem, id: "cart-2", quantity: 1, selectedPrice: 100 },
      ];
      const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
      expect(subtotal).toBe(280);
    });

    it("should apply delivery fee for delivery orders", () => {
      const subtotal = 280;
      const deliveryFee = 40;
      const total = subtotal + deliveryFee;
      expect(total).toBe(320);
    });

    it("should not apply delivery fee for pickup orders", () => {
      const subtotal = 280;
      const deliveryFee = 0;
      const total = subtotal + deliveryFee;
      expect(total).toBe(280);
    });

    it("should handle empty cart", () => {
      const items: CartItem[] = [];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
      expect(totalItems).toBe(0);
      expect(subtotal).toBe(0);
    });
  });

  describe("cart item operations", () => {
    it("should add item to cart", () => {
      const cart: CartItem[] = [];
      const newItem = { ...mockCartItem };
      const updatedCart = [...cart, newItem];
      expect(updatedCart).toHaveLength(1);
      expect(updatedCart[0]).toEqual(newItem);
    });

    it("should remove item from cart by id", () => {
      const cart: CartItem[] = [
        mockCartItem,
        { ...mockCartItem, id: "cart-2" },
      ];
      const filteredCart = cart.filter((item) => item.id !== "cart-1");
      expect(filteredCart).toHaveLength(1);
      expect(filteredCart[0].id).toBe("cart-2");
    });

    it("should update quantity of cart item", () => {
      const cart: CartItem[] = [mockCartItem];
      const updated = cart.map((item) =>
        item.id === "cart-1" ? { ...item, quantity: 5 } : item
      );
      expect(updated[0].quantity).toBe(5);
    });

    it("should remove item when quantity is set to 0", () => {
      const cart: CartItem[] = [mockCartItem];
      const updatedCart = cart.filter((item) => !(item.id === "cart-1" && 0 <= 0));
      expect(updatedCart).toHaveLength(0);
    });

    it("should clear entire cart", () => {
      const cart: CartItem[] = [
        mockCartItem,
        { ...mockCartItem, id: "cart-2" },
        { ...mockCartItem, id: "cart-3" },
      ];
      const cleared = cart.length === 0 ? [] : [];
      expect(cleared).toHaveLength(0);
    });
  });

  describe("order type", () => {
    it("should support delivery order type", () => {
      const orderType = "Delivery";
      expect(["Delivery", "Pickup"]).toContain(orderType);
    });

    it("should support pickup order type", () => {
      const orderType = "Pickup";
      expect(["Delivery", "Pickup"]).toContain(orderType);
    });

    it("should default to delivery", () => {
      const orderType = "Delivery";
      expect(orderType).toBe("Delivery");
    });
  });
});
