import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, mergeMap, retry } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { Recipe } from '../recipes/recipe.model';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  /**
   * given a function that takes a url and returns a request inject the url with token
   * to create a request with authentication
   * @param reqFunc - function that recives a url and returns a request (observable)
   */
  private makeRequest(reqFunc: (url: string) => Observable<Recipe[]>): Observable<Recipe[]> {

    const rawUrl: string = 'https://ng-recipe-book-7efbc.firebaseio.com/recipes.json';

    // error handle function that logs the error to the console and rethrows an empty
    // array of recipients
    function handleErr(error: HttpErrorResponse): Observable<Recipe[]> {
      console.log(error);
      return throwError([]);
    }

    // get a promise from the auth service that will return a token and turn it into an
    // Observable<string>
    return from(this.authSvc.getToken())
      .pipe(mergeMap(token => { // mergeMap the token into a function that will contruct
                                // the request

        const url = `${rawUrl}?auth=${token}`;

        // construct the request and pipe in the default error handler
        const req = reqFunc(url).pipe(catchError(handleErr));

        return req;
      }));
  }
  
  saveData(recipes: Recipe[]): Observable<Recipe[]> {

    // request making function
    const reqFunc = (url: string) => this.http.put<Recipe[]>(url, recipes);

    // make request and return it
    return this.makeRequest(reqFunc);
  }

  fetchData(): Observable<Recipe[]> {

    // request making function that insures that each
    // recipe has an ingredients array
    function mapFunc(recipes: Recipe[]): Recipe[] {
      return recipes.map(item => {
        if (!item.ingredients) {
          item.ingredients = [];
        }
        return item;
      });
    }

    const reqFunc = (url: string) =>
      this.http.get<Recipe[]>(url).pipe(map(mapFunc));

    return this.makeRequest(reqFunc);
  }

  //saveData(recipes: Recipe[]): Observable<Recipe[]> {

  //  function handleErr(error: HttpErrorResponse): Observable<Recipe[]> {
  //    console.log(error);
  //    return throwError([]);
  //  }

  //  return this.http.put<Recipe[]>(this.url, recipes)
  //    .pipe(
  //      //map(val => { console.log(val); return val; }),
  //      catchError(handleErr)
  //    );
  //}

  //fetchData(): Observable<Recipe[]> {
  //  function handleErr(error: HttpErrorResponse): Observable<Recipe[]> {
  //    console.log(error);
  //    return throwError([]);
  //  }

  //  return this.http.get<Recipe[]>(this.url)
  //    .pipe(
  //      map((recipes: Recipe[]) =>
  //      (recipes || []).map(item => {
  //        if (!item.ingredients) {
  //          item.ingredients = [];
  //        }
  //        return item;
  //      })
  //      ),
  //      catchError(handleErr)
  //    );
  //}
}
