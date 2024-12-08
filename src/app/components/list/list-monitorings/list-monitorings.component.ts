import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-list-monitorings',
	templateUrl: './list-monitorings.component.html',
	styleUrls: ['./list-monitorings.component.scss']
})
export class ListMonitoringsComponent implements OnInit 
{
	person_id: number = -1;
	form_id: number = -1;
	tech_id: number = 1;

	constructor(private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit()
	{
		this.route.queryParams.subscribe((params)=> 
		{
			//
			//	Person id
			//
			let x = params['person-id'];
			if(x && x > 0)
				this.person_id = x;
			else if(this.person_id > 0)
				this.person_id = -1;
			
			//
			//	Form id
			//
			x = params['form-id'];
			if(x && x > 0)
				this.form_id = x;
			else if(this.form_id > 0)
				this.form_id = -1;
			
			//
			//	Technician id
			//
			x = params['tech-id'];
			if(x && x > 0)
				this.tech_id = x;
			else if(this.tech_id > 0)
				this.tech_id = -1;
		});
	}

	navigate_by_url(evt: any)
	{
		this.router.navigate([evt.url], { queryParams : evt.params });
	}

}
