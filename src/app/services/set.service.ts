import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';
import { MySet } from '../Classes/MySet';

@Injectable({
	providedIn: 'root'
})
export class SetService 
{
	constructor(private httpClient: HttpClient) { }

	get_sets(mon_id: number)
	{
		return new Promise<MySet[]>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_SET, 
			{ 
				params: (new HttpParams()).set("mon_id", mon_id),
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

	create_set(name: string, comments: string, mon_id: number, arrCalc: number[])
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_SET, 
			{
				name: name,
				comments: comments,
				mon_id: mon_id,
				arrCalc: arrCalc
			}, 
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

	enable_disable_set(set_id: number, is_active: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_SET, 
			{
				set_id: set_id,
				is_active: is_active
			}, 
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
}
