import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserServices } from '../../../services/user.services';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ɵInternalFormsSharedModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users$!: Observable<User[]>;
  pendingChanges: any[] = [];
  filterForm = new FormGroup({
    userName : new FormControl('',[]),
    email : new FormControl('',[]),
    role : new FormControl('',[]),
    isActive : new FormControl('',[]),
  })
  constructor(private userServices: UserServices) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.userServices.getUsers().pipe(
      catchError(err => {
        Swal.fire('Error!', 'Failed while  fetching users: ' + err.error , 'error')
        return of([]);
      }));
  }

  changeRole(userId: number, role: string): void {
    const existing = this.pendingChanges.find(c => c.id === userId);
    if (existing) { existing.role = role; }
    else this.pendingChanges.push({ id: userId, role: role, isActive: undefined })
  }

  toggleStatus(userId: number, active: boolean): void {
    const existing = this.pendingChanges.find(c => c.id === userId)
    if (existing) existing.isActive = active
    else this.pendingChanges.push({ id: userId, role: undefined, isActive: active })
  }



  deleteRole(userId: number): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userServices.deleteUser(userId).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'User Deleted Successfully.', 'success');
          this.loadUsers();
        },
        error: err =>  Swal.fire('Error!', 'Failed to Delete changes: ' + err.error , 'error')
      });
    }
  }

  saveChange(): void {
    if (this.pendingChanges.length === 0) {
      Swal.fire('NoChange!', 'No changes to save', 'warning')
      return;
    }

    this.userServices.bulkUpdateUser(this.pendingChanges).subscribe({
      next: () => {
        Swal.fire('Saved!', 'Changes saved successfully.', 'success');
        this.pendingChanges = [];
        this.loadUsers();
      },
      error: (err) => {  Swal.fire('Error!', 'Failed to save changes: ' + err.error , 'error')}
    });
  }

  applyFilter():void{
    const {email, isActive, role, userName} = this.filterForm.value;
    this.users$! = this.userServices.getUsers().pipe(
      map(users => users.filter(u => 
      (userName ? u.userName.toLowerCase().includes(userName.toLowerCase()) : true) &&
      (isActive !=='' ? u.isActive === (isActive === 'true') : true) &&
      (email ? u.email.toLowerCase().includes(email.toLowerCase()) : true) &&
      (role ? u.role === role : true)
      ))
    )
  }

  resetFilter():void{
    this.filterForm.reset({
      userName : '',
      isActive : '',
      email : '',
      role : ''
    })
    this.loadUsers();
  }
}
