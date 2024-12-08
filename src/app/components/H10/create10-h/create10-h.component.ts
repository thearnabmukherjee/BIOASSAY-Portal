import { Location } from '@angular/common';
import { ClassService } from './../../../services/class.service';
import { IntakerouteService } from './../../../services/intakeroute.service';
import { ProcessTypeService } from './../../../services/process-type.service';
import { TldService } from './../../../services/tld.service';
import { NuclideService } from './../../../services/nuclide.service';
import { UsersService } from './../../../services/users.service';
import { PlantService } from './../../../services/plant.service';
import { DivisionService } from './../../../services/division.service';
import { H10Service } from './../../../services/h10.service';
import { Message } from './../../../Classes/Message';
import { WorkerService } from './../../../services/worker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as bulmaCalendar from 'bulma-calendar';
import { Divisions } from '../../../Classes/Divisions';

@Component({
	selector: 'app-create10-h',
	templateUrl: './create10-h.component.html',
	styleUrls: ['./create10-h.component.scss']
})
export class Create10HComponent implements OnInit 
{
	is_loading = true;
	is_changing_plant = false;
	is_personal_details_opened = true;
	is_monitoring_details_opened = true;
	person_image_url = "";
	personal_details_obj: any = null;
	person_id: number = -1;
	last_10H_form_obj: any = null;
	arrDivisions: any[] = [];
	arrPlants: any[] = [];
	arrNuclides: { id: number, name: string, is_checked: boolean, ui_name: string }[] = [];
	arrWorkerType: string[] = [ 'Employee', 'Contract worker', 'Trainee', 'Other' ];
	arrTLDFragments: { id: number, tld: string, plant_id: number, plant_name: string }[] = [];
	arrCCFragments: string[] = [ 'G', 'NG', 'BR', 'NE' ];
	arrSampleType: string[] = [ 'Urine', 'Fecal', 'Other' ];
	arrCollectionDuration: string[] = ['Spot', 'Overnight', '24 hours', '48 hours', '72 hours', 'Others'];
	arrMonitoringType: string[] = [ 'Routine', 'Special', 'Task-related', 'Baseline', 'Termination', 'Superannuation', 'Confirmatory', 'Follow-up' ];
	arrProcessTypes: { id: number, desc: string, is_active: boolean }[] = [];
	arrIntakeRoutes: { id: number, name: string, is_checked: boolean, ui_name: string }[] = [];
	arrParticleSizes: string[] = ['Default (5 micron)', 'Mention in comments'];
	arrClasses: {id: number, name: string, is_checked: boolean, ui_name: string}[] = [];
	date_of_previous_monitoring: string = "Not found!";
	my_info: any = null;
	is_creating_10H_form = false;

	private MAX_DATE_OF_SAMPLE_COLLECTION = new Date();
	private MIN_DATE_OF_SAMPLE_COLLECTION = new Date();
	private MAX_EXPOSURE_TIME = new Date();
	private MAX_IODINATION_DATE = new Date();

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
	selected_class: number = 0;
	selected_weight: number = 0;
	selected_height: number = 0;
	selected_chest_cc: number = 0;
	selected_comments: string = "";
	selected_class_other: string = "";

	constructor(private route: ActivatedRoute,
				private workerService: WorkerService,
				private h10Service: H10Service,
				private divisionService: DivisionService,
				private plantService: PlantService,
				private userService: UsersService,
				private nuclideService: NuclideService,
				private tldService: TldService,
				private processTypeService: ProcessTypeService,
				private routeService: IntakerouteService,
				private classService: ClassService,
				private router: Router,
				private _location: Location) 
	{ 

		this.MAX_DATE_OF_SAMPLE_COLLECTION.setDate(this.MAX_DATE_OF_SAMPLE_COLLECTION.getDate() + 30);
		this.MIN_DATE_OF_SAMPLE_COLLECTION.setDate(this.MIN_DATE_OF_SAMPLE_COLLECTION.getDate() - 7);
	}

