import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/features/auth/context/auth-context';
import { useRequireAuth } from '@/src/features/auth/hooks/use-require-auth';
import { filterRecipesBySearch, useRecipes } from '@/src/features/recipes';
import type { Recipe } from '@/src/shared/api/generated/graphql';

import { DISCOVER_CATEGORIES, type DiscoverCategory } from '../constants/discover-categories';
import { DiscoverTheme } from '../constants/discover-theme';
import { DiscoverRecipeCard } from './discover-recipe-card';

const MAX_WIDTH_WEB = 600;
const TRENDING_PREVIEW_COUNT = 4;
const c = DiscoverTheme.colors;

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  if (first && last) {
    return `${first}${last}`.toUpperCase();
  }
  return (first || last || '?').toUpperCase();
}

function CategoryChip({
  category,
  selected,
  onPress,
}: {
  category: DiscoverCategory;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.categoryItem} onPress={onPress}>
      <View style={[styles.categoryCircle, selected && styles.categoryCircleActive]}>
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.categoryLabel, selected && styles.categoryLabelActive]}>
        {category.label}
      </Text>
    </Pressable>
  );
}

function CategoryRow({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: DiscoverCategory['id'];
  onSelectCategory: (id: DiscoverCategory['id']) => void;
}) {
  const chips = DISCOVER_CATEGORIES.map((item) => (
    <CategoryChip
      key={item.id}
      category={item}
      selected={selectedCategory === item.id}
      onPress={() => onSelectCategory(item.id)}
    />
  ));

  if (Platform.OS === 'web') {
    return <View style={styles.categoryRowWeb}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryList}
    >
      {chips}
    </ScrollView>
  );
}

export function DiscoverScreen() {
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DiscoverCategory['id']>('ALL');
  const [showAllTrending, setShowAllTrending] = useState(false);

  const { data, loading, error, refetch } = useRecipes({
    fetchPolicy: 'cache-and-network',
  });

  const filteredRecipes = useMemo(() => {
    let recipes = data?.recipes ?? [];

    if (selectedCategory !== 'ALL') {
      recipes = recipes.filter((recipe) => recipe.category === selectedCategory);
    }

    return filterRecipesBySearch(recipes, searchQuery);
  }, [data?.recipes, searchQuery, selectedCategory]);

  const trendingRecipes = showAllTrending
    ? filteredRecipes
    : filteredRecipes.slice(0, TRENDING_PREVIEW_COUNT);

  const handleRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id, recipeData: JSON.stringify(recipe) },
    });
  };

  const firstName = user?.firstName?.trim() || 'there';
  const initials = user ? getInitials(user.firstName, user.lastName) : '?';

  const pageHeader = (
    <View style={styles.inner}>
      <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.topBar}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.greeting}>Hi {firstName} 👋</Text>
        </View>
        <Pressable style={styles.notificationButton} hitSlop={8}>
          <MaterialIcons name="notifications-none" size={22} color={c.text} />
        </Pressable>
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(140).springify()} style={styles.heroTitle}>
        Discover something new
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchBar}>
        <MaterialIcons name="search" size={22} color={c.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your home..."
          placeholderTextColor={c.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.searchDivider} />
        <Pressable style={styles.filterButton} hitSlop={8}>
          <MaterialIcons name="tune" size={22} color={c.textMuted} />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(260).springify()}>
        <CategoryRow
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(320).springify()} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Picked For You</Text>
        {filteredRecipes.length > TRENDING_PREVIEW_COUNT ? (
          <Pressable onPress={() => setShowAllTrending((value) => !value)} hitSlop={8}>
            <Text style={styles.seeMore}>
              {showAllTrending ? 'Show Less' : 'See More >'}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>

      {loading && !data?.recipes?.length ? (
        <ActivityIndicator size="large" color={c.accent} style={styles.listLoading} />
      ) : null}

      {error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Couldn&apos;t load recipes</Text>
          <Pressable onPress={() => refetch()}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const listEmpty = !loading && !error ? (
    <View style={[styles.inner, styles.emptyState]}>
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim()
          ? 'Try a different search term'
          : 'Add some recipes to see them here'}
      </Text>
    </View>
  ) : null;

  if (authLoading || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={c.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {pageHeader}
          {error ? null : (
            trendingRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.cardWrap}>
                <DiscoverRecipeCard recipe={recipe} onPress={handleRecipePress} />
              </View>
            ))
          )}
          {listEmpty}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        style={styles.list}
        data={error ? [] : trendingRecipes}
        keyExtractor={(recipe) => recipe.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <DiscoverRecipeCard recipe={item} onPress={handleRecipePress} />
          </View>
        )}
        ListHeaderComponent={pageHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardWrap: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 24 : 12,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.cardBorder,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: c.text,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: c.textSecondary,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.cardBorder,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: c.text,
    marginBottom: 20,
    lineHeight: 34,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.searchBackground,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.searchBorder,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    marginBottom: 24,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: c.text,
    padding: 0,
    outlineStyle: 'none',
  } as any,
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: c.divider,
  },
  filterButton: {
    padding: 2,
  },
  categoryList: {
    gap: 16,
    paddingBottom: 28,
  },
  categoryRowWeb: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 28,
    overflowX: 'auto',
    overflowY: 'hidden',
  } as const,
  categoryItem: {
    alignItems: 'center',
    width: 64,
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: c.categoryCircle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.cardBorder,
    marginBottom: 8,
  },
  categoryCircleActive: {
    borderColor: c.text,
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: c.categoryLabel,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: c.categoryLabelActive,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: c.text,
  },
  seeMore: {
    fontSize: 13,
    fontWeight: '600',
    color: c.textMuted,
  },
  listLoading: {
    marginVertical: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: c.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: c.textMuted,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: c.accent,
  },
});
