import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class WorkerService 
{
	constructor(private httpClient: HttpClient) { }

	get_personal_details(page_num: number = 0, search_val: string = "")
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_PERSONAL_DEAILS, 
			{ 
				params: (new HttpParams()).set("page_num", page_num).set("search_val", search_val), 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	get_personal_details_of_worker(person_id: number)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_SINGLE_PERSONAL_DEAILS, 
			{ 
				params: (new HttpParams()).set("person_id", person_id),
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}

	create_personal_details(name: string, empno: string, dob: string, doj: string, firm_name: string, gender: string, is_worker: boolean, photo: string, remarks: string | null = null, fingerprints: string | null = null)
	{
		return new Promise<{ isError: boolean, msg: any }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_SINGLE_PERSONAL_DEAILS, 
			{
				name: name,
				empno: empno,
				dob: dob,
				doj: doj,
				firm_name: firm_name,
				gender: gender,
				fingerprints: fingerprints,
				is_worker: is_worker ? "T" : "F",
				photo: photo,
				remarks: remarks
			},
			{ 
				withCredentials: true 
			}).toPromise().then((res)=>
			{
				resolve(<any>res);
			}).catch((e)=> reject(e));
		});
	}
}
