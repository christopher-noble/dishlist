import { IconSymbol } from '@/components/ui/icon-symbol';
import { Theme } from '@/constants/theme';
import {
  ExpandableIngredientChip,
  useArchiveRecipe,
  useDeleteRecipe,
  useRecoverRecipe,
  useRecipe,
  useRecipeCreateOptions,
  type RecipeFieldsFragment,
} from '@/src/features/recipes';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BACK_BUTTON_SIZE = 44;
const BACK_BUTTON_BORDER_RADIUS = 22;
const HEADER_HEIGHT = 300;
const CONTENT_PADDING = 24;
const TITLE_FONT_SIZE = 32;
const TITLE_FONT_WEIGHT = '800';
const DESCRIPTION_FONT_SIZE = 16;
const SECTION_TITLE_FONT_SIZE = 20;
const SECTION_TITLE_FONT_WEIGHT = '700';
const INGREDIENT_FONT_SIZE = 16;
const NUTRITION_LABEL_FONT_SIZE = 14;
const NUTRITION_VALUE_FONT_SIZE = 18;
const NUTRITION_VALUE_FONT_WEIGHT = '700';
const BACK_ICON_SIZE = 24;
const c = Theme.colors;
const BACK_ICON_COLOR = c.text;
const BACK_BUTTON_BACKGROUND = 'rgba(255, 255, 255, 0.92)';
const TEXT_COLOR_PRIMARY = c.text;
const TEXT_COLOR_SECONDARY = c.textSecondary;
const BACKGROUND_COLOR = c.background;
const SECTION_SPACING = 32;
const ITEM_SPACING = 16;
const BADGE_PADDING_HORIZONTAL = 12;
const BADGE_PADDING_VERTICAL = 6;
const BADGE_BORDER_RADIUS = 20;
const NUTRITION_ITEM_SPACING = 12;
const CARD_SHADOW_COLOR = '#000';
const CARD_SHADOW_OFFSET_X = 0;
const CARD_SHADOW_OFFSET_Y = 2;
const CARD_SHADOW_OPACITY = 0.1;
const CARD_SHADOW_RADIUS = 4;
const CARD_ELEVATION = 3;
const STEP_SECTION_LABEL = 'Steps';
const STEPS_SUBHEADER_FONT_SIZE = 15;
const STEPS_SUBHEADER_FONT_WEIGHT = '600';
const STEPS_SECTION_MARGIN_TOP = 24;
const STEP_NUMBER_BADGE_SIZE = 28;
const STEP_NUMBER_BADGE_RADIUS = 14;
const STEP_NUMBER_FONT_SIZE = 14;
const STEP_BODY_FONT_SIZE = 16;
const STEP_BODY_LINE_HEIGHT = 24;
const STEP_ROW_GAP = 12;
const STEP_ROW_MARGIN_BOTTOM = 14;
const ARCHIVED_FOOTER_FADE_HEIGHT = 72;
const ARCHIVED_FOOTER_BUTTON_HEIGHT = 48;
const ARCHIVED_FOOTER_VERTICAL_PADDING = 16;

function normalizeIngredients(
  raw: unknown,
): RecipeFieldsFragment['ingredients'] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (typeof entry === 'string') {
        const item = entry.trim();
        return item ? { item, amount: 0, unit: '' } : null;
      }

      if (!entry || typeof entry !== 'object' || !('item' in entry)) {
        return null;
      }

      const record = entry as { item?: string; amount?: number; unit?: string };
      const item = typeof record.item === 'string' ? record.item.trim() : '';
      if (!item) {
        return null;
      }

      return {
        item,
        amount: typeof record.amount === 'number' ? record.amount : 0,
        unit: typeof record.unit === 'string' ? record.unit : '',
      };
    })
    .filter((entry): entry is RecipeFieldsFragment['ingredients'][number] => entry != null);
}

