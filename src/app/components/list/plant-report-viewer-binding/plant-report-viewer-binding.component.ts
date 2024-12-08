import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';
import { Message } from '../../../Classes/Message';
import { PlantService } from '../../../services/plant.service';
import { UsersService } from '../../../services/users.service';

@Component({
	selector: 'app-plant-report-viewer-binding',
	templateUrl: './plant-report-viewer-binding.component.html',
	styleUrls: ['./plant-report-viewer-binding.component.scss']
})
export class PlantReportViewerBindingComponent implements OnInit 
{
	is_loading: boolean = false;
	arrPlants: { id: number, name: string, plocation: string, is_strategic: boolean, is_checked: boolean, ui_name: string }[] = [];
	arrRecords : {id: number, username: string, first_name: string, last_name: string, email: string, plants : { plant_id: number, plant_name: string }[] }[] = [];
	is_open_plants_modal: boolean = false;
	selected_user_id: number = -1;

	constructor(private userService: UsersService,
				private plantService: PlantService) { }

	ngOnInit()
	{
		this.load_all_data();
	}

	private load_all_data()
	{
		this.load_plants().then((isSuccess)=> 
		{
			if(isSuccess)
				this.load_users();
		}).catch((e)=> console.log(e));
	}

	private async load_plants()
	{
		try
		{
			let res = await this.plantService.get_plants();
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return false;
			}
			else
			{
				this.arrPlants = [];	
				for(let i = 0 ; i < res.msg.length; ++i)
					this.arrPlants.push(
					{
						id: res.msg[i].id,
						name: res.msg[i].name,
						plocation: res.msg[i].plocation,
						is_strategic: res.msg[i].is_strategic,
						is_checked: false,
						ui_name: "chk" + res.msg[i].id.toString()
					});
				return true;
			}
		}
		catch(e)
		{
			console.log(e);
			return false;
		}
		finally
		{
			this.is_loading = false;
		}
	}

	private load_users()
	{
		this.is_loading = true;
		this.userService.get_users_roles().then((res)=> 
		{
			this._load_bindings(res);
		}).catch((e)=> { this.is_loading = false; console.log(e); });
	}

	private _load_bindings(arrUsers: {id: number, username: string, first_name: string, last_name: string, email: string, roles: string[] }[])
	{
		this.is_loading = true;
		this.userService.get_plant_rv_bindings().then((arrBinding)=>
		{
			this.arrRecords = [];
			for(let i = 0; i < arrUsers.length; ++i)
			{
				if(!arrUsers[i].roles.includes("report_viewer"))
					continue;
				let arrPlants: { plant_id: number, plant_name: string }[] = [];
				for(let j = 0; j < arrBinding.length; ++j)
					if(arrBinding[j].rv_id == arrUsers[i].id)
						arrPlants.push({ plant_id: arrBinding[j].plant_id, plant_name: arrBinding[j].plant_name });
				this.arrRecords.push(
				{ 
					id: arrUsers[i].id,
					username: arrUsers[i].username,
					first_name: arrUsers[i].first_name,
					last_name: arrUsers[i].last_name,
					email: arrUsers[i].email,
					plants: arrPlants
				});
			}
			this.is_loading = false;
		}).catch((e)=> { this.is_loading = false; console.log(e) });
	}

	format_plants(arrPlants: { plant_id: number, plant_name: string }[])
	{
		if(arrPlants.length == 0)
			return "-";
		let arr : string[] = [];
		arrPlants.forEach((p)=> arr.push(p.plant_name));
		return arr.join(", ");
	}

	ask_for_plant_change(user_id: number, arrUserPlants: { plant_id: number, plant_name: string }[])
	{
		this.selected_user_id = user_id;
		this.arrPlants.forEach((p)=> p.is_checked = false);
		this.arrPlants.forEach((p)=> 
		{ 
			for(let i = 0 ; i < arrUserPlants.length; ++i)
				if(arrUserPlants[i].plant_id == p.id)
				{
					p.is_checked = true;
					break;
				}
		});
		this.is_open_plants_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	plant_checked_unchecked(plant_obj: { id: number, name: string, plocation: string, is_strategic: boolean, is_checked: boolean, ui_name: string }, evt: any)
	{
		plant_obj.is_checked = evt.target.checked;
	}

	change_assignment()
	{
		if(this.selected_user_id <= 0)
			return;
		
		this.is_loading = true; 
		let arr: number[] = [];
		this.arrPlants.forEach((p)=> { if(p.is_checked) arr.push(p.id); });
		this.userService.change_rv_plant_assignment(this.selected_user_id, arr).then((res)=> 
		{
			this.is_loading = false; 
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.load_all_data();
				Message.show_message("Success", "Plant assignment changed successfully!!", false);
			}
		}).catch((e)=> 
		{ 
			console.log(e); 
			this.is_loading = false; 
		}).finally(()=> 
		{ 
			this.is_open_plants_modal = false;
			AppSettings.subjectBlockScroll.next(false);
		});
	}

	close_modal()
	{
		this.is_open_plants_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
