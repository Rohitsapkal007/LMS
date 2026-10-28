import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root'})

export class AuthGuard implements CanActivate{

    constructor(private authService:AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot) : boolean{
        const token = this.authService.getToken();
        const role = this.authService.getRole();
        if(token && role)
        {
            const expectedRole = route.data['role'];
            if(!expectedRole || role == expectedRole )
                 return true;
            
            this.router.navigate(['/login']);
            return false;
        }
        this.router.navigate(['/login']);
        return false;
    }
}