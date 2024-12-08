import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class IntakerouteService 
{
	constructor(private httpClient: HttpClient) { }

	get_intake_routes()
	{
		return new Promise<{ id: number, name: string }[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_INTAKE_ROUTE, { withCredentials: true }).toPromise().
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

	create_new_intake_route(route: string)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_INTAKE_ROUTE, {}, { params: (new HttpParams()).set("name", route), withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}
}
