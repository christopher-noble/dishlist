import { BackButton } from '@/components/ui/back-button';
import { Theme } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRequireAuth } from '@/src/features/auth';
import {
  EMPTY_INGREDIENT_DRAFT,
  IngredientFormRow,
  StepFormRow,
  normalizeRecipeName,
  requestPhotoLibraryAccess,
  uploadRecipeImage,
  useCreateRecipe,
  useRecipeCreateOptions,
  draftsToRecipeIngredients,
  type IngredientDraft,
} from '@/src/features/recipes';
import {
  FORM_LAYOUT_TRANSITION,
  FORM_ROW_EXITING,
} from '@/src/features/recipes/components/ingredient-form-animations';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import type { RecipeCategory } from '@/src/shared/api/generated/graphql';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const c = Theme.colors;
const MAX_WIDTH_WEB = 600;

interface FormData {
  name: string;
  category: RecipeCategory;
  servesCount: number;
}

const INITIAL_FORM: FormData = { name: '', category: 'DINNER', servesCount: 1 };

export default function AddRecipeScreen() {
  useRequireAuth();
  const { data: optionsData, loading: optionsLoading } = useRecipeCreateOptions();
  const createOptions = optionsData?.recipeCreateOptions;
  const maxServes = createOptions?.maxServes ?? 100;
  const categories = createOptions?.categories ?? [];
  const unitOptions = createOptions?.ingredientUnits ?? [];

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([
    { ...EMPTY_INGREDIENT_DRAFT },
  ]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [createRecipe, { loading, error }] = useCreateRecipe();
  const nameRef = useRef<TextInput>(null);
  const ingredientRefs = useRef<(TextInput | null)[]>([]);
  const stepRefs = useRef<(TextInput | null)[]>([]);

  const parseServesInput = (text: string): number => {
    const digits = text.replace(/\D/g, '');
    if (digits === '') return 0;
    return Math.min(maxServes, parseInt(digits, 10));
  };

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 600);
  }, []);

  const updateIngredient = (
    index: number,
    patch: Partial<IngredientDraft>,
  ) => {
    setIngredients((current) =>
      current.map((ingredient, i) =>
        i === index ? { ...ingredient, ...patch } : ingredient,
      ),
    );
  };

  const addIngredient = () => {
    setIngredients((current) => [...current, { ...EMPTY_INGREDIENT_DRAFT }]);
    setTimeout(() => ingredientRefs.current[ingredients.length]?.focus(), 100);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, text: string) => {
    const updated = [...steps];
    updated[index] = text;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
    setTimeout(() => stepRefs.current[steps.length]?.focus(), 100);
  };

  const removeStep = (index: number) => {
    setSteps(steps.length > 1 ? steps.filter((_, i) => i !== index) : []);
  };

  const pickImage = async () => {
    setImageError(null);
    const access = await requestPhotoLibraryAccess();

    if (!access.granted) {
      if (access.reason === 'denied') {
        setImageError('Photo library permission is required to add a recipe image.');
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    const validIngredients = draftsToRecipeIngredients(ingredients);
    const validSteps = steps.filter((s) => s.trim());
    if (!form.name.trim() || !validIngredients.length) return;

    try {
      setImageError(null);
      let imageKey: string | undefined;

      if (selectedImage) {
        imageKey = await uploadRecipeImage({
          uri: selectedImage.uri,
          fileName:
            selectedImage.fileName ??
            `recipe-${Date.now()}.${selectedImage.mimeType?.split('/')[1] ?? 'jpg'}`,
          fileType: selectedImage.mimeType ?? 'image/jpeg',
        });
      }

      const { data } = await createRecipe({
        variables: {
          input: {
            name: normalizeRecipeName(form.name),
            description: '',
            category: form.category,
            ingredients: validIngredients,
            steps: validSteps.map((s) => s.trim()),
            ...(form.servesCount > 0 ? { servesCount: form.servesCount } : {}),
            ...(imageKey ? { imageKey } : {}),
          },
        },
        refetchQueries: ['GetRecipes'],
      });

      if (data?.createRecipe) router.back();
    } catch (uploadError) {
      setImageError(
        uploadError instanceof Error ? uploadError.message : 'Failed to upload recipe image',
      );
    }
  };

  const isValid =
    form.name.trim() && draftsToRecipeIngredients(ingredients).length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.headerWrapper}>
          <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
            <BackButton />
            <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.headerTitle}>
              Add New
            </Animated.Text>
            <View style={styles.headerSpacer} />
          </Animated.View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <View style={styles.form}>
              <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
                <TextInput
                  ref={nameRef}
                  style={styles.nameInput}
                  value={form.name}
                  onChangeText={(name) => setForm({ ...form, name })}
                  placeholder="Recipe name"
                  placeholderTextColor={c.placeholder}
                  autoCapitalize="none"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.section}>
                <Text style={styles.label}>Photo</Text>
                <Pressable onPress={pickImage} style={styles.imagePicker}>
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage.uri }}
                      style={styles.selectedImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.imagePickerPlaceholder}>
                      <IconSymbol name="photo" size={28} color={c.textSecondary} />
                      <Text style={styles.imagePickerText}>Add recipe photo</Text>
                    </View>
                  )}
                </Pressable>
                {imageError ? <Text style={styles.error}>{imageError}</Text> : null}
              </Animated.View>

              {optionsLoading ? (
                <ActivityIndicator size="small" color={c.primary} style={styles.optionsLoading} />
              ) : null}

              <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.chips}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setForm({ ...form, category: cat })}
                      style={[styles.chip, form.category === cat && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>
                        {cat.charAt(0) + cat.slice(1).toLowerCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(500).springify()}
                layout={FORM_LAYOUT_TRANSITION}
                style={styles.section}
              >
                <Text style={styles.label}>Ingredients</Text>
                {ingredients.map((ingredient, index) => (
                  <Animated.View
                    key={index}
                    layout={FORM_LAYOUT_TRANSITION}
                    exiting={FORM_ROW_EXITING}
                  >
                    <IngredientFormRow
                      ingredient={ingredient}
                      units={unitOptions}
                      canRemove={ingredients.length > 1}
                      itemRef={(ref) => {
                        ingredientRefs.current[index] = ref;
                      }}
                      onItemChange={(text) => updateIngredient(index, { item: text })}
                      onAmountChange={(text) => updateIngredient(index, { amount: text })}
                      onUnitChange={(unit) => updateIngredient(index, { unit })}
                      onRemove={() => removeIngredient(index)}
                      onSubmitItem={() =>
                        index < ingredients.length - 1
                          ? ingredientRefs.current[index + 1]?.focus()
                          : addIngredient()
                      }
                    />
                  </Animated.View>
                ))}
                <Animated.View layout={FORM_LAYOUT_TRANSITION}>
                  <Pressable onPress={addIngredient} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                  </Pressable>
                </Animated.View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(600).springify()}
                layout={FORM_LAYOUT_TRANSITION}
                style={styles.section}
              >
                <Text style={styles.label}>Steps</Text>
                {steps.map((step, index) => (
                  <Animated.View
                    key={index}
                    layout={FORM_LAYOUT_TRANSITION}
                    exiting={FORM_ROW_EXITING}
                  >
                    <StepFormRow
                      stepNumber={index + 1}
                      value={step}
                      inputRef={(ref) => {
                        stepRefs.current[index] = ref;
                      }}
                      onChange={(text) => updateStep(index, text)}
                      onRemove={() => removeStep(index)}
                      onSubmitEditing={() =>
                        index < steps.length - 1
                          ? stepRefs.current[index + 1]?.focus()
                          : addStep()
                      }
                    />
                  </Animated.View>
                ))}
                <Animated.View layout={FORM_LAYOUT_TRANSITION}>
                  <Pressable onPress={addStep} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Step</Text>
                  </Pressable>
                </Animated.View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(700).springify()}
                layout={FORM_LAYOUT_TRANSITION}
                style={styles.section}
              >
                <Text style={styles.label}>Serves</Text>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => setForm({ ...form, servesCount: Math.max(0, form.servesCount - 1) })}
                    disabled={form.servesCount === 0}
                    style={[styles.stepperButton, form.servesCount === 0 && styles.stepperButtonDisabled]}
                  >
                    <IconSymbol
                      name="minus"
                      size={22}
                      color={form.servesCount === 0 ? c.disabled : c.primary}
                    />
                  </Pressable>
                  <View style={styles.stepperValue}>
                    <TextInput
                      style={styles.stepperValueInput}
                      value={form.servesCount === 0 ? '' : String(form.servesCount)}
                      onChangeText={(text) => setForm({ ...form, servesCount: parseServesInput(text) })}
                      keyboardType="number-pad"
                      maxLength={3}
                      selectTextOnFocus
                    />
                    <Text style={styles.stepperLabel}>{form.servesCount === 1 ? 'person' : form.servesCount > 1 ? 'people' : ''}</Text>
                  </View>
                  <Pressable
                    onPress={() => setForm({ ...form, servesCount: Math.min(maxServes, (form.servesCount || 0) + 1) })}
                    disabled={form.servesCount >= maxServes}
                    style={[styles.stepperButton, form.servesCount >= maxServes && styles.stepperButtonDisabled]}
                  >
                    <IconSymbol
                      name="plus"
                      size={22}
                      color={form.servesCount >= maxServes ? c.disabled : c.primary}
                    />
                  </Pressable>
                </View>
              </Animated.View>

              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerWrapper}>
          <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.footer}>
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid || loading}
              style={[styles.submitButton, (!isValid || loading) && styles.submitButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color={c.white} />
              ) : (
                <Text style={[styles.submitText, (!isValid || loading) && styles.submitTextDisabled]}>
                  Save Recipe
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  flex: { flex: 1 },
  headerWrapper: { alignItems: 'center', backgroundColor: c.background },
  header: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'web' ? 32 : 8,
  },
  headerSpacer: { width: 44 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: c.text },
  scrollContent: { alignItems: 'center', paddingBottom: 60 },
  formWrapper: { width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  form: { width: '100%', maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined },
  optionsLoading: { marginBottom: 12 },
  section: { marginBottom: 36 },
  nameInput: { fontSize: 28, fontWeight: '700', color: c.text, paddingVertical: 12, paddingHorizontal: 8, borderWidth: 0, outlineStyle: 'none' } as any,
  imagePicker: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.borderNeutral,
    backgroundColor: c.surface,
  },
  imagePickerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickerText: { fontSize: 14, fontWeight: '600', color: c.textSecondary },
  selectedImage: { width: '100%', height: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: c.text, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: c.chip, borderWidth: 1, borderColor: c.chipBorder },
  chipActive: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: c.textSecondary },
  chipTextActive: { color: c.white },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  input: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.borderNeutral, borderRadius: 12, padding: 16, fontSize: 16, color: c.text },
  removeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: c.background, borderWidth: 1, borderColor: c.destructiveBorder, alignItems: 'center', justifyContent: 'center' },
  removeText: {
    fontSize: 22,
    lineHeight: 22,
    color: c.destructive,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: Platform.OS === 'ios' ? -1 : 0,
  },
  addButton: { height: 48, borderRadius: 12, backgroundColor: c.background, borderWidth: 1, borderColor: c.chipBorder, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  addButtonText: { fontSize: 14, fontWeight: '600', color: c.primaryDark },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: c.white },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 4 },
  stepperButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: c.background, borderWidth: 2, borderColor: c.chipBorder, alignItems: 'center', justifyContent: 'center' },
  stepperButtonDisabled: { backgroundColor: c.background, borderColor: c.borderNeutral, opacity: 0.5 },
  stepperValue: { width: 96, height: 64, borderRadius: 16, backgroundColor: c.surface, borderWidth: 2, borderColor: c.chipBorder, alignItems: 'center', justifyContent: 'center' },
  stepperValueInput: {
    fontSize: 24,
    fontWeight: '700',
    color: c.text,
    textAlign: 'center',
    width: '100%',
    padding: 0,
    borderWidth: 0,
    outlineStyle: 'none',
  } as any,
  stepperLabel: { fontSize: 11, color: c.textSecondary, marginTop: 2 },
  error: { fontSize: 14, color: c.destructive, textAlign: 'center', marginTop: 8 },
  footerWrapper: { alignItems: 'center', borderTopWidth: 1, borderTopColor: c.borderNeutral, backgroundColor: c.background },
  footer: { width: '100%', maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined, padding: 20 },
  submitButton: { height: 56, borderRadius: 16, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { backgroundColor: c.disabledBg },
  submitText: { fontSize: 18, fontWeight: '700', color: c.white },
  submitTextDisabled: { color: c.disabled },
});
