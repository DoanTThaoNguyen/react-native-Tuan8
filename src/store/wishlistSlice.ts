import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../types';
import type { RootState } from './index';

type WishlistState = {
  items: Book[];
  hydrated: boolean;
};

const initialState: WishlistState = {
  items: [],
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Book>) {
      const idx = state.items.findIndex(
        b => b.id === action.payload.id,
      );

      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    hydrateWishlist(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
  },
});

export const {
  toggleWishlist,
  hydrateWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlist = (s: RootState) =>
  s.wishlist.items;

export const selectIsFavorite = (id: string) => (s: RootState) =>
  s.wishlist.items.some(b => b.id === id);