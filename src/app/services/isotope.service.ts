import { Isotope } from './../Classes/Isotope';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class IsotopeService
{
    constructor(private httpClient: HttpClient) { }

    get_isotopes(nuclide_id: number)
    {
        return new Promise<Isotope[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_ISOTOPE, { params: (new HttpParams()).set("nuc_id", nuclide_id), withCredentials: true }).toPromise().
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

	manage_isotope(isotope_id: number, name: string, is_tracer: boolean, half_life: number, specific_activity: number)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_ISOTOPE, {}, 
				{ 
					params: (new HttpParams())
					.set("isotope_id", isotope_id) 
					.set("name", name)
					.set("is_tracer", is_tracer)
					.set("half_life", half_life)
					.set("specific_activity", specific_activity), 
					withCredentials: true 
				}).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	enable_disable_isotope(isotope_id: number, is_enable: boolean)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.delete(AppSettings.SERVER_ISOTOPE, 
				{ 
					params: (new HttpParams())
					.set("isotope_id", isotope_id) 
					.set("is_enable", is_enable), 
					withCredentials: true 
				}).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	create_new_isotope(name: string, nuc_id: number, is_tracer: boolean, half_life: number, specific_activity: number)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_ISOTOPE, 
			{
				name: name,
				nuc_id: nuc_id,
				is_tracer: is_tracer,
				half_life:half_life,
				specific_activity: specific_activity
			}, 
			{ withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}
} 