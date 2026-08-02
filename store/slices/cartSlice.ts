import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MockProducts } from "@/lib/data/mock-products";
import type { ProductModel } from "@/lib/data/mock-products";

export interface CartItemModel {
  product: ProductModel;
  selected: boolean;
  quantity: number;
}

interface CartState {
  items: CartItemModel[];
}

const initialState: CartState = {
  items: [
    { product: MockProducts.items[4], selected: true, quantity: 1 },
    { product: MockProducts.items[5], selected: true, quantity: 1 },
  ],
};

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSelected(state, action: PayloadAction<number>) {
      const item = state.items[action.payload];
      if (item) item.selected = !item.selected;
    },
    incrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items[action.payload];
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items[action.payload];
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    addItem(state, action: PayloadAction<{ product: ProductModel; quantity?: number }>) {
      const existing = state.items.find((i) => i.product.id === action.payload.product.id);
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1;
        existing.selected = true;
      } else {
        state.items.push({
          product: action.payload.product,
          selected: true,
          quantity: action.payload.quantity ?? 1,
        });
      }
    },
  },
});

export const { toggleSelected, incrementQuantity, decrementQuantity, addItem } = cartSlice.actions;

export function selectCartTotal(state: { cart: CartState }): number {
  return state.cart.items
    .filter((i) => i.selected)
    .reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0);
}

export default cartSlice.reducer;
