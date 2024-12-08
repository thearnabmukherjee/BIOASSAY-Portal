import { Message } from './../../../Classes/Message';
import { WorkerService } from './../../../services/worker.service';
import { UsersService } from './../../../services/users.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, NgZone } from '@angular/core';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'sub-worker-details',
	templateUrl: './sub-worker-details.component.html',
	styleUrls: ['./sub-worker-details.component.scss']
})
export class SubWorkerDetailsComponent implements OnInit, OnChanges
{
	// is_open_modal: boolean = false;
	is_loading: boolean = true;
	personal_details_obj: any = null;
	person_image_url: string = "";

	@Input('person-id') person_id: number = -1;
	@Output('close') evt_close = new EventEmitter<void>();
	
	constructor(private userService: UsersService,
				private workerService: WorkerService,
				private _ngZone: NgZone) { }

	ngOnInit()
	{
		this.load_records();
	}

	async ngOnChanges(changes: SimpleChanges) 
	{
		let isChange = false;
		if(changes.person_id)
		{
			if(!changes.person_id.firstChange)
			{
				this.person_id = changes.person_id.currentValue;
				isChange = true;
			}
		}

		if(isChange)
			await this.load_records();
	}

	private async load_records()
	{
		this.is_loading = true;
		if(this.person_id <= 0)
			return;
		try
		{
			let res = await this.workerService.get_personal_details_of_worker(this.person_id);
			if(res.isError)
			{
				this.close_modal();
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				this.personal_details_obj = cloneDeep(res.msg);
				this.person_image_url = res.msg.photo_url;
			}
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
			console.log("Personal details loaded");
		}
	}

	close_modal()
	{
		// this.is_open_modal = false;
		this.evt_close.emit();
	}
}
