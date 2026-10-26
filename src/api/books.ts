import { Platform } from 'react-native';
import type { Book } from '../types';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${BASE_URL}/books`);

  if (!response.ok) {
    throw new Error('Không thể tải danh sách sách');
  }

  return response.json();
};

export const fetchBookById = async (id: string): Promise<Book> => {
  const response = await fetch(`${BASE_URL}/books/${id}`);

  if (!response.ok) {
    throw new Error('Không tìm thấy sách');
  }

  return response.json();
};