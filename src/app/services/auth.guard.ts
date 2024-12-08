import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate 
{
	private isAuthenticated = false;

	constructor(private authService: AuthService)
	{
		this.authService.subLoginState.subscribe((v)=> this.isAuthenticated = v);
	}

	canActivate(route: ActivatedRouteSnapshot,
				state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
	{
		if(this.isAuthenticated)
			return true;
		else
			return new Promise<boolean>((resolve, _)=> 
			{
				this.authService.check_if_logged_in().then(()=> 
				{
					this.authService.are_tokens_valid().then(()=> 
					{
						resolve(true);
					}).catch((e)=> resolve(false));
				}).catch((e)=> resolve(false));
			});
	}
}
