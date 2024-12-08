import { Message } from './../../../Classes/Message';
import { NuclideService } from './../../../services/nuclide.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-nuclide',
	templateUrl: './nuclide.component.html',
	styleUrls: ['./nuclide.component.scss']
})
export class NuclideComponent implements OnInit 
{
	is_loading = true;
	arrNuclides: { id: number, name: string }[] = [];
	is_open_modal = false;
	new_nuclide_name = "";
	arrAssignments : { id: number, nuc_id: number, plant_id: number, plant_name: string }[] = [];

	constructor(private nuclideService: NuclideService) { }

	ngOnInit()
	{
		this.load_data();
	}

	private async load_data()
	{
		this.is_loading = true;
		await this.load_nuclides();
		await this.load_assignments();
		this.is_loading = false;
	}

	private async load_nuclides()
	{
		try
		{
			let arr = await this.nuclideService.get_nuclides();
			this.arrNuclides = arr;
			this.arrNuclides.sort((a, b)=> 
			{
				if(a.name < b.name)
					return -1;
				else if(a.name > b.name)
					return 1;
				else
					return 0;
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_assignments()
	{
		try
		{
			let arr = await this.nuclideService.get_plant_nuclides(0);
			this.arrAssignments = arr;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	ask_for_new_nuclide()
	{
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_nuclide()
	{
		if(this.new_nuclide_name == "")
			Message.show_message("Error", "Please provide the name of the nuclide", true);
		else if(this.new_nuclide_name.length > 50)
			Message.show_message("Error", "Maximum length of nuclide name is 50 characters", true);
		else
			this.nuclideService.create_new_nuclide(this.new_nuclide_name).then((res)=> 
			{
				if(res.isError)
					Message.show_message("Error", res.msg, true);
				else
				{
					Message.show_message("Success", "Nuclide created successfully", false);
					this.close_modal();
					this.load_data();
				}
			}).catch((e)=> console.log(e));
	}

	close_modal()
	{
		this.new_nuclide_name = "";
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}

	get_associated_plants(nuc_id: number)
	{
		let arrAssigned: string[] = [];
		this.arrAssignments.forEach((a)=> 
		{
			if(a.nuc_id == nuc_id)
				arrAssigned.push(a.plant_name);
		});

		if(arrAssigned.length == 0)
			return "-";
		else
			return arrAssigned.join(", ");
	}

	split_nuclide(name: string): string[]
	{
		return AppSettings.split_nuclide(name);
	}
}
