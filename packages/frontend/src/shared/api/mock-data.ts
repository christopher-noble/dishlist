import type {
  CreateRecipeInput,
  MockRecipe,
  NutritionalInfoInput,
  RecipeFieldsFragment,
  UpdateRecipeInput,
} from '@/src/features/recipes/types';

type FragmentNutritionalInfo = RecipeFieldsFragment['nutritionalInfo'];
type FragmentIngredient = RecipeFieldsFragment['ingredients'][number];

function mockIngredient(item: string, amount: number, unit: string): FragmentIngredient {
  return { item, amount, unit };
}

function toNutritionalInfo(
  info: NutritionalInfoInput | null | undefined,
): FragmentNutritionalInfo {
  if (!info) {
    return null;
  }

  return {
    calories: info.calories ?? null,
    protein: info.protein ?? null,
    carbs: info.carbs ?? null,
    fat: info.fat ?? null,
    fiber: info.fiber ?? null,
  };
}

const MOCK_RECIPES: MockRecipe[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: '',
    steps: ['Form patties and season', 'Grill until done', 'Assemble the burger'],
    imageKey: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'LUNCH',
    ingredients: [
      mockIngredient('beef', 500, 'G'),
      mockIngredient('lettuce', 4, 'CUP'),
      mockIngredient('tomato', 2, 'CUP'),
      mockIngredient('onion', 1, 'CUP'),
      mockIngredient('pickles', 6, 'CUP'),
      mockIngredient('bun', 4, 'CUP'),
    ],
    servesCount: 4,
    nutritionalInfo: {
      calories: 650,
      protein: 35,
      carbs: 45,
      fat: 28,
      fiber: 3,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Avocado Toast',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    category: 'BREAKFAST',
    ingredients: [
      mockIngredient('sourdough', 2, 'CUP'),
      mockIngredient('avocado', 1, 'CUP'),
      mockIngredient('cherry tomatoes', 150, 'G'),
      mockIngredient('feta', 50, 'G'),
      mockIngredient('lemon', 1, 'TBSP'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 420,
      protein: 12,
      carbs: 38,
      fat: 24,
      fiber: 8,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    category: 'DINNER',
    ingredients: [
      mockIngredient('salmon', 2, 'LB'),
      mockIngredient('quinoa', 1, 'CUP'),
      mockIngredient('broccoli', 200, 'G'),
      mockIngredient('carrots', 2, 'CUP'),
      mockIngredient('lemon', 1, 'TBSP'),
      mockIngredient('herbs', 2, 'TBSP'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 520,
      protein: 42,
      carbs: 32,
      fat: 22,
      fiber: 5,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Chocolate Chip Cookies',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    category: 'DESSERT',
    ingredients: [
      mockIngredient('flour', 250, 'G'),
      mockIngredient('butter', 115, 'G'),
      mockIngredient('sugar', 200, 'G'),
      mockIngredient('chocolate chips', 1, 'CUP'),
      mockIngredient('vanilla', 1, 'TSP'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 280,
      protein: 3,
      carbs: 38,
      fat: 14,
      fiber: 1,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Fresh Orange Juice',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    category: 'BEVERAGE',
    ingredients: [mockIngredient('oranges', 4, 'CUP')],
    servesCount: null,
    nutritionalInfo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Caesar Salad',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: 'LUNCH',
    ingredients: [
      mockIngredient('romaine', 1, 'CUP'),
      mockIngredient('caesar dressing', 3, 'TBSP'),
      mockIngredient('croutons', 0.5, 'CUP'),
      mockIngredient('parmesan', 30, 'G'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 18,
      fat: 24,
      fiber: 4,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Margherita Pizza',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: 'DINNER',
    ingredients: [
      mockIngredient('pizza dough', 1, 'KG'),
      mockIngredient('tomato sauce', 250, 'ML'),
      mockIngredient('mozzarella', 200, 'G'),
      mockIngredient('basil', 10, 'G'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 580,
      protein: 24,
      carbs: 68,
      fat: 22,
      fiber: 4,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'French Toast',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1484723091739-30a097b8f16b?w=400',
    category: 'BREAKFAST',
    ingredients: [
      mockIngredient('bread', 4, 'CUP'),
      mockIngredient('eggs', 3, 'CUP'),
      mockIngredient('milk', 120, 'ML'),
      mockIngredient('maple syrup', 2, 'TBSP'),
      mockIngredient('butter', 30, 'G'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 450,
      protein: 12,
      carbs: 52,
      fat: 20,
      fiber: 2,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Ice Cream Sundae',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    category: 'DESSERT',
    ingredients: [
      mockIngredient('vanilla ice cream', 2, 'CUP'),
      mockIngredient('chocolate sauce', 3, 'TBSP'),
      mockIngredient('whipped cream', 0.5, 'CUP'),
      mockIngredient('cherry', 4, 'CUP'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 380,
      protein: 6,
      carbs: 48,
      fat: 18,
      fiber: 2,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Green Smoothie',
    description: '',
    steps: [],
    imageKey: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
    category: 'BEVERAGE',
    ingredients: [
      mockIngredient('spinach', 2, 'CUP'),
      mockIngredient('banana', 1, 'CUP'),
      mockIngredient('mango', 1, 'CUP'),
      mockIngredient('yogurt', 250, 'ML'),
    ],
    servesCount: null,
    nutritionalInfo: {
      calories: 220,
      protein: 8,
      carbs: 42,
      fat: 4,
      fiber: 6,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockRecipesStore: MockRecipe[] = [...MOCK_RECIPES];

const MOCK_DELAY_MS = 500;

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const mockApi = {
  getRecipes: async (): Promise<MockRecipe[]> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return mockRecipesStore.filter((recipe) => recipe.createdAt !== null);
  },

  getArchivedRecipes: async (): Promise<MockRecipe[]> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return [];
  },

  getRecipeById: async (id: string): Promise<MockRecipe | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipe = mockRecipesStore.find((m) => m.id === id);
    return recipe ?? null;
  },

  createRecipe: async (input: CreateRecipeInput): Promise<MockRecipe> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const now = new Date().toISOString();
    const newRecipe: MockRecipe = {
      id: generateId(),
      name: input.name,
      description: input.description,
      imageKey: input.imageKey ?? null,
      category: input.category,
      ingredients: input.ingredients,
      steps: input.steps,
      servesCount: input.servesCount ?? null,
      nutritionalInfo: toNutritionalInfo(input.nutritionalInfo),
      createdAt: now,
      updatedAt: now,
    };
    mockRecipesStore.push(newRecipe);
    return newRecipe;
  },

  updateRecipe: async (id: string, input: UpdateRecipeInput): Promise<MockRecipe> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipeIndex = mockRecipesStore.findIndex((m) => m.id === id);
    if (recipeIndex === -1) {
      throw new Error('Recipe not found');
    }
    const existingRecipe = mockRecipesStore[recipeIndex];
    const updatedRecipe: MockRecipe = {
      ...existingRecipe,
      name: input.name ?? existingRecipe.name,
      description: input.description ?? existingRecipe.description,
      imageKey: input.imageKey ?? existingRecipe.imageKey,
      category: input.category ?? existingRecipe.category,
      ingredients: input.ingredients ?? existingRecipe.ingredients,
      steps: input.steps ?? existingRecipe.steps,
      servesCount: input.servesCount ?? existingRecipe.servesCount,
      nutritionalInfo:
        input.nutritionalInfo !== undefined
          ? toNutritionalInfo(input.nutritionalInfo)
          : existingRecipe.nutritionalInfo,
      updatedAt: new Date().toISOString(),
    };
    mockRecipesStore[recipeIndex] = updatedRecipe;
    return updatedRecipe;
  },

  archiveRecipe: async (id: string): Promise<MockRecipe> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipeIndex = mockRecipesStore.findIndex((m) => m.id === id);
    if (recipeIndex === -1) {
      throw new Error('Recipe not found');
    }
    const archivedRecipe: MockRecipe = {
      ...mockRecipesStore[recipeIndex],
      updatedAt: new Date().toISOString(),
    };
    mockRecipesStore.splice(recipeIndex, 1);
    return archivedRecipe;
  },

  recoverRecipe: async (id: string): Promise<MockRecipe> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipe = mockRecipesStore.find((m) => m.id === id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return {
      ...recipe,
      updatedAt: new Date().toISOString(),
    };
  },
};
