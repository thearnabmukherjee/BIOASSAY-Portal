import { Location } from '@angular/common';
import { NuclideService } from './../../../services/nuclide.service';
import { IntakerouteService } from './../../../services/intakeroute.service';
import { UsersService } from './../../../services/users.service';
import { Message } from './../../../Classes/Message';
import { WorkerService } from './../../../services/worker.service';
import { ClassService } from './../../../services/class.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { H10Service } from '../../../services/h10.service';


@Component({
	selector: 'app-view10-h',
	templateUrl: './view10-h.component.html',
	styleUrls: ['./view10-h.component.scss']
})
export class View10HComponent implements OnInit 
{
	form_id: number = -1;
	person_id: number = -1;
	hp_id: number = -1;
	hp_name: string = '';
	is_loading = true;
	is_personal_details_opened: boolean = true;
	is_monitoring_details_opened: boolean = true;
	is_form_details_opened: boolean = true;
	//personal_details_obj: any = null;
	//my_info: any = null;
	h10_res: any = null;
	division_name:string = "";
	plant_name: string = "";
	person_image_url = "";
	arrNuclides: { id: number, name: string, is_checked: boolean, ui_name: string }[] = [];
	arrIntakeRoutes: { id: number, name: string, is_checked: boolean, ui_name: string }[] = [];
	
	selected_division_id: number = -1;
	selected_plant_id: number = -1;
	selected_worker_type: string = "";
	selected_tld_fragment: string = "";
	selected_tld_fragment_last: string = "";
	selected_CC_fragment: string = "";
	selected_CC_fragment_middle: string = "";
	selected_CC_fragment_last: string = "";
	selected_Sample_Type_Fragment: string = "";
	selected_Sample_Type_Fragment_Last: string = "";
	selected_collection_duration_fragment: string = "";
	selected_collection_duration_fragment_last: string = "";
	selected_date_of_collection: string = "";
	selected_monitoring_type: string = "";
	selected_process_type: string = "";
	selected_process_type_other: string = "";
	selected_time_of_exposure: string = "";
	selected_time_of_exposure_other: string = "";
	selected_brief_description: string = "";
	seleced_iodination_last_date: string = "";
	seleced_iodination_last_date_other: string = "";
	selected_therapeutic_treatment_details: string = "";
	selected_particle_size: string = "";
	selected_particle_size_other: string = "";
	selected_isotopic_comp_contaminants: string = "";
	selected_pu_am_ration: string = "";
	selected_class: string = "";
	selected_weight: number = 0;
	selected_height: number = 0;
	selected_chest_cc: number = 0;
	selected_comments: string = "";
	selected_previous_monitoring_date: string = "";
	arrSelectedComments: string[] = [];
	selected_class_other: string = "";

	constructor(private route: ActivatedRoute, 
				private h10Service: H10Service,
				private classService: ClassService,
				private workerService: WorkerService,
				private userService: UsersService,
				private routeService: IntakerouteService,
				private nuclideService: NuclideService,
				private _location: Location) { }

	ngOnInit()
	{
		let form_id = this.route.snapshot.queryParamMap.get('form-id');
		if(form_id == null)
			return;
		this.form_id = +form_id;
		this.load_data();
	}

	private async load_data()
	{
		this.is_loading = true;
		//await this.load_my_info();
		await this.load_intake_routes();
		await this.load_nuclides();
		await this.load_10_form();
		// await this.load_personal_details(this.person_id);
		this.is_loading = false;
	}

	// private async load_my_info()
	// {
	// 	try
	// 	{
	// 		this.my_info = await this.userService.get_my_info();
	// 	}
	// 	catch(e)
	// 	{
	// 		console.log(e);
	// 	}
	// }

