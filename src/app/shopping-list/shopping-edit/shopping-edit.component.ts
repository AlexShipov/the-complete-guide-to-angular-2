import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { ShoppingListStore } from '../store/shopping-list-store';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode = false;

  private editSubs: Subscription;
  @ViewChild('ingredientsForm') ingredientsForm: NgForm;

  constructor(private store: Store<ShoppingListStore>) { }

  ngOnInit() {

    this.editSubs = this.store.select('shoppingList')
      .subscribe(data => {
        
        if (data.editedIngredientIndex > -1) {
          
          this.editMode = true;

          this.ingredientsForm.setValue({
            ingName: data.editedIngredient.name,
            ingAmount: data.editedIngredient.amount
          });

        } else {
          this.editMode = false;
        }
      });
  }

  onClear() {
    this.ingredientsForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.EndEdit())
  }

  onDelete() {
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.DeleteIngredient());
    }

    this.onClear();
  }

  onSubmit() {    
    const ingName = this.ingredientsForm.value.ingName;
    const ingAmount = this.ingredientsForm.value.ingAmount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient));
    }
    else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.onClear();
  }

  ngOnDestroy() {
    this.store.dispatch(new ShoppingListActions.EndEdit())
    this.editSubs.unsubscribe();
  }
}
