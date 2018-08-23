import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode = false;

  private editSubs: Subscription;
  private editedItemIndex: number;
  private editedItem: Ingredient;

  @ViewChild('ingredientsForm') ingredientsForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.editSubs = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.ingredientsForm.setValue({
          ingName: this.editedItem.name,
          ingAmount: this.editedItem.amount
        });
      });
  }

  onClear() {
    this.ingredientsForm.reset();
    this.editMode = false;
  }

  onDelete() {
    if (this.editMode) {
      this.slService.deleteIngedient(this.editedItemIndex);
    }

    this.onClear();
  }

  onSubmit() {    
    const ingName = this.ingredientsForm.value.ingName;
    const ingAmount = this.ingredientsForm.value.ingAmount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.slService.updateIngedient(this.editedItemIndex, newIngredient);
    }
    else {
      this.slService.addIngredient(newIngredient);
    }

    this.editMode = false;
    this.ingredientsForm.reset();
  }

  ngOnDestroy() {
    this.editSubs.unsubscribe();
  }
}
