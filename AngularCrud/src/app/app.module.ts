import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Add FormsModule if not already included

import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { HomeComponent } from './home/home.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { StudentService } from './services/student.service';
import { StudentCardComponent } from './student-card/student-card.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentFormComponent,
    DepartmentListComponent,
    DepartmentFormComponent,
    HomeComponent,
    EditStudentComponent,
    StudentCardComponent,
    LoginComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule // Import FormsModule
  ],
  providers: [StudentService], // Provide StudentService here
  bootstrap: [AppComponent]
})
export class AppModule { }
