import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import { ShoppingListService } from '../shoppingL-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f',{static:false}) slForm:NgForm
  subscription: Subscription
  editItemIndex: number;
  editItem: Ingredient;
  editMode=false;
  
  constructor(private shoppinglistService:ShoppingListService) { }

  ngOnInit(): void {
    this.subscription=this.shoppinglistService.startedEditing.subscribe(
      (index)=>{
        this.editItemIndex=index;
        this.editMode=true;
        this.editItem = this.shoppinglistService.getIngredient(index);
        this.slForm.setValue({
          'name': this.editItem.name,
          'amount': this.editItem.amount
        })
      }
    )
  }

  onSubmit(form: NgForm){
    const value=form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.shoppinglistService.updateIngredient(this.editItemIndex, newIngredient);  
    }else{
      this.shoppinglistService.addIngredient(newIngredient)      
    }
    this.editMode = false;
    this.slForm.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode=false;
  }

  onDelete(){
    this.shoppinglistService.deleteIngredient(this.editItemIndex)
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
