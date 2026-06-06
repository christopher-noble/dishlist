import { Theme } from '@/constants/theme';
import React, { useLayoutEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { IngredientUnitLabels } from '../utils/ingredient-display';
import { FORM_MOTION_TIMING } from './ingredient-form-animations';
import { UnitDropdown } from './unit-dropdown';

const c = Theme.colors;

const REMOVE_BUTTON_SIZE = 32;
const ROW_GAP = 8;

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
  const showRemove = useSharedValue(canRemove ? 1 : 0);

  useLayoutEffect(() => {
    showRemove.value = withTiming(canRemove ? 1 : 0, FORM_MOTION_TIMING);
  }, [canRemove, showRemove]);

  const removeSlotStyle = useAnimatedStyle(() => ({
    width: interpolate(
      showRemove.value,
      [0, 1],
      [0, REMOVE_BUTTON_SIZE],
      Extrapolation.CLAMP,
    ),
    marginLeft: interpolate(showRemove.value, [0, 1], [0, ROW_GAP], Extrapolation.CLAMP),
  }));

  const removeButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      showRemove.value,
      [0, 0.45, 0.65, 1],
      [0, 0, 1, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateX: interpolate(
          showRemove.value,
          [0, 1],
          [REMOVE_BUTTON_SIZE, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={styles.rowWrapper}>
      <View style={styles.row}>
        <View style={styles.fields}>
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
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
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
        </View>
        <Animated.View
          style={[styles.removeSlot, removeSlotStyle]}
          pointerEvents={canRemove ? 'auto' : 'none'}
        >
          <Animated.View style={removeButtonStyle}>
            <Pressable onPress={onRemove} style={styles.removeButton}>
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fields: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_GAP,
    minWidth: 0,
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
  removeSlot: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
