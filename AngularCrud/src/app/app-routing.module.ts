import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { StudentCardComponent } from './student-card/student-card.component';
import { LoginComponent } from './login/login.component'; // Import LoginComponent
import { RoleGuard } from './guards/role.guard'; // Import the RoleGuard for protecting routes
import { LayoutComponent } from './layout/layout.component'; // Import the LayoutComponent that contains the sidebar and layout

const routes: Routes = [
  // Login page (separate from the rest of the app, no sidebar)
  { path: 'login', component: LoginComponent },

  // All dashboard routes will be inside LayoutComponent (with sidebar)
  {
    path: '',
    component: LayoutComponent, // All routes with the sidebar layout are children of LayoutComponent
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'students', component: StudentListComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'staff'] } },
      { path: 'students/add', component: StudentFormComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'staff'] } },
      { path: 'students/edit/:id', component: EditStudentComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'staff'] } },
      { path: 'departments', component: DepartmentListComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
      { path: 'departments/add', component: DepartmentFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
      { path: 'departments/edit/:id', component: DepartmentFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
      { path: 'students/print/:id', component: StudentCardComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'staff'] } }
    ]
  },

  // Redirect to login if the path is empty
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Catch-all route for undefined paths
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
