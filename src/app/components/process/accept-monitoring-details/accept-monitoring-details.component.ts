import { WorkerService } from './../../../services/worker.service';
import { NuclideService } from './../../../services/nuclide.service';
import { H10Service } from './../../../services/h10.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../../../Classes/Message';
import * as bulmaCalendar from 'bulma-calendar';
import moment from 'moment';

@Component({
	selector: 'app-accept-monitoring-details',
	templateUrl: './accept-monitoring-details.component.html',
	styleUrls: ['./accept-monitoring-details.component.scss']
})
export class AcceptMonitoringDetailsComponent implements OnInit 
{
	is_loading = true;
	private form_id: number = -1;
	personal_details_obj: any = null;
	res_10H: any = null;
	is_personal_details_opened: boolean = true;
	is_monitoring_details_opened: boolean = true;
	arrAllNuclides: { id: number, name: string }[] = [];
	selected_tld_no: string = "-NA-";
	selected_cc_no: string = "-NA-";
	selected_radionuclides: string = "No radionuclide found!";

	sample_vol: number = 0;
	sample_wt: number = 0;
	sample_receipt_date: string = "";
	sample_remarks: string = "";

	is_enable_volume: boolean = false;

	private static MIN_RECEIVED_DATE = new Date();
	private static MAX_RECEIVED_DATE = new Date();
	private static MAX_PAST_DAYS_ALLOWED = 365;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private _location: Location,
				private h10Service: H10Service,
				private nuclideService: NuclideService,
				private workerService: WorkerService) { }

	ngOnInit()
	{
		let form_id = this.route.snapshot.queryParamMap.get('form-id');
		if(form_id == null)
		{
			this._location.back();
			return;
		}
		else if(+form_id <= 0)
		{
			this._location.back();
			return;
		}

		this.form_id = +form_id;
		let today = new Date(AcceptMonitoringDetailsComponent.MAX_RECEIVED_DATE);
		AcceptMonitoringDetailsComponent.MIN_RECEIVED_DATE = new Date(today.setDate(today.getDate() - AcceptMonitoringDetailsComponent.MAX_PAST_DAYS_ALLOWED));
		this.load_data().then((r)=> 
		{
			if(r)
			{
				bulmaCalendar.attach('#dtReceivedOn', 
				{ 
					dateFormat: 'yyyy-MM-dd', 
					timeFormat: 'HH:mm',
					maxDate: AcceptMonitoringDetailsComponent.MAX_RECEIVED_DATE, 
					minDate: AcceptMonitoringDetailsComponent.MIN_RECEIVED_DATE,
					validateLabel: 'Done',
					showHeader: false,
					displayMode: 'dialog'
				})[0].on('select', dt => 
				{
					let t = <string><any>dt.data.value();
					if(t.length == 16)
						t = t + ":00";
					this.sample_receipt_date = t;
				});
				this.show_current_date();
			}
		});
	}

	private isFormOkay()
	{
		if(this.sample_wt <= 0)
		{
			if(!this.is_enable_volume)
			{
				Message.show_message("Error", "Please specify proper sample weight", true);
				return false;
			}
		}
		
		if(this.sample_wt > 5000)
		{
			Message.show_message("Error", "Maximum value for sample weight is 5000 g", true);
			return false;
		}
		
		if(this.sample_vol <= 0)
		{
			if(this.is_enable_volume)
			{
				Message.show_message("Error", "Please specify proper sample volume", true);
				return false;
			}
		}
		
		if(this.sample_vol > 5000)
		{
			Message.show_message("Error", "Maximum value for sample volume is 5000 ml", true);
			return false;
		}
		if(this.sample_receipt_date == null || this.sample_receipt_date == "" || this.sample_receipt_date.length != 19)
		{
			Message.show_message("Error", "Please specify sample receved on date", true);
			return false;
		}
		if(this.sample_remarks.length > 512)
		{
			Message.show_message("Error", "Maximum length for remarks is 512 characters", true);
			return false;
		}
		return true;
	}

	private async load_data()
	{
		this.is_loading = true;
		await this.load_nuclides();
		if(this.arrAllNuclides.length == 0)
		{
			Message.show_message("Error", "Failed to load list of radionuclides", true);
			this._location.back();
			return false;
		}

		await this.load_10_form();
		if(this.res_10H == null)
		{
			Message.show_message("Error", "Failed to load 10H form details", true);
			this._location.back();
			return false;
		}

		await this.load_personal_details(this.res_10H.person_id);
		if(this.personal_details_obj == null)
		{
			Message.show_message("Error", "Failed to load personal details of the worker/employee", true);
			this._location.back();
			return false;
		}

		this.is_loading = false;
		return true;
	}

	private async load_10_form()
	{
		try
		{
			let res = await this.h10Service.get_specific_10H_form(this.form_id);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			res = res.msg;
			this.res_10H = res;

			//
			//	TLD
			//
			let tld = res.tld;
			if(tld != null && tld != "" && tld.length > 0)
			{
				let arr = (<string>tld).split('/');
				if(arr.length > 2)
				{
					this.selected_tld_no = `${arr[0]}C${arr[2]}`;
				}
			}

			//
			//	CC no
			//
			let compcode = res.compcode;
			if(compcode != null && compcode != "" && compcode.length > 0)
			{
				let arr = (<string>compcode).split('/');
				if(arr.length > 2)
				{
					this.selected_cc_no = compcode;
				}
			}

			//
			//	Nuclides
			//
			let arrNuclides = <number[]>res.arrNuclides;
			this.selected_radionuclides = arrNuclides.filter((n)=> 
			{  
				for(let i = 0 ; i < this.arrAllNuclides.length; ++i)
					if(this.arrAllNuclides[i].id == n)
					{
						return true;
					}
				return false;
			}).map((n)=> 
			{
				for(let i = 0 ; i < this.arrAllNuclides.length; ++i)
					if(this.arrAllNuclides[i].id == n)
					{
						return this.arrAllNuclides[i].name;
					}
				return "";
			}).join(", ");

			//
			//	Sample type	
			//
			this.is_enable_volume = this.res_10H.sample_type == 'Urine';
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_personal_details(person_id: number)
	{
		try
		{
			let res = await this.workerService.get_personal_details_of_worker(person_id);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			this.personal_details_obj = res.msg;
		}
		catch(e)
		{
			console.log(e);
		}
	} 

	private async load_nuclides()
	{
		this.arrAllNuclides = [];
		try
		{
			this.arrAllNuclides = await this.nuclideService.get_nuclides();
		}
		catch(e)
		{
			console.log(e);
		}
	}

	view_10H_form()
	{
		this.router.navigate(['/view-10h'], { queryParams: { 'form-id': this.form_id } });
	}

	accept_the_form()
	{
		if(!this.isFormOkay())
			return;
		this.is_loading = true;

		this.h10Service.accept_10h_form(this.form_id, 
		{
			received_on: this.sample_receipt_date,
			remarks: this.sample_remarks,
			sample_vol: this.sample_vol,
			sample_wt: this.sample_wt
		}).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", "10H form accepted successfully", false);
				this._location.back();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	private show_current_date()
	{
		let dt = moment();
		this.sample_receipt_date = dt.format("YYYY-MM-DD HH:mm:ss");

		let element = document.querySelector('#dtReceivedOn')
		if(element)
		{
			let ref = (<any>element).bulmaCalendar;
			ref.clear();
			ref.value(dt.format("YYYY-MM-DD HH:mm"));
			ref.refresh();
		}
	}
}
