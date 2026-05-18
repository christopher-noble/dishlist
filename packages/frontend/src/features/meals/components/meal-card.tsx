import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';
import type { Meal } from '@/src/shared/api/generated/graphql';

const c = Theme.colors;

const CARD_WIDTH_WEB = 280;
const IMAGE_HEIGHT_MOBILE = 150;
const IMAGE_HEIGHT_WEB = CARD_WIDTH_WEB * 0.75;

interface MealCardProps {
  meal: Meal;
  onPress?: (meal: Meal) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress }) => {
  const [hovered, setHovered] = useState(false);
  const imageHeight = Platform.OS === 'web' ? IMAGE_HEIGHT_WEB : IMAGE_HEIGHT_MOBILE;

  const cardStyle = Platform.OS === 'web'
    ? {
        backgroundColor: c.surface,
        borderRadius: 16,
        margin: 8,
        overflow: 'hidden' as const,
        width: CARD_WIDTH_WEB,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        transform: hovered ? [{ scale: 1.02 }] : undefined,
        cursor: 'pointer' as const,
      }
    : [styles.card, hovered && styles.cardHovered];

  return (
    <Pressable
      style={cardStyle as any}
      onPress={() => onPress?.(meal)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {meal.imageUrl ? (
        <Image source={{ uri: meal.imageUrl }} style={{ height: imageHeight }} contentFit="cover" />
      ) : (
        <View style={[styles.placeholder, { height: imageHeight }]}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{meal.name}</Text>
        <Text style={styles.category}>{meal.category.charAt(0) + meal.category.slice(1).toLowerCase()}</Text>
      </View>
    </Pressable>
  );
};

const nativeShadow = Platform.OS !== 'web'
  ? { shadowColor: c.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 3 }
  : {};

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    flex: 1,
    ...nativeShadow,
  },
  cardHovered: {
    transform: [{ scale: 1.02 }],
    ...(Platform.OS !== 'web' ? { shadowOpacity: 0.15 } : {}),
  },
  placeholder: {
    backgroundColor: c.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: c.textWarm,
    marginTop: 4,
  },
});
