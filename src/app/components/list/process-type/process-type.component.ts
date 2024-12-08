import { Message } from './../../../Classes/Message';
import { ProcessTypeService } from './../../../services/process-type.service';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-process-type',
	templateUrl: './process-type.component.html',
	styleUrls: ['./process-type.component.scss']
})
export class ProcessTypeComponent implements OnInit 
{
	is_loading = false;
	is_open_new_process_type = false;
	tmp_process_type: string = "";
	arrRecords: {id: number, desc: string, is_active: boolean}[]= [];

	constructor(private processTypeService: ProcessTypeService) { }

	ngOnInit()
	{
		this.load_data();
	}

	private load_data()
	{
		this.is_loading = true;
		this.processTypeService.get_process_types().then((arr)=> this.arrRecords = arr).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	ask_for_new_type()
	{
		this.is_open_new_process_type = true;
		AppSettings.subjectBlockScroll.next(true);
		this.tmp_process_type = "";
	}

	create_new_process_type()
	{
		if(this.tmp_process_type.length == 0)
		{
			Message.show_message("Error", "Please provide description for type of process", true);
			return;
		}
		this.processTypeService.create_process_type(this.tmp_process_type).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			this.load_data();
			this.close_modal();
			Message.show_message("Success", "Process type created successfully", false);
		}).catch((e)=> console.log(e));
	}

	close_modal()
	{
		this.is_open_new_process_type = false;
		AppSettings.subjectBlockScroll.next(false);
	}

	change_state(id: number, is_enable: boolean)
	{
		this.processTypeService.enable_disable_process_type(id, is_enable).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "New process type created successfully", false);
				this.load_data();
				this.close_modal();
			}
		}).catch((e)=> console.log(e));
	}

}
