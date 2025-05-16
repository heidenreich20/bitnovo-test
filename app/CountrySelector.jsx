// components/CountrySelectorModal.js
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';

const countries = [
  { name: 'Argentina', code: 'AR', dialCode: '+54' },
  { name: 'Estados Unidos', code: 'US', dialCode: '+1' },
  { name: 'España', code: 'ES', dialCode: '+34' },
  { name: 'Reino Unido', code: 'GB', dialCode: '+44' },
  { name: 'México', code: 'MX', dialCode: '+52' },
  { name: 'Colombia', code: 'CO', dialCode: '+57' },
  { name: 'Chile', code: 'CL', dialCode: '+56' },
  { name: 'Brasil', code: 'BR', dialCode: '+55' },
  { name: 'Perú', code: 'PE', dialCode: '+51' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598' },
];

export default function CountrySelectorModal({ visible, onClose, onSelect, selectedDialCode }) {
  const [search, setSearch] = useState('');

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search)
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TextInput
            placeholder="Buscar país o código"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />

          <FlatList
            data={filtered}
            keyExtractor={item => item.code}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  item.dialCode === selectedDialCode && styles.selectedItem
                ]}
                onPress={() => {
                  onSelect(item.dialCode);
                  onClose();
                }}
              >
                <CountryFlag isoCode={item.code} style={styles.flag} />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.dialCode}>{item.dialCode}</Text>
                </View>
                {item.dialCode === selectedDialCode && (
                  <Text style={styles.check}>✔️</Text>
                )}
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  selectedItem: {
    backgroundColor: '#E0F0FF',
  },
  flag: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  dialCode: {
    fontSize: 14,
    color: '#555',
  },
  check: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#035AC5',
    fontWeight: '600',
  },
});
