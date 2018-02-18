import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Category } from './category.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CategoryService {

  private baseUrl = 'api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      catchError(this.handleError<Category[]>('getCategory'))
    );;
  }

  saveCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category, httpOptions).pipe(
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  deleteCategory(category: Category | number): Observable<Category> {
    const id = typeof category === 'number' ? category : category.id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Category>(url, httpOptions).pipe(
      catchError(this.handleError<Category>('deleteCategory'))
    );
  }
  
  updateCategory (category: Category): Observable<any> {
    return this.http.put(this.baseUrl, category, httpOptions).pipe(
      catchError(this.handleError<any>('updateCategory'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
