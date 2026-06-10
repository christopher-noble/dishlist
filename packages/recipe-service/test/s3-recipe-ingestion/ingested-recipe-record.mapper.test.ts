import { describe, expect, it } from 'vitest';

import { RecipeCategory } from '../../src/domain/entities/recipe.ts';
import {
  buildTrainingMessages,
  buildTrainingText,
  mapToIngestedRecipeRecord,
} from '../../jobs/helpers/s3-recipe-ingestion.js';

describe('ingested recipe record mapper', () => {
  it('maps postgres rows into SageMaker-ready training records', () => {
    const record = mapToIngestedRecipeRecord({
      id: '11111111-1111-1111-1111-111111111111',
      user_id: '22222222-2222-2222-2222-222222222222',
      name: 'Banana Bread',
      description: 'Moist loaf with ripe bananas.',
      category: RecipeCategory.DESSERT,
      ingredients: [{ item: 'bananas', amount: 3, unit: '' }],
      steps: ['Preheat oven to 350F.', 'Mix and bake for 55 minutes.'],
      serves: 8,
      nutritional_info: { calories: 280, protein: 4.5 },
      image_key: 'recipes/user/banana-bread.jpg',
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      updated_at: new Date('2026-01-02T00:00:00.000Z'),
    });

    expect(record.trainingText).toContain('# Banana Bread');
    expect(record.trainingText).toContain('## Ingredients');
    expect(record.trainingText).toContain('- 3 bananas');
    expect(record.messages).toEqual([
      {
        role: 'user',
        content:
          'Write a complete recipe for Banana Bread (dessert) that serves 8 using this context: Moist loaf with ripe bananas..',
      },
      {
        role: 'assistant',
        content: record.trainingText,
      },
    ]);
  });

  it('builds training text without optional sections when data is missing', () => {
    const trainingText = buildTrainingText({
      id: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      name: 'Simple Salad',
      description: 'Fresh greens.',
      category: RecipeCategory.LUNCH,
      ingredients: [{ item: 'lettuce', amount: 1, unit: '' }],
      steps: ['Toss and serve.'],
      servesCount: null,
      nutritionalInfo: null,
      imageKey: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    expect(trainingText).not.toContain('Serves:');
    expect(trainingText).not.toContain('## Nutrition');
    expect(buildTrainingMessages(
      {
        id: '11111111-1111-1111-1111-111111111111',
        userId: '22222222-2222-2222-2222-222222222222',
        name: 'Simple Salad',
        description: 'Fresh greens.',
        category: RecipeCategory.LUNCH,
        ingredients: [{ item: 'lettuce', amount: 1, unit: '' }],
        steps: ['Toss and serve.'],
        servesCount: null,
        nutritionalInfo: null,
        imageKey: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      trainingText,
    )[0].content).toContain('Simple Salad');
  });
});
