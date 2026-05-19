import { v7 as uuidv7 } from 'uuid';
import {
  Recipe,
  RecipeCategory,
  NutritionalInfo,
} from '../../../domain/entities/recipe.ts';
import { prisma } from '../../../configuration/database/index.ts';
import { injectable } from 'tsyringe';
import { Prisma, Recipe as SchemaRecipe } from '@prisma/client';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import { archivedRetentionCutoffDate } from '../../../domain/recipes/archived-retention.ts';
import {
  RecipeRepositoryPort,
  CreateRecipeInput,
  UpdateRecipeInput,
} from '../../../domain/repositories/recipe-repository.port.ts';
import {
  parseRecipeIngredientsFromDb,
  serializeRecipeIngredientsForDb,
} from '../../../domain/recipes/ingredient-schema.ts';
import type { RecipeIngredient } from '../../../domain/entities/recipe-ingredient.ts';

@injectable()
export class RecipeRepositoryAdapter implements RecipeRepositoryPort {
  async create(input: CreateRecipeInput): Promise<Recipe> {
    const created = await prisma.recipe.create({
      data: {
        id: uuidv7(),
        userId: input.userId,
        name: input.name,
        description: input.description,
        imageKey: input.imageKey,
        category: input.category,
        ingredients: this.mapIngredientsForPrisma(input.ingredients),
        steps: input.steps,
        servesCount: input.servesCount,
        nutritionalInfo: this.mapNutritionalInfoForCreate(
          input.nutritionalInfo,
        ),
      },
    });

    return this.mapSchemaRecipeToDomain(created);
  }

  async findById(id: string): Promise<Recipe | null> {
    const recipe = await prisma.recipe.findFirst({
      where: { id, deletedAt: null },
    });

    if (!recipe) {
      return null;
    }

    return this.mapSchemaRecipeToDomain(recipe);
  }

  async findActiveByUserId(userId: string): Promise<Recipe[]> {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
        archivedAt: null,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recipes.map((recipe) => this.mapSchemaRecipeToDomain(recipe));
  }

  async findArchivedByUserId(userId: string): Promise<Recipe[]> {
    const retentionCutoff = archivedRetentionCutoffDate();

    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
        archivedAt: { gte: retentionCutoff },
        deletedAt: null,
      },
      orderBy: {
        archivedAt: 'desc',
      },
    });

    return recipes.map((recipe) => this.mapSchemaRecipeToDomain(recipe));
  }

  async countStatsByUserId(userId: string) {
    const retentionCutoff = archivedRetentionCutoffDate();

    const [activeRecipeCount, archivedLast30DaysCount] = await Promise.all([
      prisma.recipe.count({
        where: {
          userId,
          archivedAt: null,
          deletedAt: null,
        },
      }),
      prisma.recipe.count({
        where: {
          userId,
          archivedAt: { gte: retentionCutoff },
          deletedAt: null,
        },
      }),
    ]);

    return { activeRecipeCount, archivedLast30DaysCount };
  }

  async update(id: string, input: UpdateRecipeInput): Promise<Recipe> {
    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        imageKey: input.imageKey,
        category: input.category,
        ...(input.ingredients !== undefined
          ? { ingredients: this.mapIngredientsForPrisma(input.ingredients) }
          : {}),
        steps: input.steps,
        servesCount: input.servesCount,
        nutritionalInfo: this.mapNutritionalInfoForUpdate(
          input.nutritionalInfo,
        ),
      },
    });

    return this.mapSchemaRecipeToDomain(updated);
  }

  async archive(id: string): Promise<Recipe> {
    const archived = await prisma.recipe.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    return this.mapSchemaRecipeToDomain(archived);
  }

  async recover(id: string): Promise<Recipe> {
    const recovered = await prisma.recipe.update({
      where: { id },
      data: {
        archivedAt: null,
      },
    });

    return this.mapSchemaRecipeToDomain(recovered);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.recipe.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async softDeleteAllArchivedByUserId(userId: string): Promise<number> {
    const retentionCutoff = archivedRetentionCutoffDate();

    const result = await prisma.recipe.updateMany({
      where: {
        userId,
        archivedAt: { gte: retentionCutoff },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count;
  }

  async purgeExpiredArchivedRecipes(): Promise<number> {
    const retentionCutoff = archivedRetentionCutoffDate();

    const result = await prisma.recipe.updateMany({
      where: {
        archivedAt: { lt: retentionCutoff },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count;
  }

  private mapIngredientsForPrisma(
    ingredients: RecipeIngredient[],
  ): Prisma.InputJsonValue {
    return serializeRecipeIngredientsForDb(ingredients) as unknown as Prisma.InputJsonValue;
  }

  private mapNutritionalInfoForCreate(info?: NutritionalInfo | null) {
    if (!info) return Prisma.JsonNull;
    return {
      calories: info.calories ?? null,
      protein: info.protein ?? null,
      carbs: info.carbs ?? null,
      fat: info.fat ?? null,
      fiber: info.fiber ?? null,
    };
  }

  private mapNutritionalInfoForUpdate(info?: NutritionalInfo | null) {
    if (info === undefined) return undefined;
    if (info === null) return Prisma.JsonNull;
    return {
      calories: info.calories,
      protein: info.protein,
      carbs: info.carbs,
      fat: info.fat,
      fiber: info.fiber,
    };
  }

  private mapSchemaRecipeToDomain(recipe: SchemaRecipe): Recipe {
    return {
      id: recipe.id,
      userId: recipe.userId,
      name: recipe.name,
      description: recipe.description,
      imageKey: recipe.imageKey,
      category: enumFromKeyStringOrThrow(RecipeCategory, recipe.category),
      ingredients: parseRecipeIngredientsFromDb(recipe.ingredients),
      steps: recipe.steps,
      servesCount: recipe.servesCount,
      nutritionalInfo: recipe.nutritionalInfo as NutritionalInfo | null,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      archivedAt: recipe.archivedAt,
      deletedAt: recipe.deletedAt,
    };
  }
}
