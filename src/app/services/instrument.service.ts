import { Instrument } from './../Classes/Instrument';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';

@Injectable({
	providedIn: 'root'
})
export class InstrumentService 
{
	constructor(private httpClient: HttpClient) { }

	get_instruments()
	{
		return new Promise<Instrument[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_INSTRUMENT, { withCredentials: true }).toPromise().
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

	create_instrument(name: string)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.post(AppSettings.SERVER_INSTRUMENT, {}, { params: (new HttpParams()).set("name", name), withCredentials: true }).toPromise().
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

	enable_disable_instrument(inst_id: number, isEnable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_INSTRUMENT, {}, 
			{ 
				params: (new HttpParams())
						.set("inst_id", inst_id)
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
