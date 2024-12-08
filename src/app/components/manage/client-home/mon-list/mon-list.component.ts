import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BarePerson } from '../../../../Classes/BarePerson';
import { MonitoringService } from '../../../../services/monitoring.service';
import { Router } from '@angular/router';
import { H10Service } from '../../../../services/h10.service';
import { ReportService } from '../../../../services/report.service';

@Component({
	selector: 'app-mon-list',
	templateUrl: './mon-list.component.html',
	styleUrls: ['./mon-list.component.scss']
})
export class MonListComponent implements OnInit, OnChanges
{
	@Input("selected-person") selected_person: BarePerson | null = null;
	is_loading = false;
	arrRecords: any[] = [];
	arr10HForms: any[] = [];
	arr_mon_reports: { mon_id: number, report_id: number }[] = [];
	
	constructor(private monService: MonitoringService,
				private h10Service: H10Service,
				private router: Router,
				private report_service: ReportService) { }

	async ngOnChanges(changes: SimpleChanges) 
	{
		if(changes.selected_person)
		{
			if(!changes.selected_person.firstChange)
			{
				this.selected_person = changes.selected_person.currentValue;
				await this.load_records();
			}
		}
	}

	private async load_records()
	{
		if(this.selected_person == null)
			return;
		this.is_loading = true;
		try
		{
			//
			//	Load monitoring details
			//
			this.arrRecords = await this.monService.get_monitorings(this.selected_person.id, 0, 0, 0, 0);

			//
			//	Load all 10H forms belonging to this person
			//
			this.arr10HForms = []
			let page_num = 0;
			while(true)
			{
				let arr = await this.h10Service.get_10H_of_person(this.selected_person.id, page_num);
				if(arr.length == 0)
					break;
				++page_num;
				this.arr10HForms = [...this.arr10HForms, ...arr];
			}

			//
			//	Load reports for the person
			//
			this.arr_mon_reports = await this.report_service.get_report_ids_for_person(this.selected_person.id);
			for(let i = 0 ; i < this.arrRecords.length; ++i)
				this.arrRecords[i].report_id = this._get_report_id(this.arrRecords[i].id);
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
		}
	}

	private _get_report_id(mon_id: number)
	{
		let matchings = this.arr_mon_reports.filter((x)=> x.mon_id == mon_id);
		if(matchings.length == 0)
			return 0;
		let matching = matchings[0];
		return matching.report_id;
	}

	show_report(report_id: number)
	{
		if(report_id <= 0)
			return;
		this.router.navigate(['/view-report'], { queryParams: {  'report-id': report_id } });
	}

	ngOnInit()
	{
		//this.load_records();
	}

	show_linked_10H(r: any)
	{
		this.router.navigate(['/view-10h'], { queryParams: { 'form-id': r['form_id'] } });
	}

	show_linked_analysis(r: any)
	{
		if(this.selected_person == null)
			return;
		this.router.navigate(['/view-analysis'], { queryParams: { 'mon-id': r['id'], 'person-id': this.selected_person['id'] } });
	}

	show_wt_vol_values(a: any, b: any)
	{
		if(a == null && b == null)
			return "-NA-";
		else if(a != null && b == null)
			return a;
		else if(a != null && b != null)
			return `${a}/${b}`;
		else if(a == null && b != null)
			return b;
		return "-NA-";
	}

	get_div_plant(mon_record: any)
	{
		for(let i = 0 ; i < this.arr10HForms.length; ++i)
			if(this.arr10HForms[i].id == mon_record.form_id)
				return `${this.arr10HForms[i]['division_name']}/${this.arr10HForms[i]['plant_name']}`;
		return "-NA-";
	}
}