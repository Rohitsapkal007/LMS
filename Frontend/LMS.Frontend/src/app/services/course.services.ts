import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Course } from '../shared/models/course.model';
import { CoursesbyStatus } from '../shared/models/CoursesbyStatus.model';
import { Response } from '../models/Response.model';

@Injectable({
  providedIn: 'root',
})
export class CourseServices {
  private apiUrl = environment.apiUrl + '/api/courses';

  constructor(private http: HttpClient) {}
  
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
  
  getCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }
  
  createCourse(course: FormData): Observable<Response> {
    return this.http.post<Response>(`${this.apiUrl}`, course);
  }
  
  updateCourse(courseId: number, course: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${courseId}`, course);
  }
  
  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`);
  }

  getCoursesbyStatus(status: string) : Observable<CoursesbyStatus[]>{
    return this.http.get<CoursesbyStatus[]>(`${this.apiUrl}/courses?status=${status}`,);
  }

  getInstructorCoursesbyStatus(status: string) : Observable<CoursesbyStatus[]>{
    return this.http.get<CoursesbyStatus[]>(`${this.apiUrl}/instructor-courses?status=${status}`,);
  }

  UpdateCoursesStatustoDraft(courseId: number) : Observable<void>
  {
    return this.http.patch<void>(`${this.apiUrl}/${courseId}/draft`,{})
  }

  UpdateCoursesStatustoPending(courseId: number) : Observable<void>
  {
    return this.http.patch<void>(`${this.apiUrl}/${courseId}/pending`,{})
  }

  UpdateCoursesStatustoApprove(courseId: number) : Observable<void>
  {
    return this.http.patch<void>(`${this.apiUrl}/${courseId}/approve`,{})
  }

  UpdateCoursesStatustoReject(courseId: number) : Observable<void>
  {
    return this.http.patch<void>(`${this.apiUrl}/${courseId}/reject`,{})
  }
  
  UpdateCoursesStatustoDeactive(courseId: number) : Observable<void>
  {
    return this.http.patch<void>(`${this.apiUrl}/${courseId}/deactive`,{})
  }

  uploadVideo(courseId:number, formData: FormData)
  {
    return this.http.post(`${this.apiUrl}/${courseId}/videos`, formData);
  }

  uploadResource(courseId:number, formData: FormData)
  {
    return this.http.post(`${this.apiUrl}/${courseId}/resources`, formData);
  }

  deleteVideo(courseId:Number)
  {

  }

  deleteResource(courseid:number)
  {

  }


}
