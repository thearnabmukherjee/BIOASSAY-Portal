import { Background } from './../Classes/Background';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class BackgroundService 
{
	constructor(private httpClient: HttpClient) { }

	get_backgrounds(bkg_id: number = 0)
	{
		return new Promise<Background[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_BACKGROUND, { params: (new HttpParams()).set("bkg_id", bkg_id), withCredentials: true }).toPromise().
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

	create_new_background(name: string, detector_id: number, isotope_id: number, technique: string, counting_time: number, counts: number)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_BACKGROUND, 
				{
					name: name,
					detector_id: detector_id,
					isotope_id: isotope_id,
					technique: technique,
					counting_time: counting_time,
					counts: counts
				}, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	enable_disable_background_record(record_id: number, is_enable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_BACKGROUND, { bkg_id: record_id, is_enable: is_enable }, { withCredentials: true }).toPromise().
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
