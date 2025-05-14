import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentCompleted({ navigation }) {
    const animation = useRef(null);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LottieView
                    autoPlay
                    loop={false}
                    ref={animation}
                    style={{
                        width: 200,
                        height: 200,

                    }}
                    source={require('../assets/completedFer.json')}
                />

                <Text style={styles.title}>Pago recibido</Text>
                <Text style={styles.subtitle}>El pago se ha confirmado con éxito</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('CreatePayment', {
                        amount: '',
                        notes: '',
                    });
                }}
            >
                <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 32,
    },
    logo: {
        width: 140,
        height: 40,
        marginTop: 12,
    },
    content: {
        alignItems: 'center',
    },
    checkIcon: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    button: {
        backgroundColor: '#F5F7FA',
        paddingVertical: 14,
        paddingHorizontal: 64,
        borderRadius: 12,
        elevation: 2,
    },
    buttonText: {
        color: '#003E8A',
        fontWeight: '600',
        fontSize: 16,
    },
});
