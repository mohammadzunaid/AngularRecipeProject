import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';

import {Recipe} from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shoppingL-list.service';


@Injectable({
    providedIn:'root'
})
export class RecipeService{
    recipesChanged= new Subject<Recipe[]>()
    
    getRecipes(){
        return this.recipes.slice();
    }
    getRecipe(id:number){
        return this.recipes[id];
    }

    // private recipes: Recipe[] = [
    //     new Recipe('Tasty Schnitzel', 'A Super-tasty schnitzel - just awesome!',
    //         'https://previews.123rf.com/images/peteers/peteers1608/peteers160800243/61209413-wiener-schnitzel-with-french-fries-salad-and-a-sharp-dip.jpg',[
    //             new Ingredient('Meat',2),
    //             new Ingredient('French Fries',20)
    //         ]),
    //     new Recipe('Big Fat Burger', 'What else you need to say?',
    //         'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/mbtg1wsd3zdqu3v3rpgd',
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat',1)                
    //         ])
    // ];
    
    private recipes: Recipe[] = [];
    
    constructor(private slService:ShoppingListService){}

    setRecipes(recipes:Recipe[]){
        this.recipes=recipes;
        this.recipesChanged.next(this.recipes.slice())
    }

    addIngredientsToShoppingList(ingredients:Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(newRecipe:Recipe){
        this.recipes.push(newRecipe)
        this.recipesChanged.next(this.recipes.slice())
    }

    updateRecipe(index:number,newRecipe:Recipe){
        this.recipes[index]=newRecipe
        this.recipesChanged.next(this.recipes.slice())
    }

    deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice())
    }
}