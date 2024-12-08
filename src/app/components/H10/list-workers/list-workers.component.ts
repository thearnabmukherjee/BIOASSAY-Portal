import { Router } from '@angular/router';
import { Message } from './../../../Classes/Message';
import { Workers } from './../../../Classes/Workers';
import { WorkerService } from './../../../services/worker.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as bulmaCalendar from 'bulma-calendar';

@Component({
	selector: 'app-list-workers',
	templateUrl: './list-workers.component.html',
	styleUrls: ['./list-workers.component.scss']
})
export class ListWorkersComponent implements OnInit, OnDestroy
{
	search_val: string = "";
	date_of_birth: string = "";
	date_of_joining: string = "";
	page_num: number = 0;
	is_loading: boolean = false;
	arrPeopleRecords : Workers[] = [];
	total_records: number = 0;

	constructor(private workerService: WorkerService,
				private router: Router) { }

	ngOnInit()
	{
		//
		//	Prepare calender
		//
		let temp = bulmaCalendar.attach("#dob", { dateFormat: 'dd/MM/yyyy', maxDate: new Date() });
		temp.forEach((c)=> c.on('select', obj=> 
		{
			this.date_of_birth = <string><any>obj.data.value();
		}));
		temp = bulmaCalendar.attach("#doj", { dateFormat: 'dd/MM/yyyy', maxDate: new Date() });
		temp.forEach((c)=> c.on('select', obj=> 
		{
			this.date_of_joining = <string><any>obj.data.value();
		}));

		this.load_worker_records();
	}

	private load_worker_records()
	{
		this.is_loading = true;
		this.workerService.get_personal_details(this.page_num, this.search_val).then((res)=>
		{	
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				this.total_records = res.count;
				this.arrPeopleRecords = [];
				for(let i = 0 ; i < res.msg.length; ++i)
				{
					let obj = res.msg[i];
					this.arrPeopleRecords.push(
					{
						id: obj.id,
						dob: obj.dob,
						doj: obj.doj,
						empno: obj.empno,
						firm_name: obj.firm_name,
						gender: obj.gender,
						is_worker: obj.is_worker,
						name: obj.name,
						photo_url: obj.photo_url,
						remarks: obj.remarks
					});
				}
			}
		}).catch((e)=> {console.log(e);}).finally(()=> this.is_loading = false);
	}

	ngOnDestroy()
	{
		var element = document.querySelector('[type="date"]');
		for(let el in element)
			(<any>element).bulmaCalendar.destroy();
	}

	reset_form()
	{
		this.search_val = "";
		this.date_of_birth = "";
		this.date_of_joining = "";
		this.page_num = 0;
		this.load_worker_records();
	}

	perform_search()
	{
		this.load_worker_records();
	}

	goto_first_page()
	{
		this.page_num = 0;
		this.load_worker_records();
	}

	goto_previous_page()
	{
		if(this.page_num == 0)
			return;
		--this.page_num;
		this.load_worker_records();
	}

	goto_next_page()
	{
		++this.page_num;
		this.load_worker_records();
	}

	goto_worker_registration_page()
	{
		this.router.navigate(['/new-worker-registration']);
	}

	fill_10h_form(person_id: number)
	{
		this.router.navigate(['/create-10h'], { queryParams: { 'person-id': person_id } });
	}

	list_of_10H_forms(person_id: number)
	{
		this.router.navigate(['/list-worker-10h'], { queryParams: { 'person-id': person_id } });
	}
}
