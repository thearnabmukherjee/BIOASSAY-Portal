import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from './../Classes/AppSettings';
import { UsersService } from './users.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService 
{
	subLoginState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	subUserInfo: BehaviorSubject<{ id: number, username: string, first_name: string, last_name: string, roles: string[] } | null> = new BehaviorSubject<{ id: number, username: string, first_name: string, last_name: string, roles: string[] } | null>(null);
	
	constructor(private httpClient: HttpClient,
				private userService: UsersService) { }

	check_if_logged_in(): Promise<void>
	{
		return new Promise<void>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_PING_URL, { withCredentials: true }).toPromise().
			then((res: any)=> 
			{
				this.subLoginState.next(true);
				resolve();
			}).
			catch((e)=> 
			{
				this.subLoginState.next(false);
				reject(e);
			});
		});
	}

	get_valid_auth_state()
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_VALID_AUTH_STATE_URL, 
			{ 
				withCredentials: true 
			}).toPromise().
			then((res: any)=> 
			{
				resolve(res);
			}).
			catch((e)=> 
			{
				reject(e);
			});
		});
	}

	refresh_tokens(): Promise<void>
	{
		return new Promise<void>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_REFRESH_TOKEN_URL, { withCredentials: true }).toPromise().
			then((res: any)=> 
			{
				if(res.isError)
				{
					this.subLoginState.next(false);
					reject(res.msg);
				}
				else
				{
					this.subLoginState.next(true);
					resolve();
					this.fetch_user_info();
				}
			}).
			catch((e)=> 
			{
				this.subLoginState.next(false);
				reject(e);
			});
		});
	}

	are_tokens_valid(): Promise<void>
	{
		return new Promise<void>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_ARE_TOKENS_VALID, { withCredentials: true }).toPromise().
			then((res: any)=> 
			{
				this.subLoginState.next(true);
				resolve();
			}).
			catch((e)=> 
			{
				this.subLoginState.next(false);
				reject(e);
			});
		});
	}

	submit_auth_code(code: string, state: string): Promise<void>
	{
		return new Promise<void>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_SUBMIT_AUTH_CODE_URL, 
			{ 
				params: (new HttpParams()).set("code", code).set("state", state),
				withCredentials: true 
			}).toPromise().
			then((res: any)=> 
			{
				this.subLoginState.next(true);
				resolve();
			}).
			catch((e)=> 
			{
				this.subLoginState.next(false);
				reject(e);
			});
		});
	}

	logout()
	{
		return new Promise<void>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_LOGOUT_URL, { withCredentials: true }).toPromise().
			then((res: any)=> 
			{ 
				this.subLoginState.next(false);
				this.subUserInfo.next(null);
				resolve();
			}).
			catch((e)=> reject(e));
		});
	}

	get_info_observable()
	{
		return this.subUserInfo.asObservable();
	}

	fetch_user_info()
	{
		return new Promise<{ id: number, username: string, first_name: string, last_name: string, roles: string[] }>((resolve, reject)=> 
		{
			this.userService.get_my_info().then((res)=> 
			{ 
				this.subUserInfo.next(res); resolve(res)
			}).catch((e)=> 
			{ 
				console.log(e); 
				reject(e); 
			});
		});
	}
}
