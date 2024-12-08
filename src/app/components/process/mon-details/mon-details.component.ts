import { NuclideService } from './../../../services/nuclide.service';
import { WorkerService } from './../../../services/worker.service';
import { H10Service } from './../../../services/h10.service';
import { Message } from './../../../Classes/Message';
import { Location } from '@angular/common';
import { MonitoringService } from './../../../services/monitoring.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-mon-details',
	templateUrl: './mon-details.component.html',
	styleUrls: ['./mon-details.component.scss']
})
export class MonDetailsComponent implements OnInit 
{
	is_loading = true;
	mon_id: number = -1;
	mon_obj: any = null;
	is_personal_details_opened: boolean = true;
	is_monitoring_details_opened: boolean = true;
	personal_details_obj: any = null;
	res_10H: any = null;
	form_id: number = -1;
	person_id: number = -1;
	arrAllNuclides: { id: number, name: string }[] = [];
	selected_tld_no: string = "-NA-";
	selected_cc_no: string = "-NA-";
	selected_radionuclides: string = "No radionuclide found!";

	constructor(private route: ActivatedRoute,
				private monService: MonitoringService,
				private _location: Location,
				private h10Service: H10Service,
				private workerService: WorkerService,
				private nuclideService: NuclideService,
				private router: Router) { }

	ngOnInit()
	{
		this.route.queryParams.subscribe((params)=> 
		{
			this.mon_id = +params['mon-id'];
			this.load_data();
		});
	}

	private async load_data()
	{
		this.is_loading = true;
		await this.load_nuclides();
		await this.load_mon_details();
		await this.load_10_form();
		this.load_personal_details()
		this.is_loading = false;
	}

	private async load_mon_details()
	{
		this.is_loading = true;
		this.mon_obj = null;
		try
		{
			let arr = await this.monService.get_monitorings(-1, -1, -1, 0, this.mon_id);
			if(arr == null || arr.length == 0)
			{
				Message.show_message("Error", "Failed to load monitoring details", true);
				this._location.back();
				return;
			}
			else
			{
				this.mon_obj = arr[0];
				this.form_id = this.mon_obj.form_id;
				this.person_id = this.mon_obj.person_id;
			}
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
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_personal_details()
	{
		try
		{
			let res = await this.workerService.get_personal_details_of_worker(this.person_id);
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
}
