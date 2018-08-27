import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { DataStorageService } from '../shared/data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ];

  constructor(private dataStorageSvc: DataStorageService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number) {
    if (index >= 0) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.getRecipes());
    }
  }

  saveData(): Observable<Recipe[]> {
    return this.dataStorageSvc.saveData(this.recipes);
  }

  fetchData(): Observable<Recipe[]> {
    return this.dataStorageSvc.fetchData().pipe(
      tap((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipesChanged.next(this.getRecipes());
      })
    );
  }
}
