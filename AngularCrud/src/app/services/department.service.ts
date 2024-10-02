import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:32167/api/Department'; // Ensure this URL is correct and points to your API

  constructor(private http: HttpClient) {}

  // Get all departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Catch errors
    );
  }

  // Get a specific department by ID
  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Catch errors
    );
  }

  // Add a new department
  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department).pipe(
      catchError(this.handleError) // Catch errors
    );
  }

  // Update an existing department
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department).pipe(
      catchError(this.handleError) // Catch errors
    );
  }

  // Delete a department by ID
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Catch errors
    );
  }

  // Centralized error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Backend returned code ${error.status}, message was: ${error.message}`;
    }

    // Log the error message to the console for debugging
    console.error(errorMessage);

    // Rethrow the error to be handled by the component
    return throwError(() => new Error(errorMessage));
  }
}
