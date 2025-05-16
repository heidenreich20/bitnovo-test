import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import shareImg from '../assets/images/copyLink.png';
import emailIcon from '../assets/images/email.png';
import paymentIcon from '../assets/images/paymentIcon.png';
import QRIcon from '../assets/images/QRIcon.png';
import shareIcon from '../assets/images/share.png';
import whatsappIcon from '../assets/images/whatsappIcon.png';
import SuccessModal from './components/SuccessModal';
import CountrySelector from './CountrySelector';

export default function SharePaymentScreen({ navigation }) {
  const route = useRoute();
  const { identifier, webUrl, amount, currencySymbol } = route.params;
  const [countryCode, setCountryCode] = useState('+54');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [succesVisible, setSuccessVisible] = useState(false);
  const [successChannel, setSuccessChannel] = useState('');
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [isCountrySelectorVisible, setIsCountrySelectorVisible] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route.params?.selectedCountry) {
      setCountryCode(route.params.selectedCountry.dialCode);
    }
  }, [route.params?.selectedCountry]);

  useEffect(() => {
    navigation.setOptions({ title: 'Solicitar pago' });
  }, [navigation]);

  const fullUrl = `https://${webUrl}`;

  const handleWhatsappShare = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Por favor ingresa un número de WhatsApp');
      return;
    }

    if (!countryCode) {
      Alert.alert('Error', 'Por favor selecciona un código de país');
      return;
    }

    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const fullNumber = `${countryCode}${cleanedNumber}`;

    if (cleanedNumber.length < 6 || cleanedNumber.length > 15) {
      Alert.alert('Error', 'El número de WhatsApp no es válido');
      return;
    }

    const message = `Pago solicitado: ${fullUrl}`;
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
      .then(() => {
        setSuccessChannel('WhatsApp');
        setSuccessVisible(true);
        setIsWaitingPayment(true);
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo abrir WhatsApp');
      });
  };

  const handleEmailShare = () => {
    if (email) {
      const subject = 'Pago solicitado';
      const body = `Aquí está el enlace de pago:\n\n${fullUrl}`;
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      Linking.openURL(url)
        .then(() => {
          setSuccessVisible(true);
          setSuccessChannel('correo electrónico');
          setIsWaitingPayment(true);
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudo abrir el cliente de correo electrónico');
        });
    } else {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico');
    }
  };

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
    <View style={styles.container}>
      <View style={styles.paymentBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <Image source={paymentIcon} style={{ width: 56, height: 56 }} />
          <View>
            <Text style={styles.paymentTitle}>Solicitud de pago</Text>
            <Text style={styles.paymentAmount}>{parseFloat(amount).toFixed(2)} {currencySymbol}</Text>
          </View>
        </View>
        <Text style={styles.paymentSubtitle}>Comparte el enlace de pago con el cliente</Text>
      </View>

      <View style={styles.linkWrapper}>
        <View style={[styles.shareLink, { width: '80%', marginBottom: 0 }]}>
          <Image source={shareIcon} style={{ width: 24, height: 24, marginRight: 8 }} />
          <TextInput
            style={styles.textInput}
            value={webUrl}
            multiline={false}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('QRCode', {
            webUrl,
            identifier,
            amount,
            currencySymbol,
          })}>
          <Image source={shareImg} style={{ height: 72, width: 64, borderRadius: 6 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.shareLink}>
        <Image source={emailIcon} style={{ width: 24, height: 24, marginRight: 8 }} />
        <TextInput
          style={styles.textInput}
          placeholder="Enviar por correo electrónico"
          placeholderTextColor="#002859"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />
        {isEmailFocused && email.length > 0 && (
          <TouchableOpacity onPress={handleEmailShare} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.shareLink}>
        <Image source={whatsappIcon} style={{ width: 24, height: 24, marginRight: 8 }} />
        <TouchableOpacity onPress={() => setIsCountrySelectorVisible(true)}>
          <Text style={{ color: '#002859', fontWeight: '600', fontSize: 16, marginRight: 8 }}>
            {countryCode} ▼
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Enviar a número de WhatsApp"
          placeholderTextColor="#002859"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={15}
          onFocus={() => setIsPhoneFocused(true)}
          onBlur={() => setIsPhoneFocused(false)}
        />
        {isPhoneFocused && phoneNumber.length > 0 && (
          <TouchableOpacity onPress={handleWhatsappShare} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.shareLink}>
        <Image source={QRIcon} style={{ width: 24, height: 24, marginEnd: 6 }} />
        <View style={[styles.textInput, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={{fontFamily: 'Mulish', fontSize: 12, color: '#002859'}}>Compartir con otras aplicaciones</Text>
        </View>
      </View>
      <SuccessModal
        visible={succesVisible}
        onClose={() => setSuccessVisible(false)}
        channel={successChannel}
      />
      {isWaitingPayment && (
        <View style={styles.waitingContainer}>
          <ActivityIndicator size="small" color="#035AC5" style={{ marginBottom: 8 }} />
          <Text style={styles.waitingText}>Esperando el pago del cliente...</Text>
        </View>
      )}
      <CountrySelector
        visible={isCountrySelectorVisible}
        onClose={() => setIsCountrySelectorVisible(false)}
        onSelect={(dial) => setCountryCode(dial)}
        selectedDialCode={countryCode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  paymentBox: {
    backgroundColor: '#F0F4FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Mulish',
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002859',
    marginBottom: 6,
  },
  paymentSubtitle: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Mulish',
  },
  shareLink: {
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 16,
    fontFamily: 'Mulish',
  },
  linkWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 16,
    fontFamily: 'Mulish',
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontFamily: 'Mulish',
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    color: '#002859',
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontFamily: 'Mulish',
  },
  button: {
    backgroundColor: '#035AC5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Mulish',
  },
  shareText: {
    color: '#002859',
  },
  waitingContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E6F1FF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingText: {
    color: '#002859',
    fontWeight: '500',
    fontSize: 14,
    fontFamily: 'Mulish',
  },
});

