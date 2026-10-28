import { ChangeDetectorRef, Component } from '@angular/core';
import { CoursesbyStatus } from '../../../../shared/models/CoursesbyStatus.model';
import { catchError, Observable, of } from 'rxjs';
import { CourseServices } from '../../../../services/course.services';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../../../shared/models/course.model';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-pending',
  styleUrl: './pending.scss',
  templateUrl: './pending.html',
})
export class Pending {
  pendingCourses$!: Observable<CoursesbyStatus[]>;

  constructor(private courseService: CourseServices, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadPendingCourses();
  }

  loadPendingCourses(): void {
    this.pendingCourses$ = this.courseService.getInstructorCoursesbyStatus("Pending").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with draft status: ' + err.error, 'error')
      return of([]);
    }));
  }

  editCourse(courseId:number, course: CoursesbyStatus): void {
    this.router.navigate(['instructor-courses/edit-course', courseId], {state: {course}});
  }

  withdrawCourse(courseId: number): void {

    this.courseService.UpdateCoursesStatustoDraft(courseId).subscribe({
      next: ()=>{
              Swal.fire('Success!', 'Course Withdrawn Successfully','success');
              this.loadPendingCourses();
              this.cdr.markForCheck();
            },
            error: () => Swal.fire('Failed!', 'Failed to withdraw the Course', 'error')
    })
  }
}
