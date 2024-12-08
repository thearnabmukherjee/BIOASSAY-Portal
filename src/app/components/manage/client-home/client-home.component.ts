import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarePerson } from '../../../Classes/BarePerson';

@Component({
	selector: 'app-client-home',
	templateUrl: './client-home.component.html',
	styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent implements OnInit, OnDestroy
{
	right_message = "";
	worker_filter: string = "";
	selected_person: BarePerson | null = null;

	constructor() { }
	

	ngOnInit(){}

	search_performed(val: string)
	{
		this.worker_filter = val;
		this.selected_person = null;
		this.right_message = "";
	}

	worker_selected(p: BarePerson)
	{
		this.selected_person = p;
		this.right_message = `Monitoring details of : ${p.name}`;
		if(p.empno != null && p.empno.length > 0)
		{
			this.right_message += ` (${p.empno})`;
		}
	}

	ngOnDestroy(){}
}
