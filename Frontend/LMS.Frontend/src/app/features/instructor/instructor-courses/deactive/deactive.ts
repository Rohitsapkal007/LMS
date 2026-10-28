import { ChangeDetectorRef, Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CoursesbyStatus } from '../../../../shared/models/CoursesbyStatus.model';
import { CourseServices } from '../../../../services/course.services';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-deactive',
  styleUrl: './deactive.scss',
  templateUrl: './deactive.html',
})
export class Deactive {
  deactivatedCourses$!: Observable<CoursesbyStatus[]>;

  constructor(private courseService: CourseServices, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadDeactivatedCourses();
  }

  loadDeactivatedCourses(): void {
    this.deactivatedCourses$ = this.courseService.getInstructorCoursesbyStatus("Deactivated").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with deactivated status: ' + err.error, 'error')
      return of([]);
    }));
  }

  reactivateCourse(courseId: number): void {
    this.courseService.UpdateCoursesStatustoApprove(courseId).subscribe({
      next: ()=>{
        Swal.fire('Success!', 'Course Submitted for approval','success');
        this.loadDeactivatedCourses();
        this.cdr.markForCheck();
      },
      error: () => Swal.fire('Failed!', 'Failed to Submit the Course', 'error')
    })
  }
}
