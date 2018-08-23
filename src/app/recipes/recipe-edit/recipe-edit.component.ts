import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private recipeSvc: RecipeService,
  private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;

      this.initForm()
    });
  }

  private initForm() {

    const recipe = this.editMode ? this.recipeSvc.getRecipe(this.id) : null;

    let recipeName = recipe == null ? '' : recipe.name;
    let recipeImagePath = recipe == null ? '' : recipe.imagePath;
    let recipeDescription = recipe == null ? '' : recipe.description;

    let recipeIngredients = new FormArray([]);

    if (this.editMode && recipe['ingredients']) {
      for (let ingredient of recipe.ingredients) {
        recipeIngredients.push(new FormGroup({
          'name': new FormControl(ingredient.name, Validators.required),
          'amount': new FormControl(ingredient.amount,
            [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        }));
      }
    }


    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    
    if (this.editMode) {
      this.recipeSvc.updateRecipe(this.id, this.recipeForm.value);
    }
    else {
      this.recipeSvc.addRecipe(this.recipeForm.value);
    }

    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null,
        [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
