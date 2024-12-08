import { MonitoringService } from './../../../services/monitoring.service';
import { AppSettings } from './../../../Classes/AppSettings';
import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from '../../../Classes/Message';
import { H10Service } from '../../../services/h10.service';
import { Router } from '@angular/router';
import {cloneDeep} from 'lodash';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { CalculationService } from '../../../services/calculation.service';
import { SetService } from '../../../services/set.service';
import { Calculations } from '../../../Classes/Calculation';
import { NuclideService } from '../../../services/nuclide.service';

@Component({
	selector: 'h10-list',
	templateUrl: './h10-list.component.html',
	styleUrls: ['./h10-list.component.scss']
})
export class H10ListComponent implements OnInit, OnChanges
{
	is_open_reject_modal = false;
	rejection_reason: string = "";
	private selected_reject_form_id: number = -1;
	is_loading = true;
	page_num: number = 0;
	arrRecords: any[] = [];

	is_only_hp: boolean = false;
	is_admin: boolean = false;
	is_oic1: boolean = false;
	is_tech: boolean = false;
	form_types = AppSettings.VALID_FORM_STATES;

	@Input('person-id') person_id: number = -1;
	@Input('form-type') form_type: string = "";
	@Input('search-val') search_val: string = "";
	@Input('start-date') start_date_time: string = "";
	@Input('end-date') end_date_time: string = "";
	@Output('navigate') evt_navigate = new EventEmitter<{'url': string, params: any}>();


	constructor(private h10Service: H10Service,
				private monService: MonitoringService,
				private router: Router,
				private _ngZone: NgZone,
				private authUser: AuthService,
				private calcService: CalculationService,
				private setService: SetService,
				private nucService: NuclideService) { }
	
	private is_called_once: boolean = false;
	ngOnInit()
	{
		this.authUser.subUserInfo.subscribe((info)=> 
		{
			if(info == null)
				return;
			//
			//	Check if only HP role
			//
			if(info.roles.length == 1 && info.roles[0] == "hp")
				this.is_only_hp = true;
			else
				this.is_only_hp = false;
			
			//
			//	Check if admin
			//
			this.is_admin = info.roles.includes("admin");

			//
			//	Check if OIC1
			//
			this.is_oic1 = info.roles.includes("oic1");

			//
			//	Check if technician
			//
			this.is_tech = info.roles.includes("tech");

			if(!this.is_called_once)
				this.load_records();
			this.is_called_once = true;
		});
	}

	async ngOnChanges(changes: SimpleChanges) 
	{
		let isChanged = false;
		if(changes['person_id'])
		{
			if(!changes['person_id'].firstChange)
			{
				this.person_id = changes['person_id'].currentValue;
				isChanged = true;
			}
		}

		if(changes['form_type'])
		{
			if(!changes['form_type'].firstChange)
			{
				this.form_type = changes['form_type'].currentValue;
				isChanged = true;
			}
		}
		if(changes['search_val'])
		{
			if(!changes['search_val'].firstChange)
			{
				this.search_val = changes['search_val'].currentValue;
				isChanged = true;
			}
		}
		if(changes['start_date_time'])
		{
			if(!changes['start_date_time'].firstChange)
			{
				this.start_date_time = changes['start_date_time'].currentValue;
				isChanged = true;
			}
		}
		if(changes['end_date_time'])
		{
			if(!changes['end_date_time'].firstChange)
			{
				this.end_date_time = changes['end_date_time'].currentValue;
				isChanged = true;
			}
		}

		if(isChanged)
			await this.load_records();
	}

