import { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../store';
import {
  removeFromCart,
  selectCartItems,
} from '../store/cartSlice';
import CartItemRow from '../components/CartItemRow';
import { formatVND } from '../utils/format';
import { useDebouncedQuantities } from '../hooks/useDebouncedQuantities';

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);

  const {
    updateQuantity,
    cancelQuantity,
  } = useDebouncedQuantities();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (id: string, currentQuantity: number) =>
    quantities[id] ?? currentQuantity;

  const handleChangeQuantity = (id: string, quantity: number) => {
    const item = items.find(i => i.book.id === id);
    if (!item) return;

    const nextQuantity = Math.max(
      1,
      Math.min(quantity, item.book.stock),
    );

    setQuantities(prev => ({
      ...prev,
      [id]: nextQuantity,
    }));

    updateQuantity(id, nextQuantity);
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc muốn xóa sách này khỏi giỏ hàng?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            cancelQuantity(id);
            dispatch(removeFromCart(id));

            setQuantities(prev => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          },
        },
      ],
    );
  };

  const total = items.reduce((sum, item) => {
    const quantity = getQuantity(item.book.id, item.quantity);
    return sum + item.book.price * quantity;
  }, 0);

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text>Giỏ hàng đang trống.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.book.id}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                quantity={getQuantity(item.book.id, item.quantity)}
                onChangeQuantity={handleChangeQuantity}
                onRemove={() => handleRemove(item.book.id)}
              />
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>
              Tổng tiền: {formatVND(total)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#e53935',
  },
});