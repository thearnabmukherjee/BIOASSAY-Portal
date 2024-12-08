import { BackgroundService } from './../../../services/background.service';
import { Background } from './../../../Classes/Background';
import { Component, OnInit } from '@angular/core';
import { Detector } from '../../../Classes/Detector';
import { Instrument } from '../../../Classes/Instrument';
import { Isotope } from '../../../Classes/Isotope';
import { DetectorService } from '../../../services/detector.service';
import { InstrumentService } from '../../../services/instrument.service';
import { IsotopeService } from '../../../services/isotope.service';
import { Message } from '../../../Classes/Message';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit 
{
	is_loading = false;
	is_open_modal = false;
	is_creating = false;
	is_enabling_disabling = false;
	arrTech: string[] = ['ALPHA SPECTROMETRY', 'LF SAM', 'LF CFM'];

	arrRecords: Background[] = [];
	arrInstrumentRecords: Instrument[] =[];
	arrDetectors: Detector[] = [];
	arrIsotopes: Isotope[] = [];

	arrFilteredDetectors: Detector[] = [];
	name: string = "";
	selected_instrument_id: number = 0;
	selected_detector_id: number = 0;
	selected_isotope_id: number = 0;
	counting_time: string = "0";
	counts: string = "0";
	selected_technique: string = "";

	constructor(private detectorService: DetectorService,
				private instrumentService: InstrumentService,
				private isotopeService: IsotopeService,
				private backgroundService: BackgroundService) { }

	ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.backgroundService.get_backgrounds();
			this.arrInstrumentRecords = await this.instrumentService.get_instruments();
			this.arrDetectors = await this.detectorService.get_detectors(0);
			this.arrIsotopes = await this.isotopeService.get_isotopes(0);
			this.arrRecords.forEach((r)=> 
			{
				//
				//	Extract detector name
				//
				let detRef: Detector | null = null;
				for(let i = 0 ; i < this.arrDetectors.length; ++i)
					if(this.arrDetectors[i].id == r.detector_id)
					{
						r.detector_name = this.arrDetectors[i].name;
						detRef = this.arrDetectors[i];
						break;
					}
				
				//
				//	Extract isotopes
				//
				for(let i = 0 ; i < this.arrIsotopes.length; ++i)
					if(this.arrIsotopes[i].id == r.isotope_id)
					{
						r.isotope_name = this.arrIsotopes[i].name;
						break;
					}
				
				//
				//	Extract instrument name
				//
				if(detRef != null)
					for(let i = 0 ; i < this.arrInstrumentRecords.length; ++i)
						if(this.arrInstrumentRecords[i].id == detRef.instrument_id)
						{
							r.instrument_name = this.arrInstrumentRecords[i].name;
							break;
						}
			});
		}
		catch(e)
		{
			console.log(e);
		}
		this.is_loading = false;
	}

	open_modal()
	{
		this.name = "";
		this.selected_instrument_id = 0;
		this.selected_detector_id = 0;
		this.selected_isotope_id = 0;
		this.counting_time = "0";
		this.counts = "0";
		this.selected_technique = "";
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	_instrument_selected(val: any)
	{
		this.selected_instrument_id = val;
		this.arrFilteredDetectors = this.arrDetectors.filter((d)=> d.instrument_id == val);
	}

	private IsFormOkay()
	{
		//
		//	Name
		//
		if(this.name == null || this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name", true);
			return false;
		}

		//
		//	Detector
		//
		if(this.selected_detector_id <= 0 || this.arrDetectors.filter((d)=> d.id == this.selected_detector_id).length == 0)
		{
			Message.show_message("Error", "Please select a detector", true);
			return false;
		}

		//
		//	Isotope
		//
		if(this.selected_isotope_id <= 0 || this.arrIsotopes.filter((d)=> d.id == this.selected_isotope_id).length == 0)
		{
			Message.show_message("Error", "Please select an isotope", true);
			return false;
		}

		//
		//	Counting time
		//
		if(this.counting_time == null || this.counting_time.length == 0)
		{
			Message.show_message("Error", "Please provide counting time", true);
			return false;
		}
		if(isNaN(+this.counting_time) || +this.counting_time <= 0)
		{
			Message.show_message("Error", "Please provide proper counting time. It must be an integer greater than zero", true);
			return false;
		}

		//
		//	counts
		//
		if(this.counts == null || this.counts.length == 0)
		{
			Message.show_message("Error", "Please provide counts", true);
			return false;
		}
		if(isNaN(+this.counts) || +this.counts < 0)
		{
			Message.show_message("Error", "Please provide proper counts. It must be an integer greater than equal to zero", true);
			return false;
		}
		
		//
		//	Technique
		//
		if(!this.arrTech.includes(this.selected_technique))
		{
			Message.show_message("Error", "Please select an analysis technique", true);
			return false;
		}

		return true;
	}

	create_new_record()
	{
		if(!this.IsFormOkay())
			return;
		this.is_creating = true;
		this.backgroundService.create_new_background(this.name, this.selected_detector_id, this.selected_isotope_id, this.selected_technique, +this.counting_time, +this.counts).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "New background record created successfully", false);
				this._load_data();
				this.close_modal();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_record(record_id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.backgroundService.enable_disable_background_record(record_id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			Message.show_message("Success", "Background record modified successfully", false);
			this._load_data();
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	split_nuclide(name: string | undefined): string[]
	{
		if(name == null || name.length == 0 || name ===  undefined)
			return ["", "NA-", ""];
		return AppSettings.split_nuclide(name);
	}

	close_modal()
	{
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
