import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectIsFavorite,
  toggleWishlist,
} from '../store/wishlistSlice';
import type { Book } from '../types';

type Props = {
  book: Book;
  size?: number;
  style?: object;
};

export default function FavoriteButton({
  book,
  size = 20,
  style,
}: Props) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(book.id));

  return (
    <Pressable
      style={[styles.badge, style]}
      onPress={() => dispatch(toggleWishlist(book))}
    >
      <Text style={{ fontSize: size, color: isFavorite ? '#e53935' : '#555' }}>
        {isFavorite ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});