import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service'; // Correct path

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  departments: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService // Inject the department service
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      departmentId: ['', Validators.required],
      address:['',Validators.required]
      
    });
  }

  ngOnInit(): void {
    this.fetchDepartments(); // Fetch departments on component initialization
  }

  get f() { return this.studentForm.controls; }

  fetchDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data: any[]) => {
        this.departments = data;
        console.log(this.departments)
      },
      error: (error: any) => {
        console.error('Error fetching departments:', error);
      }
    });
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.f['name'].value);
    formData.append('emailID', this.f['emailID'].value);
    formData.append('phoneNumber', this.f['phoneNumber'].value);
    formData.append('dob', this.f['dob'].value);
    formData.append('departmentId', this.f['departmentId'].value);
    formData.append('address',this.f['address'].value);

    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post<any>('http://localhost:32167/api/student', formData).subscribe({
      next: response => {
        console.log('Response:', response);
        this.router.navigate(['/students']);
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageSrc = e.target?.result || null; // Ensure result is not undefined
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
