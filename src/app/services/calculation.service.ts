import { Calculations } from './../Classes/Calculation';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class CalculationService 
{
	constructor(private httpClient: HttpClient) { }
	
	//
	//	Get list of calculations
	//
	get_calculations(mon_id: number)
	{
		return new Promise<Calculations[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_CALC, 
				{
					params: (new HttpParams()).set("mon_id", mon_id), 
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

	//
	//	Create a bunch
	//
	create_calculation_bunch(mon_id: number, ids: number[], name: string, comments: string, is_BDL: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_CALC_BUNCH, 
			{  
				mon_id: mon_id,
				ids: ids,
				name: name,
				comments: comments,
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
