import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { hydrateCart } from '../store/cartSlice';
import { hydrateWishlist } from '../store/wishlistSlice';

export function usePersistSlice<T>(options: {
  key: string;
  selectItems: (s: RootState) => T[];
  selectHydrated: (s: RootState) => boolean;
  hydrate: (items: T[]) => PayloadAction<T[]>;
}) {
  const { key, selectItems, selectHydrated, hydrate } = options;

  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const hydrated = useAppSelector(selectHydrated);

  // Đọc dữ liệu khi mở app
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        dispatch(hydrate(raw ? (JSON.parse(raw) as T[]) : []));
      } catch {
        dispatch(hydrate([]));
      }
    })();
  }, []);

  // Lưu dữ liệu sau khi đọc xong
  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(key, JSON.stringify(items)).catch(e =>
      console.warn(e),
    );
  }, [key, items, hydrated]);

  return hydrated;
}

export function useAppPersistence() {
  const cartReady = usePersistSlice({
    key: '@bookstore/cart',
    selectItems: s => s.cart.items,
    selectHydrated: s => s.cart.hydrated,
    hydrate: hydrateCart,
  });

  const wishlistReady = usePersistSlice({
    key: '@bookstore/wishlist',
    selectItems: s => s.wishlist.items,
    selectHydrated: s => s.wishlist.hydrated,
    hydrate: hydrateWishlist,
  });

  return cartReady && wishlistReady;
}