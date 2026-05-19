-- Converts recipes.ingredients from text[] to jsonb (multi-step; safe without psql-only features).

ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS ingredients_new jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE recipes
SET ingredients_new = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'item', elem,
        'amount', 0,
        'unit', ''
      )
    ),
    '[]'::jsonb
  )
  FROM unnest(ingredients::text[]) AS elem
);

ALTER TABLE recipes DROP COLUMN ingredients;

ALTER TABLE recipes RENAME COLUMN ingredients_new TO ingredients;

ALTER TABLE recipes ALTER COLUMN ingredients DROP DEFAULT;
