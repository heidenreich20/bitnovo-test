import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { Image, StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BitnovoLogo from '../assets/images/bitnovoPay.png';
import CreatePayment from './CreatePayment';
import CurrencySelector from './CurrencySelector';
import PaymentCompleted from './PaymentCompleted';
import QRCode from './QRCode';
import SharePayment from './SharePayment';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
        />

        <Stack.Navigator initialRouteName="CreatePayment">
          <Stack.Screen
            name="CreatePayment"
            component={CreatePayment}
          />
          <Stack.Screen
            name="SharePayment"
            component={SharePayment}
            options={{
              title: 'Compartir Pago',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerTintColor: '#002859',
            }}
          />
          <Stack.Screen
            name="QRCode"
            component={QRCode}
            options={{
              title: 'Código QR',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerTintColor: '#002859',
            }}
          />
          <Stack.Screen
            name="CurrencySelector"
            component={CurrencySelector}
            options={{
              title: 'Seleccionar Moneda',
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerTintColor: '#002859',
            }}
          />
          <Stack.Screen
            name="PaymentCompleted"
            component={PaymentCompleted}
            options={{
              headerTitle: () => (
                <Image
                  source={BitnovoLogo}
                  style={{ width: 100, height: 40, resizeMode: 'contain' }}
                />
              ),
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerTintColor: '#002859',
            }}
          />
        </Stack.Navigator>
      </ThemeProvider>
    </SafeAreaView>
  );
}
