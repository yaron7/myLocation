import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Location } from './location.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LocationService {

  private baseUrl = 'api/locations';

  constructor(private http: HttpClient) { }
 
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.baseUrl)
      .pipe(
      catchError(this.handleError<any>('getLoctions'))
      );
  }

  saveLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, location, httpOptions)
      .pipe(
      catchError(this.handleError<any>('addLoction'))
      );
  }


  deleteLocation(location: Location): Observable<Location> {
    const id = typeof location === 'number' ? location : location;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Location>(url, httpOptions)
      .pipe(
      catchError(this.handleError<any>('deleteLoction'))
      );
  }

  updateLocation(location: Location): Observable<any> {
    return this.http.put(this.baseUrl, location, httpOptions).pipe(
      catchError(this.handleError<any>('updateLocation'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
