import { Message } from './../../../Classes/Message';
import { WorkerService } from './../../../services/worker.service';
import { H10Service } from './../../../services/h10.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-worker10-h',
	templateUrl: './worker10-h.component.html',
	styleUrls: ['./worker10-h.component.scss']
})
export class Worker10HComponent implements OnInit 
{
	is_loading = true;
	personal_details_obj: any = null;
	person_id: number = -1;
	
	constructor(private router: Router,
				private route: ActivatedRoute,
				private h10Service: H10Service,
				private workerService: WorkerService) { }

	ngOnInit()
	{
		let person_id = this.route.snapshot.queryParamMap.get('person-id');
		if(person_id == null)
			return;
		this.person_id = +person_id;
		this.load_worker_details();
	}

	private load_worker_details()
	{
		this.workerService.get_personal_details_of_worker(this.person_id).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", "Failed to load worker/employee details", true);
				return;
			}
			this.personal_details_obj = res.msg;
		}).catch((e)=> console.log(e));
	}

	navigate_to_url(evt: any)
	{
		this.router.navigate([evt.url], { queryParams : evt.params });
	}

	create_new_10H()
	{
		this.router.navigate(['create-10h'], { queryParams: { 'person-id': this.person_id } });
	}
}
