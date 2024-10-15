import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  studentForm: FormGroup;
  studentId: string;
  selectedFile: File | null = null;
  student: Student | undefined;
  profilePhotoFile: string | ArrayBuffer | null = null; 
  dob: string | undefined;
  departments: any[] = []; // Store departments
  selectedDepartmentId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: [''],
      departmentId: ['', Validators.required], // Updated with Validators.required
      address:['',Validators.required],
      profilePhotoFile: [null]
    });

    this.studentId = this.route.snapshot.paramMap.get('id')!;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // ngOnInit(): void {
  //   this.fetchDepartments(); // Fetch departments on init
  //   this.studentService.getStudent(this.studentId).subscribe(
  //     (data: Student) => {
  //       this.student = data;
  //       this.dob = this.formatDate(new Date(this.student.dob));
  //       this.selectedDepartmentId = this.student.departmentId; // Set selected department
  //       this.studentForm.patchValue(this.student);
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error fetching student:', error.message);
  //     }
  //   );
  // }

  ngOnInit(): void {
    this.fetchDepartments(); // Fetch departments on init
    this.studentService.getStudent(this.studentId).subscribe(
      (data: Student) => {
        this.student = data;
        this.dob = this.formatDate(new Date(this.student.dob));
        this.selectedDepartmentId = this.student.departmentId;
        this.studentForm.patchValue(this.student);
        this.studentService.getProfilePhotoUrl(this.student.profilePhotoFile).subscribe(
          (blob: Blob) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.profilePhotoFile = e.target.result;
            };
            reader.readAsDataURL(blob);
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching profile photo:', error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching student:', error.message);
      }
    );
  }

  fetchDepartments(): void {
    this.studentService.getDepartments().subscribe(
      (data: any[]) => {
        this.departments = data;
        console.log(this.departments)
      },
     
      (error: HttpErrorResponse) => {
        console.error('Error fetching departments:', error.message);
      }
    );
  }



  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.selectedFile = input.files[0];
  //   }
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoFile = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  get f() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    if (this.student) {
      const formData = new FormData();
      formData.append('id', this.f['id'].value);
      formData.append('name', this.f['name'].value);
      formData.append('emailID', this.f['emailID'].value);
      formData.append('phoneNumber', this.f['phoneNumber'].value);
      formData.append('dob', this.f['dob'].value);
      formData.append('departmentId', this.f['departmentId'].value);
      formData.append('address', this.f['address'].value);
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      console.log(formData);

      this.http.put<any>(`http://localhost:32167/api/student/${this.studentId}`, formData).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating student:', error.message);
        }
      });
    }
  }
  
  updateStudent(student: Student): void {
    this.studentService.updateStudent(this.studentId, student).subscribe(
      () => {
        this.router.navigate(['/students']);
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating student:', error.message);
      }
    );
  }
}

