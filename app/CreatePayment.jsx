import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import bitnovoApi from './api/bitnovo';

export default function CreatePaymentScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  useFocusEffect(() => {
    if (route.params?.selectedCurrency) {
      setCurrency(route.params.selectedCurrency);
    }
  });

  useEffect(() => {
    if (route.params?.amount !== undefined) {
      setAmount(route.params.amount);
    }
    if (route.params?.notes !== undefined) {
      setNotes(route.params.notes);
    }
  }, [route.params?.amount, route.params?.notes]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Importe a pagar',
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerTintColor: "#002859",
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CurrencySelector', {
              selectedCurrency: currency,
              onSelect: (val) => setCurrency(val),
            })
          }
          style={{ color: '#002859', backgroundColor: '#D3DCE64D' }}
        >
          <Text>
            {currency} ▼
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, currency]);

  const maxLength = 140;
  const isValid = !!amount && notes.length <= maxLength;

  const createPayment = async () => {
    if (!isValid) {
      Alert.alert('Faltan campos', 'Por favor completa todos los campos correctamente.');
      return;
    }

    try {
      setLoading(true);
      const response = await bitnovoApi.post('/orders/', {
        expected_output_amount: parseFloat(amount),
        notes,
        fiat: currency,
      });

      const { identifier, web_url } = response.data;
      navigation.navigate('SharePayment', {
        identifier,
        webUrl: web_url.split('://')[1],
        amount,
        currencySymbol: getCurrencySymbol(currency),
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'No se pudo crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (code) => {
    switch (code) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return code;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.amountDisplayWrapper}>
          <TextInput
            style={[
              styles.amountInputDisplay,
              {
                color: parseFloat(amount) > 0 ? "#035AC5" : '#C0CCDA',
              },
            ]}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={'#C0CCDA'}
          />
          <Text
            style={[styles.currencySymbolDisplay,
            {
              color: parseFloat(amount) > 0 ? "#035AC5" : '#C0CCDA',
            },
            ]}
          >
            {getCurrencySymbol(currency)}
          </Text>
        </View>

        <Text style={styles.label}>Concepto</Text>
        <TextInput
          style={[
            styles.textArea,
            { color: '#002859' },
          ]}
          multiline
          maxLength={maxLength}
          placeholder="Añade una descripción"
          placeholderTextColor={'#C0CCDA'}
          value={notes}
          onChangeText={setNotes}
        />
        <Text style={styles.charCount}>
          {notes.length}/{maxLength} caracteres
        </Text>

        <TouchableOpacity
          disabled={!isValid || loading}
          onPress={createPayment}
          style={[
            styles.button,
            {
              backgroundColor: isValid ? '#0053A4' : '#E6F0FA',
            },
          ]}
        >
          <Text
            style={{
              color: isValid ? '#fff' : '#8FA9C9',
              fontWeight: '600',
            }}
          >
            {loading ? 'Creando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  amountDisplayWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  amountInputDisplay: {
    fontSize: 40,
    fontWeight: '600',
    padding: 0,
    margin: 0,
  },
  currencySymbolDisplay: {
    fontSize: 32,
    marginLeft: 8,
    fontWeight: '600',
    color: '#C0CCDA'
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  charCount: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
