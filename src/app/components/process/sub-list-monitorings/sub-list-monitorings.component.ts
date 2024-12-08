import { MonitoringService } from './../../../services/monitoring.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, NgZone } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';
import { H10Service } from '../../../services/h10.service';
import {cloneDeep} from 'lodash';

@Component({
	selector: 'sub-list-monitorings',
	templateUrl: './sub-list-monitorings.component.html',
	styleUrls: ['./sub-list-monitorings.component.scss']
})
export class SubListMonitoringsComponent implements OnInit, OnChanges
{
	arrRecords : any[] = [];
	page_num: number = 0;
	is_loading = true;
	selected_worker_id: number = -1;

	@Input('person-id') person_id: number = -1;
	@Input('form-id') form_id: number = -1;
	@Input('tech-id') creater: number = -1;
	@Output('navigate') evt_navigate = new EventEmitter<{'url': string, params: any}>();

	constructor(private monService: MonitoringService,
				private _ngZone: NgZone) { }

	ngOnInit()
	{
		this.load_records();
	}

	async ngOnChanges(changes: SimpleChanges) 
	{
		let isChanged = false;
		if(changes.person_id)
		{
			if(!changes.person_id.firstChange)
			{
				this.person_id = changes.person_id.currentValue;
				isChanged = true;
			}
		}
		if(changes.form_id)
		{
			if(!changes.form_id.firstChange)
			{
				this.form_id = changes.form_id.currentValue;
				isChanged = true;
			}
		}
		if(changes.creater)
		{
			if(!changes.creater.firstChange)
			{
				this.creater = changes.creater.currentValue;
				isChanged = true;
			}
		}
		if(isChanged)
			await this.load_records();
	}

	private async load_records()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.monService.get_monitorings(this.person_id, this.form_id, this.creater, this.page_num);
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
			AppSettings.run_change_detection(this._ngZone, ()=> 
			{
				this.arrRecords = cloneDeep(this.arrRecords);
			});
		}
	}

	goto_first_page()
	{
		this.page_num = 0;
		this.load_records();
	}

	goto_previous_page()
	{
		if(this.page_num == 0)
			return;
		--this.page_num;
		this.load_records();
	}

	goto_next_page()
	{
		++this.page_num;
		this.load_records();
	}

	view_10H_form(form_id: number)
	{
		this.evt_navigate.emit({ url: '/view-10h', params : { 'form-id': form_id } });
	}

	view_worker_details(person_id: number)
	{
		this.selected_worker_id = person_id;
	}

	view_analysis(mon_id: number, person_id: number)
	{
		this.evt_navigate.emit({ url: '/view-analysis', params : { 'mon-id': mon_id, 'person-id': person_id } });
	}

	worker_details_closed(ev: any)
	{
		this.selected_worker_id = -1;
	}

	public trackItem(index: number, item: any)
	{
		return item.id;
	}
}
