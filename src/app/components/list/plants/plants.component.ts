import { NuclideService } from './../../../services/nuclide.service';
import { Message } from './../../../Classes/Message';
import { TldService } from './../../../services/tld.service';
import { PlantService } from './../../../services/plant.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-plants',
	templateUrl: './plants.component.html',
	styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit 
{
	arrPlants: {id: number, name: string, plocation: string, is_active: boolean, is_strategic: boolean, created_on?: string, created_by?: number, modified_on?: string, modified_by?: string}[] = [];
	is_loading = true;
	is_open_tld_modal : boolean = false;
	is_open_new_plant_modal: boolean = false;
	is_open_new_nuc_plant_binding_modal: boolean = false;
	tmp_plant_name: string = "";
	tmp_plant_location: string = "";
	tmp_is_strategic: boolean = false;

	is_loading_tlds: boolean = false;
	selected_plant_id: number = -1;
	arrAllTLDs: { id: number, tld: string, is_checked: boolean }[] = [];
	arrAllNuclides: { id: number, name: string, is_checked: boolean }[] = [];
	arrAllNucPlantBinding: { id: number, nuc_id: number, plant_id: number, plant_name: string }[] = [];

	constructor(private plantService: PlantService,
				private tldService: TldService,
				private nuclideService: NuclideService) { }

	ngOnInit()
	{
		this.load_data();
	}

	private async load_data()
	{
		this.is_loading = true;
		await this.load_nuclides();
		await this.load_plants();
		await this.load_nuc_plant_binding();
		this.is_loading = false;
	}

	private async load_nuclides()
	{
		try
		{
			let arr = await this.nuclideService.get_nuclides();
			this.arrAllNuclides = [];
			for(let i = 0 ; i < arr.length; ++i)
				this.arrAllNuclides.push({ id: arr[i].id, name: arr[i].name, is_checked: false });
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_nuc_plant_binding()
	{
		try
		{
			this.arrAllNucPlantBinding = await this.nuclideService.get_plant_nuclides(0);
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_plants()
	{
		try
		{
			let res = await this.plantService.get_plants();
			if(!res.isError)
			{
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
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private _scroll_to_top()
	{
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}

	ask_for_new_plant()
	{
		this.tmp_plant_name = "";
		this.tmp_plant_location = "";
		this.tmp_is_strategic = false;
		this.is_open_new_plant_modal = true;
		AppSettings.subjectBlockScroll.next(true);
		this._scroll_to_top();
	}

	create_new_plant()
	{
		if(this.tmp_plant_name.length == 0)
		{
			Message.show_message("Error", "Please specify name of the plant", true);
			return;
		}
		else if(this.tmp_plant_location.length == 0)
		{
			Message.show_message("Error", "Please specify location of the plant", true);
			return;
		}
		this.plantService.create_new_plant(this.tmp_plant_name, this.tmp_plant_location, this.tmp_is_strategic).then((res)=>
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "New plant created successfully", false);
				this.load_data();
				this.close_modal();
			}
		}).catch((e)=> console.log(e));
	}

	plant_is_checked_unchecked(evt: any)
	{
		this.tmp_is_strategic = evt.target.checked;
	}



	ask_for_tld_assignment(plant_id: number)
	{
		this.selected_plant_id = plant_id;
		this.is_loading_tlds = true;
		this.tldService.get_tlds().then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.arrAllTLDs = [];
				let arr = res.msg;
				for(let i = 0 ; i < arr.length; ++i)
					this.arrAllTLDs.push({ id: arr[i].id, tld: arr[i].name, is_checked: arr[i].plant == plant_id });
			}
			this.is_open_tld_modal = true;
			AppSettings.subjectBlockScroll.next(true);
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading_tlds = false);
		this._scroll_to_top();
	}

	tld_checked_unchecked(obj: { id: number, tld: string, is_checked: boolean }, evt: any)
	{
		obj.is_checked = evt.target.checked;
	}

	change_assignment()
	{
		if(this.selected_plant_id <= 0)
			return;
		let arrAssignedTLDs: number[] = [];
		this.arrAllTLDs.forEach((t)=> { if(t.is_checked) arrAssignedTLDs.push(t.id); });
		this.tldService.assign_tld_to_plant(this.selected_plant_id, arrAssignedTLDs).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "TLDs assigned successfully to the specified plant", false);
			}
			this.close_modal();
		}).catch((e)=> console.log(e)).finally(()=> this.close_modal() );
	}





	ask_for_nuclide_assignment(plant_id: number)
	{
		this.selected_plant_id = plant_id;
		this.is_open_new_nuc_plant_binding_modal = true;
		AppSettings.subjectBlockScroll.next(true);
		this.arrAllNuclides.forEach((n)=> n.is_checked = false);
		this.arrAllNucPlantBinding.forEach((b)=> 
		{
			for(let i = 0 ; i < this.arrAllNuclides.length; ++i)
				if(this.arrAllNuclides[i].id == b.nuc_id && b.plant_id == plant_id)
				{
					this.arrAllNuclides[i].is_checked = true;
					break;
				}
		});
		this._scroll_to_top();
	}

	nuclide_checked_unchecked(obj: { id: number, name: string, is_checked: boolean }, evt: any)
	{
		obj.is_checked = evt.target.checked;
	}

	change_nuclide_binding()
	{
		if(this.selected_plant_id <= 0)
			return;
		let arrAssignedNuclides: number[] = [];
		this.arrAllNuclides.forEach((n)=> { if(n.is_checked) arrAssignedNuclides.push(n.id); })
		this.nuclideService.change_plant_nuclide_assignment(this.selected_plant_id, arrAssignedNuclides).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.load_data();
				this.close_modal();
				Message.show_message("Success", "Nuclides assigned successfully to the specified plant", false);
			}
		}).catch((e)=> console.log(e)).finally(()=> this.close_modal());
	}



	close_modal()
	{
		this.is_open_tld_modal = false;
		this.is_open_new_plant_modal =false;
		this.is_open_new_nuc_plant_binding_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
