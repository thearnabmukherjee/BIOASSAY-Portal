import { CheckSource } from './../Classes/CheckSource';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';
import { saveAs } from 'file-saver';
import { saveAs} from 'file-saver';

@Injectable({
	providedIn: 'root'
})
export class CheckSourceService 
{
	constructor(private httpClient: HttpClient) { }

	get_check_sources()
	{
		return new Promise<CheckSource[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_CHECK_SOURCE, { withCredentials: true }).toPromise().
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

	create_new_check_source(name: string, arrIsotopes: number[], activity: number, comments: string, file: File | null)
	{
		return new Promise<{isError: boolean, msg: string}>((resolve, reject)=> 
		{
			let formData = new FormData();
			if(file != null)
				formData.append('file', file);

			formData.append('name', name);
			formData.append('activity', activity.toString());
			formData.append('comments', comments);

			//let params = new HttpParams();
			arrIsotopes.forEach((iso)=> 
			{
				//params = params.append("arrIsotopes", iso);
				formData.append('arrIsotopes', iso.toString());
			});
			
			this.httpClient.post(AppSettings.SERVER_CHECK_SOURCE, formData, { withCredentials: true }).toPromise().
			then((res)=> resolve(<any>res)).catch((e)=> { console.log(e); reject(e) });
		});
	}

	enable_disable_source_record(record_id: number, is_enable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.put(AppSettings.SERVER_CHECK_SOURCE, {}, 
			{ 
				params: (new HttpParams())
						.set("src_id", record_id)
						.set("is_enable", is_enable), 
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

	download_attachment(record_id: number, file_name: string)
	{
		return new Promise<void>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_CHECK_SOURCE_ATTACHMENT, { params: (new HttpParams()).set("source_id", record_id), responseType: 'blob', withCredentials: true }).toPromise().then((blob)=> 
			{
				resolve();
				saveAs(blob, file_name);
			}).catch((e)=> reject(e));
		});
	}
}