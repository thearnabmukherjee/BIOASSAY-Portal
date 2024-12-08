import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';
import { Divisions } from '../Classes/Divisions';

@Injectable({
	providedIn: 'root'
})
export class DivisionService 
{
	constructor(private httpClient: HttpClient) { }

	get_divisions()
	{
		return new Promise<{ isError: boolean, msg: Divisions[] | string }>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_FORWARD_DIVISIONS_URL, { withCredentials: true }).toPromise().
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

	create_new_division(abbr: string, desc: string)
	{
		return new Promise<{isError: boolean, msg: any}>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_FORWARD_DIVISIONS_URL, 
			{  
				abbr: abbr,
				description: desc
			}, { withCredentials: true }).toPromise().
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
