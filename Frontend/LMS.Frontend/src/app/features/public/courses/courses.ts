import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Course } from '../../../shared/models/course.model';
import { CourseServices } from '../../../services/course.services';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environments';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CourseDetailModal } from './course-detail-modal/course-detail-modal';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './courses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./courses.scss'],
})
export class Courses {
  courses = signal<Course[]>([]);
  isLoading = signal(true);
  apiUrl : string = environment.apiUrl

  constructor(private courseService: CourseServices,
              private dialog : MatDialog) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        console.log(data);
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        Swal.fire('Failed!','Failed while fetching courses','error')
        this.isLoading.set(false);
      }
    })
  }

  openCourseDetail(course:any): void{
    this.dialog.open(CourseDetailModal, {width: '1000px', data: course});
  }



}
