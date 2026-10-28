import { booleanAttribute, Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../../core/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
})
export class Header {
  isLoggedIn$! : Observable<boolean>;
  role$! : Observable<string | null>;

  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit()
  {
    this.isLoggedIn$ = this.authService.loggedIn$;
    this.role$ = this.authService.role$;

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
