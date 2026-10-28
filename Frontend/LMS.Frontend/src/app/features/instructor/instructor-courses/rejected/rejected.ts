import { ChangeDetectorRef, Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CoursesbyStatus } from '../../../../shared/models/CoursesbyStatus.model';
import { CourseServices } from '../../../../services/course.services';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-rejected',
  styleUrl: './rejected.scss',
  templateUrl: './rejected.html',
})
export class Rejected {

  rejectedCourses$!: Observable<CoursesbyStatus[]>;

  constructor(private courseService: CourseServices, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadRejectedCourses();
  }

  loadRejectedCourses(): void {
    this.rejectedCourses$ = this.courseService.getInstructorCoursesbyStatus("Rejected").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with draft status: ' + err.error, 'error')
      return of([]);
    }));
  }

  editCourse(courseId: number, course: CoursesbyStatus): void {
    this.router.navigate(['instructor-courses/edit-course',courseId], {state:{course}});
  }

  resubmit(courseId: number): void {
    this.courseService.UpdateCoursesStatustoPending(courseId).subscribe({
      next: ()=>{
              Swal.fire('Success!', 'Course Submitted for approval','success');
              this.loadRejectedCourses();
              this.cdr.markForCheck();
            },
            error: () => Swal.fire('Failed!', 'Failed to Submit the Course', 'error')
    })
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
          next: ()=>{
            Swal.fire('Success!', 'Course Deleted Successfully','success');
            this.loadRejectedCourses();
            this.cdr.markForCheck();
          },
          error: () => Swal.fire('Failed!', 'Failed to delete the Course', 'error')
        })
  }
}
