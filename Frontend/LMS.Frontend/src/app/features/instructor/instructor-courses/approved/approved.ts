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
  selector: 'app-approved',
  styleUrl: './approved.scss',
  templateUrl: './approved.html',
})
export class Approved {
  approvedCourses$!: Observable<CoursesbyStatus[]>;

  constructor(private courseService: CourseServices, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadApprovedCourses();
  }

  loadApprovedCourses(): void {
    this.approvedCourses$ = this.courseService.getInstructorCoursesbyStatus("Approved").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with draft status: ' + err.error, 'error')
      return of([]);
    }));
  }

  editCourse(courseId: number, course: CoursesbyStatus): void {
    this.router.navigate(['instructor-courses/edit-course', courseId], {state: {course}});
  }

  deactivedCource(courseId: number): void {
    this.courseService.UpdateCoursesStatustoDeactive(courseId).subscribe({
      next: ()=>{
                    Swal.fire('Success!', 'Course Deactivated Successfully','success');
                    this.loadApprovedCourses();
                    this.cdr.markForCheck();
                  },
                  error: () => Swal.fire('Failed!', 'Failed to deactivate the Course', 'error')
    })
  }
}
