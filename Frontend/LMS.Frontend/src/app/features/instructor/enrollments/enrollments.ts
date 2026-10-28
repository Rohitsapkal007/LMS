import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Enrollment } from '../../../shared/models/enrollment.model';
import { enrollmentQueryService } from '../../../services/enrollmentQueryService.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollments.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './enrollments.scss',
})
export class Enrollments implements OnInit {
  gridData$!:Observable<Enrollment[]>;

  constructor(private enrollmentQueryService : enrollmentQueryService,
              private router: Router
  ){}

  ngOnInit(): void {
    this.loadEnrollmentData();
  }

  loadEnrollmentData() : void{
    this.gridData$ = this.enrollmentQueryService.getEnrollmenData().pipe(catchError(err =>{
      Swal.fire('Error!', 'Failed to load the courses: ' + err.error, 'error')
      return of([]);
    }));
  }

  viewStudents(courseId : number) : void{
    this.router.navigate(['/enrollments/enrolled-student', courseId]);
  }

  exportData(courseId: number): void {
  this.enrollmentQueryService.exportEnrolledStudentData(courseId)
    .subscribe({
      next: (response: Blob) => {

        const blob = new Blob([response],{
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = `Enrollments.xlsx`;

        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
      }
    });
}
}
