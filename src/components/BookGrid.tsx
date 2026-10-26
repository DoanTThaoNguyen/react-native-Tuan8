import {
  FlatList,
  type ListRenderItem,
} from 'react-native';
import type { ReactElement } from 'react';
import type { Book } from '../types';
import BookCard from './BookCard';

type Props = {
  books: Book[];
  onPressBook: (id: string) => void;
  ListEmptyComponent?: ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function BookGrid({
  books,
  onPressBook,
  ListEmptyComponent,
  refreshing,
  onRefresh,
}: Props) {
  return (
    <FlatList
      data={books}
      keyExtractor={book => book.id}
      renderItem={({ item }) => (
        <BookCard book={item} onPress={onPressBook} />
      )}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={[
        { padding: 12, gap: 12 },
        books.length === 0 && { flexGrow: 1 },
      ]}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}