import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class ProcessTypeService 
{
	constructor(private httpClient: HttpClient) { }

	get_process_types()
	{
		return new Promise<{ id: number, desc: string, is_active: boolean }[]>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_TYPE_OF_PROCESS, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	create_process_type(ptype: string)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_TYPE_OF_PROCESS, {}, 
			{
				params : (new HttpParams()).set("ptype", ptype), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	enable_disable_process_type(_id: number, is_enable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_TYPE_OF_PROCESS, {}, 
			{
				params : (new HttpParams()).set("_id", _id).set("is_enable", is_enable), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}
}
