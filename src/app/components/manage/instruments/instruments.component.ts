import { Message } from './../../../Classes/Message';
import { InstrumentService } from './../../../services/instrument.service';
import { Instrument } from './../../../Classes/Instrument';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-instruments',
	templateUrl: './instruments.component.html',
	styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent implements OnInit 
{
	is_loading = false;
	is_creating = false;
	is_enabling_disabling = false;
	arrRecords: Instrument[] = [];

	constructor(private instService: InstrumentService) { }

	ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.instService.get_instruments();
		}
		catch(e)
		{
			console.log(e);
		}
		this.is_loading = false;
	}

	create_new_instrument()
	{
		let val = prompt("Please specify new instrument name");
		if(val == null || val.length == 0)
			return;
		if(val.length > 100)
		{
			Message.show_message("Error", "Maximum length of instrument name is 100 characters", true);
			return;
		}
		this.is_creating = true;
		this.instService.create_instrument(val).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "New instrument created successfully", false);
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_instrument(instrument_id: number, isEnable: boolean)
	{
		this.is_enabling_disabling = true;
		this.instService.enable_disable_instrument(instrument_id, isEnable).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "Instrument changed successfully", false);
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}
}
