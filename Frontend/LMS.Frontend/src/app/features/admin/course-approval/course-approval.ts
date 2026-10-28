import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CourseServices } from '../../../services/course.services';
import { CoursesbyStatus } from '../../../shared/models/CoursesbyStatus.model';
import { catchError, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-approval',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-approval.html',
  styleUrl: './course-approval.scss',
})
export class CourseApproval implements OnInit {

  pendingCourses$!: Observable<CoursesbyStatus[]>;
  approvedCourses$!: Observable<CoursesbyStatus[]>;
  rejectedCourses$!: Observable<CoursesbyStatus[]>;
  deactivatedCourses$!: Observable<CoursesbyStatus[]>;
  role$!: Observable<string | null>;

  constructor(private courseService: CourseServices, private cdRef: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit() {
    this.loadCourses();
    this.role$ = this.authService.role$;
  }

  loadCourses() {
    this.loadPendingCourses();
    this.loadApprovedCourses();
    this.loadRejectedCourses();
    this.loadDeactivatedCourses();
  }

  loadPendingCourses() {
    this.pendingCourses$ = this.courseService.getCoursesbyStatus("Pending").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with pending status:' + err.error , 'error')
      return of([]);
    }))
  }

  loadApprovedCourses() {
    this.approvedCourses$ = this.courseService.getCoursesbyStatus("Approved").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with approved status :' + err.error , 'error')
      return of([]);
    }))
  }

  loadRejectedCourses() {
    this.rejectedCourses$ = this.courseService.getCoursesbyStatus("Rejected").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with approved status:' + err.error , 'error')
      return of([]);
    }))
  }

  loadDeactivatedCourses() {
    this.deactivatedCourses$ = this.courseService.getCoursesbyStatus("Deactivated").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with approved status:' + err.error , 'error')
      return of([]);
    }))
  }

  approveCourse(courseId: number) {
    this.courseService.UpdateCoursesStatustoApprove(courseId).subscribe({
      next: () => {
        Swal.fire('Success!', 'Status Updated Successfully.', 'success');
        this.loadCourses();
        this.cdRef.markForCheck();
      },
      error: () => {
        Swal.fire('Error!', 'Failed to Update the Status:', 'error')
      }
    })
  }

  rejectCourse(courseId: number) {
    this.courseService.UpdateCoursesStatustoReject(courseId).subscribe({
      next: () => {
        
        Swal.fire('Success!', 'Status Updated Successfully.', 'success');
        this.loadCourses();
        this.cdRef.markForCheck();
      },
      error: () => {
         Swal.fire('Error!', ' Failed to Update the Status.', 'error')
      }
    })
  }

  deactivateCourse(courseId: number) {
    this.courseService.UpdateCoursesStatustoDeactive(courseId).subscribe({
      next: () => {
        Swal.fire('Success!', 'Status Updated Successfully.', 'success');
        this.loadCourses();
        this.cdRef.markForCheck();
      },
      error: () => {
        Swal.fire('Error!', ' Failed to Update the Status.', 'error')
      }

    })
  }

}
