import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EnrolledCourses } from "../shared/models/enrolledCourses";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environments";
import { EnrolledStudent, Enrollment } from "../shared/models/enrollment.model";

@Injectable({ providedIn: 'root' })

export class enrollmentQueryService {
    private apiUrl = environment.apiUrl + '/api/enrollment'
    constructor(private http: HttpClient) { }

    getEnrolledCourse(): Observable<EnrolledCourses[]> {
        return this.http.get<EnrolledCourses[]>(`${this.apiUrl}/student`);
    }

    getEnrollmenData(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/instructor`);
    }

    getEnrolledStudentDetails(courseId : number) : Observable<EnrolledStudent[]>
    {
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/view-students/${courseId}`)
    }

    exportEnrolledStudentData(courseId : number) : Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export-excel/${courseId}`, 
            {
                responseType: 'blob'
            }
        );
    }
}