	ngOnInit()
	{
		let person_id = this.route.snapshot.queryParamMap.get('person-id');
		if(person_id == null)
			return;
		this.person_id = +person_id;
		this.load_data(+person_id);

		//
		//	Calcender for "Date of collection"
		//
		bulmaCalendar.attach('#dtCollection', { dateFormat: 'yyyy-MM-dd', maxDate: this.MAX_DATE_OF_SAMPLE_COLLECTION, minDate: this.MIN_DATE_OF_SAMPLE_COLLECTION })[0].on('select', dt => 
		{
			this.selected_date_of_collection = <string><any>dt.data.value();
		});

		//
		//	Calcender for "Date of collection"
		//
		bulmaCalendar.attach('#dtExposureTime', { dateFormat: 'yyyy-MM-dd', maxDate: this.MAX_EXPOSURE_TIME })[0].on('select', dt => 
		{
			this.selected_time_of_exposure = <string><any>dt.data.value();
		});

		//
		//	Calcender for "Iodination date"
		//
		bulmaCalendar.attach('#dtIodination', { dateFormat: 'yyyy-MM-dd', maxDate: this.MAX_IODINATION_DATE })[0].on('select', dt => 
		{
			this.seleced_iodination_last_date = <string><any>dt.data.value();
		});
	}

	private async load_data(person_id: number)
	{
		this.is_loading = true;
		let arrT: any[] = [];

		//arrT.push(this.load_worker_details(person_id));
		arrT.push(this.load_last_10H_of_person(person_id));
		arrT.push(this.load_divisions());
		arrT.push(this.load_only_my_plants());
		arrT.push(this.load_last_10H_info(person_id));
		arrT.push(this.load_type_of_process());
		arrT.push(this.load_intake_routes());
		arrT.push(this.load_classes());
		arrT.push(this.load_previous_monitoring_date(person_id));

		for(let i = 0 ; i < arrT.length; ++i)
			await arrT[i];
		
		//
		//	Make default selections according to last 10H
		//
		await this.make_default_selections_according_to_last_10H();
		this.is_loading = false;
	}

	plant_selection_changed(evt: any)
	{
		this.selected_plant_id = parseInt(evt.target.value);
		this._plant_is_changed();
	}

	private async _plant_is_changed()
	{
		this.is_changing_plant = true;
		await this.load_linked_radionuclides(this.selected_plant_id);
		await this.load_linked_TLDs(this.selected_plant_id);
		this.selected_tld_fragment = "";
		this.selected_tld_fragment_last = "";
		this.is_changing_plant = false;
	}

	intake_route_checked_unchecked(obj: { id: number, name: string, is_checked: boolean, ui_name: string }, evt: any)
	{
		obj.is_checked = evt.target.checked;
	}

	nuclide_checked_unchecked(obj: { id: number, name: string, is_checked: boolean, ui_name: string }, evt: any)
	{
		obj.is_checked = evt.target.checked;
	}

