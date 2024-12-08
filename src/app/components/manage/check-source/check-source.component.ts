import { CheckSourceService } from './../../../services/check-source.service';
import { IsotopeService } from './../../../services/isotope.service';
import { Message } from './../../../Classes/Message';
import { CheckSource } from './../../../Classes/CheckSource';
import { Isotope } from './../../../Classes/Isotope';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-check-source',
	templateUrl: './check-source.component.html',
	styleUrls: ['./check-source.component.scss']
})
export class CheckSourceComponent implements OnInit 
{
	is_loading = false;
	is_open_modal = false;
	is_creating = false;
	is_enabling_disabling = false;
	is_downloading = false;
	arrIsotopes: Isotope[] = [];
	arrRecords: CheckSource[] = [];

	name: string = "";
	activity_added: string = "";
	file_name: string = "";
	comments: string = "";
	selected_file: File | null = null;

	constructor(private isotopeService: IsotopeService,
				private checkSource: CheckSourceService) { }

	ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrIsotopes = await this.isotopeService.get_isotopes(0);
			this.arrRecords = await this.checkSource.get_check_sources();
		}
		catch(e)
		{
			console.log(e);
		}
		this.is_loading = false;
	}

	open_modal()
	{
		for(let i = 0 ; i < this.arrIsotopes.length; ++i)
		{
			this.arrIsotopes[i].is_checked = false;
			this.arrIsotopes[i].ui_name = `chk${this.arrIsotopes[i].id}`;
		}
		this.name = "";
		this.activity_added = "";
		this.file_name = "";
		this.comments = "";
		this.selected_file = null;
		this.is_open_modal = true;
	}

	files_selected(evt: any)
	{
		let files: FileList = evt.target.files;
		if(files == null || files.length == 0 || files.item(0) == null)
		{
			this.file_name = "";
			return;
		}
		else
		{
			let f = files.item(0);
			if(f == null)
			{
				this.file_name = "";
				return;
			}
			this.file_name = f.name;
			this.selected_file = f;
		}
	}

	get_isotope_names(arr: number[])
	{
		let lstNames: string[]= [];
		arr.forEach((id)=> 
		{
			let iso_name = this.arrIsotopes.filter((iso)=> iso.id == id)[0].name;
			if(!lstNames.includes(iso_name))
				lstNames.push(iso_name);
		});
		return lstNames.join(", ");
	}

	private IsFormOkay()
	{
		if(this.name == null || this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name", true);
			return false;
		}

		if(this.arrIsotopes.filter((x)=> x.is_checked).length == 0)
		{
			Message.show_message("Error", "Please select at-least one isotope", true);
			return false;
		}

		if(isNaN(+this.activity_added))
		{
			Message.show_message("Error", "Please provide value of added activity", true);
			return false;
		}

		if(+this.activity_added <= 0)
		{
			Message.show_message("Error", "Added activity must be greater than zero", true);
			return false;
		}

		return true;
	}

	create_new_check_source()
	{
		if(!this.IsFormOkay())
			return;
		this.is_creating = true;
		this.checkSource.create_new_check_source(this.name, 
												 this.arrIsotopes.filter((x)=> x.is_checked).map((x)=> x.id), 
												 +this.activity_added,
												 this.comments, this.selected_file).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				Message.show_message("Success", "Standard source record saved successfully", false);
				this.close_modal();
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_record(record_id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.checkSource.enable_disable_source_record(record_id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				Message.show_message("Success", res.msg, false);
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	isotope_checked_unchecked(obj: any, evt: any)
	{
		obj.is_checked = evt.target.checked;
	}

	download_attachment(record_id: number, file_name: string)
	{
		this.is_downloading = true;
		this.checkSource.download_attachment(record_id, file_name).then(()=> Message.show_message("Success", "File downloaded successfully", false)).catch((e)=> console.log(e)).finally(()=> this.is_downloading = false);
	}

	close_modal()
	{
		this.is_open_modal = false;
	}
}
