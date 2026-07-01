import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Game {
  id: number;
  title: string;
  price: number;
  available?: boolean;
  publisher?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // URL pointing to the running Django REST API endpoint
  private apiUrl = `${environment.apiUrl}/games/`;

  // Inject HttpClient into the service constructor
  constructor(private http: HttpClient) {}

  // Fetch games list from the server
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch a single game by ID from the server
  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new game record to the database
  addGame(title: string, price: number): Observable<Game> {
    const payload = {
      title: title,
      price: price,
      // Django model requires linking a publisher ID. We pass default publisher ID 1
      publisher: 1
    };

    return this.http.post<Game>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  // Asynchronous error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response status code
      errorMessage = `Server returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    // throwError wraps the message in a new Observable error stream
    return throwError(() => new Error(errorMessage));
  }
}