	submit_10H_form()
	{
		if(!this.isFormOkay())
			return;
		let obj_to_send = 
		{
			division_id: this.selected_division_id,
			plant_id: this.selected_plant_id,
			worker_type: this.selected_worker_type,
			tld1: this.selected_tld_fragment,
			tld2: this.selected_tld_fragment_last,
			cc1: this.selected_CC_fragment,
			cc2: this.selected_CC_fragment_middle,
			cc3: this.selected_CC_fragment_last,
			sample_type1: this.selected_Sample_Type_Fragment,
			sample_type2: this.selected_Sample_Type_Fragment_Last,
			collectionDuration1: this.selected_collection_duration_fragment,
			collectionDuration2: this.selected_collection_duration_fragment_last,
			collectionDate: this.selected_date_of_collection,
			tom: this.selected_monitoring_type,
			toproc1: this.selected_process_type,
			toproc2: this.selected_process_type_other,
			toe1: this.selected_time_of_exposure,
			toe2: this.selected_time_of_exposure_other,
			briefDescription: this.selected_brief_description,
			arrRoutes: this.arrIntakeRoutes.filter(r => r.is_checked).map(r => r.id),
			arrNuclides: this.arrNuclides.filter(r => r.is_checked).map(r => r.id),
			lastIodinationDay1: this.seleced_iodination_last_date,
			lastIodinationDay2: this.seleced_iodination_last_date_other,
			treatmentDetails: this.selected_therapeutic_treatment_details,
			particleSize1: this.selected_particle_size,
			particleSize2: this.selected_particle_size_other,
			isotopicComp: this.selected_isotopic_comp_contaminants,
			puamRatio: this.selected_pu_am_ration,
			selectedClass: this.selected_class,
			class_other: this.selected_class_other,
			weight: this.selected_weight,
			height: this.selected_height,
			chest: this.selected_chest_cc,
			comments: this.selected_comments,
			person_id: this.person_id
		};
		this.is_creating_10H_form = true;
		this.h10Service.create_10H_form(obj_to_send).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "10H form created successfully", false).then((v)=> this._location.back());
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating_10H_form = false);
	}

	private isFormOkay()
	{
		if(this.selected_division_id <= 0)
		{
			Message.show_message("Error", "Please select a division", true);
			return false;
		}
		else if(this.selected_plant_id <= 0)
		{
			Message.show_message("Error", "Please select a plant", true);
			return false;
		}
		else if(this.selected_worker_type == "")
		{
			Message.show_message("Error", "Please select the worker type", true);
			return false;
		}
		else if(this.selected_Sample_Type_Fragment == "")
		{
			Message.show_message("Error", "Please select the sample type", true);
			return false;
		}
		else if(this.selected_Sample_Type_Fragment == this.arrSampleType[2] && this.selected_Sample_Type_Fragment_Last == "")
		{
			Message.show_message("Error", "Please specify other sample type details", true);
			return false;
		}
		else if(this.selected_process_type == "")
		{
			Message.show_message("Error", "Please select Nature and type of process or operation", true);
			return false;
		}
		else if(this.selected_process_type == "Other (Please Specify)" && this.selected_process_type_other == "")
		{
			Message.show_message("Error", "Please specify other Nature and type of process or operation details", true);
			return false;
		}
		else if(this.selected_collection_duration_fragment == "")
		{
			Message.show_message("Error", "Please select duration of sample collection", true);
			return false;
		}
		else if((this.selected_monitoring_type == this.arrMonitoringType[1] || this.selected_monitoring_type == this.arrMonitoringType[2]) && (this.selected_brief_description == ""))
		{
			Message.show_message("Error", `Please specify Brief relevant description of incidence. It is mandatory for ${this.arrMonitoringType[1]} and ${this.arrMonitoringType[2]} monitorings`, true);
			return false;
		}
		
		if((this.selected_monitoring_type == this.arrMonitoringType[1]) && (this.selected_time_of_exposure == ""))
		{
			Message.show_message("Error", `Probable date, duration and time of exposure is mandatory for Special monitoring`, true);
			return false;
		}
		else if(this.arrIntakeRoutes.filter(r => r.is_checked).length == 0)
		{
			Message.show_message("Error", "Please select at-least one intake route", true);
			return false;
		}
		else if(this.arrNuclides.filter(r => r.is_checked).length == 0)
		{
			Message.show_message("Error", "Please select at-least one radio nuclide", true);
			return false;
		}
		else if(this.selected_date_of_collection == "")
		{
			Message.show_message("Error", "Please select date of collection", true);
			return false;
		}
		else if(this.selected_class > 0)
		{
			if(this.arrClasses.filter((x)=> x.id == this.selected_class).map((x)=> x.name)[0].toLowerCase().includes("other"))
			{
				if(this.selected_class_other == null || this.selected_class_other == "")
				{
					Message.show_message("Error", "Please specify solubility type details", true);
					return false;
				}
			}
		}
		else if(this.selected_tld_fragment != "" && this.selected_tld_fragment_last == "")
		{
			Message.show_message("Error", "Please specify proper TLD number or clear it", true);
			return false;
		}
		else if(this.selected_CC_fragment != "" && (this.selected_CC_fragment_middle == "" || this.selected_CC_fragment_last == ""))
		{
			Message.show_message("Error", "Please specify proper CC number or clear it", true);
			return false;
		}
		else if(this.selected_collection_duration_fragment == this.arrCollectionDuration[5] && this.selected_collection_duration_fragment_last == "")
		{
			Message.show_message("Error", "Please specify duration of collection details", true);
			return false;
		}
		else if(!this.arrParticleSizes.includes(this.selected_particle_size))
		{
			Message.show_message("Error", "Please select particle size", true);
			return false;
		}
		else if(this.selected_particle_size == this.arrParticleSizes[1])
		{
			Message.show_message("Error", "Please specify particle size details", true);
			return false;
		}
		else if(this.selected_weight < 0)
		{
			Message.show_message("Error", "Please specify proper weight", true);
			return false;
		}
		else if(this.selected_height < 0)
		{
			Message.show_message("Error", "Please specify proper height", true);
			return false;
		}
		else if(this.selected_chest_cc < 0)
		{
			Message.show_message("Error", "Please specify proper chest circumference", true);
			return false;
		}
		return true;
	}

	private async make_default_selections_according_to_last_10H()
	{
		if(this.last_10H_form_obj == null)
			return;
		this.selected_division_id = this.last_10H_form_obj.division_id;
		this.selected_plant_id = this.last_10H_form_obj.plant_id;
		await this._plant_is_changed();
		this.selected_worker_type = this.last_10H_form_obj.worker_type;
		let tld = this.last_10H_form_obj.tld;
		if(tld != null && tld != "" && tld.length > 0)
		{
			let arr = (<string>tld).split('/');
			if(arr.length > 2)
			{
				this.selected_tld_fragment = arr[0];
				this.selected_tld_fragment_last = arr[2];
			}
		}
		let compcode = this.last_10H_form_obj.compcode;
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
		this.selected_monitoring_type = this.last_10H_form_obj.tom;
		this.selected_process_type = this.last_10H_form_obj.toproc;
		if(this.last_10H_form_obj.topComments != null && this.last_10H_form_obj.topComments != "")
			this.selected_process_type_other = this.last_10H_form_obj.topComments;
		this.arrIntakeRoutes.forEach((r)=> r.is_checked = false);
		this.arrIntakeRoutes.forEach((r)=> { if((<number[]>this.last_10H_form_obj.arrRoutes).includes(r.id)) r.is_checked = true });
		this.arrNuclides.forEach((r)=> r.is_checked = false);
		this.arrNuclides.forEach((r)=> { if((<number[]>this.last_10H_form_obj.arrNuclides).includes(r.id)) r.is_checked = true });
		this.selected_therapeutic_treatment_details = this.last_10H_form_obj.treatmentDetails;
		this.selected_particle_size = this.last_10H_form_obj.particleSize;
		this.selected_particle_size_other = this.last_10H_form_obj.particleSizeComments;
		this.selected_isotopic_comp_contaminants = this.last_10H_form_obj.isotopicComp;
		this.selected_pu_am_ration = this.last_10H_form_obj.puamRatio;

		if(this.last_10H_form_obj.selectedClass && this.last_10H_form_obj.selectedClass > 0)
			this.selected_class = this.last_10H_form_obj.selectedClass;
		if(this.last_10H_form_obj.class_other && this.last_10H_form_obj.class_other != "" && this.last_10H_form_obj.class_other != null)
			this.selected_class_other = this.last_10H_form_obj.class_other;

		if(this.last_10H_form_obj.weight && this.last_10H_form_obj.weight > 0)
			this.selected_weight = this.last_10H_form_obj.weight;

		if(this.last_10H_form_obj.height && this.last_10H_form_obj.height > 0)
			this.selected_height = this.last_10H_form_obj.height;

		if(this.last_10H_form_obj.chest && this.last_10H_form_obj.chest > 0)
			this.selected_chest_cc = this.last_10H_form_obj.chest;
		
		if(this.last_10H_form_obj.prev_mon != null && this.last_10H_form_obj.prev_mon != "")
			this.date_of_previous_monitoring = this.last_10H_form_obj.prev_mon;
	}

	private async load_previous_monitoring_date(person_id: number)
	{
		this.date_of_previous_monitoring = "Not found!";
		this.userService.get_previous_monitoring_date(person_id).then((d)=>
		{ 
			if(d != null && d != "") 
				this.date_of_previous_monitoring = d; 
		}).catch((e)=> console.log(e));
	}

	private async load_classes()
	{
		try
		{
			let arr = await this.classService.get_classes();
			this.arrClasses = [];
			arr.forEach((c)=> 
			{
				this.arrClasses.push({ id: c.id, name: c.name, is_checked: false, ui_name: `chkClass${c.id}` });
			});
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

	// private async load_worker_details(person_id: number)
	// {
	// 	try
	// 	{
	// 		this.personal_details_obj = null;
	// 		this.person_image_url = "";
	// 		let res = await this.workerService.get_personal_details_of_worker(person_id);
	// 		if(res.isError)
	// 		{
	// 			console.log("Failed to get personal details : " + res.msg);
	// 		}
	// 		else
	// 		{
	// 			this.personal_details_obj = res.msg;
	// 			this.person_image_url = res.msg.photo_url;
	// 		}
	// 	}
	// 	catch(e)
	// 	{
	// 		console.log(e);
	// 	}
	// }

	private async load_last_10H_of_person(person_id: number)
	{
		try
		{
			this.last_10H_form_obj = null;
			let res = await this.h10Service.get_last_10H_of_person(person_id);
			if(!res.isError)
				this.last_10H_form_obj = res.msg;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_divisions()
	{
		try
		{
			this.arrDivisions = [];
			let res = await this.divisionService.get_divisions();
			if(!res.isError)
			{
				this.arrDivisions = <Divisions[]>res.msg;
				this.arrDivisions.sort((a, b)=>
				{
					if(a.abbr < b.abbr)
						return -1;
					else if(a.abbr > b.abbr)
						return 1;
					else
						return 0;
				});
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_only_my_plants()
	{
		try
		{
			this.arrPlants = [];
			//
			//	Load all plants
			//
			let res = await this.plantService.get_plants();
			if(res.isError) 
				return;
			this.arrPlants = res.msg;
			this.arrPlants.sort((a, b)=> 
			{
				if(a.name < b.name)
					return -1;
				else if(a.name > b.name)
					return 1;
				else
					return 0;
			});

			//
			//	Load user info
			//
			let user_info = await this.userService.get_my_info();
			this.my_info = user_info;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_last_10H_info(person_id: number)
	{
		try
		{
			this.last_10H_form_obj = null;
			let res = await this.h10Service.get_last_10H_of_person(person_id);
			if(!res.isError)
				this.last_10H_form_obj = res.msg;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_linked_radionuclides(plant_id: number)
	{
		try
		{
			this.arrNuclides = [];
			let arrBinding = await this.nuclideService.get_plant_nuclides(plant_id);
			if(arrBinding.length == 0)
			{
				return;
			}
			let arrNuclides = await this.nuclideService.get_nuclides();
			for(let i = 0 ; i < arrBinding.length; ++i)
			{
				for(let j = 0 ; j < arrNuclides.length; ++j)
					if(arrBinding[i].nuc_id == arrNuclides[j].id)
					{
						this.arrNuclides.push({ id: arrNuclides[j].id, name: arrNuclides[j].name, is_checked: false, ui_name: `chkNuc${arrNuclides[j].id}` });
						break;
					}
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_linked_TLDs(plant_id: number)
	{
		try
		{
			this.arrTLDFragments = [];
			let arrTLD = await this.tldService.get_tlds();
			if(arrTLD.isError)
				return;
			
			arrTLD = arrTLD.msg;
			for(let i = 0 ; i < arrTLD.length; ++i)
				if(arrTLD[i].plant == plant_id)
					this.arrTLDFragments.push(
					{ 
						id: arrTLD[i].id, 
						plant_id: arrTLD[i].plant, 
						plant_name: arrTLD[i].plant_name, 
						tld: arrTLD[i].name 
					});
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_type_of_process()
	{
		try
		{
			let arr = await this.processTypeService.get_process_types();
			this.arrProcessTypes = [];
			arr.forEach((t)=> 
			{
				if(t.is_active)
					this.arrProcessTypes.push(t);
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}

	failed_to_load_worker_details(ant: any)
	{
		this._location.back();
	}
}
