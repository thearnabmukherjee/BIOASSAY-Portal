import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';
import { Footnote } from '../../../Classes/Footnote';
import { Message } from '../../../Classes/Message';
import { ReportPeople } from '../../../Classes/ReportPeople';
import { ReportService } from '../../../services/report.service';
import * as bulmaCalendar from 'bulma-calendar';
import { DivisionService } from '../../../services/division.service';
import { FootnoteService } from '../../../services/footnote.service';
import { Divisions } from '../../../Classes/Divisions';

@Component({
	selector: 'app-new-report',
	templateUrl: './new-report.component.html',
	styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit, AfterViewInit, OnDestroy
{
	VALID_WORKER_TYPES: string[] = ["Trainee", "Employee", "Contract worker", "Other", "All"];
	VALID_REPORT_TYPES: string[] = ['Routine', 'Special', 'Task-related', 'Baseline', 'Termination', 'Superannuation', 'Confirmatory', 'Follow-up'];
	selected_worker_type: string = "";
	selected_divison_id: number = 0;
	arrDivisions: any[] = [];
	selected_start_date: string = "";
	selected_end_date: string = "";
	selected_report_name: string = "";
	arrFootnotes: Footnote[] = [];
	selected_footnote_id: number = 0;
	tmp_send_to: string = "";
	tmp_copy_to: string = "";
	selected_arrSend_to: string[] = [];
	selected_arrCopy_to: string[] = [];
	selected_comments: string = "";
	is_creating_report: boolean = false;
	_arr_people_to_select: ReportPeople[] = [];
	is_open_people_selector: boolean = false;

	@Input("report-type") selected_report_type: string = "";
	@Output("closed") close_emitter: EventEmitter<void> = new EventEmitter<void>();

	constructor(private reportService: ReportService,
				private division_service: DivisionService,
				private footnote_service: FootnoteService) { }

	ngOnInit() 
	{
		this._load_divisions();
		this._load_footnotes();
	}

	private async _load_divisions()
	{
		try
		{
			//
			//	Load divisions
			//
			let res = await this.division_service.get_divisions();
			if(res.isError)
			{
				Message.show_message("Error", <string>res.msg, true);
				this.close_emitter.emit();
			}
			else
			{
				this.arrDivisions = (<Divisions[]>res.msg).filter((d)=> d.is_active).sort((a: Divisions, b: Divisions)=> 
				{
					if(a.abbr < b.abbr)
						return -1;
					else if(a.abbr > b.abbr)
						return 1;
					return 0;
				});
			}
		}
		catch(e)
		{
			console.log(e);
			Message.show_message("Error", "An error occurred while loading divisions", true);
			this.close_emitter.emit();
		}
	}

	private async _load_footnotes()
	{
		try
		{
			this.arrFootnotes = await this.footnote_service.get_footnotes();
		}
		catch(e)
		{
			console.log(e);
			Message.show_message("Error", "An error occurred while loading footnotes", true);
			this.close_emitter.emit();
		}
	}

	ngAfterViewInit()
	{
		let dt_calender_type: "default" | "modal" | "inline" = "default";
		//
		//	Configure start date
		//
		bulmaCalendar.attach('#dtReportStartDate', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), displayMode: dt_calender_type, type: 'date' })[0].on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
			this.selected_start_date = val;
		});

		//
		//	Configure end date
		//
		bulmaCalendar.attach('#dtReportEndDate', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), displayMode: dt_calender_type, type: 'date' })[0].on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
			this.selected_end_date = val;
		});
	}

	add_send_to()
	{
		if(this.tmp_send_to == null || this.tmp_send_to.length == 0)
		{
			Message.show_message("Error", "Please specify send to contents", true);
			return
		}
		else if(this.selected_arrSend_to.filter((x)=> x == this.tmp_send_to).length > 0)
		{
			return;
		}
		else
		{
			this.selected_arrSend_to.push(this.tmp_send_to);
			this.tmp_send_to = "";
		}
	}

	add_copy_to()
	{
		if(this.tmp_copy_to == null || this.tmp_copy_to.length == 0)
		{
			Message.show_message("Error", "Please specify copy to contents", true);
			return
		}
		else if(this.selected_arrCopy_to.filter((x)=> x == this.tmp_copy_to).length > 0)
		{
			return;
		}
		else
		{
			this.selected_arrCopy_to.push(this.tmp_copy_to);
			this.tmp_copy_to = "";
		}
	}

	remove_send_to(item: string)
	{
		this.selected_arrSend_to = this.selected_arrSend_to.filter((x)=> x != item);
	}

	remove_copy_to(item: string)
	{
		this.selected_arrCopy_to = this.selected_arrCopy_to.filter((x)=> x != item);
	}

	close_modal()
	{
		AppSettings.subjectBlockScroll.next(false);
		this.close_emitter.emit();
	}

	verify_reports_inputs()
	{
		if(!this.VALID_WORKER_TYPES.includes(this.selected_worker_type))
		{
			Message.show_message("Error", "Please select a valid worker type", true);
			return;
		}
		if(this.selected_start_date == null || this.selected_start_date.length == 0)
		{
			Message.show_message("Error", "Please select start date", true);
			return;
		}
		if(this.selected_end_date == null || this.selected_end_date.length == 0)
		{
			Message.show_message("Error", "Please select end date", true);
			return;
		}
		if(this.arrDivisions.filter((x)=> x.id == this.selected_divison_id).length == 0)
		{
			Message.show_message("Error", "Please select a division", true);
			return;
		}
		if(this.arrFootnotes.filter((x)=> x.id == this.selected_footnote_id).length == 0)
		{
			Message.show_message("Error", "Please select a footnote", true);
			return;
		}
		if(this.selected_arrSend_to.length == 0)
		{
			Message.show_message("Error", "Please specify at-least one person whom to send the report", true);
			return;
		}
		if(this.selected_report_name == null || this.selected_report_name.length == 0)
		{
			Message.show_message("Error", "Please specify report name", true);
			return;
		}

		//
		//	Start generating the report
		//
		this.is_creating_report = true;
		this._arr_people_to_select = [];
		this.reportService.get_report_records(this.selected_report_name,
											  this.selected_worker_type,
											  this.selected_start_date + " 00:00:00",
											  this.selected_end_date + " 23:59:59",
											  this.selected_divison_id,
											  this.selected_footnote_id,
											  this.selected_report_type).then(async (res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", <string>res.msg, true);
				return;
			}

			Message.show_info_message("Information", "Please select the analysis sets to include in the report");
			this.is_open_people_selector = true;
			AppSettings.subjectBlockScroll.next(true);
			this._arr_people_to_select = <ReportPeople[]>res.msg;
		}).catch((e)=> 
		{ 
			console.log(e); 
			this.close_modal();
		}).finally(()=> this.is_creating_report = false);
	}

	ngOnDestroy()
	{
		AppSettings.subjectBlockScroll.next(false);
	}
}
