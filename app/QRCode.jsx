import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';

export default function QRCodeScreen({ route, navigation }) {
  const { webUrl, identifier, amount, currencySymbol } = route.params;
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`wss://payments.pre-bnvo.com/ws/merchant/${identifier}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS message:', data);

        if (data?.status === 'IA') {
          console.log('WS message:', data);
          setIsWaitingPayment(true);
        }

        if (data?.status === 'CO') {
          console.log('WS message:', data);
          navigation.replace('PaymentCompleted', { identifier });
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => socket.close();
  }, [identifier, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.
        </Text>
      </View>

      <View style={styles.qrWrapper}>
        <QRCodeStyled
          data={`https://${webUrl}`}
          style={{ backgroundColor: 'white' }}
          logo={{
          href: require('../assets/images/bitnovoLogo.png'),
          padding: 4,
          scale: 2
        }}
          padding={20}
          pieceSize={10}
        />
      </View>

      <Text style={styles.amount}>
        {parseFloat(amount).toFixed(2)} {currencySymbol}
      </Text>

      <Text style={styles.note}>
        Esta pantalla se actualizará automáticamente.
      </Text>

      {isWaitingPayment === true && (
        <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0052CC',
    alignItems: 'center',
    paddingTop: 20,
  },
  banner: {
    backgroundColor: '#EAF1FC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  bannerText: {
    textAlign: 'center',
    color: '#003E8A',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Mulish',
  },
  qrWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    fontFamily: 'Mulish',
  },
  note: {
    color: '#D6E4F5',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    fontFamily: 'Mulish',
  },
});
