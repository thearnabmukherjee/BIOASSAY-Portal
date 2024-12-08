import { Message } from './../../../Classes/Message';
import { H10Service } from './../../../services/h10.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bulmaCalendar from 'bulma-calendar';
import moment from 'moment';
import { AppSettings } from '../../../Classes/AppSettings';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-list-h10',
	templateUrl: './list-h10.component.html',
	styleUrls: ['./list-h10.component.scss']
})
export class ListH10Component implements OnInit, OnDestroy
{
	current_form_type: string = "";
	is_loading: boolean = true;
	search_val: string = "";
	form_search_val: string = "";

	start_date_time: string = "";
	start_date_time_value: string = "";
	end_date_time: string = "";
	end_date_time_value: string = "";

	private MAX_DATE = new Date();
	private has_calender_initialized = false;
	private _sub: Subscription | null = null;

	constructor(private route: ActivatedRoute,
				private h10Service: H10Service,
				private router: Router) { }
	

	get is_show_sample_no()
	{
		return AppSettings.VALID_FORM_STATES.filter((x)=> x != AppSettings.VALID_FORM_STATES[0]).includes(this.current_form_type);
	}

	ngOnInit()
	{
		this._sub = this.route.queryParams.subscribe((params)=> 
		{
			this.current_form_type = params['type'];

			//
			//	Attach bulma calendars
			//
			if(!this.has_calender_initialized)
			{
				this.has_calender_initialized = true;
				bulmaCalendar.attach('#dtStartDate', { dateFormat: 'yyyy-MM-dd', maxDate: this.MAX_DATE, validateLabel: 'Done', showClearButton: false, showButtons: false })[0].on('select', dt => 
				{
					this.start_date_time_value = <string><any>dt.data.value() + " 00:00:00";
				});

				bulmaCalendar.attach('#dtEndDate', { dateFormat: 'yyyy-MM-dd', maxDate: this.MAX_DATE, validateLabel: 'Done', showClearButton: false, showButtons: false })[0].on('select', dt => 
				{
					this.end_date_time_value = <string><any>dt.data.value() + " 23:59:59";
				});
			}
		});
	}

	search_enter_pressed(event: any)
	{
		if (event.key === 'Enter')
		{
			this.perform_search();
		}
	}

	navigate_to_url(evt: any)
	{
		this.router.navigate([evt.url], { queryParams : evt.params });
	}

	perform_search()
	{
		this.search_val = this.form_search_val;
		this.start_date_time = this.start_date_time_value;
		this.end_date_time = this.end_date_time_value;
	}

	reset_search()
	{
		this.form_search_val = this.search_val = "";
		this.start_date_time = this.start_date_time_value = "";
		this.end_date_time = this.end_date_time_value = "";

		let dt = moment();
		let element = document.querySelector('#dtStartDate')
		if(element)
		{
			let ref = (<any>element).bulmaCalendar;
			ref.clear();
		}

		element = document.querySelector('#dtEndDate')
		if(element)
		{
			let ref = (<any>element).bulmaCalendar;
			ref.clear();
		}
	}

	ngOnDestroy()
	{
		this._sub?.unsubscribe();
	}
}
