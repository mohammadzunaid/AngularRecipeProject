import { Component, OnInit, OnDestroy } from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import { ShoppingListService } from './shoppingL-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {
  ingChangedSubscription : Subscription
  ingredients: Ingredient[];

  constructor(private shoppinglistService: ShoppingListService,private loggingService:LoggingService) {
  }

  ngOnInit() {
    this.ingredients=this.shoppinglistService.getIngredients();
    this.ingChangedSubscription=this.shoppinglistService.ingredientsChanged.subscribe(
      (ingredient: Ingredient[])=>{
        this.ingredients=ingredient;
      }
    )

    this.loggingService.printLog('Output from Shopping-list component ngOninit');
  }

  onEditItem(index : number){
    this.shoppinglistService.startedEditing.next(index);
  }

  ngOnDestroy(){
    this.ingChangedSubscription.unsubscribe()
  }

}
