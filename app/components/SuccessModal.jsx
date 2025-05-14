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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 12,
        backgroundColor: '#0053A4',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 40, 89, 0.3)",
    },
    modal: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        backgroundColor: '#A1E4FC',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkmark: {
        fontSize: 32,
        color: '#00C8D3',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002859',
        marginBottom: 8,
    },
    message: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonClose: {
        backgroundColor: '#0053A4',
        padding: 12,
        borderRadius: 8,
    },
    buttonCloseText: {
        color: '#fff',
        fontWeight: '600',
    },
});
