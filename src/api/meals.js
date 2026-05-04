import { apiFetch } from './client';

/**
 * weekStart: ISO date string of the Monday for the displayed week, e.g. "2026-05-04"
 * Returns a flat array of MealPlan rows; the component groups them by day+mealType.
 */
export async function getMealPlan(weekStart) {
  return apiFetch(`/meals?weekStart=${weekStart}`);
}

export async function upsertMeal({ weekStart, day, mealType, meal, cook, notes }) {
  return apiFetch('/meals', {
    method: 'PUT',
    body: JSON.stringify({ weekStart, day, mealType, meal, cook, notes }),
  });
}

export async function removeMeal({ weekStart, day, mealType }) {
  return apiFetch('/meals', {
    method: 'DELETE',
    body: JSON.stringify({ weekStart, day, mealType }),
  });
}
