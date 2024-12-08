import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class MonitoringService 
{
	constructor(private httpClient: HttpClient) { }

	get_monitorings(person_id: number, form_id: number, created_by : number, page_num: number = 0, mon_id: number = 0)
	{
		return new Promise<any>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_MONITORING, 
			{ 
				params : (new HttpParams()).set("person_id", person_id).set("form_id", form_id).set("creater", created_by).set("page_num", page_num).set("mon_id", mon_id),
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

	get_matching_monitorings(lstFormIds: number[])
	{
		return new Promise<{id: number, sample_no: string, sample_vol?: number, sample_weight?: number, received_on: string, remarks: string, form_id?: number, person_id?:number, person_name: string, monitored_on: string, created_on: string, created_by_name: string}[]>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_MONITORING, { lstForms: lstFormIds },
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

	get_sample_numbers(lstFormIds: number[])
	{
		return new Promise<{form_id: number, sample_no: string}[]>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_SAMPLE_NUMBERS, { lstForms: lstFormIds },
			{ 
				withCredentials: true 
			}).toPromise().
			then((res: any)=> 
			{
				resolve(<{form_id: number, sample_no: string}[]>res);
			}).
			catch((e)=> 
			{
				reject(e);
			});
		});
	}

	get_monitoring_types()
	{
		return new Promise<string[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_MONITORING_TYPES, 
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

	mark_repeat_monitoring(form_id: number, reason: string, duration_comments: string = "")
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_10H_REPEAT_MONITORING, 
			{
				form_id: form_id,
				reason: reason,
				duration_comments: duration_comments
			}, 
			{ 
				//params: (new HttpParams()).set("form_id", form_id).set("reason", reason),
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
