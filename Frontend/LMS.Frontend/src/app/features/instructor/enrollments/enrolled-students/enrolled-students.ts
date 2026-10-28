import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { EnrolledStudent } from '../../../../shared/models/enrollment.model';
import { CommonModule } from '@angular/common';
import { enrollmentQueryService } from '../../../../services/enrollmentQueryService.service';
import Swal from 'sweetalert2';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-enrolled-students',
  styleUrl: './enrolled-students.scss',
  templateUrl: './enrolled-students.html',
})
export class EnrolledStudents implements OnInit {
  courseId!: number;
  enrolledStudentData$!: Observable<EnrolledStudent[]>
  constructor(private route: ActivatedRoute,
    private enrollmentQueryService: enrollmentQueryService,
    private router: Router) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.getEnrolledStudentDetails();
  }

  getEnrolledStudentDetails(): void {
    this.enrolledStudentData$ = this.enrollmentQueryService.getEnrolledStudentDetails(this.courseId).pipe(catchError(err => {
      console.log(err);
      Swal.fire('Error!', 'Failed to load the courses: ' + err.error, 'error')
      return of([]);
    }));
  }

  backToMyEnrollment(): void{
    this.router.navigate(['./enrollments']);
  }
}