	private async load_records()
	{
		this.is_loading = true;
		this.arrRecords = [];
		try
		{
			let isChanged = false;
			if(this.person_id > 0)
			{
				this.arrRecords = await this.h10Service.get_10H_of_person(this.person_id, this.page_num);
				isChanged = true;
			}
			else if(AppSettings.VALID_FORM_STATES.includes(this.form_type))
			{
				this.arrRecords = await this.h10Service.search_10H_forms(this.search_val, this.page_num, this.form_type, this.start_date_time, this.end_date_time);
				isChanged = true;
			}

			//
			//	Modify TLD
			//
			for(let i = 0 ; i < this.arrRecords.length; ++i)
			{
				if(this.arrRecords[i].tld != null && this.arrRecords[i].tld != "")
					this.arrRecords[i].tld  = this.arrRecords[i].tld.replace("/", "").replace("/", "");
			}

			//
			//	Load sample numbers
			//
			if(this.arrRecords.length > 0 && isChanged)
			{
				if(!this.is_only_hp)
				{
					// let arr = await this.monService.get_sample_numbers(this.arrRecords.map((f)=> f.id));
					// for(let i = 0 ; i < this.arrRecords.length ; ++i)
					// {
					// 	let arrMatch = arr.filter((x)=> x.form_id == this.arrRecords[i].id);
					// 	if(arrMatch.length > 0)
					// 	{
					// 		this.arrRecords[i].sample_no = arrMatch[0].sample_no;
					// 	}
					// 	else
					// 	{
					// 		this.arrRecords[i].sample_no = 'NA';
					// 	}
					// }
				}
				//
				//	Don't display sample numbers to HP
				//
				else
				{
					for(let i = 0 ; i < this.arrRecords.length ; ++i)
						this.arrRecords[i].sample_no = 'NA';
				}
			}

			//
			//	Load accepted on dates and accepted by name
			//
			if(this.arrRecords.length > 0 && isChanged && this.form_type == "Accepted")
			{
				try
				{
					let ids: number[]= [];
					for(let i = 0 ; i < this.arrRecords.length ; ++i)
					{
						ids.push(this.arrRecords[i].id);
					}
					let arr = await this.monService.get_matching_monitorings(ids);
					this.arrRecords.forEach((r)=> 
					{
						if(arr.filter((x)=> x.form_id! == r.id).length > 0)
						{
							let temp_obj = arr.filter((x)=> x.form_id! == r.id)[0];
							r.received_on = temp_obj.received_on;
							r.accepted_by_name = temp_obj.created_by_name;
						}
					});
				}
				catch(e)
				{
					console.log(e);
				}
			}

			//
			//	TODO: Load default set details for Being processed forms
			//
			if(this.arrRecords.length > 0 && this.form_type == "Being processed")
			{
				try
				{
					//
					//	Fetch monitorings of the 10H forms
					//
					let ids: number[]= [];
					for(let i = 0 ; i < this.arrRecords.length ; ++i)
					{
						ids.push(this.arrRecords[i].id);
					}
					let arr = await this.monService.get_matching_monitorings(ids);

					//
					//	Load calculations for each monitoring
					//
					for(let i = 0 ;i < this.arrRecords.length; ++i)
					{
						let r = this.arrRecords[i];
						this.arrRecords[i].cal_display_val = "NA";

						//
						//	find calculations included in default set
						//
						try
						{
							if(arr.filter((x)=> x.form_id! == r.id).length > 0)
							{
								let _mon_id = arr.filter((x)=> x.form_id! == r.id)[0]['id'];
								let _arr_calc = await this.calcService.get_calculations(_mon_id);
								let _arr_sets = await this.setService.get_sets(_mon_id);
								if(_arr_sets.filter((x)=>x.is_active).length == 0)
									this.arrRecords[i].cal_display_val = "NA";
								else
								{
									let _matched_set = _arr_sets.filter((x)=>x.is_active)[0];
									this.arrRecords[i].cal_display_val = await this._join_calc(_arr_calc.filter((x)=> _matched_set.arrCalculations.includes(x.id)));
								}
							}
						}
						catch(xxxx){console.log(xxxx);}
					}
				}
				catch(e)
				{
					console.log(e);
				}
			}
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			AppSettings.run_change_detection(this._ngZone, ()=> 
			{
				this.is_loading = false;
				this.arrRecords = cloneDeep(this.arrRecords);
			});
		}
	}

	goto_first_page()
	{
		this.page_num = 0;
		this.load_records();
	}

	goto_previous_page()
	{
		if(this.page_num == 0)
			return;
		--this.page_num;
		this.load_records();
	}

	goto_next_page()
	{
		++this.page_num;
		this.load_records();
	}

	view_10H_form(form_id: number)
	{
		this.evt_navigate.emit({ url: '/view-10h', params : { 'form-id': form_id } });
	}

	perform_analysis(form_id: number)
	{
		this.monService.get_monitorings(0, form_id, 0, 0, 0).then((arr)=> 
		{
			if(arr.length > 0)
			{
				let mon = arr[0];
				this.router.navigate(['/view-analysis'], { queryParams: { 'mon-id': mon.id, 'person-id': mon.person_id } });
			}
			else
			{
				Message.show_message("Error", "No monitoring found!", true);
			}
		}).catch((e)=> console.log(e));
	}

