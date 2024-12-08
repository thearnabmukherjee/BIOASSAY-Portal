import { InstrumentService } from './../../../services/instrument.service';
import { Instrument } from './../../../Classes/Instrument';
import { DetectorService } from './../../../services/detector.service';
import { Detector } from './../../../Classes/Detector';
import { Component, OnInit } from '@angular/core';
import { Message } from '../../../Classes/Message';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-detectors',
	templateUrl: './detectors.component.html',
	styleUrls: ['./detectors.component.scss']
})
export class DetectorsComponent implements OnInit 
{
	is_loading = false;
	is_open_modal = false;
	is_creating = false;
	is_enabling_disabling = false;
	arrRecords: Detector[] = [];
	arrInst: Instrument[] = [];

	inst_id: number = 0;
	name: string = "";

	constructor(private detectorService: DetectorService,
				private instService: InstrumentService) { }

	ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.detectorService.get_detectors(0);
			this.arrInst = await this.instService.get_instruments();
		}
		catch(e)
		{
			console.log(e);
		}
		this.is_loading = false;
	}

	get_instrument_name(inst_id: number)
	{
		for(let i = 0 ; i < this.arrInst.length; ++i)
			if(this.arrInst[i].id == inst_id)
				return this.arrInst[i].name;
		return "--NA--";
	}

	open_modal()
	{
		this.inst_id = 0;
		this.name = "";
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_new_detector()
	{
		if(this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name of the detector", true);
			return;
		}
		if(this.inst_id <= 0)
		{
			Message.show_message("Error", "Please select the instrument", true);
			return;
		}

		this.is_creating = true;
		this.detectorService.create_detector(this.name, this.inst_id).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.close_modal();
				Message.show_message("Success", "New detector created successfully", false);
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_detector(det_id: number, isEnable: boolean)
	{
		this.is_enabling_disabling = true;
		this.detectorService.enable_disable_detector(det_id, isEnable).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "Detector changed successfully", false);
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	close_modal()
	{
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
