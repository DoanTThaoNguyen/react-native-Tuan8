import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../store';
import { setQuantity } from '../store/cartSlice';

export function useDebouncedQuantities() {
  const dispatch = useAppDispatch();

  const timers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const pending = useRef<Record<string, number>>({});

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (timers.current[id]) {
        clearTimeout(timers.current[id]);
      }

      pending.current[id] = quantity;

      timers.current[id] = setTimeout(() => {
        dispatch(setQuantity({ id, quantity }));
        delete timers.current[id];
        delete pending.current[id];
      }, 300);
    },
    [dispatch],
  );

  const cancelQuantity = useCallback((id: string) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }

    delete pending.current[id];
  }, []);

  useEffect(() => {
    return () => {
      Object.entries(pending.current).forEach(([id, quantity]) => {
        dispatch(setQuantity({ id, quantity }));
      });

      Object.values(timers.current).forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, [dispatch]);

  return { updateQuantity, cancelQuantity };
}