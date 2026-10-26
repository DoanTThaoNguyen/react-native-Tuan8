import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import type { Book } from '../types';
import FavoriteButton from './FavoriteButton';

type Props = {
  book: Book;
  onPress: (id: string) => void;
};

const formatVND = (price: number) =>
  price.toLocaleString('vi-VN') + ' ₫';

export default function BookCard({ book, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(book.id)}
    >
      <View>
        <Image
          source={{ uri: book.cover }}
          style={styles.cover}
        />

        <FavoriteButton book={book} />

        {book.stock === 0 && (
          <Text style={styles.soldOut}>Hết hàng</Text>
        )}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {book.title}
      </Text>

      <Text style={styles.price}>
        {formatVND(book.price)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 4,
    color: '#e53935',
  },
  soldOut: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#555',
    color: '#fff',
    padding: 4,
  },
});
