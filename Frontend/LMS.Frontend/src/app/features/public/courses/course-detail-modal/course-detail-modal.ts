import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environments';
import { Course } from '../../../../shared/models/course.model';
import { EnrollmentServices } from '../../../../services/enrollment.services';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  imports: [MatDialogModule],
  standalone: true,
  selector: 'app-course-detail-modal',
  styleUrl: './course-detail-modal.scss',
  templateUrl: './course-detail-modal.html',
})
export class CourseDetailModal implements OnInit{
  apiUrl: string = environment.apiUrl;
  courseData!: Course;
  role! : string | null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private enrollmentService: EnrollmentServices,
    private dialogRef : MatDialogRef<CourseDetailModal>,
    private authService : AuthService) {
    this.courseData = data;
  }

  ngOnInit(): void {
     this.authService.role$.subscribe({next: (role) => this.role = role})
  }

  buyCourse(): void {
    this.enrollmentService.enrollInCourse(this.courseData.courseId).subscribe({
      next: () => {
        Swal.fire('Enrolled!', 'Course has been Created Successfully.', 'success')
      },
      error: (err) => {Swal.fire('Failed!', err.error, 'error'); console.log(err)}
    })
    this.dialogRef.close();
  }
}

