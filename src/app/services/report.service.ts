import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Classes/AppSettings';
import { Report } from '../Classes/Reports';
import { ReportPeople } from '../Classes/ReportPeople';

@Injectable({
	providedIn: 'root'
})
export class ReportService 
{
	constructor(private httpClient: HttpClient) { }

	get_reports(report_type: string, 
				search_val: string = "", 
				page_num: number = 0, 
				report_id: number = 0, 
				start_date: string = "", 
				end_date: string = "",
				signed_filter: "Signed" | "Un-signed" | "All" = "All",
				sent_sign_filter: "Sent" | "Not sent" | "All" = "All")
	{
		return new Promise<Report[]>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_REPORTS, 
			{ 
				params : (new HttpParams()).set("search_val", search_val)
										   .set("report_type", report_type)
										   .set("page_num", page_num)
										   .set("report_id", report_id)
										   .set("start_date", start_date)
										   .set("end_date", end_date)
										   .set("signed_filter", signed_filter)
										   .set("sent_sign_filter", sent_sign_filter),
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

	get_report_records(name: string, worker_type: string, start_date: string, end_date: string, division_id: number, footnote_id: number, tom: string)
	{
		return new Promise<{ isError: boolean, msg: string | ReportPeople[]}>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_REPORT_RECORDS, 
			{ 
				params : (new HttpParams()).set("name", name)
										   .set("worker_type", worker_type)
										   .set("start_date", start_date)
										   .set("end_date", end_date)
										   .set("division_id", division_id)
										   .set("footnote_id", footnote_id)
										   .set("tom", tom),
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

	generate_temp_report(name: string, worker_type: string, 
						 start_date: string, end_date: string, 
						 division_id: number, footnote_id: number, 
						 arr_set_ids: number[], arrSend_to: string[],
						 arrCopy_to: string[], comments: string,
						 report_type: string)
	{
		if(start_date.length == 10)
			start_date += " 00:00:00";
		if(end_date.length == 10)
			end_date += " 23:59:59";
		return new Promise<{ isError: boolean, msg: string, token?: string }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_REPORT_TEMP, 
			{
				name: name, worker_type: worker_type,
				start_date: start_date, end_date: end_date,
				division_id: division_id, footnote_id: footnote_id,
				arr_set_ids: arr_set_ids, arrSend_to: arrSend_to,
				arrCopy_to: arrCopy_to, comments: comments,
				report_type: report_type
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

	save_report(html_contents: string, token: string, baggage: string)
	{
		return new Promise<{ isError: boolean, msg: string, id?: number }>((resolve, reject)=> 
		{
			this.httpClient.post(AppSettings.SERVER_REPORT_SAVE, 
			{
				html_contents: html_contents,
				token: token,
				baggage: baggage
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

	get_report_as_HTML(report_id: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_REPORT_AS_HTML, 
			{ 
				params : (new HttpParams()).set("report_id", report_id),
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

	get_report_as_PDF(report_id: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=>
		{
			this.httpClient.get(AppSettings.SERVER_REPORT_AS_PDF, 
			{ 
				params : (new HttpParams()).set("report_id", report_id),
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


	enable_disable_report(report_id: number, is_enable: boolean)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_REPORTS, 
			{
				report_id: report_id,
				is_enable: is_enable
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

	send_for_signature(report_id: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_SEND_FOR_SIGN, 
			{
				report_id: report_id
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

	reject_report(report_id: number, reason: string)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_REJECT_REPORT, 
			{
				report_id: report_id,
				reason: reason
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

	sign_report(report_id: number)
	{
		return new Promise<{ isError: boolean, msg: string }>((resolve, reject)=> 
		{
			this.httpClient.put(AppSettings.SERVER_REPORT_SIGN, 
			{
				report_id: report_id
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

	get_report_ids_for_person(person_id: number)
	{
		return new Promise<{ mon_id: number, report_id: number }[]>((resolve, reject)=> 
		{
			this.httpClient.get(AppSettings.SERVER_REPORTS_FOR_PERSON,
			{ 
				params: (new HttpParams()).set("person_id", person_id),
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
