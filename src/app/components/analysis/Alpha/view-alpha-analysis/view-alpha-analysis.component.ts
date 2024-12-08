import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Calculations } from 'src/app/Classes/Calculation';
import { Detector } from 'src/app/Classes/Detector';
import { Isotope } from 'src/app/Classes/Isotope';
import { DetectorService } from 'src/app/services/detector.service';
import { IsotopeService } from 'src/app/services/isotope.service';
import { NuclideService } from 'src/app/services/nuclide.service';

@Component({
	selector: 'app-view-alpha-analysis',
	templateUrl: './view-alpha-analysis.component.html',
	styleUrls: ['./view-alpha-analysis.component.scss']
})
export class ViewAlphaAnalysisComponent implements OnInit, OnChanges
{
	@Input('record') record: Calculations | null = null;

	nucRecords: { id: number, name: string }[] = [];
	arrIsotopes: Isotope[] = [];
	arrDetectors: Detector[] = [];
	nuclide_name: string = "-";
	isotope_name: string = "-";
	detector_name: string = "-";
	tracer_name: string = "-";
	is_alpha_spec_details_opened: boolean = true;

	constructor(private nuclide_service: NuclideService,
				private isotope_service: IsotopeService,
				private detector_service: DetectorService) { }
	

	ngOnInit() 
	{
		this._load_data();
	}

	ngOnChanges(changes: SimpleChanges)
	{
		if('record' in changes)
		{
			this.record = changes['record'].currentValue;
			this._load_data();
		}
	}

	private async _load_data()
	{
		//
		//	Load basic data
		//
		if(this.nucRecords.length == 0)
			this.nucRecords = await this.nuclide_service.get_nuclides();
		if(this.arrDetectors.length == 0)
			this.arrDetectors = await this.detector_service.get_detectors(0);
		if(this.arrIsotopes.length == 0)
			this.arrIsotopes = await this.isotope_service.get_isotopes(0);
		
		if(this.record == null)
			return;
		//
		//	Extract data
		//
		this.nuclide_name = this.nucRecords.filter((n)=> n.id == this.record!.nuclide_id)[0].name;
		this.isotope_name =  this.arrIsotopes.filter((i)=> i.id == this.record!.isotope_id)[0].name;
		this.tracer_name = this.arrIsotopes.filter((i)=> i.id == this.record!.tracer_id)[0].name;
		this.detector_name = this.arrDetectors.filter((d)=> d.id == this.record!.detector_id)[0].name;
	}
}