	modify_10_form(form_id: number)
	{
		this.evt_navigate.emit({ url: '/edit-10h', params : { 'form-id': form_id } });
	}

	print_10H_form(form_id: number)
	{
		this.is_loading = true;
		this.h10Service.get_pdf(form_id).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("10H print error", res.msg, true);
			}
			else
			{
				let report_name = `10H_form_${form_id}`;
				let pdf_contents = atob(<string>res.encoded_pdf);
				this._download_file(this._bytes_toArray_buffer(pdf_contents), report_name);
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}

	reject_10H_form(form_id: number)
	{
		this.rejection_reason = "";
		this.selected_reject_form_id = form_id;
		this.is_open_reject_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	view_monitoring_details(form_id: number)
	{
		this.monService.get_monitorings(-1, form_id, -1, 0, -1).then((arr)=> 
		{
			if(arr == null || arr.length == 0)
			{
				Message.show_message("Error", "Failed to load monitoring details", true);
			}
			else
			{
				let obj = arr[0];
				this.evt_navigate.emit({ url: '/view-mon', params : { 'mon-id': obj.id } });
			}
		}).catch((e)=> console.log(e));
	}

	sample_spoiled(form_id: number)
	{
		Message.ask_question_is_accepted(`Mark sample spoiled, form: ${form_id}`, "Are you sure to mark this form as sample spoiled?", "Yes", "No, don't mark").then((res)=> 
		{
			if(res)
			{
				this.is_loading = true;
				this.h10Service.sample_spoiled_form(form_id).then((res)=> 
				{
					if(res.isError)
					{
						Message.show_message("Error", res.msg, true);
						return;
					}
					this.load_records();
					Message.show_message("Success", "10H form marked as sample spoiled successfully", false);
				}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
			}
		});
	}

	accept_10H_form(form_id: number)
	{
		this.evt_navigate.emit({ url: '/accept-10h', params : { 'form-id': form_id } });
	}

	actuate_form_rejection()
	{
		this.is_loading = true;
		this.h10Service.reject_10h_form(this.selected_reject_form_id, this.rejection_reason).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			this.load_records();
			Message.show_message("Success", "10H form rejected successfully", false);
		}).catch((e)=> console.log(e)).finally(()=> { this.is_loading = false; this.close_modal(); });
	}

	close_modal()
	{
		this.is_open_reject_modal = false;
		this.rejection_reason = "";
		this.selected_reject_form_id = -1;
		AppSettings.subjectBlockScroll.next(false);
	}

	_is_edit_accept_enabled(status: string)
	{
		switch(status)
		{
			case AppSettings.VALID_FORM_STATES[0]:		//	10 H submitted
				return true;
			default:
				return false;
		}
	}

	public trackItem(index: number, item: any)
	{
		return item.id;
	}

	private _bytes_toArray_buffer(pdf_contents: any)
	{
		let binaryLen = pdf_contents.length;
		let bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) 
		{
			var ascii = pdf_contents.charCodeAt(i);
			bytes[i] = ascii;
		}
		return bytes;
	}

	private _download_file(bytes: Uint8Array, filename: string)
	{
		let blob = new Blob([bytes], {type: "application/pdf"});
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;
    	link.click();
		document.body.removeChild(link);
	}

	private arr_nuclides: {id: number, name: string}[] = [];
	private async _join_calc(arr: Calculations[])
	{
		if(this.arr_nuclides.length == 0)
		{
			this.arr_nuclides = await this.nucService.get_nuclides();
		}
		let ret = "";
		arr.forEach((c)=> 
		{
			ret += `${this._find_nuc_name(c.nuclide_id)}: ${c.activity} ± ${c.activity_error}\n`;
		});
		return ret.endsWith("\n") ? ret.slice(0, -1) : ret;
	}

	private _find_nuc_name(nuc_id: number | null)
	{
		if(nuc_id == null)
			return "Bunch";
		if(this.arr_nuclides.filter((x)=> x.id == nuc_id).length > 0)
			return this.arr_nuclides.filter((x)=> x.id == nuc_id)[0].name;
		return "Bunch";
	}
}
