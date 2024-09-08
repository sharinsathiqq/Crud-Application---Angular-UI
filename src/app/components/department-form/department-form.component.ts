import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  departmentId: number | null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      departmentId: [0, Validators.required],
      departmentName: ['', Validators.required]
    });

    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.departmentId) {
      this.departmentService.getDepartment(this.departmentId).subscribe(data => {
        this.departmentForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      if (this.departmentId) {
        this.departmentService.updateDepartment(this.departmentId, this.departmentForm.value).subscribe(() => {
          this.router.navigate(['/departments']);
        });
      } else {
        const a = this.departmentForm.value;
      
        this.departmentService.addDepartment(this.departmentForm.value).subscribe(() => {
          this.router.navigate(['/departments']);
        });
      }
    }
  }
}
