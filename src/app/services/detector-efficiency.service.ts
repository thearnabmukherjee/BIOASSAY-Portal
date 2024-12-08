import { DetectorEfficiency } from './../Classes/DetectorEfficiency';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class DetectorEfficiencyService 
{
	constructor(private httpClient: HttpClient) { }

	get_detector_efficiency_records()
	{
		return new Promise<DetectorEfficiency[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_DETECTOR_EFFICIENCY, { withCredentials: true }).toPromise().
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

	create_new_detector_efficiency_record(detector_id: number, source_id: number, counting_time: number, measured_counts: number, technique: string, efficiency: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_DETECTOR_EFFICIENCY, 
				{
					detector_id: detector_id,
					source_id: source_id,
					counting_time: counting_time,
					measured_counts: measured_counts,
					technique: technique,
					efficiency: efficiency
				}, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	enable_disable_detector_efficiency(record_id: number, is_enable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_DETECTOR_EFFICIENCY, { eff_id: record_id, is_enable: is_enable }, 
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
}
