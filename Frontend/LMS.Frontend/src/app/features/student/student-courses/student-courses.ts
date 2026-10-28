import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { EnrolledCourses } from '../../../shared/models/enrolledCourses';
import { ReactiveFormsModule } from '@angular/forms';
import { enrollmentQueryService } from '../../../services/enrollmentQueryService.service';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-courses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-courses.scss',
})
export class StudentCourses implements OnInit {

  courses$!: Observable<EnrolledCourses[]>;

  constructor(private enrollmentQueryService: enrollmentQueryService) { }

  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {


    this.courses$ = this.enrollmentQueryService.getEnrolledCourse().pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with draft status: ' + err.error, 'error')
      return of([]);
    }));
  }

}
