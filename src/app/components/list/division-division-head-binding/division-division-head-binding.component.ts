import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { DivisionService } from '../../../services/division.service';
import { Message } from '../../../Classes/Message';
import { AppSettings } from '../../../Classes/AppSettings';
import { Divisions } from '../../../Classes/Divisions';

@Component({
	selector: 'app-division-division-head-binding',
	templateUrl: './division-division-head-binding.component.html',
	styleUrls: ['./division-division-head-binding.component.scss']
})
export class DivisionDivisionHeadBindingComponent implements OnInit 
{
	is_loading: boolean = false;
	arrDivisions: { id: number, description: string, abbr: string, is_checked: boolean, ui_name: string }[] = [];
	arrRecords : {id: number, username: string, first_name: string, last_name: string, email: string, divisions : { div_id: number, div_name: string }[] }[] = [];
	is_open_divisions_modal: boolean = false;
	selected_user_id: number = -1;

	constructor(private userService: UsersService,
				private divisionService: DivisionService) { }

	ngOnInit()
	{
		this.load_all_data();
	}

	private load_all_data()
	{
		this.load_divisons().then((isSuccess)=> 
		{
			if(isSuccess)
				this.load_users();
		}).catch((e)=> console.log(e));
	}

	private async load_divisons()
	{
		try
		{
			let res = await this.divisionService.get_divisions();
			if(res.isError)
			{
				Message.show_message("Error", <string>res.msg, true);
				return false;
			}
			else
			{
				this.arrDivisions = [];	
				for(let i = 0 ; i < res.msg.length; ++i)
				{
					let arr = <Divisions[]>res.msg;
					this.arrDivisions.push(
					{
						id: arr[i].id,
						description: arr[i].description,
						abbr: arr[i].abbr,
						is_checked: false,
						ui_name: "chk" + arr[i].id.toString()
					});
				}
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
		this.userService.get_division_dh_bindings().then((arrBinding)=>
		{
			this.arrRecords = [];
			for(let i = 0; i < arrUsers.length; ++i)
			{
				if(!arrUsers[i].roles.includes("division_head"))
					continue;

				let arrDivs: { div_id: number, div_name: string }[] = [];
				for(let j = 0; j < arrBinding.length; ++j)
					if(arrBinding[j].rv_id == arrUsers[i].id)
						arrDivs.push({ div_id: arrBinding[j].division_id, div_name: arrBinding[j].division_name });
				this.arrRecords.push(
				{ 
					id: arrUsers[i].id,
					username: arrUsers[i].username,
					first_name: arrUsers[i].first_name,
					last_name: arrUsers[i].last_name,
					email: arrUsers[i].email,
					divisions: arrDivs
				});
			}
			this.is_loading = false;
		}).catch((e)=> { this.is_loading = false; console.log(e) });
	}

	format_division(arrDivs: { div_id: number, div_name: string }[])
	{
		if(arrDivs.length == 0)
			return "-";
		let arr : string[] = [];
		arrDivs.forEach((p)=> arr.push(p.div_name));
		return arr.join(", ");
	}

	ask_for_div_change(user_id: number, arrUserDivs: { div_id: number, div_name: string }[])
	{
		this.selected_user_id = user_id;
		this.arrDivisions.forEach((p)=> p.is_checked = false);
		this.arrDivisions.forEach((p)=> 
		{ 
			for(let i = 0 ; i < arrUserDivs.length; ++i)
				if(arrUserDivs[i].div_id == p.id)
				{
					p.is_checked = true;
					break;
				}
		});
		this.is_open_divisions_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	division_checked_unchecked(div_obj: { id: number, description: string, abbr: string, is_checked: boolean, ui_name: string }, evt: any)
	{
		div_obj.is_checked = evt.target.checked;
	}

	change_assignment()
	{
		if(this.selected_user_id <= 0)
			return;
		
		this.is_loading = true; 
		let arr: number[] = [];
		this.arrDivisions.forEach((p)=> { if(p.is_checked) arr.push(p.id); });
		this.userService.change_division_dh_assignment(this.selected_user_id, arr).then((res)=> 
		{
			this.is_loading = false; 
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.load_all_data();
				Message.show_message("Success", "Division assignment changed successfully!!", false);
			}
		}).catch((e)=> 
		{ 
			console.log(e); 
			this.is_loading = false; 
		}).finally(()=> 
		{ 
			this.is_open_divisions_modal = false;
			AppSettings.subjectBlockScroll.next(false);
		});
	}

	close_modal()
	{
		this.is_open_divisions_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
