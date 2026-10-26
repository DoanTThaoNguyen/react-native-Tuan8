import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { Book } from '../types';
import { fetchBooks } from '../api/books';
import BookGrid from '../components/BookGrid';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setBooks(await fetchBooks());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Không tải được sách: {error}</Text>
      </View>
    );
  }

  return (
    <BookGrid
      books={books}
      onPressBook={id =>
        navigation.navigate('BookDetail', { bookId: id })
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});