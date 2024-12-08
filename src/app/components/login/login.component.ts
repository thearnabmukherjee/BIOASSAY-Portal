import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { AppSettings } from './../../Classes/AppSettings';
import { Message } from './../../Classes/Message';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit 
{
	is_checking = true;

	constructor(private authService: AuthService,
				private router: Router) { }

	ngOnInit()
	{
		this.is_checking = true;
		this.authService.check_if_logged_in().then((_)=> 
		{
			this.authService.are_tokens_valid().then((_)=>
			{
				this.is_checking = false;
				this.router.navigateByUrl('home-page');
			}).catch((e)=> { console.log(e); this.is_checking = false; });
		}).catch((e)=> { console.log(e); this.is_checking = false;});
	}

	async login()
	{
		let state: string = "";
		try
		{
			let res = await this.authService.get_valid_auth_state();
			if(res.isError)
			{
				await Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				state = res.msg;
			}
		}
		catch(e)
		{
			console.log(e);
			await Message.show_message("Failure", "Failed to load auth state. This seems to be connection error. Please try again", true);
			return;
		}
		finally
		{
			this.is_checking = false;
		}

		let arrComponents: string[]= [];
		arrComponents.push(`${encodeURIComponent("response_type")}=${encodeURIComponent("code")}`);
		arrComponents.push(`${encodeURIComponent("client_id")}=${encodeURIComponent(AppSettings.RRBA_CLIENT_ID)}`);
		arrComponents.push(`${encodeURIComponent("redirect_uri")}=${encodeURIComponent(AppSettings.OAUTH_REDIRECT_URI)}`);
		arrComponents.push(`${encodeURIComponent("state")}=${encodeURIComponent(state)}`);
		let external_scopes = [
			"pd.list",
			"pd.create",
			"pd.modify",
			"div.list",
			"div.create",
			"div.modify",
			"plant.list",
			"plant.create",
			"plant.modify",
			"tld.list",
			"tld.create",
			"tld.modify",
			"pd.photo.download",
			"openid"
		];
		let final_external_scope = AppSettings.IDS_PORTAL_CLIENT_ID + "::" + external_scopes.join(":");
		arrComponents.push(`${encodeURIComponent("scope")}=${encodeURIComponent(final_external_scope + " openid")}`);
		let url = AppSettings.OAUTH_AUTHORIZE_URL + "?" + arrComponents.join("&");
		window.location.href = url;
	}
}
