import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ShoppingListStore } from '../../shopping-list/store/shopping-list-store';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeIndex: number;

  constructor(private recipeService: RecipeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<ShoppingListStore>) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const rec = this.getRecipe(+params['id']);
      this.recipeIndex = +params['id'];
      if (rec) {
        this.recipe = rec;
      }
      else {
        this.router.navigate([''], { relativeTo: this.activatedRoute });
      }
    });
  }

  private getRecipe(id: number) : Recipe {
    return this.recipeService.getRecipe(id);
  }

  onAddToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

}
