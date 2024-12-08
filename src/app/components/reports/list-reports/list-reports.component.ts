import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '../../../Classes/Reports';
import { ReportService } from '../../../services/report.service';
import { Message } from '../../../Classes/Message';
import * as bulmaCalendar from 'bulma-calendar';
import { SafeHtml } from '@angular/platform-browser';
import { AppSettings } from '../../../Classes/AppSettings';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-list-reports',
	templateUrl: './list-reports.component.html',
	styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent implements OnInit, OnDestroy, AfterViewInit
{
	signed_filter: "Signed" | "Un-signed" | "All" = "All";
	sent_sign_filter: "Sent" | "Not sent" | "All" = "All";

	report_filter_value: string = "";
	report_filter_report_type: string = "All";
	report_filter_report_type_deffered: string = "All";

	is_loading: boolean = false;
	arrRecords: Report[] = [];
	page_num: number = 0;
	search_val: string = "";
	VALID_WORKER_TYPES: string[] = ["Trainee", "Employee", "Contract worker", "Other", "All"];	//["Employee", "Worker", "All"];
	BASELINE_WORKER_TYPES: string[] = ["Trainee", "Employee", "Contract worker", "Other"];

	start_date: string = "";
	end_date: string = "";
	
	is_enabling_disabling: boolean = false;
	is_open_new_report_modal: boolean = false;

	selected_report_type: string = "";
	tmp_send_to: string = "";
	tmp_copy_to: string = "";

	loaded_report_contents: SafeHtml = "";
	static REPORT_BAGGAGE: string = "";
	static REPORT_HTML: string = "";
	static REPORT_TOKEN: string = "";
	private _sub: Subscription | null = null;
	
	constructor(private route: ActivatedRoute,
				private router: Router,
				private reportService: ReportService,
				private _location: Location) { }
	

	ngOnInit()
	{
		this._sub = this.route.queryParams.subscribe((params)=> 
		{
			//
			//	Subscribe to signed / un-signed filter
			//
			let _signed_filter = params['signed_filter'];
			if(!["Signed" , "Un-signed" , "All"].includes(_signed_filter))
				_signed_filter = "All";
			this.signed_filter = _signed_filter;

			//
			//	Subscribe to sent / not sent filter
			//
			let _sent_filter = params['sent_sign_filter'];
			if(!["Sent" , "Not sent" , "All"].includes(_sent_filter))
			_sent_filter = "All";
			this.sent_sign_filter = _sent_filter;

			//
			//	Load the records
			//
			this._load_reports().then((_)=> 
			{
				
			}).catch((e)=> { console.log(e); this._location.back(); });
		});
	}

	private cal_sd: any = null;
	private cal_ed: any = null;
	ngAfterViewInit()
	{
		//
		//	Start date
		//
		this.cal_sd = bulmaCalendar.attach('#dtStartDate', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), type: 'date' })[0];
		this.cal_sd.on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
			this.start_date = val;
		});

		//
		//	End date
		//
		this.cal_ed = bulmaCalendar.attach('#dtEndDate', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), type: 'date' })[0];
		this.cal_ed.on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
			this.end_date = val;
		});
	}

	perform_search()
	{
		this.is_loading = true;
		this.report_filter_report_type_deffered = this.report_filter_report_type;
		this._load_reports().finally(()=> this.is_loading = false);
	}

	private async _load_reports()
	{
		try
		{
			this.arrRecords = await this.reportService.get_reports( this.report_filter_report_type, 
																	this.report_filter_value, 
																	this.page_num, 0, 
																	this.start_date, 
																	this.end_date,
																	this.signed_filter,
																	this.sent_sign_filter);
			for(let i = 0 ; i < this.arrRecords.length; ++i)
				if(this.arrRecords[i].name.length > 20)
					this.arrRecords[i].name = this.arrRecords[i].name.substring(0, 18) + "..";
		}
		catch(e)
		{
			console.log(e);
		}
	}

	send_for_signatures(id: number)
	{
		this.is_loading = true;
		this.reportService.send_for_signature(id).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				Message.show_message("Success", "Report sent for signatures successfully", false);
				this._load_reports();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	async sign_the_report(id: number)
	{
		let matched = this.arrRecords.filter((x)=> x.id == id)[0];
		let ret = await Message.ask_question_is_accepted("Approval confirmation", `Are you sure to approve this report: ${matched.name}`, "Yes, approve", "No, don't cancel");
		if(!ret)
			return;

		this.is_loading = true;
		this.reportService.sign_report(id).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				Message.show_message("Success", "Report approved successfully", false);
				this._load_reports();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	reject_the_report(id: number)
	{
		let reason = prompt("Please specify rejection reason");
		if(reason == null || reason == "")
			return;

		this.is_loading = true;
		this.reportService.reject_report(id, reason).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				Message.show_message("Success", "Report rejected successfully", false);
				this._load_reports();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	enable_disable_report(id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.reportService.enable_disable_report(id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", res.msg, false);
				this._load_reports();
			}
		}).catch((e)=> console.log(e)).finally(()=> 
		{
			this.is_enabling_disabling = false;
		});
	}

	show_report_contents(id: number)
	{
		this.router.navigate(["/view-report"], { queryParams: { 'report-id': id } });
	}

	close_modal()
	{
		this.is_open_new_report_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}

	ngOnDestroy()
	{
		this._sub?.unsubscribe();
	}

	get_report_status(r: Report)
	{
		if(!r.is_active)
			return "De-activated";
		else
		{
			if(!r.is_sent_for_sign)
				return "Not sent";
			else
			{
				if(r.is_rejected)
					return "Rejected";
				else
				{
					if(!r.approved_by1)
						return "Not yet approved";
					else
					{
						if(!r.approved_by2)
							return "Partially approved";
						else
							return "Approved";
					}
				}
			}
		}
	}

	create_report(report_type: string)
	{
		this.selected_report_type = report_type;
		this.is_open_new_report_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	private clear_calender_values(id: string)
	{
		let element = document.querySelector(`#${id}`)
		if(element)
		{
			let ref = (<any>element).bulmaCalendar;
			ref.clear();
		}
	}

	private get_calender_value(id: string): string
	{
		let element = document.querySelector(`#${id}`)
		if(element)
		{
			let ref = (<any>element).bulmaCalendar;
			return ref.value();
		}
		return "";
	}

	private formatDateToYYYYMMDD(date) 
	{
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to the month because it is zero-based
		const day = String(date.getDate()).padStart(2, '0');
	  
		return `${year}-${month}-${day}`;
	}
}
