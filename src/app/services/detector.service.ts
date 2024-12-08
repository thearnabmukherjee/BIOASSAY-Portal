import { Detector } from './../Classes/Detector';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class DetectorService 
{
	constructor(private httpClient: HttpClient) { }

	get_detectors(instrument_id: number)
	{
		return new Promise<Detector[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_DETECTOR, { params: (new HttpParams()).set("instrument_id", instrument_id), withCredentials: true }).toPromise().
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

	create_detector(name: string, instrument_id: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_DETECTOR, {}, 
				{ 
					params: (new HttpParams())
							.set("name", name)
							.set("instrument_id", instrument_id), 
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

	enable_disable_detector(detector_id: number, isEnable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_DETECTOR, {}, 
			{ 
				params: (new HttpParams())
						.set("detector_id", detector_id)
						.set("is_enable", isEnable), 
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
