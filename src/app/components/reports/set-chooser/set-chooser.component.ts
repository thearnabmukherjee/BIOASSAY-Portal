import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../../../Classes/Message';
import { ReportPeople } from '../../../Classes/ReportPeople';
import { ReportService } from '../../../services/report.service';
import { ListReportsComponent } from '../list-reports/list-reports.component';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-set-chooser',
	templateUrl: './set-chooser.component.html',
	styleUrls: ['./set-chooser.component.scss']
})
export class SetChooserComponent implements OnInit, OnChanges, OnDestroy
{
	is_creating_report: boolean = false;
	@Input("raw-records") raw_records: ReportPeople[] = [];
	@Input("name") name: string = "";
	@Input("worker-type") worker_type: string = "";
	@Input("start-date") start_date: string = "";
	@Input("end-date") end_date: string = "";
	@Input("division-id") division_id: number = 0;
	@Input("footnote-id") footnote_id: number = 0;
	@Input("send-to") arrSendTo: string[] = [];
	@Input("copy-to") arrcopyTo: string[] = [];
	@Input("comments") comments: string = "";
	@Input("report-type") report_type: string = "";

	@Output("cancel") cancel_emitter: EventEmitter<void> = new EventEmitter<void>();

	arr_records: { raw_record: ReportPeople, name: string, is_checked: boolean }[] = [];


	constructor(private report_service: ReportService,
				private router: Router) { }

	ngOnInit() 
	{
		ListReportsComponent.REPORT_BAGGAGE = "";
		ListReportsComponent.REPORT_HTML = "";
		ListReportsComponent.REPORT_TOKEN = "";
	}

	ngOnChanges(changes: SimpleChanges)
	{
		if('raw_records' in changes)
		{
			this.raw_records = changes['raw_records'].currentValue;
			this.format_for_gui(this.raw_records);
		}
		if('name' in changes)
			this.name = changes['name'].currentValue;
		
		if('worker_type' in changes)
			this.worker_type = changes['worker_type'].currentValue;
		
		if('start-date' in changes)
			this.start_date = changes['start-date'].currentValue;
		
		if('end_date' in changes)
			this.end_date = changes['end_date'].currentValue;

		if('division_id' in changes)
			this.division_id = changes['division_id'].currentValue;

		if('footnote_id' in changes)
			this.footnote_id = changes['footnote_id'].currentValue;
		
		if('arrSendTo' in changes)
			this.arrSendTo = changes['arrSendTo'].currentValue;

		if('arrcopyTo' in changes)
			this.arrcopyTo = changes['arrcopyTo'].currentValue;

		if('comments' in changes)
			this.comments = changes['comments'].currentValue;
		
		if('report_type' in changes)
			this.report_type = changes['report_type'].currentValue;
	}

	cancel_request()
	{
		this.cancel_emitter.emit();
	}

	generate_and_show_temp_report()
	{
		if(this.arr_records.filter((x)=> x.is_checked).length == 0)
			Message.ask_question_is_accepted("Nothing selected", "You have not selected any analysis set to include in report. Do you want to proceed?", "Proceed with empty report", "Cancel").then((_)=> this._generate_report());
		else
			this._generate_report();
	}

	private async _generate_report()
	{
		try
		{
			this.is_creating_report = true;
			let res = await this.report_service.generate_temp_report(this.name, 
																	 this.worker_type, 
																	 this.start_date, 
																	 this.end_date, 
																	 this.division_id, 
																	 this.footnote_id,
																	 this.arr_records.filter((x)=> x.is_checked).map((x)=> x.raw_record.id),
																	 this.arrSendTo,
																	 this.arrcopyTo,
																	 this.comments,
																	 this.report_type);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}

			ListReportsComponent.REPORT_BAGGAGE = res.msg!;
			ListReportsComponent.REPORT_HTML = (JSON.parse(res.msg))['html_contents'];
			ListReportsComponent.REPORT_TOKEN = res.token!;
			this.router.navigate(["/view-report"], { queryParams: { 'report-id': -1 } });
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_creating_report = false;
		}
		
	}

	private format_for_gui(records: ReportPeople[])
	{
		this.arr_records = records.map((x)=> { return {
			raw_record: x,
			name: `chk${x.id}`,
			is_checked: false
		}});
	}

	ngOnDestroy()
	{
		AppSettings.subjectBlockScroll.next(false);
	}
}
