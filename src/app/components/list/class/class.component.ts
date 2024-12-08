import { ClassService } from './../../../services/class.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../../../Classes/Message';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit 
{
	is_loading = true;
	arrRecords: { id: number, name: string }[] = [];
	is_open_modal = false;
	new_name = "";

	constructor(private classService: ClassService) { }

	ngOnInit()
	{
		this.load_classes();
	}

	private load_classes()
	{
		this.is_loading = true;
		this.classService.get_classes().then((arr)=> this.arrRecords = arr).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	ask_for_new_class()
	{
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_class()
	{
		if(this.new_name == "")
			Message.show_message("Error", "Please provide the name of the solubility type", true);
		else if(this.new_name.length > 50)
			Message.show_message("Error", "Maximum length of solubility type name is 50 characters", true);
		else
			this.classService.create_new_class(this.new_name).then((res)=> 
			{
				if(res.isError)
					Message.show_message("Error", res.msg, true);
				else
				{
					Message.show_message("Success", "Solubility type created successfully", false);
					this.close_modal();
					this.load_classes();
				}
			}).catch((e)=> console.log(e));
	}

	close_modal()
	{
		this.new_name = "";
		this.is_open_modal = false;
		AppSettings.subjectBlockScroll.next(false);
	}
}
