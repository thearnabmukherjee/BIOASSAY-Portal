import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Calculations } from 'src/app/Classes/Calculation';
import { Detector } from 'src/app/Classes/Detector';
import { Isotope } from 'src/app/Classes/Isotope';
import { DetectorService } from 'src/app/services/detector.service';
import { NuclideService } from 'src/app/services/nuclide.service';

@Component({
	selector: 'app-view-samanalysis',
	templateUrl: './view-samanalysis.component.html',
	styleUrls: ['./view-samanalysis.component.scss']
})
export class ViewSAMAnalysisComponent implements OnInit, OnChanges
{
	@Input('record') record: Calculations | null = null;

	nucRecords: { id: number, name: string }[] = [];
	arrIsotopes: Isotope[] = [];
	arrDetectors: Detector[] = [];
	nuclide_name: string = "-";
	detector_name: string = "-";
	arrReadings: { x: number, y: number }[] = [];
	is_lf_details_opened: boolean = true;

	constructor(private nuclide_service: NuclideService,
				private detector_service: DetectorService) { }

	ngOnInit()
	{
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
		
		
		if(this.record == null)
			return;
		
		//
		//	Extract data
		//
		this.nuclide_name = this.nucRecords.filter((n)=> n.id == this.record!.nuclide_id)[0].name;
		this.detector_name = this.arrDetectors.filter((d)=> d.id == this.record!.detector_id)[0].name;
		this.arrReadings = [];
		for(let i = 0 ; i < this.record.contents.arrReadingAbs.length; ++i)
		{
			this.arrReadings.push({ x: this.record!.contents.arrReadingAbs[i], y: this.record!.contents.arrReadingSD[i] });
		}
	}
}
