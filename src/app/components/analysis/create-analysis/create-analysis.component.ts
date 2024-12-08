import { Router } from '@angular/router';
import { Message } from './../../../Classes/Message';
import { InstrumentService } from './../../../services/instrument.service';
import { DetectorService } from './../../../services/detector.service';
import { Instrument } from './../../../Classes/Instrument';
import { Detector } from './../../../Classes/Detector';
import { Isotope } from './../../../Classes/Isotope';
import { IsotopeService } from './../../../services/isotope.service';
import { NuclideService } from './../../../services/nuclide.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-create-analysis',
	templateUrl: './create-analysis.component.html',
	styleUrls: ['./create-analysis.component.scss']
})
export class CreateAnalysisComponent implements OnInit 
{
	@Input("mon-id") mon_id: number = 0;
	@Output("closed") closed_event: EventEmitter<void> = new EventEmitter();

	is_loading = true;
	arrNuclides: { id: number, name: string }[] = [];
	arrTechnique = [
		{ key: 'ALPHA SPECTROMETRY', value: 'ALPHA SPECTROMETRY' },
		{ key: 'LF SAM', value: 'LF SAM' },
		{ key: 'LF CFM', value: 'LF CFM' }];
	arrIsotopes: Isotope[] = [];
	arrInstrument: Instrument[] = [];
	arrDetectors: Detector[] = [];
	arrTracer: { id: number, name: string }[] = [];

	selected_radionuclide_id: number = 0;
	selected_technique: string = "";
	selected_isotope_id: number = 0;
	selected_instrument_id: number = 0;
	selected_detector_id: number = 0;
	selected_tracer_id: number = 0;

	constructor(private nuclideService: NuclideService,
				private isotopeService: IsotopeService,
				private detectorService: DetectorService,
				private instrumentService: InstrumentService,
				private router: Router) { }

	ngOnInit()
	{
		if(this.mon_id <= 0)
		{
			this.closed_event.emit();
			return;
		}
		this.load_data();
	}

	private async load_data()
	{
		this.is_loading = true;
		try
		{
			this.arrNuclides = await this.nuclideService.get_nuclides();
			await this.load_instruments();
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

	private async load_isotopes()
	{
		if(this.selected_radionuclide_id <= 0)
			return;

		this.is_loading = true;
		try
		{
			this.selected_isotope_id = 0;
			this.selected_tracer_id = 0;
			this.arrIsotopes = (await this.isotopeService.get_isotopes(this.selected_radionuclide_id)).filter((iso)=> iso.is_active);
			this.arrTracer = [];
			this.arrIsotopes.forEach((i)=> 
			{
				if(i.is_tracer)
					this.arrTracer.push(i);
			});
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

	private async load_instruments()
	{
		this.is_loading = true;
		try
		{
			this.selected_instrument_id = 0;
			this.arrInstrument = (await this.instrumentService.get_instruments()).filter((inst)=> inst.is_active);
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

	private async load_detectors()
	{
		this.is_loading = true;
		try
		{
			this.selected_detector_id = 0;
			this.arrDetectors = [];
			this.arrDetectors = await this.detectorService.get_detectors(this.selected_instrument_id);
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

	async radionuclide_selection_changed(nuc_id: any)
	{
		this.selected_radionuclide_id = nuc_id;
		await this.load_isotopes();
	}

	async instrument_selection_changed(inst_id: any)
	{
		this.selected_instrument_id = inst_id;
		await this.load_detectors();
	}

	private IsFormOkay()
	{
		if(this.mon_id <= 0)
		{
			Message.show_message("Error", "Linked monitoring not found!", true);
			return false;
		}
		if(this.selected_radionuclide_id <= 0 || this.arrNuclides.filter((x)=> x.id == this.selected_radionuclide_id).length == 0)
		{
			Message.show_message("Error", "Please select a radionuclide", true);
			return false;
		}
		if(this.selected_technique == "")
		{
			Message.show_message("Error", "Please select analysis technique", true);
			return false;
		}
		if(this.selected_instrument_id <= 0 || this.arrInstrument.filter((x)=> x.id == this.selected_instrument_id).length == 0)
		{
			Message.show_message("Error", "Please select an instrument", true);
			return false;
		}
		if(this.selected_detector_id <= 0 || this.arrDetectors.filter((x)=> x.id == this.selected_detector_id).length == 0)
		{
			Message.show_message("Error", "Please select a detector", true);
			return false;
		}

		if(this.selected_technique == this.arrTechnique[0].key)	//	Alpha spectrometry
		{
			if(this.selected_isotope_id <= 0 || this.arrIsotopes.filter((x)=> x.id == this.selected_isotope_id).length == 0)
			{
				Message.show_message("Error", "Please select an isotope", true);
				return false;
			}
			if(this.selected_tracer_id <= 0 || this.arrTracer.filter((x)=> x.id == this.selected_tracer_id).length == 0)
			{
				Message.show_message("Error", "Please select a tracer", true);
				return false;
			}
		}

		return true;
	}

	async proceed_for_analysis()
	{
		if(!this.IsFormOkay())
			return;

		this.closed_event.emit();
		if(this.selected_technique == this.arrTechnique[0].key)		//	Alpha spectrometry
			this.router.navigate(['/create-alpha-analysis'], { queryParams: 
			{  
				'mon-id': this.mon_id,
				'nuc-id': this.selected_radionuclide_id,
				'iso-id': this.selected_isotope_id,
				'det-id': this.selected_detector_id,
				'inst-id': this.selected_instrument_id,
				'tracer-id': this.selected_tracer_id
			} });
		else
			this.router.navigate(['/create-lf-analysis'], { queryParams: 
			{  
				'mon-id': this.mon_id,
				'tech': this.selected_technique,
				'nuc-id': this.selected_radionuclide_id,
				'det-id': this.selected_detector_id
			} });
	}

	technique_changed(evt: any)
	{
		let val = evt.target.value;
		this.selected_technique = val;
	}

	close_modal()
	{
		this.closed_event.emit();
	}
}