function normalizeRecipe(raw: unknown): RecipeFieldsFragment | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const candidate = raw as Partial<RecipeFieldsFragment>;
  if (!candidate.id || !candidate.name || !candidate.category) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    description: candidate.description ?? '',
    imageKey: candidate.imageKey ?? null,
    category: candidate.category,
    ingredients: normalizeIngredients(candidate.ingredients),
    steps: Array.isArray(candidate.steps) ? candidate.steps : [],
    servesCount: candidate.servesCount ?? null,
    nutritionalInfo: candidate.nutritionalInfo ?? null,
  };
}

export default function RecipeDetailScreen() {
  const { id, recipeData, archived } = useLocalSearchParams<{
    id: string;
    recipeData?: string;
    archived?: string;
  }>();
  const isArchivedView = archived === '1';
  const cachedRecipe = recipeData
    ? normalizeRecipe(JSON.parse(recipeData))
    : null;
  const { data, loading, error } = useRecipe({
    variables: { id: id! },
    skip: !id,
  });
  const [archiveRecipe] = useArchiveRecipe();
  const [recoverRecipe, { loading: recovering }] = useRecoverRecipe();
  const [deleteRecipe, { loading: deleting }] = useDeleteRecipe();
  const insets = useSafeAreaInsets();
  const { data: createOptionsData } = useRecipeCreateOptions();
  const unitOptions = createOptionsData?.recipeCreateOptions.ingredientUnits ?? [];
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);

  const recipe = data?.recipe ?? cachedRecipe;

  const toggleIngredientsExpanded = useCallback(() => {
    setIngredientsExpanded((value) => !value);
  }, []);

  useEffect(() => {
    setIngredientsExpanded(false);
  }, [recipe?.id]);

  const handleEdit = useCallback(() => {
    if (!recipe) return;
    router.push({ pathname: '/recipe/edit/[id]', params: { id: recipe.id } });
  }, [recipe]);

  const handleArchive = useCallback(() => {
    if (!recipe) return;
    Alert.alert(
      'Remove from feed?',
      `"${recipe.name}" will move to your removed recipes for up to 30 days.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await archiveRecipe({
              variables: { id: recipe.id },
              refetchQueries: ['GetRecipes', 'GetRecipeStats'],
            });
            router.back();
          },
        },
      ],
    );
  }, [archiveRecipe, recipe]);

  const handleRecover = useCallback(() => {
    if (!recipe) return;
    Alert.alert(
      'Recover recipe?',
      `"${recipe.name}" will return to your feed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recover',
          onPress: async () => {
            await recoverRecipe({
              variables: { id: recipe.id },
              refetchQueries: ['GetRecipes', 'GetArchivedRecipes', 'GetRecipeStats'],
            });
            router.back();
          },
        },
      ],
    );
  }, [recoverRecipe, recipe]);

  const handlePermanentDelete = useCallback(() => {
    if (!recipe) return;
    Alert.alert(
      'Delete permanently?',
      `"${recipe.name}" cannot be recovered.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe({
              variables: { id: recipe.id },
              refetchQueries: ['GetArchivedRecipes', 'GetRecipeStats'],
            });
            router.back();
          },
        },
      ],
    );
  }, [deleteRecipe, recipe]);

  if (!recipe && error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return null;
  }

  const descriptionText = recipe.description.trim();
  const preparationSteps = (recipe.steps ?? []).filter((step) => step.trim().length > 0);
  const hasImage = Boolean(recipe.imageKey);
  const archivedFooterHeight =
    ARCHIVED_FOOTER_FADE_HEIGHT +
    ARCHIVED_FOOTER_VERTICAL_PADDING * 2 +
    ARCHIVED_FOOTER_BUTTON_HEIGHT +
    insets.bottom;
  const servesCount = recipe.servesCount ?? 0;
  const servesLabel =
    servesCount === 1 ? 'person' : servesCount > 1 ? 'people' : null;

  const iconActionButtonStyle = styles.iconActionButton;

  const backButton = (
    <TouchableOpacity
      onPress={() => router.back()}
      style={iconActionButtonStyle}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <IconSymbol
        name="chevron.left"
        size={BACK_ICON_SIZE}
        color={BACK_ICON_COLOR}
        weight="semibold"
      />
    </TouchableOpacity>
  );

  const editButton = !isArchivedView ? (
    <Pressable
      onPress={handleEdit}
      style={iconActionButtonStyle}
      accessibilityRole="button"
      accessibilityLabel="Edit recipe"
    >
      <IconSymbol name="pencil" size={BACK_ICON_SIZE} color={BACK_ICON_COLOR} />
    </Pressable>
  ) : null;

  const removeButton = !isArchivedView ? (
    <Pressable
      onPress={handleArchive}
      style={[styles.floatingTrashButton, { bottom: CONTENT_PADDING + insets.bottom }]}
      accessibilityRole="button"
      accessibilityLabel="Remove from feed"
    >
      <IconSymbol name="trash" size={BACK_ICON_SIZE} color={c.destructive} />
    </Pressable>
  ) : null;

  const archivedFooter = isArchivedView ? (
    <View
      style={[styles.archivedFooter, { paddingBottom: insets.bottom + ARCHIVED_FOOTER_VERTICAL_PADDING }]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.88)', BACKGROUND_COLOR]}
        locations={[0, 0.4, 0.78, 1]}
        style={styles.archivedFooterFade}
        pointerEvents="none"
      />
      <View style={styles.archivedFooterContent}>
        <View style={styles.archivedActionRow}>
          <Pressable
            onPress={handleRecover}
            disabled={recovering || deleting}
            style={[
              styles.archivedActionButton,
              styles.archivedRecoverButton,
              (recovering || deleting) && styles.archivedActionButtonDisabled,
            ]}
          >
            <Text style={styles.archivedRecoverButtonText}>Recover</Text>
          </Pressable>
          <Pressable
            onPress={handlePermanentDelete}
            disabled={recovering || deleting}
            style={[
              styles.archivedActionButton,
              styles.archivedDeleteButton,
              (recovering || deleting) && styles.archivedActionButtonDisabled,
            ]}
          >
            <Text style={styles.archivedDeleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isArchivedView && { paddingBottom: archivedFooterHeight },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {hasImage ? (
          <View style={styles.headerContainer}>
            <Animated.View entering={FadeInUp.duration(300)} style={StyleSheet.absoluteFill}>
              <Image
                source={{ uri: recipe.imageKey! }}
                style={styles.headerImage}
                contentFit="cover"
                transition={200}
              />
            </Animated.View>
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.55)', c.background]}
              locations={[0, 0.55, 0.88, 1]}
              style={styles.gradientOverlay}
            />
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={styles.headerButtonRow}
            >
              {backButton}
              {editButton}
            </Animated.View>
          </View>
        ) : (
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.compactHeader}>
            {backButton}
            {editButton}
          </Animated.View>
        )}

        <View style={[styles.contentContainer, !hasImage && styles.contentContainerNoImage]}>
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {recipe.name}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {recipe.category.charAt(0) + recipe.category.slice(1).toLowerCase()}
                </Text>
              </View>
            </View>
            {descriptionText ? (
              <Text style={styles.descriptionText}>{descriptionText}</Text>
            ) : null}
            {servesLabel ? (
              <Text style={styles.servesText}>
                Serves {servesCount} {servesLabel}
              </Text>
            ) : null}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={[styles.preparationSection, !hasImage && styles.preparationSectionNoImage]}
          >
            <View style={styles.section}>
              <View style={styles.ingredientsContainer}>
                {recipe.ingredients.map((ingredient, index) => (
                  <Animated.View
                    key={`${String(index)}-${ingredient.item}`}
                    entering={FadeInDown.delay(550 + index * 50).springify()}
                  >
                    <ExpandableIngredientChip
                      ingredient={ingredient}
                      unitOptions={unitOptions}
                      expanded={ingredientsExpanded}
                      onPress={toggleIngredientsExpanded}
                    />
                  </Animated.View>
                ))}
              </View>
              {preparationSteps.length > 0 && (
                <View style={styles.stepsBlock}>
                  <Text style={styles.stepsSubheader}>
                    {STEP_SECTION_LABEL}
                  </Text>
                  <View style={styles.stepsList}>
                    {preparationSteps.map((step, index) => (
                      <Animated.View
                        key={`${String(index)}-${step}`}
                        entering={FadeInDown.delay(650 + index * 50).springify()}
                        style={styles.stepRow}
                      >
                        <View style={styles.stepNumberBadge}>
                          <Text style={styles.stepNumberBadgeText}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={styles.stepBody}>
                          {step}
                        </Text>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </Animated.View>

          {recipe.nutritionalInfo && (
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Nutrition
                </Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Calories
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {recipe.nutritionalInfo.calories}
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Protein
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {recipe.nutritionalInfo.protein}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Carbs
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {recipe.nutritionalInfo.carbs}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Fat
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {recipe.nutritionalInfo.fat}g
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

        </View>
      </ScrollView>
      {archivedFooter}
      {removeButton}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BACK_BUTTON_SIZE + CONTENT_PADDING + 16,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  headerButtonRow: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 4,
    paddingBottom: 16,
  },
  iconActionButton: Platform.OS === 'web'
    ? {
        width: BACK_BUTTON_SIZE,
        height: BACK_BUTTON_SIZE,
        borderRadius: BACK_BUTTON_BORDER_RADIUS,
        backgroundColor: BACK_BUTTON_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `${CARD_SHADOW_OFFSET_X}px ${CARD_SHADOW_OFFSET_Y}px ${CARD_SHADOW_RADIUS}px rgba(0,0,0,${CARD_SHADOW_OPACITY})`,
      } as any
    : {
        width: BACK_BUTTON_SIZE,
        height: BACK_BUTTON_SIZE,
        borderRadius: BACK_BUTTON_BORDER_RADIUS,
        backgroundColor: BACK_BUTTON_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: CARD_SHADOW_OFFSET_X, height: CARD_SHADOW_OFFSET_Y },
        shadowOpacity: CARD_SHADOW_OPACITY,
        shadowRadius: CARD_SHADOW_RADIUS,
        elevation: CARD_ELEVATION,
      },
  floatingTrashButton: Platform.OS === 'web'
    ? {
        position: 'absolute',
        right: CONTENT_PADDING,
        bottom: CONTENT_PADDING,
        width: BACK_BUTTON_SIZE,
        height: BACK_BUTTON_SIZE,
        borderRadius: BACK_BUTTON_BORDER_RADIUS,
        backgroundColor: BACK_BUTTON_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        boxShadow: `${CARD_SHADOW_OFFSET_X}px ${CARD_SHADOW_OFFSET_Y}px ${CARD_SHADOW_RADIUS}px rgba(0,0,0,${CARD_SHADOW_OPACITY})`,
      } as any
    : {
        position: 'absolute',
        right: CONTENT_PADDING,
        bottom: CONTENT_PADDING,
        width: BACK_BUTTON_SIZE,
        height: BACK_BUTTON_SIZE,
        borderRadius: BACK_BUTTON_BORDER_RADIUS,
        backgroundColor: BACK_BUTTON_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: CARD_SHADOW_OFFSET_X, height: CARD_SHADOW_OFFSET_Y },
        shadowOpacity: CARD_SHADOW_OPACITY,
        shadowRadius: CARD_SHADOW_RADIUS,
        elevation: CARD_ELEVATION,
      },
  archivedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  archivedFooterFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -ARCHIVED_FOOTER_FADE_HEIGHT,
    height: ARCHIVED_FOOTER_FADE_HEIGHT,
  },
  archivedFooterContent: {
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: ARCHIVED_FOOTER_VERTICAL_PADDING,
  },
  archivedActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  archivedActionButtonDisabled: {
    opacity: 0.5,
  },
  archivedActionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archivedRecoverButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: c.chipBorder,
  },
  archivedRecoverButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: c.primaryDark,
  },
  archivedDeleteButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: c.destructiveBorder,
  },
  archivedDeleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: c.destructive,
  },
  contentContainer: {
    paddingHorizontal: CONTENT_PADDING,
    paddingBottom: CONTENT_PADDING,
    paddingTop: CONTENT_PADDING,
  },
  contentContainerNoImage: {
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: ITEM_SPACING,
  },
  title: {
    flex: 1,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginRight: ITEM_SPACING,
  },
  categoryBadge: {
    paddingHorizontal: BADGE_PADDING_HORIZONTAL,
    paddingVertical: BADGE_PADDING_VERTICAL,
    borderRadius: BADGE_BORDER_RADIUS,
    backgroundColor: c.primaryMuted,
  },
  categoryText: {
    fontSize: INGREDIENT_FONT_SIZE,
    color: c.primaryDark,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: DESCRIPTION_FONT_SIZE,
    lineHeight: 24,
    color: TEXT_COLOR_SECONDARY,
    marginTop: 4,
    marginBottom: 12,
  },
  servesText: {
    fontSize: DESCRIPTION_FONT_SIZE,
    fontWeight: '600',
    color: TEXT_COLOR_SECONDARY,
    marginTop: 8,
  },
  section: {
    marginBottom: SECTION_SPACING,
  },
  sectionTitle: {
    fontSize: SECTION_TITLE_FONT_SIZE,
    fontWeight: SECTION_TITLE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginBottom: ITEM_SPACING,
  },
  preparationSection: {
    marginTop: SECTION_SPACING,
  },
  preparationSectionNoImage: {
    marginTop: SECTION_SPACING,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepsBlock: {
    marginTop: STEPS_SECTION_MARGIN_TOP,
  },
  stepsSubheader: {
    fontSize: STEPS_SUBHEADER_FONT_SIZE,
    fontWeight: STEPS_SUBHEADER_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginBottom: ITEM_SPACING,
  },
  stepsList: {
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: STEP_ROW_GAP,
    marginBottom: STEP_ROW_MARGIN_BOTTOM,
  },
  stepNumberBadge: {
    width: STEP_NUMBER_BADGE_SIZE,
    height: STEP_NUMBER_BADGE_SIZE,
    borderRadius: STEP_NUMBER_BADGE_RADIUS,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberBadgeText: {
    fontSize: STEP_NUMBER_FONT_SIZE,
    fontWeight: '700',
    color: c.white,
  },
  stepBody: {
    flex: 1,
    fontSize: STEP_BODY_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
    lineHeight: STEP_BODY_LINE_HEIGHT,
  },
  ingredientBadge: {
    paddingHorizontal: BADGE_PADDING_HORIZONTAL,
    paddingVertical: BADGE_PADDING_VERTICAL,
    borderRadius: BADGE_BORDER_RADIUS,
    backgroundColor: c.primaryLight,
    borderWidth: 1,
    borderColor: c.chipBorder,
  },
  ingredientText: {
    fontSize: INGREDIENT_FONT_SIZE,
    color: c.textSecondary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    marginBottom: NUTRITION_ITEM_SPACING,
  },
  nutritionLabel: {
    fontSize: NUTRITION_LABEL_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: NUTRITION_VALUE_FONT_SIZE,
    fontWeight: NUTRITION_VALUE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CONTENT_PADDING,
  },
  errorText: {
    fontSize: DESCRIPTION_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
  },
});
