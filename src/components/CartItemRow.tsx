import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import type { CartItem } from '../types';

type Props = {
  item: CartItem;
  quantity: number;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: () => void;
};

const formatVND = (price: number) =>
  price.toLocaleString('vi-VN') + ' ₫';

export default function CartItemRow({
  item,
  quantity,
  onChangeQuantity,
  onRemove,
}: Props) {
  const { book } = item;

  return (
    <View style={styles.row}>
      <Image source={{ uri: book.cover }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text>{formatVND(book.price)}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            disabled={quantity <= 1}
            onPress={() => onChangeQuantity(book.id, quantity - 1)}
            style={[styles.button, quantity <= 1 && styles.disabled]}
          >
            <Text>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            disabled={quantity >= book.stock}
            onPress={() => onChangeQuantity(book.id, quantity + 1)}
            style={[
              styles.button,
              quantity >= book.stock && styles.disabled,
            ]}
          >
            <Text>+</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
  quantity: {
    marginHorizontal: 12,
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  removeText: {
    color: '#e53935',
    fontSize: 18,
  },
});