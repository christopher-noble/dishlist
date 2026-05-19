import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';
import type { Recipe } from '@/src/shared/api/generated/graphql';

const c = Theme.colors;

const CARD_WIDTH_WEB = 280;
const IMAGE_HEIGHT_GRID_MOBILE = 150;
const IMAGE_HEIGHT_LIST = 180;
const IMAGE_HEIGHT_WEB = CARD_WIDTH_WEB * 0.75;

export type RecipeCardLayout = 'grid' | 'list';

interface RecipeCardProps {
  recipe: Recipe;
  layout?: RecipeCardLayout;
  onPress?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  layout = 'grid',
  onPress,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  const isListLayout = layout === 'list';
  const imageHeight = Platform.OS === 'web'
    ? IMAGE_HEIGHT_WEB
    : isListLayout
      ? IMAGE_HEIGHT_LIST
      : IMAGE_HEIGHT_GRID_MOBILE;

  const cardStyle = Platform.OS === 'web'
    ? {
        backgroundColor: c.surface,
        borderRadius: 16,
        margin: 8,
        overflow: 'hidden' as const,
        width: isListLayout ? '100%' : CARD_WIDTH_WEB,
        maxWidth: isListLayout ? 600 : CARD_WIDTH_WEB,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        transform: hovered ? [{ scale: 1.02 }] : undefined,
        cursor: 'pointer' as const,
      }
    : [
        isListLayout ? styles.cardList : styles.card,
        hovered && styles.cardHovered,
      ];

  return (
    <Pressable
      style={cardStyle as any}
      onPress={() => onPress?.(recipe)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {onDelete ? (
        <Pressable
          style={styles.deleteButton}
          onPress={(event) => {
            event.stopPropagation();
            onDelete(recipe);
          }}
          hitSlop={8}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      ) : null}
      {recipe.imageKey ? (
        <Image
          source={{ uri: recipe.imageKey }}
          style={isListLayout ? styles.listImage : { height: imageHeight }}
          contentFit="cover"
        />
      ) : null}
      <View style={[styles.content, isListLayout && styles.contentList]}>
        <Text
          style={[styles.title, isListLayout && styles.titleList]}
          numberOfLines={2}
        >
          {recipe.name}
        </Text>
        <Text style={styles.category}>{formatCategory(recipe.category)}</Text>
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
  cardList: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%',
    ...nativeShadow,
  },
  cardHovered: {
    transform: [{ scale: 1.02 }],
    ...(Platform.OS !== 'web' ? { shadowOpacity: 0.15 } : {}),
  },
  listImage: {
    width: '100%',
    height: IMAGE_HEIGHT_LIST,
  },
  content: {
    padding: 14,
  },
  contentList: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
  },
  titleList: {
    fontSize: 18,
    fontWeight: '700',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: c.textWarm,
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: c.destructiveBg,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: c.destructive,
  },
});
