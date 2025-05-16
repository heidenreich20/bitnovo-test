import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessModal({ visible, onClose, channel }) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.iconWrapper}>
                        <Text style={styles.checkmark}>✔</Text>
                    </View>
                    <Text style={styles.title}>Solicitud enviada</Text>
                    <Text style={styles.message}>
                        Tu solicitud de pago ha sido enviada con éxito por {channel}.
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.buttonClose}>
                        <Text style={styles.buttonCloseText}>Entendido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        backgroundColor: '#0053A4',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Mulish',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: "rgba(0, 40, 89, 0.3)",
    },
    modal: {
        display: 'flex',
        gap: 16,
        height: '50%',
        backgroundColor: '#fff',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginVertical: 15,
        marginHorizontal: 15,
    },
    iconWrapper: {
        backgroundColor: '#A1E4FC',
        width: 80,
        height: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkmark: {
        fontSize: 42,
        color: '#00C8D3',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#002859',
        marginBottom: 8,
        fontFamily: 'Mulish',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Mulish',

    },
    buttonClose: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0053A4',
        padding: 24,
        borderRadius: 6,
        width: 320,
    },
    buttonCloseText: {
        color: '#fff',
        fontWeight: '700',
        fontFamily: 'Mulish',
    },
});
