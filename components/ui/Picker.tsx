import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import { Colors, spacing } from '@/constants/Colors';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  error?: string;
}

export function Picker({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error,
}: PickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.pickerText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown color={Colors.gray400} size={20} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: spacing.xs,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: Colors.error,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.gray900,
  },
  placeholderText: {
    color: Colors.gray400,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray900,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  optionText: {
    fontSize: 16,
    color: Colors.gray700,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});