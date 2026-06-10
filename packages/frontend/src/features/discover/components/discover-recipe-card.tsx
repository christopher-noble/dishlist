import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { DiscoverTheme } from '../constants/discover-theme';
import type { Recipe } from '@/src/shared/api/generated/graphql';

const c = DiscoverTheme.colors;
const CARD_HEIGHT = 180;

interface DiscoverRecipeCardProps {
  recipe: Recipe;
  onPress?: (recipe: Recipe) => void;
}

function estimateCookTime(recipe: Recipe): string {
  const stepCount = recipe.steps?.length ?? 0;
  const minutes = Math.max(10, stepCount * 5);
  return `${minutes} min`;
}

export function DiscoverRecipeCard({ recipe, onPress }: DiscoverRecipeCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      style={[styles.card, hovered && styles.cardHovered]}
      onPress={() => onPress?.(recipe)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {recipe.imageKey ? (
        <Image source={{ uri: recipe.imageKey }} style={styles.backgroundImage} contentFit="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="restaurant" size={40} color={c.textMuted} />
        </View>
      )}

      <LinearGradient
        colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.textGradient}
      />

      <Pressable
        style={styles.favoriteButton}
        onPress={(event) => {
          event.stopPropagation();
          setFavorited((value) => !value);
        }}
        hitSlop={8}
      >
        <MaterialIcons
          name={favorited ? 'favorite' : 'favorite-border'}
          size={18}
          color={favorited ? c.accent : c.textMuted}
        />
      </Pressable>

      <View style={styles.arrowButton}>
        <MaterialIcons name="north-east" size={16} color={c.text} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.name}
        </Text>

        <View style={styles.timeRow}>
          <MaterialIcons name="schedule" size={14} color={c.textMuted} />
          <Text style={styles.timeText}>{estimateCookTime(recipe)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const nativeShadow =
  Platform.OS !== 'web'
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }
    : {};

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.cardBorder,
    position: 'relative',
    backgroundColor: c.surfaceMuted,
    ...nativeShadow,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' as const }
      : {}),
  },
  cardHovered: {
    transform: [{ scale: 1.01 }],
    ...(Platform.OS !== 'web' ? { shadowOpacity: 0.12 } : {}),
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: c.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '72%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.cardBorder,
  },
  arrowButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.cardBorder,
  },
  content: {
    position: 'absolute',
    left: 18,
    right: '30%',
    bottom: 18,
    zIndex: 2,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: c.text,
    lineHeight: 22,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: c.textMuted,
    fontWeight: '500',
  },
});
