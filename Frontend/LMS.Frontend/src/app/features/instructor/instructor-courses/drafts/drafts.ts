import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CourseServices } from '../../../../services/course.services';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CoursesbyStatus } from '../../../../shared/models/CoursesbyStatus.model';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-drafts',
  styleUrl: './drafts.scss',
  templateUrl: './drafts.html',
})
export class Drafts implements OnInit {
  draftedCourses$!: Observable<CoursesbyStatus[]>;

  constructor(private courseService: CourseServices, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadDraftedCourses();
  }

  loadDraftedCourses(): void {
    this.draftedCourses$ = this.courseService.getInstructorCoursesbyStatus("Draft").pipe(catchError(err => {
      Swal.fire('Error!', 'Failed to load the courses with draft status: ' + err.error, 'error')
      return of([]);
    }));
  }

  editCourse(courseId: number, course: CoursesbyStatus): void {
    console.log(course);
    this.router.navigate(['instructor-courses/edit-course', courseId], {state: {course}})
  }


  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: ()=>{
        Swal.fire('Success!', 'Course Deleted Successfully','success');
        this.loadDraftedCourses();
        this.cdr.markForCheck();
      },
      error: () => Swal.fire('Failed!', 'Failed to delete the Course', 'error')
    })
  }

  manageCourseContent(courseId: number): void{
    this.router.navigate(['/instructor-courses/manage-content', courseId])
  }
}
