import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class PlantService 
{
	constructor(private httpClient: HttpClient) { }

	get_plants()
	{
		return new Promise<{isError: boolean, msg: any}>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_FORWARD_PLANTS_URL, { withCredentials: true }).toPromise().
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

	create_new_plant(plant_name: string, plant_location: string, is_strategic: boolean)
	{
		return new Promise<{isError: boolean, msg: any}>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_FORWARD_PLANTS_URL, 
			{  
				name: plant_name,
				plocation: plant_location,
				is_strategic: is_strategic
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
