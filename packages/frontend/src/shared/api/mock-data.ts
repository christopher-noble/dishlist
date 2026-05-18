import type { CreateMealInput, Meal, UpdateMealInput } from '@/src/features/meals/types';
import { MealCategory } from '@/src/features/meals/types';

const MOCK_MEALS: Meal[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, and special sauce',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: MealCategory.LUNCH,
    ingredients: ['beef', 'lettuce', 'tomato', 'onion', 'pickles', 'bun'],
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
    description: 'Sourdough bread topped with mashed avocado, cherry tomatoes, and feta',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    category: MealCategory.BREAKFAST,
    ingredients: ['sourdough', 'avocado', 'cherry tomatoes', 'feta', 'lemon'],
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
    description: 'Fresh Atlantic salmon with roasted vegetables and quinoa',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    category: MealCategory.DINNER,
    ingredients: ['salmon', 'quinoa', 'broccoli', 'carrots', 'lemon', 'herbs'],
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
    description: 'Freshly baked cookies with premium chocolate chips',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    category: MealCategory.DESSERT,
    ingredients: ['flour', 'butter', 'sugar', 'chocolate chips', 'vanilla'],
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
    description: 'Freshly squeezed orange juice, served cold',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    category: MealCategory.BEVERAGE,
    ingredients: ['oranges'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with caesar dressing, croutons, and parmesan',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: MealCategory.LUNCH,
    ingredients: ['romaine', 'caesar dressing', 'croutons', 'parmesan'],
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
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: MealCategory.DINNER,
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil'],
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
    description: 'Golden brown toast with maple syrup and butter',
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097b8f16b?w=400',
    category: MealCategory.BREAKFAST,
    ingredients: ['bread', 'eggs', 'milk', 'maple syrup', 'butter'],
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
    description: 'Vanilla ice cream with chocolate sauce and whipped cream',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    category: MealCategory.DESSERT,
    ingredients: ['vanilla ice cream', 'chocolate sauce', 'whipped cream', 'cherry'],
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
    description: 'Fresh spinach, banana, and mango blended to perfection',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
    category: MealCategory.BEVERAGE,
    ingredients: ['spinach', 'banana', 'mango', 'yogurt'],
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

const mockMealsStore: Meal[] = [...MOCK_MEALS];

const MOCK_DELAY_MS = 500;

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const mockApi = {
  getMeals: async (): Promise<Meal[]> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return mockMealsStore.filter((meal) => meal.createdAt !== null);
  },

  getArchivedMeals: async (): Promise<Meal[]> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return [];
  },

  getMealById: async (id: string): Promise<Meal | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const meal = mockMealsStore.find((m) => m.id === id);
    return meal ?? null;
  },

  createMeal: async (input: CreateMealInput): Promise<Meal> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const now = new Date().toISOString();
    const newMeal: Meal = {
      id: generateId(),
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      category: input.category,
      ingredients: input.ingredients,
      nutritionalInfo: input.nutritionalInfo,
      createdAt: now,
      updatedAt: now,
    };
    mockMealsStore.push(newMeal);
    return newMeal;
  },

  updateMeal: async (id: string, input: UpdateMealInput): Promise<Meal> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const mealIndex = mockMealsStore.findIndex((m) => m.id === id);
    if (mealIndex === -1) {
      throw new Error('Meal not found');
    }
    const existingMeal = mockMealsStore[mealIndex];
    const updatedMeal: Meal = {
      ...existingMeal,
      name: input.name ?? existingMeal.name,
      description: input.description ?? existingMeal.description,
      imageUrl: input.imageUrl ?? existingMeal.imageUrl,
      category: input.category ?? existingMeal.category,
      ingredients: input.ingredients ?? existingMeal.ingredients,
      nutritionalInfo: input.nutritionalInfo ?? existingMeal.nutritionalInfo,
      updatedAt: new Date().toISOString(),
    };
    mockMealsStore[mealIndex] = updatedMeal;
    return updatedMeal;
  },

  archiveMeal: async (id: string): Promise<Meal> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const mealIndex = mockMealsStore.findIndex((m) => m.id === id);
    if (mealIndex === -1) {
      throw new Error('Meal not found');
    }
    const archivedMeal: Meal = {
      ...mockMealsStore[mealIndex],
      updatedAt: new Date().toISOString(),
    };
    mockMealsStore.splice(mealIndex, 1);
    return archivedMeal;
  },
};