	private async load_10_form()
	{
		try
		{
			let res = await this.h10Service.get_specific_10H_form(this.form_id);
			console.log(res);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			res = res.msg;
			this.h10_res = res;
			this.selected_division_id = res.division_id;
			this.selected_plant_id = res.plant_id
			this.selected_worker_type = res.worker_type


			let tld = res.tld;
			if(tld != null && tld != "" && tld.length > 0)
			{
				let arr = (<string>tld).split('/');
				if(arr.length > 2)
				{
					this.selected_tld_fragment = arr[0];
					this.selected_tld_fragment_last = arr[2];
				}
			}
			let compcode = res.compcode;
			if(compcode != null && compcode != "" && compcode.length > 0)
			{
				let arr = (<string>compcode).split('/');
				if(arr.length > 2)
				{
					this.selected_CC_fragment = arr[0];
					this.selected_CC_fragment_middle = arr[1];
					this.selected_CC_fragment_last = arr[2];
				}
			}

			this.arrIntakeRoutes.forEach((r)=> r.is_checked = false);
			this.arrIntakeRoutes.forEach((r)=> { if((<number[]>res.arrRoutes).includes(r.id)) r.is_checked = true });
			this.arrNuclides.forEach((r)=> r.is_checked = false);
			this.arrNuclides.forEach((r)=> { if((<number[]>res.arrNuclides).includes(r.id)) r.is_checked = true });

			this.division_name = res.division_name;
			this.plant_name = res.plant_name;
			this.selected_Sample_Type_Fragment = res.sample_type;
			this.selected_Sample_Type_Fragment_Last = res.sample_type_other;
			this.selected_collection_duration_fragment = res.collectionDuration;
			this.selected_collection_duration_fragment_last = res.collectionDurationOther;
			this.selected_date_of_collection = res.collectionDate;
			this.selected_monitoring_type = res.tom;
			this.selected_process_type = res.toproc;
			this.selected_process_type_other = res.topComments;
			this.selected_time_of_exposure = res.toe;
			this.selected_time_of_exposure_other = res.toeComments;
			this.selected_brief_description = res.briefDescription;
			this.seleced_iodination_last_date = res.lastIodinationDay;
			this.seleced_iodination_last_date_other = res.lastIodinationDayComments;
			this.selected_therapeutic_treatment_details = res.treatmentDetails;
			this.selected_particle_size = res.particleSize;
			this.selected_particle_size_other = res.particleSizeComments;
			this.selected_isotopic_comp_contaminants = res.isotopicComp;
			this.selected_pu_am_ration = res.puamRatio;
			this.selected_class = res.class_name;
			this.selected_class_other = res.class_other;
			this.hp_id = res.hp_id;
			this.hp_name = res.hp_name;
			if(res.weight)
				this.selected_weight = res.weight;
			
			if(res.height)
				this.selected_height = res.height;
			
			if(res.chest)
				this.selected_chest_cc = res.chest;
			this.selected_comments = res.comments;
			this.selected_previous_monitoring_date = res.prev_mon;
			this.person_id = res.person_id;

			//
			//	Beautify comments
			//
			this.arrSelectedComments = [];
			if(this.selected_comments != null && this.selected_comments.length > 0)
			{
				this.arrSelectedComments = this.selected_comments.split('\n')
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_intake_routes()
	{
		try
		{
			this.arrIntakeRoutes = [];
			let arr = await this.routeService.get_intake_routes();
			arr.forEach((r)=> 
			{
				this.arrIntakeRoutes.push({ id: r.id, name: r.name, is_checked: false, ui_name: `chkRoute${r.id}` });
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_nuclides()
	{
		try
		{
			let res = await this.nuclideService.get_nuclides();
			this.arrNuclides = [];
			for(let i = 0 ; i < res.length; ++i)
				this.arrNuclides.push({ id: res[i].id, name: res[i].name, is_checked: false, ui_name: `chkNuclide${res[i].id}` });
		}
		catch(e)
		{
			console.log(e);
		}
	}

	get_formatted_nuclides()
	{
		if(this.arrNuclides.length == 0)
			return "-NA-";
		return this.arrNuclides.filter((x)=> x.is_checked).map((x)=> x.name).join(", ");
	}

	get_formatted_routes()
	{
		if(this.arrIntakeRoutes.length == 0)
			return "-NA-";
		return this.arrIntakeRoutes.filter((x)=> x.is_checked).map((x)=> x.name).join(", ");
	}

	failed_to_load_worker_details(ant: any)
	{
		this._location.back();
	}
}
