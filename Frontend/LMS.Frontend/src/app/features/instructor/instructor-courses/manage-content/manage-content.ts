import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ViewChild, ElementRef } from '@angular/core';
import { CourseServices } from '../../../../services/course.services';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-manage-content',
  styleUrl: './manage-content.scss',
  templateUrl: './manage-content.html',
})

export class ManageContent implements OnInit {
  @ViewChild('videoInput')
  videoInput!: ElementRef<HTMLInputElement>;

  @ViewChild('resourceInput')
  resourceInput!: ElementRef<HTMLInputElement>;

  courseid!: number;
  activeTab = 'videos';
  videoTitle: string = '';
  selectedVideo: File | null = null;
  selectedResource: File | null = null;
  videos: any[] = [];
  resources: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, 
    private cdr: ChangeDetectorRef, 
    private courseServices : CourseServices,
    private router: Router) { }

  ngOnInit(): void {
    this.courseid = Number(this.activatedRoute.snapshot.paramMap.get('courseId'));
  }

  get videoCount(): number {
    return this.videos.length;
  }

  get resourceCount(): number {
    return this.resources.length;
  }

  get canSubmit(): boolean {
    return this.videoCount > 0 &&
      this.resourceCount > 0;
  }

  onVideoSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedVideo = input.files[0];
    }
  }

  addVideo(): void {
    var videoLength = this.videos.length;
    const formData = new FormData();
    if (videoLength >= 1) {
      var video = this.videos.find(v => (v.title.toLowerCase() == this.videoTitle.toLowerCase() || v.fileName.toLowerCase() == this.selectedVideo?.name.toLowerCase()));
      if (video) {
        Swal.fire('validation', 'Duplicate title or fileName is not allowed', 'warning');
        return
      }
    }
    if (!this.videoTitle.trim()) {
      Swal.fire('validation', 'Lecture title is required', 'warning');
      return;
    }

    if (!this.selectedVideo) {
      Swal.fire('validation', 'Please select a video', 'warning');
      return;
    }

    this.videos.push({
      id: videoLength + 1,
      title: this.videoTitle,
      fileName: this.selectedVideo.name,
      file: this.selectedVideo
    });
 
    formData.append('title', this.videoTitle);
    formData.append('video', this.selectedVideo!);

    this.courseServices.uploadVideo(this.courseid, formData).subscribe({
      next: (response: any) => {
        this.resources.push(response);
        this.videoTitle = '';
        this.selectedResource = null;
        this.videoInput.nativeElement.value = '';

        Swal.fire('Success', 'Video uploaded Successfully', 'success');
      },
      error: err=> {
        Swal.fire('Failed', err.error , 'error' );
      }
    });
  }

  deleteVideo(videoId: number): void {
    if (this.videos.find(v => v.id == videoId)) {
      if (this.videos.length == 1) {
        Swal.fire('validation', 'Atleast one lecture is mandatory', 'warning');
      }
      else {
        Swal.fire({
          title: "Are you sure?",
          text: 'this video will be removed',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'yes',
          cancelButtonText: 'no',
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            this.videos = this.videos.filter(v => v.id != videoId);
            Swal.fire('Success', 'Video deleted successfully', 'success');
            this.cdr.markForCheck();
          }
        })
      }
    }
    else {
      Swal.fire('Invalid', 'Delete action is not present for this lecture', 'warning');
    }
  }

  onResourceSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedResource = input.files[0];
    }
  }

  addResource(): any {
    const formData = new FormData();
    var length = this.resources.length;
    if (length >= 1) {
      var video = this.resources.find(v => v.fileName.toLowerCase() == this.selectedResource?.name.toLowerCase());
      if (video) {
        Swal.fire('Validation', 'Duplicate fileName is not allowed', 'warning');
        return;
      }
    }

    if (!this.selectedResource) {
      Swal.fire('Validation', 'Please select the file before upload', 'warning');
      return;
    }

    formData.append('resource', this.selectedResource!)

    this.courseServices.uploadResource(this.courseid, formData).subscribe({
      next: (response:any) => {
        this.resources.push(response);

        this.selectedResource = null;
        this.resourceInput.nativeElement.value = '';
        Swal.fire('Success', 'Video uploaded successfully', 'success');
      },
      error: err => {
        Swal.fire('Failed', err.error, 'error');
      }
    }) 
  }

  deleteResourse(resourceId: number): void {
    if (this.resources.length > 0) {
      if (this.resources.find(r => r.id == resourceId)) {
        if (this.resources.length == 1) {
          Swal.fire('validator', 'Atleast one resource must be present', 'warning');
          return;
        }
        else {
          Swal.fire({
            title: "Are you sure?",
            text: 'this resource will be removed',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'yes',
            cancelButtonText: 'no',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
          }).then((result) => {
            if (result.isConfirmed) {
              this.resources = this.resources.filter(r => r.id != resourceId);
              Swal.fire('Success', 'Resource deleted successfully', 'success');
              this.cdr.markForCheck();
            }
          });
        }
      }
      else {
        Swal.fire('Validator', 'Delete option is not available for this resource', 'warning');
        return;
      }
    }

  }

  submitForApproval(): void {
    this.courseServices.UpdateCoursesStatustoPending(this.courseid).subscribe({
          next: ()=>{
            Swal.fire('Success!', 'Course Submitted for approval','success');
            this.router.navigate(['instructor-courses']);
            this.cdr.markForCheck();
          },
          error: () => Swal.fire('Failed!', 'Failed to Submit the Course for approval', 'error')
        })
  }
}
