import { Theme } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { RecipeFieldsFragment } from '@/src/shared/api/generated/graphql';
import {
  formatIngredientAmountLine,
  ingredientHasAmount,
  type IngredientUnitLabels,
} from '../utils/ingredient-display';

const c = Theme.colors;

type RecipeIngredient = RecipeFieldsFragment['ingredients'][number];

interface ExpandableIngredientChipProps {
  ingredient: RecipeIngredient;
  unitOptions: IngredientUnitLabels[];
  expanded: boolean;
  onPress: () => void;
}

export function ExpandableIngredientChip({
  ingredient,
  unitOptions,
  expanded,
  onPress,
}: ExpandableIngredientChipProps) {
  const showAmount = ingredientHasAmount(ingredient.amount, ingredient.unit);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        style={[styles.chip, expanded && styles.chipExpanded]}
      >
        <Text style={styles.itemText}>{ingredient.item}</Text>
      </Pressable>
      {expanded && showAmount ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(140)}
          style={styles.amountDropdown}
        >
          <Text style={styles.amountText}>
            {formatIngredientAmountLine(ingredient.amount, ingredient.unit, unitOptions)}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: c.primaryLight,
    borderWidth: 1,
    borderColor: c.chipBorder,
  },
  chipExpanded: {
    borderColor: c.primary,
  },
  itemText: {
    fontSize: 16,
    color: c.textSecondary,
  },
  amountDropdown: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.borderNeutral,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: c.primaryDark,
  },
});
