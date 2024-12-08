import { Message } from './../../../Classes/Message';
import { PlantService } from './../../../services/plant.service';
import { TldService } from './../../../services/tld.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-tld',
	templateUrl: './tld.component.html',
	styleUrls: ['./tld.component.scss']
})
export class TldComponent implements OnInit 
{
	is_loading = true;
	is_open_create_tld = false;
	new_tld_name: string = "";
	new_plant_id: number = -1;
	arrPlants: {id: number, name: string, plocation: string, is_active: boolean, is_strategic: boolean, created_on?: string, created_by?: number, modified_on?: string, modified_by?: string}[] =[ ];
	arrTLDS: { id: number, tld: string, plant_id: number, plant_name: string }[] = [];

	constructor(private tldService: TldService,
				private plantService: PlantService) { }

	async ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		try
		{
			this.is_loading = true;
			await this.load_tlds();
			await this.load_plants();
		}
		catch(e)
		{
			console.log(e);
			Message.show_message("Error", "An error occurred while loading the data", true);
		}
		finally
		{
			this.is_loading = false;
		}
	}

	private async load_tlds()
	{
		let res = await this.tldService.get_tlds();
		if(res.isError)
			Message.show_message("Error", res.msg, true);
		else
		{
			let arr = res.msg;
			this.arrTLDS = [];
			for(let i = 0; i < arr.length; ++i)
			{
				let obj_tld = arr[i];
				let temp: { id: number, tld: string, plant_id: number, plant_name: string } = { id: obj_tld.id, tld: obj_tld.name, plant_id: obj_tld.plant, plant_name: "" };
				this.arrTLDS.push(temp);
			}
			this.arrTLDS.sort((a, b)=> 
			{
				if(a.tld < b.tld)
					return -1;
				else if(a.tld > b.tld)
					return 1;
				else
					return 0;
			});
		}
	}

	private async load_plants()
	{
		let res = await this.plantService.get_plants();
		if(res.isError)
		{
			this.is_loading = false;
			Message.show_message("Error", res.msg, true);
		}
		else
		{
			this.arrPlants = res.msg;
			this.arrTLDS.forEach((t)=> 
			{
				let p = this.arrPlants.filter((x)=> x.id == t.plant_id)[0];
				t.plant_name = p.name;
			});
		}
	}

	ask_for_new_tld()
	{
		this.is_open_create_tld = true;
		AppSettings.subjectBlockScroll.next(true);
		this.new_plant_id = -1;
	}

	create_tld()
	{
		if(this.new_tld_name == "")
		{
			Message.show_message("Error", "Please provide name of TLD", true);
			return;
		}
		else if(this.new_tld_name.length > 10)
		{
			Message.show_message("Error", "Maximum length for TLD is 10", true);
			return;
		}
		else if(this.new_plant_id <= 0)
		{
			Message.show_message("Error", "Please select a plant associated with this TLD", true);
			return;
		}

		this.tldService.create_new_tld(this.new_tld_name, this.new_plant_id).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "TLD created successfully", false);
				this.close_modal();
				this._load_data();
			}
		}).catch((e)=> console.log(e));
	}

	close_modal()
	{
		this.new_tld_name = "";
		this.is_open_create_tld = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
