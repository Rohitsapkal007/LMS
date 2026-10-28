import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class EnrollmentServices{
    private apiUrl = environment.apiUrl + '/api/enrollment'

    constructor(private http: HttpClient){}

    enrollInCourse(course: number) : Observable<Response>
    {
        return this.http.post<Response>(`${this.apiUrl}`, course);
    }
}