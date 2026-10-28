import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Response } from '../../models/Response.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class Login {

  constructor(private authService: AuthService, private router: Router){}


  loginForm = new FormGroup({
    userName : new FormControl('', [Validators.required, Validators.minLength(3)]) ,
    password : new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  onLogin() {
    if(this.loginForm.valid)
    {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          alert(err.error);
        }
      })
    }
  }

}
