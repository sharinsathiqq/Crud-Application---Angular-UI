import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[] = [];
  studentToPrint: Student | null = null;
  departments: any[] = [];

  constructor(private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {
    this.fetchStudentsAndDepartments();
  }

  fetchStudentsAndDepartments(): void {
    this.studentService.getStudents().subscribe((students: Student[]) => {
      this.students = students;
      console.log(this.students);
      this.studentService.getDepartments().subscribe((departments: any[]) => {
        this.departments = departments;
        console.log(this.departments);
        this.mapDepartmentNames();
      }, (error: any) => {
        console.error('Error fetching departments', error);
      });
    }, (error: any) => {
      console.error('Error fetching students', error);
    });
  }

  mapDepartmentNames(): void {
    this.students.forEach(student => {
      const department = this.departments.find(dep => dep.departmentId === student.departmentId);
      if (department) {
        student.departmentName = department.departmentName;
      } else {
        student.departmentName = 'Unknown';
      }
    });
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.fetchStudentsAndDepartments();
    }, (error: any) => {
      console.error('Error deleting student', error);
    });
  }

  editStudent(id: string): void {
    this.router.navigate([`/students/edit/${id}`]);
  }

  Studentcard(student: any): void {
    this.router.navigate([`/students/print/${student}`]);
  }

  printStudent(student: Student): void {
    this.studentToPrint = student;
    setTimeout(() => {
      const printContent = document.getElementById('printSection')!;
      const WindowPrt = window.open('', '', 'width=600,height=600');
      WindowPrt?.document.write('<html><head><title>Print</title>');
      WindowPrt?.document.write('<link rel="stylesheet" href="styles.css">'); // Adjust the path if necessary
      WindowPrt?.document.write('</head><body >');
      WindowPrt?.document.write(printContent.innerHTML);
      WindowPrt?.document.write('</body></html>');
      WindowPrt?.document.close();
      WindowPrt?.focus();
      WindowPrt?.print();
      WindowPrt?.close();
    }, 1000);
  }
}