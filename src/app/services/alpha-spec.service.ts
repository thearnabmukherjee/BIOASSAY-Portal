import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class AlphaSpecService 
{

	constructor(private httpClient: HttpClient) { }

	get_alpha_spec_values(isotope_id: number, detector_id: number, tracer_id: number, form_id: number)
	{
		return new Promise<{ isError: boolean, msg?: string, tracer_bkg_couting_time?: number, bkg_id?: number, sample_bkg_counts?: number, bkg_counting_time?: number, sample_collection_duration?: number, tracer_bkg_id?: number, det_eff?: number, tracer_bkg_counts?: number }>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_ALPHA_DEFAULTS, 
				{
					params: (new HttpParams()).set("isotope_id", isotope_id).set("detector_id", detector_id).set("tracer_id", tracer_id).set("form_id", form_id), 
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

	get_recovery_percent(gross_tracer_counts: number,
						 tracer_background_counts: number,
						 sample_counting_time: number,
						 tracer_activity_spiked: number,
						 detector_efficiency: number)
	{
		return new Promise<number>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_RECOVERY_PERCENT, 
				{ 
					params :  (new HttpParams()).set("gross_tracer_counts", gross_tracer_counts)
												.set("tracer_background_counts", tracer_background_counts)
												.set("sample_counting_time", sample_counting_time)
												.set("tracer_activity_spiked", tracer_activity_spiked)
												.set("detector_efficiency", detector_efficiency), 
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

	save_calculate_alpha_result(mon_id: number, 
								nuc_id: number, 
								isotope_id: number, 
								detector_id: number, 
								tracer_id: number,
								name: string,
								comments: string,
								det_eff: number,
								gross_sample_counts: number,
								gross_tracer_counts: number,
								tracer_activity_spiked: number,
								sample_counting_time: number,
								sample_collection_time: number,
								analysis_date: string,
								previous_activity: number = 0,
								previous_activity_error: number = 0,
								bkg_id: number = 0,
								tracer_bkg_id: number = 0,
								recovery_percent: number = 0,
								is_BDL: boolean = false,
								is_insert_in_db: boolean = false)
	{
		return new Promise<{isError: boolean, msg: string, id?: number, activity?: number, activity_error?: number}>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_ALPHA_CALCULATE, 
			{  
				mon_id: mon_id,
				nuc_id: nuc_id,
				isotope_id: isotope_id,
				detector_id: detector_id,
				tracer_id: tracer_id,
				name: name,
				is_insert_in_db: is_insert_in_db,
				comments: comments,
				bkg_id: bkg_id,
				tracer_bkg_id: tracer_bkg_id,
				is_BDL: is_BDL,
				data: 
				{
					gross_sample_counts: gross_sample_counts,
					gross_tracer_counts: gross_tracer_counts,
					tracer_activity_spiked: tracer_activity_spiked,
					sample_counting_time: sample_counting_time,
					sample_collection_time: sample_collection_time,
					analysis_date: analysis_date,
					previous_activity: previous_activity,
					previous_activity_error: previous_activity_error,
					det_eff: det_eff,
					recovery_percent: recovery_percent
				}
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
