import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class LFCalculationService 
{
	constructor(private httpClient: HttpClient) { }

	save_calculate_LF_result(mon_id: number, 
							 nuc_id: number, 
							 detector_id: number, 
							 name: string,
							 comments: string,
							 isCFM: boolean,
							 analysis_vol: number,
							 sample_vol: number,
							 specific_activity: number,
							 recovery_percent: number,
							 total_volume: number,
							 analysis_date: string,
							 arrReadingAbs: number[],
							 arrReadingSD: number[],
							 sample_collection_duration: number,
							 is_BDL: boolean = false,
							 previous_activity: number = 0,
							 previous_activity_error: number = 0,
							 is_insert_in_db: boolean = false)
	{
		return new Promise<{isError: boolean, msg: string, id?: number, activity?: number, activity_error?: number}>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_LF_CALCULATE, 
			{  
				data: 
				{
					mon_id: mon_id,
					nuc_id: nuc_id,
					det_id: detector_id,
					name: name,
					comments: comments,
					analysis_vol: analysis_vol,
					sample_vol: sample_vol,
					total_vol: total_volume,
					specific_activity: specific_activity,
					recovery_percent: recovery_percent,
					analysis_date: analysis_date,
					arrReadingAbs: arrReadingAbs,
					arrReadingSD: arrReadingSD,
					sample_collection_duration: sample_collection_duration,
					previous_activity: previous_activity,
					previous_activity_error: previous_activity_error
				},
				is_insert_in_db : is_insert_in_db,
				isCFM: isCFM,
				is_BDL: is_BDL
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
