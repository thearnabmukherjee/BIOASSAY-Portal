import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Calculations } from 'src/app/Classes/Calculation';

@Component({
	selector: 'app-view-lfanalysis',
	templateUrl: './view-lfanalysis.component.html',
	styleUrls: ['./view-lfanalysis.component.scss']
})
export class ViewLFAnalysisComponent implements OnInit, OnChanges
{
	@Input('record') record: Calculations | null = null;

	constructor() { }

	ngOnInit()
	{
	}

	ngOnChanges(changes: SimpleChanges)
	{
		if('record' in changes)
		{
			this.record = changes['record'].currentValue;
		}
	}
}
