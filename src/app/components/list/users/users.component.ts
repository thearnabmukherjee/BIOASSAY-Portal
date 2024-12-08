import { Message } from './../../../Classes/Message';
import { UsersService } from './../../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit 
{
	is_loading = true;
	arrRecords : any[]= [];
	selected_user_id: number = -1;
	selected_user_roles: string[] =[];
	is_open_modal = false;
	is_changing_role = false;
	arrAllRoles: { name: string, label: string, is_checked: boolean }[] = [
		{ name: "normaluser", label: "Normal user", is_checked: false },
		{ name: "admin", label: "Administrator", is_checked: false },
		{ name: "oic1", label: "OIC 1", is_checked: false },
		{ name: "oic2", label: "OIC 2", is_checked: false },
		{ name: "hp", label: "Health Physicist", is_checked: false },
		{ name: "report_viewer", label: "Report viewer", is_checked: false },
		{ name: "division_head", label: "Division head", is_checked: false },
		{ name: "tech", label: "Technician", is_checked: false }
	];

	constructor(private userService: UsersService) { }

	ngOnInit()
	{
		this.load_users();
	}

	private load_users()
	{
		this.is_loading = true;
		this.userService.get_users_roles().then((res)=> this.arrRecords = res).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	ask_for_role_change(user_id: number, arrRoles: string[])
	{
		this.selected_user_id = user_id;
		this.selected_user_roles = arrRoles;
		this.arrAllRoles.forEach((r)=> r.is_checked = false);
		this.arrAllRoles.forEach((r)=> r.is_checked = this.selected_user_roles.includes(r.name));
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	role_checked_unchecked(r: { name: string, label: string, is_checked: boolean }, evt: any)
	{
		r.is_checked = evt.target.checked;
	}

	change_role()
	{
		if(this.selected_user_id <= 0)
		{
			this.is_open_modal = false;
			return;
		}
		
		let arrRoles: string[] = [];
		this.arrAllRoles.forEach((r)=> { if(r.is_checked) arrRoles.push(r.name); });
		this.is_changing_role = true;
		this.userService.change_role(this.selected_user_id, arrRoles).then((res)=>
		{
			if(!res.isError)
				Message.show_message("Success", "Role changed successfully", false);
			else
				Message.show_message("Error", res.msg, true);
		}).catch((e)=> console.log(e)).finally(()=> 
		{
			this.is_changing_role = false;
			this.is_open_modal = false;
			this.load_users();
		});
	}

	format_roles(roles: string[])
	{
		if(roles.length == 0)
			return "-";
		else
		{
			let temp: string[] = [];
			this.arrAllRoles.forEach((r)=> 
			{
				if(roles.includes(r.name)) temp.push(r.label);
			});
			return temp.join(", ");
		}
	}

	close_modal()
	{
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
