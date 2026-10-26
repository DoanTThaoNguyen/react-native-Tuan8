import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppSelector } from '../store';
import { selectWishlist } from '../store/wishlistSlice';
import BookGrid from '../components/BookGrid';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const navigation = useNavigation<NavigationProp>();
  const books = useAppSelector(selectWishlist);

  return (
    <BookGrid
      books={books}
      onPressBook={id =>
        navigation.navigate('BookDetail', { bookId: id })
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>Chưa có sách yêu thích.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});