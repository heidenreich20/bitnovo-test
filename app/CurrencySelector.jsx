import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';

const currencies = [
  { code: 'EUR', name: 'Euro', flag: 'eu' },
  { code: 'USD', name: 'Dólar Estadounidense', flag: 'us' },
  { code: 'GBP', name: 'Libra Esterlina', flag: 'gb' },
];

export default function CurrencySelector() {
  const navigation = useNavigation();
  const route = useRoute();
  const selected = route.params?.selectedCurrency;
  const onSelect = route.params?.onSelect;

  const [search, setSearch] = useState('');

  const filtered = currencies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    if (onSelect) {
      onSelect(code);
      navigation.goBack();
    } else {
      navigation.navigate('CreatePayment', { selectedCurrency: code });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar moneda"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              item.code === selected && styles.selectedItem,
            ]}
            onPress={() => handleSelect(item.code)}
          >
            <CountryFlag
              isoCode={item.flag}
              style={styles.flag}
              size={48}
            />
            <View style={styles.textContainer}>
              <Text style={styles.code}>{item.name}</Text>
              <Text style={styles.name}>
                {item.code}
              </Text>
            </View>
            {item.code === selected && <Text style={styles.check}>✔️</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: '#E0F0FF',
  },
  flag: {
    borderRadius: 50,
    width: 48,
    height: 48,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    color: '#555',
    fontSize: 14,
  },
  check: {
    fontSize: 15,
  },
});
