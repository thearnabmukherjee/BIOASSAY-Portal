import { MonitoringService } from './../../../services/monitoring.service';
import { Message } from './../../../Classes/Message';
import { InstrumentService } from './../../../services/instrument.service';
import { Instrument } from './../../../Classes/Instrument';
import { DetectorService } from './../../../services/detector.service';
import { IsotopeService } from './../../../services/isotope.service';
import { SetService } from './../../../services/set.service';
import { Detector } from './../../../Classes/Detector';
import { Isotope } from './../../../Classes/Isotope';
import { NuclideService } from './../../../services/nuclide.service';
import { Calculations } from './../../../Classes/Calculation';
import { CalculationService } from './../../../services/calculation.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { H10Service } from '../../../services/h10.service';
import { MySet } from '../../../Classes/MySet';
import { AppSettings } from 'src/app/Classes/AppSettings';
import * as moment from "moment";

@Component({
	selector: 'app-view-analysis',
	templateUrl: './view-analysis.component.html',
	styleUrls: ['./view-analysis.component.scss']
})
export class ViewAnalysisComponent implements OnInit, OnDestroy
{
	mon_id: number = 0;
	person_id: number = 0;
	form_id: number = 0;

	is_loading: boolean = false;
	is_selecting_records: boolean = false;
	is_selecting_for_sets: boolean = false;
	is_creating_bunch: boolean = false;
	is_personal_details_opened = false;
	is_monitoring_details_opened = false;
	is_enabling_disabling = false;
	
	monRecord: any = null;
	h10Record: any = null;
	arrNuclides: { id: number, name: string }[] = []; 
	arrIsotopes: Isotope[] = [];
	arrInstruments: Instrument[]= [];
	arrDetectors: Detector[] = [];
	arrSetRecords: MySet[] = [];

	arrRecords: Calculations[] = [];
	arrNonBunchedRecords: Calculations[]= [];
	arrBunchedRecords: Calculations[] = [];

	arrFormattedBunchedRecords: { parent: Calculations, children: Calculations[], is_expanded: boolean }[] = [];

	name: string = "";
	comments: string = "";
	is_BDL: boolean = false;
	reason: string = "";
	duration_comments: string = "";
	arr_calc_for_set_details: Calculations[] = [];
	selected_calculation: Calculations | null = null;

	is_open_create_analysis_modal: boolean = false;
	is_open_save_bunch_modal: boolean = false;
	is_open_reason_modal: boolean = false;
	is_open_set_modal: boolean = false;
	is_open_set_details_modal: boolean = false;
	is_open_calculation_details: boolean = false;

	constructor(private route: ActivatedRoute,
				private calcService: CalculationService,
				private setService: SetService,
				private nuclideService: NuclideService,
				private isoService: IsotopeService,
				private detectorService: DetectorService,
				private instrumentService: InstrumentService,
				private monService: MonitoringService,
				private h10Service: H10Service,
				private router: Router) {}
	

	ngOnInit()
	{
		this.route.queryParams.subscribe(params => 
		{
			this.mon_id = +params['mon-id'];
			this.person_id = +params['person-id'];
			this._load_data();
		});
	}

