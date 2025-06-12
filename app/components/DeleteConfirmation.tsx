import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface DeleteConfirmationProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={[styles.content, isDark && styles.contentDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Удалить запись?
          </Text>
          <Text style={[styles.message, isDark && styles.messageDark]}>
            Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, isDark && styles.cancelButtonDark]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>
                Отмена
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  contentDark: {
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  messageDark: {
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonDark: {
    backgroundColor: '#1a1a1a',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  cancelButtonTextDark: {
    color: '#fff',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 