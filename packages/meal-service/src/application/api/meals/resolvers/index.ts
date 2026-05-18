import { createMealResolver } from './create-meal.ts';
import { updateMealResolver } from './update-meal.ts';
import { mealResolver } from './meal.ts';
import { mealsResolver } from './meals.ts';
import { archiveMealResolver } from './archive-meal.ts';

export const resolvers = {
  Query: {
    meals: mealsResolver.meals,
    archivedMeals: mealsResolver.archivedMeals,
    meal: mealResolver.meal,
  },
  Mutation: {
    createMeal: createMealResolver.createMeal,
    updateMeal: updateMealResolver.updateMeal,
    archiveMeal: archiveMealResolver.archiveMeal,
  },
};
