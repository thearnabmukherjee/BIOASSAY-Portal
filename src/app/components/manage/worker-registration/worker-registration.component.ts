import { Component, OnInit } from '@angular/core';
import { Message } from '../../../Classes/Message';
import { WorkerService } from '../../../services/worker.service';
import * as bulmaCalendar from 'bulma-calendar';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSettings } from '../../../Classes/AppSettings';

@Component({
	selector: 'app-worker-registration',
	templateUrl: './worker-registration.component.html',
	styleUrls: ['./worker-registration.component.scss']
})
export class WorkerRegistrationComponent implements OnInit 
{
	name: string = "";
	gender: string=  "";
	worker_type: string = "";
	empno: string = "";
	selected_dob: string = "";
	selected_doj: string = "";
	org: string = "";
	remarks: string = "";
	encoded_photo: string = "";
	secure_photo: string = "";

	selected_file_name: string = "";
	is_open_photo_modal: boolean = false;
	is_registering: boolean = false;
	is_loading: boolean = false;

	constructor(private workerService: WorkerService,
				private _location: Location,
				private domSanitizer: DomSanitizer) { }

	ngOnInit()
	{
		//
		//	Configure date of birth
		//
		bulmaCalendar.attach('#dtDOB', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), displayMode: 'inline', type: 'date' })[0].on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
			this.selected_dob = val;
		});

		//
		//	Configure date of joining
		//
		bulmaCalendar.attach('#dtDOJ', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), displayMode: 'inline', type: 'date' })[0].on('select', dt => 
		{
			let val = <string><any>dt.data.value();
			if(val.length > 10)
				val = val.substring(0, 10);
				this.selected_doj = val;
		});
	}

	capture_photo()
	{
		this.is_open_photo_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	photo_browsed(evt: any)
	{
		const file: File = evt.target.files[0];
		if (file) 
		{
			this.is_loading = true;
            this.selected_file_name = file.name;
			const reader = new FileReader();
			reader.onload = () => 
			{
				this.encoded_photo = <string>reader.result;
				this.secure_photo = this.domSanitizer.bypassSecurityTrustResourceUrl(this.encoded_photo) as string;

				//
				//	Remove base64 encoded tag
				//
				let index = this.encoded_photo.indexOf("base64,");
				if(index >= 0)
				{
					this.encoded_photo = this.encoded_photo.substring(index + "base64,".length);
				}
				this.is_loading = false;
			};
			reader.onloadend = (x)=> { this.is_loading = false; };
			reader.readAsDataURL(file);
        }
	}

	private IsFormOkay()
	{
		if(this.encoded_photo == null || this.encoded_photo.length == 0)
		{
			Message.show_message("Error", "Please capture or upload worker photo", true);
			return false;
		}
		if(this.name == null || this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name for the person", true);
			return false;
		}
		if(this.gender == null || this.gender == "")
		{
			Message.show_message("Error", "Please select gender", true);
			return false;
		}
		if(this.worker_type == null || this.worker_type == "")
		{
			Message.show_message("Error", "Please select worker type", true);
			return false;
		}
		if(this.worker_type == "Employee")
		{
			if(this.empno == null || this.empno.length == 0)
			{
				Message.show_message("Error", "Employee number is required for employees", true);
			return false;
			}
		}
		if(this.selected_dob == null || this.selected_dob == "")
		{
			Message.show_message("Error", "Please select date of birth", true);
			return false;
		}
		if(this.selected_doj == null || this.selected_doj == "")
		{
			Message.show_message("Error", "Please select date of joining", true);
			return false;
		}
		if(this.org == null || this.org == "")
		{
			Message.show_message("Error", "Please specify the organisation name", true);
			return false;
		}

		return true;
	}

	register_user()
	{
		if(!this.IsFormOkay())
			return;
		this.is_registering = true;
		this.workerService.create_personal_details( this.name, 
													this.empno, 
													this.selected_dob, 
													this.selected_doj, 
													this.org, 
													this.gender, 
													this.worker_type == "Other", 
													this.encoded_photo, 
													this.remarks).then((res)=> 
		{	
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", "Person registered successfully", false);
				this._location.back();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_registering = false);
	}

	close_modal(obj: { secure: string, encoded: string })
	{
		this.is_open_photo_modal = false;
		AppSettings.subjectBlockScroll.next(false);
		if(obj.secure != "")
		{
			console.log("Recied some image");
			this.encoded_photo = obj.encoded;
			this.secure_photo = obj.secure;
			this.selected_file_name = "";
		}
		else
		{
			console.log("Received nothing");
		}
	}
}
