import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { Response } from "../../models/Response.model";
import { routes } from "../../app.routes";

@Injectable({providedIn : 'root',})

export class AuthService{
    private apiUrl = environment.apiUrl + '/api/auth';
    private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    loggedIn$ = this.loggedIn.asObservable();

    private role = new BehaviorSubject<string | null>(this.getRole());
    role$ = this.role.asObservable();

    constructor(private http: HttpClient){}

    login(data:any)
    {
        return this.http.post(`${this.apiUrl}/login`,data).pipe(tap((res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('isLoggedIn', 'true');
            this.loggedIn.next(true);
            this.role.next(this.getRole());
        }));
    }

    register(data: any) : Observable<Response>
    {
        return this.http.post<Response>(`${this.apiUrl}/register`, data);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        const token = this.getToken();
        if(!token) return null;
        const decoded: any = jwtDecode(token);
        return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }

    logout()
    {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        this.loggedIn.next(false);
        this.role.next(null);
    }
}
