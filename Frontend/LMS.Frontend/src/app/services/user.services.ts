import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  private apiUrl = environment.apiUrl + '/api/users';

 constructor(private http: HttpClient) {}

 getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  updateUser(userId: number, user: User): Observable<User> {
    
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }

  bulkUpdateUser(pendingChanges:any[])
  {
    return this.http.put<User>(`${this.apiUrl}/manage-users`, pendingChanges);
  }
  
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
