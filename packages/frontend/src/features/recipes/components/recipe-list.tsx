import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { Recipe } from '@/src/shared/api/generated/graphql';
import { useArchivedRecipes, useRecipes } from '../hooks/use-recipes';
import { Theme } from '@/constants/theme';
import { RecipeCard, type RecipeCardLayout } from './recipe-card';

const c = Theme.colors;

const MAX_WIDTH_WEB = 1200;
const TABLET_MIN_WIDTH = 768;

function useRecipeCardLayout(): RecipeCardLayout {
  const { width } = useWindowDimensions();
  const isTablet =
    (Platform.OS === 'ios' && Platform.isPad) ||
    (Platform.OS !== 'web' && width >= TABLET_MIN_WIDTH) ||
    (Platform.OS === 'web' && width >= TABLET_MIN_WIDTH);

  return isTablet ? 'grid' : 'list';
}

interface RecipeListProps {
  onRecipePress?: (recipe: Recipe) => void;
  onRecipeDelete?: (recipe: Recipe) => void;
  source?: 'active' | 'archived';
  emptyMessage?: string;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  onRecipePress,
  onRecipeDelete,
  source = 'active',
  emptyMessage,
}) => {
  const cardLayout = useRecipeCardLayout();
  const activeQuery = useRecipes({
    fetchPolicy: 'cache-and-network',
    skip: source !== 'active',
  });
  const archivedQuery = useArchivedRecipes({
    fetchPolicy: 'cache-and-network',
    skip: source !== 'archived',
  });
  const { data, loading, error, refetch } =
    source === 'archived' ? archivedQuery : activeQuery;
  const recipes =
    source === 'archived' ? data?.archivedRecipes : data?.recipes;

  const handleCardPress = useCallback((recipe: Recipe) => {
    if (onRecipePress) {
      onRecipePress(recipe);
    } else {
      router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, recipeData: JSON.stringify(recipe) } });
    }
  }, [onRecipePress]);

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>Tap to retry</Text>
      </View>
    );
  }

  if (!recipes?.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          {emptyMessage ?? (source === 'archived' ? 'No removed recipes' : 'No recipes found')}
        </Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <ScrollView style={styles.fill} contentContainerStyle={styles.webContainer}>
        <View style={cardLayout === 'list' ? styles.webList : styles.webGrid}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              layout={cardLayout}
              onPress={handleCardPress}
              onDelete={onRecipeDelete}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={recipes}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          layout={cardLayout}
          onPress={handleCardPress}
          onDelete={onRecipeDelete}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={cardLayout === 'grid' ? 2 : 1}
      contentContainerStyle={cardLayout === 'list' ? styles.listColumn : styles.list}
      refreshing={loading}
      onRefresh={() => refetch()}
    />
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  list: {
    padding: 16,
  },
  listColumn: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  webContainer: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: MAX_WIDTH_WEB,
    gap: 8,
  },
  webList: {
    width: '100%',
    maxWidth: 600,
    gap: 0,
  },
  errorText: {
    fontSize: 16,
    color: c.destructive,
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: c.primary,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: c.textMuted,
  },
});
