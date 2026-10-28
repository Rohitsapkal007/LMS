import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl, FormBuilder, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CustomMapperService } from '../../services/customMapper.service';
import { Response } from '../../models/Response.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.scss',
})

export class Register {
  
   registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required,  Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('',[Validators.required]),
    role: new FormControl('Student', [Validators.required, this.allowedRolesvalidator])
   }, {validators: this.passwordMatchValidator});

   constructor(private router: Router, private authService: AuthService, private customMapperService: CustomMapperService){}

   passwordMatchValidator(control: AbstractControl){
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return  password && confirmPassword && password === confirmPassword ? null : { mismatch: true };
   }

   allowedRolesvalidator(control: AbstractControl){
      const allowedRoles = ['Student', 'Instructor', 'Admin']
      return allowedRoles.includes(control.value) ? null : { invalidRole : true}
   }

   onSubmit() {
    if(this.registerForm.valid){

      this.authService.register(this.customMapperService.toRegisterPayload(this.registerForm.value)).subscribe({
        next: (res : Response) => {
          alert(res.message);
          this.goToLogin();
        },
        error: (err) => {
          alert(err.error);
        }
      });
    }
   }

   goToLogin() {
    this.router.navigate(['/login']);
   }


}
