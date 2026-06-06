import { Theme } from '@/constants/theme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const c = Theme.colors;

const REMOVE_BUTTON_SIZE = 32;
const ROW_GAP = 10;

interface StepFormRowProps {
  stepNumber: number;
  value: string;
  inputRef?: (ref: TextInput | null) => void;
  onChange: (text: string) => void;
  onRemove: () => void;
  onSubmitEditing?: () => void;
}

export function StepFormRow({
  stepNumber,
  value,
  inputRef,
  onChange,
  onRemove,
  onSubmitEditing,
}: StepFormRowProps) {
  return (
    <View style={styles.rowWrapper}>
      <View style={styles.row}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{stepNumber}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={`Step ${stepNumber}`}
          placeholderTextColor={c.placeholder}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="next"
        />
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE,
    borderRadius: REMOVE_BUTTON_SIZE / 2,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ROW_GAP,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: c.white,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: c.text,
    marginRight: ROW_GAP,
  },
  removeButton: {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE,
    borderRadius: REMOVE_BUTTON_SIZE / 2,
    backgroundColor: c.background,
    borderWidth: 1,
    borderColor: c.destructiveBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 22,
    lineHeight: 22,
    color: c.destructive,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: Platform.OS === 'ios' ? -1 : 0,
  },
});
