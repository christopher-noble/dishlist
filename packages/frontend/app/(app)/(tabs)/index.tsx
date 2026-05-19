import { IconSymbol } from '@/components/ui/icon-symbol';
import { Theme } from '@/constants/theme';
import { useRequireAuth } from '@/src/features/auth';
import { RecipeList } from '@/src/features/recipes';
import type { Recipe } from '@/src/shared/api/generated/graphql';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_WIDTH_WEB = 1200;
const c = Theme.colors;

export default function HomeScreen() {
  useRequireAuth();
  const [addHovered, setAddHovered] = useState(false);

  const handleRecipePress = (recipe: Recipe) => {
    router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, recipeData: JSON.stringify(recipe) } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrapper}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Animated.Text entering={FadeInRight.delay(300).springify()} style={styles.title}>
            Recipes
          </Animated.Text>
          <Animated.View entering={FadeInRight.delay(400).springify()}>
            <Pressable
              onPress={() => router.push('/recipe/add')}
              onHoverIn={() => setAddHovered(true)}
              onHoverOut={() => setAddHovered(false)}
              style={[styles.addButton, addHovered && styles.addButtonHovered]}
            >
              <IconSymbol name="plus" size={24} color={c.primary} weight="semibold" />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
      <RecipeList onRecipePress={handleRecipePress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  headerWrapper: {
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 20,
  },
  title: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
    color: c.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.chipBorder,
  },
  addButtonHovered: {
    backgroundColor: c.primaryMuted,
    transform: [{ scale: 1.05 }],
  },
});
