import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class H10Service 
{
	constructor(private httpClient: HttpClient) { }

	search_10H_forms(search_val: string, page_num: number, form_type: string = "", start_date_time: string = "", end_date_time: string = "")
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_10H_FORMS, 
			{ 
				params: (new HttpParams())
							.set("search_val", search_val)
							.set("page_num", page_num)
							.set("form_type", form_type)
							.set("start_date_time", start_date_time)
							.set("end_date_time", end_date_time), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	get_last_10H_of_person(person_id: number)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_LAST_10H_FORM, 
			{ 
				params: (new HttpParams()).set("person_id", person_id), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	get_10H_of_person(person_id: number, page_num: number = 0)
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_WORKER_10H_FORMS, 
			{ 
				params: (new HttpParams()).set("person_id", person_id).set("page_num", page_num), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	get_specific_10H_form(form_id: number)
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_10H_FORM, 
			{ 
				params: (new HttpParams()).set("form_id", form_id), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	create_10H_form(form_data: any)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_10H_FORM, form_data, 
			{ 
				withCredentials: true 
			}).toPromise().then((res)=> resolve(<any>res)).catch((e)=> reject(e));
		});
	}

	modify_10H_form(form_id: number, form_data: any)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_10H_FORM, form_data, 
			{
				params: (new HttpParams()).set("form_id", form_id), 
				withCredentials: true 
			}).toPromise().then((res)=> resolve(<any>res)).catch((e)=> reject(e));
		});
	}

	accept_10h_form(form_id: number, data : { sample_vol: number, sample_wt: number, remarks: string, received_on: string })
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_MONITORING, data, 
			{
				params: (new HttpParams()).set("form_id", form_id), 
				withCredentials: true 
			}).toPromise().then((res)=> resolve(<any>res)).catch((e)=> reject(e));
		});
	}

	reject_10h_form(form_id: number, reason: string)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_REJECT_10H_FORM, {}, 
			{
				params: (new HttpParams()).set("form_id", form_id).set("reason", reason), 
				withCredentials: true 
			}).toPromise().then((res)=> resolve(<any>res)).catch((e)=> reject(e));
		});
	}

	sample_spoiled_form(form_id: number)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_SAMPLE_SPOILED_10H_FORM, {}, 
			{
				params: (new HttpParams()).set("form_id", form_id), 
				withCredentials: true 
			}).toPromise().then((res)=> resolve(<any>res)).catch((e)=> reject(e));
		});
	}

	get_pdf(form_id: number)
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_10H_PRINT, 
			{ 
				params: (new HttpParams()).set("form_id", form_id), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}
}
