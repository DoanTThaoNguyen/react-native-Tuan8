import { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
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

  const { updateQuantity, cancelQuantity } =
    useDebouncedQuantities();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [removeId, setRemoveId] = useState<string | null>(null);

  const getQuantity = (id: string, currentQuantity: number) =>
    quantities[id] ?? currentQuantity;

  // Tăng, giảm số lượng và giới hạn theo tồn kho
  const handleChangeQuantity = (id: string, quantity: number) => {
    const item = items.find(i => i.book.id === id);
    if (!item || item.book.stock <= 0) return;

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

  // Hiện hộp thoại xác nhận xóa
  const handleRemove = (id: string) => {
    setRemoveId(id);
  };

  // Thực hiện xóa sau khi người dùng xác nhận
  const confirmRemove = () => {
    if (removeId === null) return;

    const id = removeId;

    cancelQuantity(id);
    dispatch(removeFromCart(id));

    setQuantities(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setRemoveId(null);
  };

  // Tính tổng tiền theo số lượng đang hiển thị
  const total = items.reduce((sum, item) => {
    const quantity = getQuantity(item.book.id, item.quantity);

    return sum + item.book.price * quantity;
  }, 0);

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Giỏ hàng đang trống.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.book.id}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                quantity={getQuantity(
                  item.book.id,
                  item.quantity,
                )}
                onChangeQuantity={handleChangeQuantity}
                onRemove={() => handleRemove(item.book.id)}
              />
            )}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>
              Tổng tiền: {formatVND(total)}
            </Text>
          </View>
        </>
      )}

      {/* Hộp thoại xác nhận xóa, dùng chung cho web và mobile */}
      <Modal
        visible={removeId !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRemoveId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Xóa sản phẩm
            </Text>

            <Text style={styles.modalMessage}>
              Bạn có chắc muốn xóa sách này khỏi giỏ hàng?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRemoveId(null)}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmRemove}
              >
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  deleteButton: {
    backgroundColor: '#e53935',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});