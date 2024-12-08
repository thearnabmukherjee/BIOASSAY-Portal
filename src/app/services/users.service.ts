import { AppSettings } from './../Classes/AppSettings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UsersService 
{
	constructor(private httpClient: HttpClient) { }

	get_users_roles()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_USER_ACCOUNTS_ROLES, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	get_my_info()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_MY_INFO, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	change_role(user_id: number, roles: string[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_USER_ACCOUNTS_ROLES, 
			{
				"user_id": user_id,
				"arrRoles": roles
			}, { withCredentials: true }).toPromise().then((res)=> resolve(<any>res))
			.catch((e)=> reject(e));
		});
	}

	get_users()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_GET_USERS, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	get_plant_hp_bindings()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_PLANT_HP_BINDING, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	change_plant_assignment(user_id: number, arrPlantIds: number[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_PLANT_HP_BINDING, 
			{
				"hp_id": user_id,
				"plant_ids": arrPlantIds
			}, { withCredentials: true }).toPromise().then((res)=> resolve(<any>res))
			.catch((e)=> reject(e));
		});
	}



	get_plant_rv_bindings()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_PLANT_RV_BINDING, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	change_rv_plant_assignment(user_id: number, arrPlantIds: number[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_PLANT_RV_BINDING, 
			{
				"rv_id": user_id,
				"plant_ids": arrPlantIds
			}, { withCredentials: true }).toPromise().then((res)=> resolve(<any>res))
			.catch((e)=> reject(e));
		});
	}


	get_division_dh_bindings()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_DIVISION_DH_BINDING, { withCredentials: true }).toPromise().then((res)=>
			{
				resolve(res);
			}).catch((e)=> reject(e));
		});
	}

	change_division_dh_assignment(user_id: number, arrDivIds: number[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_DIVISION_DH_BINDING, 
			{
				"user_id": user_id,
				"lstDivs": arrDivIds
			}, { withCredentials: true }).toPromise().then((res)=> resolve(<any>res))
			.catch((e)=> reject(e));
		});
	}



	get_previous_monitoring_date(person_id: number)
	{
		return new Promise<string>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_LAST_MONITORING_DATE, { params: (new HttpParams()).set("person_id", person_id), withCredentials: true }).toPromise().then((res)=>
			{
				resolve(<string>res);
			}).catch((e)=> reject(e));
		});
	}
}
