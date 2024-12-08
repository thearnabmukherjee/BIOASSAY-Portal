import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class TldService 
{
	constructor(private httpClient: HttpClient) { }

	get_tlds()
	{
		return new Promise<any>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_TLDS, { withCredentials: true }).toPromise().
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

	get_free_tlds()
	{
		return new Promise<any>((resolve, reject)=> 
		{
			this.get_tlds().then((res)=> 
			{
				if(res.isError)
					reject(res.msg);
				else
				{
					let arr = res.msg;
					let arrFree : {id: number, tld: string, plant_id: number}[] = [];
					for(let i = 0 ; i < arr.length; ++i)
						if(arr[i].plant <= 0)
							arrFree.push({ id: arr[i].id, tld: arr[i].name, plant_id: arr[i].plant });
					resolve(arrFree);
				}
			}).catch((e)=> reject(e));
		});
	}

	create_new_tld(tld: string, plant_id: number)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_TLDS, 
			{
				tld: tld,
				plant_id: plant_id
			}, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	assign_tld_to_plant(plant_id: number, tld_ids: number[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_TLDS, 
			{
				"plant_id": plant_id,
				"tld_ids": tld_ids
			}, { withCredentials: true }).toPromise().then((res)=> resolve(<any>res))
			.catch((e)=> reject(e));
		});
	}
}
