import { Router } from '@angular/router';
import { Component, Input, OnInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-view-monitoring-details',
	templateUrl: './view-monitoring-details.component.html',
	styleUrls: ['./view-monitoring-details.component.scss']
})
export class ViewMonitoringDetailsComponent implements OnInit, OnChanges
{
	@Input('monitoring-record') monDetails: any = null;

	constructor(private router: Router,
				private _ngZone: NgZone) { }
	

	ngOnInit(){}

	show_10H()
	{
		this.router.navigate(['/view-10h'], { queryParams : { 'form-id': this.monDetails.form_id } });
	}

	ngOnChanges(changes: SimpleChanges)
	{
		if('monDetails' in changes)
		{
			this.monDetails = changes.monDetails.currentValue;
		}

		AppSettings.run_change_detection(this._ngZone, ()=> 
		{
			let x = this.monDetails;
			this.monDetails = null;
			this.monDetails = x;
		});
	}
}
