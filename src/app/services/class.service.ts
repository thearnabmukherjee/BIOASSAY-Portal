import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class ClassService 
{

	constructor(private httpClient: HttpClient) { }

	get_classes()
	{
		return new Promise<{ id: number, name: string }[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_CLASS, { withCredentials: true }).toPromise().
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

	create_new_class(name: string)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_CLASS, {}, { params: (new HttpParams()).set("name", name), withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}
}
