import { Ingredient } from "../../shared/ingredient.model";

export class ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient = null;
  editedIngredientIndex: number = -1;
}
