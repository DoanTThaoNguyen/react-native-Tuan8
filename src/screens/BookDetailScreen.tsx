import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Book } from '../types';
import { fetchBookById } from '../api/books';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, selectQuantityInCart } from '../store/cartSlice';
import FavoriteButton from '../components/FavoriteButton';
import { formatVND } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen({ route }: Props) {
  const { bookId } = route.params;
  const dispatch = useAppDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const quantityInCart =
  useAppSelector(selectQuantityInCart(bookId)) ?? 0;
  
  useEffect(() => {
    let active = true;

    fetchBookById(bookId)
      .then(data => {
        if (active) setBook(data);
      })
      .catch(e => {
        if (active) setError((e as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookId]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error || !book) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Không tìm thấy sách.'}</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (book.stock <= 0) {
      Alert.alert('Thông báo', 'Sách đã hết hàng.');
      return;
    }

    if (quantityInCart >= book.stock) {
      Alert.alert('Thông báo', 'Số lượng trong giỏ đã đạt tồn kho.');
      return;
    }

    dispatch(addToCart(book));
    Alert.alert('Thành công', 'Đã thêm sách vào giỏ hàng.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <FavoriteButton book={book} size={26} />
      </View>

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Tác giả: {book.author}</Text>
      <Text style={styles.category}>Thể loại: {book.category}</Text>
      <Text style={styles.price}>{formatVND(book.price)}</Text>
      <Text style={styles.rating}>Đánh giá: {book.rating}</Text>
      <Text style={styles.stock}>Tồn kho: {book.stock}</Text>
      <Text style={styles.description}>{book.description}</Text>

      <TouchableOpacity
        style={[
          styles.button,
          book.stock <= 0 && styles.disabledButton,
        ]}
        onPress={handleAddToCart}
        disabled={book.stock <= 0}
      >
        <Text style={styles.buttonText}>
          {book.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 16,
  },
  cover: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: 'bold',
  },
  author: {
    marginTop: 8,
    fontSize: 16,
  },
  category: {
    marginTop: 6,
    fontSize: 16,
  },
  price: {
    marginTop: 12,
    fontSize: 20,
    color: '#e53935',
    fontWeight: 'bold',
  },
  rating: {
    marginTop: 8,
  },
  stock: {
    marginTop: 8,
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#235789',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});