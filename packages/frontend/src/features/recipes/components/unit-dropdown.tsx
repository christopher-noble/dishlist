import { Theme } from '@/constants/theme';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { IngredientUnitLabels } from '../utils/ingredient-display';

const c = Theme.colors;

const NONE_UNIT_VALUE = '';

interface UnitDropdownProps {
  value: string;
  units: IngredientUnitLabels[];
  onChange: (unit: string) => void;
}

export function UnitDropdown({ value, units, onChange }: UnitDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = units.find((unit) => unit.value === value);
  const displayLabel = selected?.singularLabel ?? (value || 'Unit');
  const isEmpty = !value;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel="Select unit"
      >
        <Text
          style={[styles.triggerText, isEmpty && styles.triggerPlaceholder]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>Unit</Text>
            <ScrollView style={styles.optionsList} keyboardShouldPersistTaps="handled">
              <Pressable
                onPress={() => {
                  onChange(NONE_UNIT_VALUE);
                  setOpen(false);
                }}
                style={[styles.option, value === NONE_UNIT_VALUE && styles.optionSelected]}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === NONE_UNIT_VALUE && styles.optionTextSelected,
                  ]}
                >
                  None
                </Text>
              </Pressable>
              {units.map((unit) => {
                const isSelected = unit.value === value;
                return (
                  <Pressable
                    key={unit.value}
                    onPress={() => {
                      onChange(unit.value);
                      setOpen(false);
                    }}
                    style={[styles.option, isSelected && styles.optionSelected]}
                  >
                    <Text
                      style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    >
                      {unit.singularLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 88,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    backgroundColor: c.surface,
    gap: 4,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
  },
  triggerPlaceholder: {
    fontWeight: '500',
    color: c.placeholder,
  },
  chevron: {
    fontSize: 12,
    color: c.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: c.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: c.borderNeutral,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: c.text,
    marginBottom: 12,
  },
  optionsList: {
    maxHeight: 320,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: c.primaryLight,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: c.text,
  },
  optionTextSelected: {
    color: c.primaryDark,
    fontWeight: '700',
  },
});
