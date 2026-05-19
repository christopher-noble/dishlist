import { BackButton } from '@/components/ui/back-button';
import { Theme } from '@/constants/theme';
import { useRequireAuth } from '@/src/features/auth';
import { RecipeList, useDeleteAllArchivedRecipes } from '@/src/features/recipes';
import type { Recipe } from '@/src/shared/api/generated/graphql';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const c = Theme.colors;
const MAX_WIDTH_WEB = 600;

export default function ArchivedRecipesScreen() {
  useRequireAuth();
  const [deleteAllArchivedRecipes, { loading: deletingAll }] =
    useDeleteAllArchivedRecipes();

  const confirmDeleteAll = useCallback(() => {
    Alert.alert(
      'Delete all removed recipes?',
      'Every recipe in this list will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete all',
          style: 'destructive',
          onPress: async () => {
            await deleteAllArchivedRecipes({
              refetchQueries: ['GetArchivedRecipes', 'GetRecipeStats'],
            });
            router.back();
          },
        },
      ],
    );
  }, [deleteAllArchivedRecipes]);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: {
        id: recipe.id,
        recipeData: JSON.stringify(recipe),
        archived: '1',
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Removed recipes</Text>
        <Pressable
          onPress={confirmDeleteAll}
          disabled={deletingAll}
          style={styles.deleteAllButton}
        >
          <Text style={styles.deleteAllText}>Delete all</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>
        Recipes you removed from your feed in the last 30 days. After 30 days they are permanently deleted automatically.
      </Text>
      <RecipeList
        source="archived"
        onRecipePress={handleRecipePress}
        emptyMessage="No removed recipes in the last 30 days"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    width: '100%',
    alignSelf: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: c.text,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  deleteAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: c.destructiveBg,
  },
  deleteAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: c.destructive,
  },
  subtitle: {
    fontSize: 14,
    color: c.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 25,
    lineHeight: 20,
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    alignSelf: 'center',
    width: '100%',
  },
});
