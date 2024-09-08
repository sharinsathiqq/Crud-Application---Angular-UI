import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:32167/api/student'; 
  private departmentApiUrl = 'http://localhost:32167/api/department'; 

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    console.log("Fetching students from API");
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: string, student: Student): Observable<void> {
    console.log(id, student);
    return this.http.put<void>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProfilePhotoUrl(picturename: string): Observable<Blob> {
    return this.http.get(`http://localhost:32167/api/ProfilePhoto/${picturename}`, { responseType: 'blob' });
  }

  uploadProfilePhoto(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    console.log("Uploading profile photo");
    return this.http.post<{ profilePictureUrl: string }>(`${this.apiUrl}/UploadProfilePicture`, formData); // Adjust the endpoint as needed
  }

  getDepartments(): Observable<any[]> {
    console.log("Fetching departments from API");
    return this.http.get<any[]>(this.departmentApiUrl);
  }
}
