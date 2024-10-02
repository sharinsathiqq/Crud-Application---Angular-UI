import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-card',
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.css']
})
export class StudentCardComponent implements OnInit {  
  studentId: string;
  selectedFile: File | null = null;
  student: Student | undefined;
  profilePhotoFile: string | ArrayBuffer | null = null; 
  dob: string | undefined;
  selectedDepartmentId: string = '';
  departments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
  ) {
    this.studentId = this.route.snapshot.paramMap.get('id')!;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.fetchDepartments(); 
    this.studentService.getStudent(this.studentId).subscribe(
      (data: Student) => {
        this.student = data;
        console.log(this.student); // Check if ID and other details are here
        this.dob = this.formatDate(new Date(this.student.dob));
        this.selectedDepartmentId = this.student.departmentId;
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
        this.mapDepartmentNames(); // Ensure department names are mapped
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
        console.log(this.departments);

        // Call mapDepartmentNames after fetching department data
        this.mapDepartmentNames();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching departments:', error.message);
      }
    );
  }

  mapDepartmentNames(): void {
    if (this.student && this.departments.length > 0) {
      const department = this.departments.find(dep => dep.departmentId === this.student!.departmentId);
      if (department) {
        this.student.departmentName = department.departmentName;
      } else {
        this.student.departmentName = 'Unknown';
      }
    }
  }

  printIDCard() {
    console.log(this.student);
    const data = document.getElementById('studentCard');

    if (data) {
      html2canvas(data, { scale: 2 }).then(canvas => { // Increase scale for better quality
        const imgWidth = 208; // A4 size in mm
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;

        // Add image to PDF
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        // Save the PDF
        pdf.save('student-id-card.pdf');
      });
    }
  }
}
