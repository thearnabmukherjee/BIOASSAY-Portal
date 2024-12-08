import { Isotope } from './../../../Classes/Isotope';
import { IsotopeService } from './../../../services/isotope.service';
import { Instrument } from './../../../Classes/Instrument';
import { InstrumentService } from './../../../services/instrument.service';
import { Message } from './../../../Classes/Message';
import { CheckSource } from './../../../Classes/CheckSource';
import { DetectorEfficiency } from './../../../Classes/DetectorEfficiency';
import { CheckSourceService } from './../../../services/check-source.service';
import { DetectorService } from './../../../services/detector.service';
import { DetectorEfficiencyService } from './../../../services/detector-efficiency.service';
import { Component, OnInit } from '@angular/core';
import { Detector } from '../../../Classes/Detector';

@Component({
	selector: 'app-detector-efficiency',
	templateUrl: './detector-efficiency.component.html',
	styleUrls: ['./detector-efficiency.component.scss']
})
export class DetectorEfficiencyComponent implements OnInit 
{
	is_loading = false;
	is_open_modal = false;
	is_creating = false;
	is_enabling_disabling = false;
	arrTech: string[] = ['ALPHA SPECTROMETRY', 'LF SAM', 'LF CFM'];

	arrRecords: DetectorEfficiency[] = [];
	arrDetectors: Detector[] = [];
	arrSourceRecords: CheckSource[]= [];
	arrInstrumentRecords: Instrument[] =[];
	arrIsotopes: Isotope[] = [];

	arrFilteredDetectors: Detector[] = [];
	arrFilteredCheckSources: CheckSource[] =[];
	selected_instrument_id: number = 0;
	selected_detector_id: number = 0;
	selected_source_id: number = 0;
	counting_time: string = "0";
	measured_counts: string = "0";
	selected_technique: string = "";
	efficiency: string = "";
	comments: string = "";

	constructor(private detEfficiencyService: DetectorEfficiencyService,
				private detectorService: DetectorService,
				private sourceService: CheckSourceService,
				private instrumentService: InstrumentService,
				private isotopeService: IsotopeService) { }

	ngOnInit()
	{
		this._load_data();
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.detEfficiencyService.get_detector_efficiency_records();
			this.arrDetectors = await this.detectorService.get_detectors(0);
			this.arrSourceRecords = await this.sourceService.get_check_sources();
			this.arrInstrumentRecords = await this.instrumentService.get_instruments();
			
			this.arrRecords.forEach((r)=>
			{
				let detRef = this.arrDetectors.filter((d)=> d.id == r.detector_id)[0];
				r.detector_name = detRef.name;
				r.source_name = this.arrSourceRecords.filter((s)=> s.id == r.source_id)[0].name;
				r.instrument_name = this.arrInstrumentRecords.filter((ins)=> ins.id == detRef.instrument_id)[0].name;
			});
			
			this.arrFilteredCheckSources = this.arrSourceRecords.filter((s)=> s.is_active);
			this.arrIsotopes = await this.isotopeService.get_isotopes(0);
		}
		catch(e)
		{
			console.log(e);
		}
		this.is_loading = false;
	}

	open_modal()
	{
		this.selected_instrument_id = 0;
		this.selected_detector_id = 0;
		this.selected_source_id = 0;
		this.counting_time = "0";
		this.measured_counts = "";
		this.selected_technique = "";
		this.efficiency = "";
		this.comments = "";
		this.is_open_modal = true;
	}

	_instrument_selected(val: any)
	{
		this.selected_instrument_id = val;
		this.arrFilteredDetectors = this.arrDetectors.filter((d)=> d.instrument_id == val);
	}

	private IsFormOkay()
	{
		//
		//	Detector
		//
		if(this.selected_detector_id <= 0 || this.arrDetectors.filter((d)=> d.id == this.selected_detector_id).length == 0)
		{
			Message.show_message("Error", "Please select a detector", true);
			return false;
		}

		//
		//	Check Source
		//
		if(this.selected_source_id <= 0 || this.arrSourceRecords.filter((d)=> d.id == this.selected_source_id).length == 0)
		{
			Message.show_message("Error", "Please select a check source record", true);
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
		//	Measured counts
		//
		if(this.measured_counts == null || this.measured_counts.length == 0)
		{
			Message.show_message("Error", "Please provide measured counts", true);
			return false;
		}
		if(isNaN(+this.measured_counts) || +this.measured_counts < 0)
		{
			Message.show_message("Error", "Please provide proper measured counts. It must be an integer greater than equal to zero", true);
			return false;
		}

		//
		//	Efficiency
		//
		if(this.efficiency == null || this.efficiency.length == 0)
		{
			Message.show_message("Error", "Please provide detector efficiency", true);
			return false;
		}
		if(isNaN(+this.efficiency) || +this.efficiency <= 0)
		{
			Message.show_message("Error", "Please provide proper efficiency value", true);
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

	get_isotope_names(arr: number[])
	{
		return this.arrIsotopes.filter((iso)=> arr.includes(iso.id)).map((iso)=> iso.name).join(", ");
	}

	create_new_record()
	{
		if(!this.IsFormOkay())
			return;
		this.is_creating = true;
		this.detEfficiencyService.create_new_detector_efficiency_record(this.selected_detector_id, 
																		this.selected_source_id, 
																		+this.counting_time, 
																		+this.measured_counts,
																		this.selected_technique,
																		+this.efficiency).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "New detector efficiency record created successfully", false);
				this._load_data();
				this.close_modal();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_record(record_id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.detEfficiencyService.enable_disable_detector_efficiency(record_id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			Message.show_message("Success", "Efficiency record modified successfully", false);
			this._load_data();
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	calculate_efficiency()
	{
		//
		//	Measured counts
		//
		if(isNaN(+this.measured_counts))
		{
			Message.show_message("Error", "Please provide measured counts", true);
			return;
		}
		if(+this.measured_counts < 0)
		{
			Message.show_message("Error", "Please provide proper value for measured counts", true);
			return;
		}

		//
		//	Counting time
		//
		if(isNaN(+this.counting_time))
		{
			Message.show_message("Error", "Please provide counting time", true);
			return;
		}
		if(+this.counting_time <= 0)
		{
			Message.show_message("Error", "Please provide proper value for counting time", true);
			return;
		}

		//
		//	Source
		//	
		if(this.selected_source_id <= 0)
		{
			Message.show_message("Error", "Please select source", true);
			return;
		}

		let srcRef = this.arrSourceRecords.filter((s)=> s.id == this.selected_source_id)[0];
		if(srcRef.activity <= 0)
			return;

		let eff = +this.measured_counts / +this.counting_time / srcRef.activity * 100;
		this.efficiency = eff.toFixed(3);
	}

	close_modal()
	{
		this.is_open_modal = false;
	}
}
