import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './instructor-courses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './instructor-courses.scss',
})
export class InstructorCourses {}
