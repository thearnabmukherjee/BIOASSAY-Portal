import { Message } from './../../../Classes/Message';
import { NuclideService } from './../../../services/nuclide.service';
import { Isotope } from './../../../Classes/Isotope';
import { IsotopeService } from './../../../services/isotope.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-isotopes',
	templateUrl: './isotopes.component.html',
	styleUrls: ['./isotopes.component.scss']
})
export class IsotopesComponent implements OnInit 
{
	is_loading = false;
	is_open_modal = false;
	arrRecords: Isotope[] = [];
	arrNuclides: { id: number, name: string }[] = [];

	name: string = "";
	nuc_id: number = 0;
	is_tracer: boolean = false;
	half_life: string = "0";
	specific_activity: string = "0";

	constructor(private isotopeService: IsotopeService,
				private nuclideService: NuclideService) { }

	ngOnInit()
	{
		this._load_data();
	}

	get_nuclide_name(nuc_id: number)
	{
		for(let i = 0; i < this.arrNuclides.length; ++i)
			if(this.arrNuclides[i].id == nuc_id)
				return this.arrNuclides[i].name;
		return "-NA-";
	}

	open_new_isotope_dialog()
	{
		this.name = "";
		this.nuc_id = 0;
		this.half_life = "0";
		this.is_tracer = false;
		this.specific_activity = "0";
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	private IsFormOkay()
	{
		if(this.name == "")
		{
			Message.show_message("Error", "Please specify name for the new isotope", true);
			return false;
		}

		if(this.half_life.length == 0 || isNaN(+this.half_life) || +this.half_life <= 0)
		{
			Message.show_message("Error", "Please specify isotope half life", true);
			return false;
		}

		if(this.specific_activity.length == 0 || isNaN(+this.specific_activity) || +this.specific_activity <= 0)
		{
			Message.show_message("Error", "Please specify isotope specific activity", true);
			return false;
		}
		
		return true;
	}

	async create_new_isotope()
	{
		if(!this.IsFormOkay())
			return;
		let res = await this.isotopeService.create_new_isotope(this.name, this.nuc_id, this.is_tracer, +this.half_life, +this.specific_activity);
		if(res.isError)
		{
			Message.show_message("Error", res.msg, true);
			return;
		}
		this.close_modal();
		await this._load_data();
		Message.show_message("Success", "New isotope created successfully", false);
	}

	radionuclide_selection_changed(x: any)
	{
		this.nuc_id = x;
	}

	async manage_isotope_attributes(iso: Isotope, isTracer: boolean, half_life: number, specific_activity: number)
	{
		try
		{
			this.is_loading = true;
			let res = await this.isotopeService.manage_isotope(iso.id, iso.name, isTracer, half_life, specific_activity);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			Message.show_message("Success", 'Isotope changed successfully!!', false);//`Isotope is now ${isTracer ? '' : 'not a'} tracer`, false);
			await this._load_data(false);
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
		}
	}

	async manage_activation(isotope_id: number, isActivate: boolean)
	{
		try
		{
			this.is_loading = true;
			let res = await this.isotopeService.enable_disable_isotope(isotope_id, isActivate);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			Message.show_message("Success", `Isotope is now ${ isActivate ? 'enabled' : 'disabled' }`, false);
			await this._load_data(false);
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
		}
	}

	private async _load_data(is_change_loading_state: boolean = true)
	{
		if(is_change_loading_state)
			this.is_loading = true;
		try
		{
			await this.load_isotopes();
			await this.load_nuclides();
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			if(is_change_loading_state)
				this.is_loading = false;
		}
	}

	private async load_nuclides()
	{
		try
		{
			this.arrNuclides = await this.nuclideService.get_nuclides();
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_isotopes()
	{
		try
		{
			this.arrRecords = await this.isotopeService.get_isotopes(0);	//	All isotopes
		}
		catch(e)
		{
			console.log(e);
		}
	}

	change_half_life(iso: Isotope)
	{
		let val = prompt("Please specify new half life", iso.half_life.toString());
		if(val == null || val == "")
			return;
		if(isNaN(+val) || +val <= 0)
		{
			Message.show_message("Error", "Please specify proper half life value", true);
			return;
		}
		this.manage_isotope_attributes(iso, iso.is_tracer, +val, iso.specific_activity);
	}

	change_specific_activity(iso: Isotope)
	{
		let val = prompt("Please specify new specific activity", iso.specific_activity.toString());
		if(val == null || val == "")
			return;
		if(isNaN(+val) || +val <= 0)
		{
			Message.show_message("Error", "Please specify proper specific activity value", true);
			return;
		}
		this.manage_isotope_attributes(iso, iso.is_tracer, iso.half_life, +val);
	}

	split_nuclide(name: string): string[]
	{
		return AppSettings.split_nuclide(name);
	}

	close_modal()
	{
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