	private async _load_data()
	{
		this.is_loading = true;
		try
		{
			this.monRecord = (await this.monService.get_monitorings(0, 0, 0, 0, this.mon_id))[0];
			this.form_id = this.monRecord.form_id;
			let h10_res = (await this.h10Service.get_specific_10H_form(this.monRecord.form_id));
			if(h10_res.isError){ console.log("Couldn't load linked 10H form details"); }
			else
			{
				this.h10Record = h10_res.msg;
			}
			this.arrRecords = await this.calcService.get_calculations(this.mon_id);
			this.arrNuclides = await this.nuclideService.get_nuclides();
			this.arrIsotopes = await this.isoService.get_isotopes(0);
			this.arrInstruments = await this.instrumentService.get_instruments();
			this.arrDetectors = await this.detectorService.get_detectors(0);

			this.arrRecords.forEach((r)=> 
			{
				r.is_checked = false;
				r.ui_name = `chkCalc${r.id}`;
				if(r.nuclide_id != null && r.nuclide_id > 0)
					r.nuclide_name = this.arrNuclides.filter((n)=> n.id == r.nuclide_id)[0].name;

				if(r.isotope_id != null && r.isotope_id > 0)
					r.isotope_name = this.arrIsotopes.filter((iso)=> iso.id == r.isotope_id)[0].name;
				
				if(r.tracer_id != null && r.tracer_id > 0)
					r.tracer_name = this.arrIsotopes.filter((iso)=> iso.id == r.tracer_id)[0].name;
				
				if(r.detector_id != null && r.detector_id > 0)
				{
					let detRef = this.arrDetectors.filter((d)=> d.id == r.detector_id)[0];
					r.detector_name = detRef.name;
					let insRef = this.arrInstruments.filter((i)=> i.id == detRef.instrument_id)[0];
					r.instrument_name = insRef.name;
					r.instrument_id = insRef.id;
				}
			});
			this.arrNonBunchedRecords = this.arrRecords.filter((r)=> !r.is_bunched);
			this.arrBunchedRecords = this.arrRecords.filter((r)=> r.is_bunched);
			this._format_bunched_records();
			await this._load_sets();
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

	private async _load_sets()
	{
		try
		{
			this.arrSetRecords = await this.setService.get_sets(this.mon_id);
			this.arrSetRecords = this.arrSetRecords.sort((a, b)=> a.id - b.id);
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private _format_bunched_records()
	{
		this.arrFormattedBunchedRecords = [];
		this.arrBunchedRecords.forEach((r)=> 
		{
			if(r.arrCalculations == null || r.arrCalculations.length == 0)
				return;

			let arrCal: Calculations[] = [];
			for(let i = 0 ; i < r.arrCalculations.length; ++i)
			{
				//
				//	Find children
				//
				let child_id: number = r.arrCalculations[i];

				//
				//	Keep record of all the children found
				//
				this.__get_terminal_child(child_id).forEach((child)=> 
				{
					if(arrCal.filter((c)=> c.id == child.id).length == 0)
						arrCal.push(child);
				});
			}
			this.arrFormattedBunchedRecords.push({ parent: r, children: arrCal, is_expanded: false });
		});
	}

	private __get_terminal_child(id: number): Calculations[]
	{
		let arrCal: Calculations[]= [];
		let calRef = this.arrRecords.filter((r)=> r.id == id)[0];

		//
		//	Terminal record
		//
		if(!calRef.is_bunched || calRef.arrCalculations == null)
			return [calRef];

		//
		//	Bunched record
		//
		calRef.arrCalculations.forEach((r)=> 
		{
			let tempCal = this.__get_terminal_child(r);
			arrCal = [...arrCal, ...tempCal];
		});

		return arrCal;
	}

	view_calculation_details(calc_id: number)
	{
		this.selected_calculation = this.arrRecords.filter((x)=> x.id == calc_id)[0];
		AppSettings.subjectBlockScroll.next(true);
		this.is_open_calculation_details = true;
	}

	create_new_analysis()
	{
		this.is_open_create_analysis_modal = true;
	}

	close_new_analysis_modal(x: any)
	{
		this.close_modal();
	}

	start_selecting_for_bunch()
	{
		this.arrRecords.forEach((r)=> r.is_checked = false);
		this.is_selecting_records = true;
		Message.show_info_message("NOTE", "Calculation records are now selectable. Please select required records and click 'Save bunch' button. If you don't want to bunch, click on 'Cancel' button");
	}

	start_selecting_for_set()
	{
		this.arrRecords.forEach((r)=> r.is_checked = false);
		this.is_selecting_for_sets = true;
		Message.show_info_message("NOTE", "Calculation records are now selectable. Please select required records and click 'Combine radionuclides' button. If you don't want to combine radionuclides, click on 'Cancel' button");
	}

	open_repeat_monitoring_modal()
	{
		this.reason = "";
		this.duration_comments = "";
		this.is_open_reason_modal = true;
	}

	ask_for_repeat_monitoring()
	{
		if(this.form_id <= 0)
			return;
		if(this.reason == null || this.reason.length == 0)
		{
			Message.show_message("Error", "Please specify the reason for repeat monitoring", true);
			return;
		}

		this.is_creating_bunch = true;
		this.monService.mark_repeat_monitoring(this.form_id, this.reason, this.duration_comments).then((res)=> 
		{
			if(res.isError)
			{
				this.monRecord = null;
				this.h10Record = null;
				this._load_data();
				Message.show_message("Error", res.msg, true);
			}
			else
			{
				this.close_modal();
				Message.show_message("Success", res.msg, false).then((_)=> 
				{
					this.monRecord = null;
					this.h10Record = null;
					this._load_data();
				});
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating_bunch = false);
	}

	open_save_bunch_modal()
	{
		if(!this.is_selecting_records)
			return;
		
		if(this.arrRecords.filter((r)=> r.is_checked).length < 2)
		{
			Message.show_message("Error", "Please select at-least two records to bunch", true);
			return;
		}
		

		this.name = `Combined activity - ${moment().format("YYYY-MM-DD HH mm")}`;
		this.comments = "";
		this.is_open_save_bunch_modal = true;
	}

	//
	//	Create new bunch record on server
	//
	submit_new_bunch_record()
	{
		if(!this.is_open_save_bunch_modal)
			return;
		if(this.name == null || this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name for the combined activity record", true);
			return;
		}
		if(this.arrRecords.filter((r)=> r.is_checked).length < 2)
		{
			Message.show_message("Error", "Please select at-least two records to combine activity", true);
			return;
		}

		this.is_creating_bunch = true;
		this.calcService.create_calculation_bunch(this.mon_id, this.arrRecords.filter((r)=> r.is_checked).map((r)=> r.id), this.name, this.comments, this.is_BDL).then((res)=>
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				this.close_modal();
				return;
			}
			else
			{
				Message.show_message("Success", "New combined activity record created successfully", false);
				this.cancel_selecting_records();
				this.close_modal();
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating_bunch = false);
	}

	open_create_set_modal()
	{
		if(!this.is_selecting_for_sets)
			return;
		if(this.arrRecords.filter((r)=> r.is_checked).length == 0)
		{
			Message.show_message("Error", "Please select at-least one records to create combined radionuclide record", true);
			return;
		}

		this.name = `Set - ${moment().format("YYYY-MM-DD HH mm")}`;
		this.comments = "";
		this.is_open_set_modal = true;
	}

	submit_new_set_record()
	{
		if(!this.is_open_set_modal)
			return;
		if(this.name == null || this.name.length == 0)
		{
			Message.show_message("Error", "Please provide name for the set", true);
			return;
		}
		if(this.arrRecords.filter((r)=> r.is_checked).length == 0)
		{
			Message.show_message("Error", "Please select at-least one records to combined radionuclide record", true);
			return;
		}

		this.is_creating_bunch = true;
		this.setService.create_set(this.name, this.comments, this.mon_id, this.arrRecords.filter((r)=> r.is_checked).map((r)=> r.id)).then((res)=>
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				this.close_modal();
				return;
			}
			else
			{
				Message.show_message("Success", "New set record created successfully", false);
				this.cancel_selecting_records();
				this.close_modal();
				this._load_data();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating_bunch = false);
	}

	cancel_selecting_records()
	{
		this.is_selecting_records = false;
		this.is_selecting_for_sets = false;
	}

	close_modal()
	{
		this.is_open_create_analysis_modal = false;
		this.is_open_save_bunch_modal = false;
		this.is_open_reason_modal = false;
		this.is_open_set_modal = false;
		this.is_BDL = false;
		this.is_open_set_details_modal = false;
		this.is_open_calculation_details = false;
		this.selected_calculation = null;
		AppSettings.subjectBlockScroll.next(false);
	}

	failed_to_load_worker_details(a: any)
	{
		console.log("Failed to load worker details");
	}

	_get_nuclide_isotopes(arr: Calculations[])
	{
		let s: Set<string> = new Set();
		arr.forEach((r)=> 
		{
			if(r.technique == "ALPHA SPECTROMETRY")
				s.add(<string>r.isotope_name);
			else
				s.add(<string>r.nuclide_name);
		});
		return Array.from(s).join(", ");
	}

	format_calculations(arrCal: number[])
	{
		let arr: Calculations[] = [];
		arrCal.forEach((i)=> 
		{
			let ref_record = this.arrRecords.filter((r)=> r.id == i)[0];
			if(ref_record)
				arr.push(ref_record);
		});
		return arr.map((x)=> x.name).join(", ");
	}

	enable_disable_record(set_id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.setService.enable_disable_set(set_id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", `Set ${is_enable ? "enabled" : "disabled"} successfully!`, false);
				this._load_sets();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	view_set_details(set_id: number)
	{
		let set_row = this.arrSetRecords.filter((x)=> x.id == set_id)[0];
		let arrCalc = this.arrRecords.filter((x)=> set_row.arrCalculations.includes(x.id));
		this.arr_calc_for_set_details = arrCalc.filter((x)=> !x.is_bunched).concat(this._extract_root_calculations(arrCalc.filter((x)=> x.is_bunched)));
		this.arr_calc_for_set_details = this._make_unique(this.arr_calc_for_set_details);
		
		AppSettings.subjectBlockScroll.next(true);
		this.is_open_set_details_modal = true;
	}

	ngOnDestroy()
	{
		this.close_modal();
	}

	private _make_unique(arr: Calculations[])
	{
		let ids = new Set(arr.map((x)=> x.id));
		let arrIds = [...ids];
		return this.arrRecords.filter((x)=> arrIds.includes(x.id));
	}

	private _extract_root_calculations(arrCal: Calculations[]): Calculations[]
	{
		let arrNonBunched = arrCal.filter((x)=> !x.is_bunched);
		let arrBunched = arrCal.filter((x)=> x.is_bunched);
		if(arrBunched.length == 0)
			return arrNonBunched;

		//
		//	Explore one level of bunched calculations
		//
		let arr: Calculations[] = [];
		arrBunched.forEach((r)=> 
		{
			r.arrCalculations?.forEach((x)=> arr.push( this.arrRecords.filter((y)=> y.id == x)[0] ));
		});

		//
		//	Go deeper and concat
		//
		arrNonBunched = arr.filter((a)=> !a.is_bunched).concat(arrNonBunched);		//	Concat all non bunched
		arrBunched = arr.filter((b)=> b.is_bunched);

		return arrNonBunched.concat(this._extract_root_calculations(arrBunched));
	}
}	
