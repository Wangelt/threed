import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  items: [],
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
    replaceItems(state, action: PayloadAction<CartItemModel[]>) {
      state.items = action.payload;
    },
    clearItems(state) {
      state.items = [];
    },
  },
});

export const { toggleSelected, incrementQuantity, decrementQuantity, addItem, replaceItems, clearItems } = cartSlice.actions;

export function selectCartTotal(state: { cart: CartState }): number {
  return state.cart.items
    .filter((i) => i.selected)
    .reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0);
}

export default cartSlice.reducer;
