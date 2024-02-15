import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private loginAPIUrl: string = "https://localhost:7065/api/Login/";
  private employeeAPIUrl: string = "https://localhost:7065/api/Employee/";

  constructor(private _http: HttpClient) { }

  addEmployee(data: any): Observable<any> {
    return this._http.post<any>(`${this.employeeAPIUrl}add_employee`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEmployee(id: number): Observable<any> {
    return this._http.delete<any>(this.employeeAPIUrl+ 'delete_employee/'+ id)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEmployee(data: any): Observable<any> {
    return this._http.put<any>(`${this.employeeAPIUrl}update_employee`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllEmployees(): Observable<any> {
    return this._http.get<any>(`${this.employeeAPIUrl}get_all_employees`)
      .pipe(
        catchError(this.handleError)
      );
  }

  signup(empObj: any): Observable<any> {
    return this._http.post<any>(`${this.loginAPIUrl}signup`, empObj)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(empObj: any): Observable<any> {
    return this._http.post<any>(`${this.loginAPIUrl}login`, empObj)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
