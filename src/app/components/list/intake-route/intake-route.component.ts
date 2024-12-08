import { IntakerouteService } from './../../../services/intakeroute.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../../../Classes/Message';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-intake-route',
	templateUrl: './intake-route.component.html',
	styleUrls: ['./intake-route.component.scss']
})
export class IntakeRouteComponent implements OnInit 
{
	is_loading = true;
	arrRecords: { id: number, name: string }[] = [];
	is_open_modal = false;
	new_name = "";

	constructor(private routeService: IntakerouteService) { }

	ngOnInit()
	{
		this.load_routes();
	}

	private load_routes()
	{
		this.is_loading = true;
		this.routeService.get_intake_routes().then((arr)=> this.arrRecords = arr).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	ask_for_new_route()
	{
		this.is_open_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_route()
	{
		if(this.new_name == "")
			Message.show_message("Error", "Please provide the name of the intake route name", true);
		else if(this.new_name.length > 50)
			Message.show_message("Error", "Maximum length of intake route name is 100 characters", true);
		else
			this.routeService.create_new_intake_route(this.new_name).then((res)=> 
			{
				if(res.isError)
					Message.show_message("Error", res.msg, true);
				else
				{
					Message.show_message("Success", "Intake route created successfully", false);
					this.close_modal();
					this.load_routes();
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
