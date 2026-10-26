import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppSelector } from '../store';
import { selectWishlist } from '../store/wishlistSlice';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const count = useAppSelector(selectWishlist).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Wishlist')}
      >
        <Text style={styles.buttonText}>
          Sách yêu thích ({count})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 16,
    backgroundColor: '#235789',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});