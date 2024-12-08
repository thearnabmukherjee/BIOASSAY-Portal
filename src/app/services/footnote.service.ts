import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';
import { Footnote } from '../Classes/Footnote';

@Injectable({
	providedIn: 'root'
})
export class FootnoteService 
{
	constructor(private httpClient: HttpClient) { }

	get_footnotes()
	{
		return new Promise<Footnote[]>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_FOOTNOTES, 
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

	create_footnote(name: string, contents: string, is_active: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_FOOTNOTES, 
			{
				name: name,
				contents: contents,
				is_active: is_active
			}, 
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

	enable_disable_footnote(note_id: number, is_active: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_FOOTNOTES, 
			{
				note_id: note_id,
				is_active: is_active
			}, 
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
