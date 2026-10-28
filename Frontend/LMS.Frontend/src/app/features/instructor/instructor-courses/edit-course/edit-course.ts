import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { COURSE_CATEGORY_OPTIONS, COURSE_LANGUAGE_OPTIONS, COURSE_LEVEL_OPTIONS, TARGET_AUDIENCE_OPTIONS, VISIBILITY_OPTIONS } from '../../../../shared/constants/dropdown-values';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseServices } from '../../../../services/course.services';
import { CustomMapperService } from '../../../../services/customMapper.service';
import { environment } from '../../../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-edit-course',
  styleUrl: './edit-course.scss',
  templateUrl: './edit-course.html',
})
export class EditCourse implements OnInit {

  coursesCategoryOptions = COURSE_CATEGORY_OPTIONS;
  coursesLevelOptions = COURSE_LEVEL_OPTIONS;
  coursesVisibilityOptions = VISIBILITY_OPTIONS;
  coursesLanguageOptions = COURSE_LANGUAGE_OPTIONS;
  coursesTargetAudienceOptions = TARGET_AUDIENCE_OPTIONS;
  courseForm!: FormGroup;
  courseId!: number;
  courseStatus!: string;
  selectedThumbnail: File | null = null;
  thumbnailPreview: string | null = null;

  constructor(private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private courseService: CourseServices,
    private route: ActivatedRoute,
    private customMapper: CustomMapperService) { }

  ngOnInit(): void {
    const course = history.state.course;

    this.courseForm = this.fb.group({
      courseId: new FormControl(course.courseId),
      instructorId: new FormControl(course.instructorId),
      title: new FormControl(course.title, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      description: new FormControl(course.description, [Validators.required, Validators.minLength(20), Validators.maxLength(10000)]),
      syllabus: new FormControl(course.syllabus, [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]),
      credits: new FormControl(course.credits ?? 0),
      enrollmentLimit: new FormControl(course.enrollmentLimit, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+$")]),
      visibility: new FormControl(course.visibility, [Validators.required]),
      category: new FormControl(course.category, [Validators.required]),
      level: new FormControl(course.level, [Validators.required]),
      duration: new FormControl(course.duration, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]+$")]),
      language: new FormControl(course.language, [Validators.required]),
      thumbnail: new FormControl(course.thumbnail),
      prerequisites: new FormControl(course.prerequisites, [Validators.maxLength(500)]),
      learningObjectives: new FormControl(course.learningObjectives, [Validators.maxLength(5000)]),
      targetAudience: new FormControl(course.targetAudience, [Validators.required]),
      status: new FormControl(course.status ?? ''),
      createdAt: new FormControl(course.createdAt),
      updatedAt: new FormControl(course.updatedAt)
    })
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.courseStatus = course.status;
    this.thumbnailPreview = environment.apiUrl + course.thumbnailUrl;
    this.selectedThumbnail = null;
    console.log(course.thumbnailUrl);
    this.applyStatusValidation(course.status)
    this.cdr.markForCheck();
  }

  applyStatusValidation(status: string) {
    if (status === 'Pending') {
      this.courseForm.get('title')?.disable();
      this.courseForm.get('category')?.disable();
      this.courseForm.get('level')?.disable();
      this.courseForm.get('syllabus')?.disable();
      this.courseForm.get('credits')?.disable();
      this.courseForm.get('enrollmentLimit')?.disable();
      this.courseForm.get('visibility')?.disable();
    }
    else if (status === 'Approved') {
      this.courseForm.get('title')?.disable();
      this.courseForm.get('syllabus')?.disable();
      this.courseForm.get('enrollmentLimit')?.disable();
      this.courseForm.get('visibility')?.disable();
      this.courseForm.get('category')?.disable();
      this.courseForm.get('level')?.disable();
      this.courseForm.get('duration')?.disable();
      this.courseForm.get('prerequisites')?.disable();
      this.courseForm.get('learningObjectives')?.disable();
      this.courseForm.get('targetAudience')?.disable();
    }
  }

  goBack(): void {
    if(this.courseStatus == null || this.courseStatus == '')
      this.router.navigate(['/instructor-courses']);
    else{
      if(this.courseStatus == 'Draft')
         this.router.navigate(['/instructor-courses/drafts']);
      else if(this.courseStatus == 'Pending')
        this.router.navigate(['/instructor-courses/pending']);
      else if(this.courseStatus == 'Approved')
        this.router.navigate(['/instructor-courses/approved']);
      else if(this.courseStatus == 'Rejected')
        this.router.navigate(['/instructor-courses/rejected']);
      else
        this.router.navigate(['/instructor-courses']);
    }
  }

  onSubmit(): void {
    const course = new FormData();

    Object.entries(this.courseForm.getRawValue()).forEach(([key,value]) => {
      if(key != 'thumbnail' && key != 'createdAt' && key != 'updatedAt' && key != 'credits')
        course.append(key, value == null ? "" : value.toString());
    })

    if (this.selectedThumbnail)
      course.append('thumbnail', this.selectedThumbnail);

     for (const [key, value] of course.entries()) {
    console.log(key, value);
    }

    this.courseService.updateCourse(this.courseId, course).subscribe({
      next: () => {
        Swal.fire('Success!', 'Course edited successfully ', 'success');
        this.router.navigate(['/instructor-courses']);
      },
      error: (err) => Swal.fire('Failed!', 'Failed to edit the course' + err.error(), 'error')
    })
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
