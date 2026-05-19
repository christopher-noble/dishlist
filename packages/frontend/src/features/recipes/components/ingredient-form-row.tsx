import { Theme } from '@/constants/theme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { IngredientUnitLabels } from '../utils/ingredient-display';
import { UnitDropdown } from './unit-dropdown';

const c = Theme.colors;

export interface IngredientDraft {
  item: string;
  amount: string;
  unit: string;
}

export const EMPTY_INGREDIENT_DRAFT: IngredientDraft = {
  item: '',
  amount: '',
  unit: '',
};

interface IngredientFormRowProps {
  ingredient: IngredientDraft;
  units: IngredientUnitLabels[];
  canRemove: boolean;
  itemRef?: (ref: TextInput | null) => void;
  onItemChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onUnitChange: (unit: string) => void;
  onRemove: () => void;
  onSubmitItem?: () => void;
}

export function IngredientFormRow({
  ingredient,
  units,
  canRemove,
  itemRef,
  onItemChange,
  onAmountChange,
  onUnitChange,
  onRemove,
  onSubmitItem,
}: IngredientFormRowProps) {
  return (
    <View style={styles.row}>
      <TextInput
        ref={itemRef}
        style={[styles.input, styles.itemInput]}
        placeholder="Ingredient"
        placeholderTextColor={c.placeholder}
        value={ingredient.item}
        onChangeText={onItemChange}
        onSubmitEditing={onSubmitItem}
        returnKeyType="next"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.amountInput]}
        placeholder="Amt."
        placeholderTextColor={c.placeholder}
        value={ingredient.amount}
        onChangeText={onAmountChange}
        keyboardType="decimal-pad"
      />
      <UnitDropdown value={ingredient.unit} units={units} onChange={onUnitChange} />
      {canRemove ? (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      ) : (
        <View style={styles.removeSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  input: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: c.text,
    height: 48,
  },
  itemInput: {
    flex: 1,
    minWidth: 0,
  },
  amountInput: {
    width: 76,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  removeSpacer: {
    width: 32,
  },
});
