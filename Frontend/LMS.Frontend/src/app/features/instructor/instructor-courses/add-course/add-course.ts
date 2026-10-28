import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { COURSE_LEVEL_OPTIONS, VISIBILITY_OPTIONS, COURSE_CATEGORY_OPTIONS, COURSE_LANGUAGE_OPTIONS, TARGET_AUDIENCE_OPTIONS } from '../../../../shared/constants/dropdown-values';
import { Router } from '@angular/router';
import { CourseServices } from '../../../../services/course.services';
import { CustomMapperService } from '../../../../services/customMapper.service';
import { Response } from '../../../../models/Response.model';
import Swal from 'sweetalert2';
import { from, timer } from 'rxjs';

@Component({
  imports: [ɵInternalFormsSharedModule, CommonModule, ReactiveFormsModule],
  standalone: true,
  selector: 'app-add-course',
  styleUrl: './add-course.scss',
  templateUrl: './add-course.html',
})
export class AddCourse {
  coursesCategoryOptions = COURSE_CATEGORY_OPTIONS;
  coursesLevelOptions = COURSE_LEVEL_OPTIONS;
  coursesVisibilityOptions = VISIBILITY_OPTIONS;
  coursesLanguageOptions = COURSE_LANGUAGE_OPTIONS;
  coursesTargetAudienceOptions = TARGET_AUDIENCE_OPTIONS;
  selectedThumbnail: File | null = null;
  thumbnailPreview: string | null = null;

  courseForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(10000)]),
    syllabus: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]),
    enrollmentLimit: new FormControl(0, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+$")]),
    visibility: new FormControl('Public', [Validators.required]),
    category: new FormControl('ComputerScience', [Validators.required]),
    level: new FormControl('Beginner', [Validators.required]),
    duration: new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]+$")]),
    language: new FormControl('English', [Validators.required]),
    thumbnail: new FormControl(''),
    prerequisites: new FormControl('', [Validators.maxLength(500)]),
    learningObjectives: new FormControl('', [Validators.maxLength(5000)]),
    targetAudience: new FormControl('Students', [Validators.required]),
  })

  constructor(private router: Router,
    private courseService: CourseServices,
    private cdr: ChangeDetectorRef) { }

  saveDraft(): void {
    const formData= new FormData();

    Object.entries(this.courseForm.getRawValue()).forEach(([key, value]) => {
      if(key != 'thumbnail')
      formData.append(key, value as any);
    });

     if (this.selectedThumbnail) {
      formData.append('thumbnail', this.selectedThumbnail);
    }

    formData.append('courseId', '0');
    formData.append('InstructorId', '0');
    formData.append('status', 'Draft');

    this.courseService.createCourse(formData).subscribe({
      next: (res: Response) => {
        Swal.fire('Created!', 'Course has been Created Successfully.' + res.message, 'success')
        this.router.navigate(['./instructor-courses']);
      },
      error: (err) => Swal.fire('Error!', 'Failed to Create Course: ' + err.error, 'error')
    })

  }

  onSubmit(): void {
    const formData= new FormData();

    Object.entries(this.courseForm.getRawValue()).forEach(([key, value]) => {
      if(key != 'thumbnail')
        formData.append(key, value as any);
    });

    if (this.selectedThumbnail)
      formData.append('thumbnail', this.selectedThumbnail);
    else
      formData.append('thumbnail', '');

    formData.append('courseId', '0');
    formData.append('InstructorId', '0');
    formData.append('status', 'Pending');
 
    this.courseService.createCourse(formData).subscribe({
      next: (res: Response) => {
        Swal.fire('Created!', 'Course has been Created Successfully.' + res.message, 'success')
        this.router.navigate(['./instructor-courses']);
      },
      error: (err) => Swal.fire('Error!', 'Failed to Create Course: ' + err.error, 'error')
    })
  }

  goBack(): void {
    this.router.navigate(['/instructor-courses']);
  }

  onThumbnailSelected(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if(!file.type.startsWith('image/')){
        Swal.fire('Invalid File','Only image files are allowed','error');
        input.value = '';
        this.selectedThumbnail = null;
        return;
      }

      if(file.size > 2*1024*1024)
      {
        Swal.fire('File too large', 'Image must be less than 2 MB!', 'error');
        input.value = '';
        this.selectedThumbnail = null;
        return;
      }

      this.selectedThumbnail = file

      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result as string;
        this.cdr.markForCheck();
      };

      reader.readAsDataURL(file);
    }
  }
}
