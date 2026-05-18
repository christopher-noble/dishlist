import { v7 as uuidv7 } from 'uuid';
import {
  Meal,
  MealCategory,
  NutritionalInfo,
} from '../../../domain/entities/meal.ts';
import { prisma } from '../../../configuration/database/index.ts';
import { injectable } from 'tsyringe';
import { Prisma, Meal as SchemaMeal } from '@prisma/client';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.ts';
import {
  MealRepositoryPort,
  CreateMealInput,
  UpdateMealInput,
} from '../../../domain/repositories/meal-repository.port.ts';

@injectable()
export class MealRepositoryAdapter implements MealRepositoryPort {
  async create(input: CreateMealInput): Promise<Meal> {
    const created = await prisma.meal.create({
      data: {
        id: uuidv7(),
        userId: input.userId,
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        category: input.category,
        ingredients: input.ingredients,
        nutritionalInfo: this.mapNutritionalInfoForCreate(
          input.nutritionalInfo,
        ),
      },
    });

    return this.mapSchemaMealToDomain(created);
  }

  async findById(id: string): Promise<Meal | null> {
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return null;
    }

    return this.mapSchemaMealToDomain(meal);
  }

  async findActiveByUserId(userId: string): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        archivedAt: null,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return meals.map((meal) => this.mapSchemaMealToDomain(meal));
  }

  async findArchivedByUserId(userId: string): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        archivedAt: { not: null },
        deletedAt: null,
      },
      orderBy: {
        archivedAt: 'desc',
      },
    });

    return meals.map((meal) => this.mapSchemaMealToDomain(meal));
  }

  async update(id: string, input: UpdateMealInput): Promise<Meal> {
    const updated = await prisma.meal.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        category: input.category,
        ingredients: input.ingredients,
        nutritionalInfo: this.mapNutritionalInfoForUpdate(
          input.nutritionalInfo,
        ),
      },
    });

    return this.mapSchemaMealToDomain(updated);
  }

  async archive(id: string): Promise<Meal> {
    const archived = await prisma.meal.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    return this.mapSchemaMealToDomain(archived);
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

  private mapSchemaMealToDomain(meal: SchemaMeal): Meal {
    return {
      id: meal.id,
      userId: meal.userId,
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      category: enumFromKeyStringOrThrow(MealCategory, meal.category),
      ingredients: meal.ingredients,
      nutritionalInfo: meal.nutritionalInfo as NutritionalInfo | null,
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
      archivedAt: meal.archivedAt,
      deletedAt: meal.deletedAt,
    };
  }
}
