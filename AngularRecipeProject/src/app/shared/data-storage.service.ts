import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn:'root'})
export class DataStorageService{
    constructor(private recipeService: RecipeService,private http:HttpClient, private authService: AuthService){}
    storeData(){
        const recipes=this.recipeService.getRecipes();  
        this.http.put('https://ng-course-recipe-book-92683.firebaseio.com/recipes.json',recipes)
        .subscribe(responseDate=>{
            console.log(responseDate)
        })
    }

    fetchRecipes(){       
        return this.http.get<Recipe[]>('https://ng-course-recipe-book-92683.firebaseio.com/recipes.json')
        .pipe(map(recipes => {
            return recipes.map(recipe => {
                return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
            })
        }), tap(recipes => {
            this.recipeService.setRecipes(recipes)
        }));
    }
}