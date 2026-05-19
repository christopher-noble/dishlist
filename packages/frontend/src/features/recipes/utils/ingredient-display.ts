export interface IngredientUnitLabels {
  value: string;
  singularLabel: string;
  pluralLabel: string;
}

export function formatIngredientUnitLabel(
  unit: string,
  amount: number,
  units: IngredientUnitLabels[],
): string {
  const normalized = unit.trim().toUpperCase();
  const option = units.find(
    (entry) => entry.value === unit || entry.value === normalized,
  );
  if (!option) {
    return unit;
  }

  return amount > 1 ? option.pluralLabel : option.singularLabel;
}

export function formatIngredientAmountLine(
  amount: number,
  unit: string,
  units: IngredientUnitLabels[],
): string {
  const unitLabel = formatIngredientUnitLabel(unit, amount, units);
  const formattedAmount = Number.isInteger(amount) ? String(amount) : String(amount);
  return `${formattedAmount} ${unitLabel}`;
}

export function ingredientHasAmount(amount: number, unit: string): boolean {
  return amount > 0 && unit.trim().length > 0;
}
