import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class NuclideService 
{
	constructor(private httpClient: HttpClient) { }

	get_nuclides()
	{
		return new Promise<{ id: number, name: string }[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_NUCLIDE, { withCredentials: true }).toPromise().
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

	get_plant_nuclides(plant_id: number)
	{
		return new Promise<any>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_PLANT_NUCLIDE_BINDING, 
			{ 
				params: (new HttpParams()).set("plant_id", plant_id), 
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

	create_new_nuclide(name: string)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_NUCLIDE, { name: name }, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	change_plant_nuclide_assignment(plant_id: number, nuc_ids: number[])
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_PLANT_NUCLIDE_BINDING, 
			{ 
				nuc_ids: nuc_ids,
				plant_id: plant_id
			}, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}
}
