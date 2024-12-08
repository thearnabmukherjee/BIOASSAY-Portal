import { Message } from './Classes/Message';
import { AuthService } from './services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription, timer } from 'rxjs';
import { AppSettings } from './Classes/AppSettings';
import { UsersService } from './services/users.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
	title = 'Bioassay';
	private subLoginState : any = null;
	is_logged_in = false;
	private subRefresh: Subscription | null = null;
	private subBlockScroll: Subscription | null = null;

	my_info: { id: number, username: string, first_name: string, last_name: string, roles: string[] } | null = null;

	constructor(private authService: AuthService,
				private router: Router){}
	
	
	ngOnInit()
	{
		//
		//	App logins or logout explicitly
		//
		this.subLoginState = this.authService.subLoginState.subscribe((v)=> 
		{
			this.is_logged_in = v;
			// if(v)
			// 	if(this.subIrritate != null)
			// 	{
			// 		this.subIrritate?.unsubscribe();
			// 		this.subIrritate = null;
			// 	}
		});

		//
		//	Got user info
		//
		this.subRefresh = this.authService.get_info_observable().subscribe((data)=> 
		{
			this.my_info = data;
		});

		//
		//	Check if logged in
		//
		this.authService.check_if_logged_in().then(()=> 
		{
			this.authService.fetch_user_info();
		}).catch((e)=> console.log(e));

		//
		//	Block scroll for modals
		//
		this.subBlockScroll = AppSettings.subjectBlockScroll.subscribe((v)=> 
		{
			document.body.scrollTop = 0; 				// For Safari
			document.documentElement.scrollTop = 0; 	// For Chrome, Firefox, IE and Opera
			let ele = document.getElementById("bioassay_html");
			if(v)
			{
				ele?.classList.add('is-clipped');
			}
			else
			{
				ele?.classList.remove('is-clipped');
			}
		});
	}

	goto_profile_page()
	{
		window.location.href = AppSettings.OAUTH_SSO_PROFILE_URL;
	}

	goto_change_password_page()
	{
		window.location.href = AppSettings.OAUTH_SSO_CHANGE_PASSWORD_URL;
	}

	goto_signup_page()
	{
		window.location.href = AppSettings.OAUTH_SSO_REGISTER_URL;
	}

	goto_forgot_password_page()
	{
		window.location.href = AppSettings.OAUTH_SSO_FORGOT_PASSWORD_URL;
	}

	logout()
	{
		this.authService.logout().then(()=> {}).catch((e)=> console.log(e))
		.finally(()=> 
		{ 
			let arrComponents: string[]= [
				`${encodeURIComponent("client_id")}=${encodeURIComponent(AppSettings.RRBA_CLIENT_ID)}`,
				`${encodeURIComponent("redirect_uri")}=${encodeURIComponent(AppSettings.MY_LOGIN_PAGE)}`
			];
			window.location.href = AppSettings.OAUTH_CONFIRM_LOGOUT_URI + "?" + arrComponents.join("&");
		});
	}
	

	ngOnDestroy()
	{
		this.subLoginState.unsubscribe();
		if(this.subRefresh != null)
		{
			this.subRefresh.unsubscribe();
			this.subRefresh = null;
		}
		if(this.subBlockScroll != null)
		{
			this.subBlockScroll.unsubscribe();
			this.subBlockScroll = null;
		}
		// if(this.subIrritate != null)
		// {
		// 	this.subIrritate?.unsubscribe();
		// 	this.subIrritate = null;
		// }
	}

	has_any_role(roles: string[])
	{
		if(this.my_info == null)
			return false;
		let isExists = false;
		roles.forEach((r)=> 
		{
			if(this.my_info?.roles.includes(r))
				isExists = true;
		});
		return isExists;
	}
}
