import { Message } from './../../../Classes/Message';
import { DivisionService } from './../../../services/division.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-divisions',
	templateUrl: './divisions.component.html',
	styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit 
{
	arrDivisions: { id: number, abbr: string, description: string, is_active: boolean, created_on?: string, created_by?: string, modified_on?: string, modified_by?: string }[] = [];
	is_loading = true;
	is_open_new_division_modal = false;
	tmp_div_abbr: string = "";
	tmp_div_desc: string = "";

	constructor(private divisionService: DivisionService) { }

	ngOnInit()
	{
		this.load_divisions();
	}

	private load_divisions()
	{
		this.is_loading = true;
		this.divisionService.get_divisions().then((res: any)=> 
		{
			if(!res.isError)
			{
				this.arrDivisions = res.msg; 
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
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	ask_for_new_division()
	{
		this.tmp_div_abbr = "";
		this.tmp_div_desc = "";
		this.is_open_new_division_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_new_division()
	{
		if(this.tmp_div_abbr.length == 0)
		{
			Message.show_message("Error", "Please specify abbreviation of division", true);
			return;
		}
		else if(this.tmp_div_desc.length == 0)
		{
			Message.show_message("Error", "Please specify description of division", true);
			return;
		}

		this.divisionService.create_new_division(this.tmp_div_abbr, this.tmp_div_desc).then((res)=>
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "Division created successfully", false);
				this.load_divisions();
				this.close_modal();
			}
		}).catch((e)=> console.log(e));
	}

	close_modal()
	{
		this.is_open_new_division_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
