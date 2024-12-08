import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BarePerson } from "../../../../Classes/BarePerson";
import { cloneDeep } from 'lodash';
import { WorkerService } from '../../../../services/worker.service';
import { Message } from '../../../../Classes/Message';

@Component({
	selector: 'app-workers-list',
	templateUrl: './workers-list.component.html',
	styleUrls: ['./workers-list.component.scss']
})
export class WorkersListComponent implements OnInit, OnChanges
{
	@Input("search-val") search_val: string = "";
	@Output("person-selected") personEvent: EventEmitter<BarePerson> = new EventEmitter<BarePerson>();
	is_loading = false;
	arrWorkers: BarePerson[] = [];
	page_num: number = 0;
	selected_person_id: number = 0;

	constructor(private workerService: WorkerService) { }

	async ngOnChanges(changes: SimpleChanges) 
	{
		if(changes.search_val)
		{
			if(!changes.search_val.firstChange)
			{
				this.search_val = changes.search_val.currentValue;
				await this.load_records();
			}
		}
	}

	private async load_records()
	{
		if(this.search_val == null)
			return;
		this.is_loading = true;
		try
		{
			//
			//	List of people
			//
			let res = await this.workerService.get_personal_details(this.page_num, this.search_val);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			let arr: BarePerson[] = [];
			for(let i = 0 ; i < res.msg.length; ++i)
			{
				let obj = res.msg[i];
				let p = new BarePerson();
				p.id = obj.id;
				p.name = obj.name;
				p.dob = obj.dob;
				p.doj = obj.doj;
				p.empno = obj.empno;
				p.firm_name = obj.firm_name;
				p.gender = obj.gender;
				p.is_worker = obj.is_worker;
				p.photo_url = obj.photo_url;
				p.remarks = obj.remarks;
				arr.push(p);
			}
			this.arrWorkers = arr;
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

	ngOnInit()
	{
		this.load_records();
	}

	worker_clicked(p: BarePerson)
	{
		this.selected_person_id = p.id;
		this.personEvent.emit(p);
	}
}
