import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

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
    private activatedRoute: ActivatedRoute) { }

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
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

}
