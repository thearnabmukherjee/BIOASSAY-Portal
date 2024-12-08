import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import bulmaCalendar from 'bulma-calendar';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Calculations } from 'src/app/Classes/Calculation';
import { Message } from 'src/app/Classes/Message';
import { CalculationService } from 'src/app/services/calculation.service';
import { DetectorService } from 'src/app/services/detector.service';
import { H10Service } from 'src/app/services/h10.service';
import { LFCalculationService } from 'src/app/services/lfcalculation.service';
import { MonitoringService } from 'src/app/services/monitoring.service';
import { NuclideService } from 'src/app/services/nuclide.service';

@Component({
	selector: 'app-create-lfanalysis',
	templateUrl: './create-lfanalysis.component.html',
	styleUrls: ['./create-lfanalysis.component.scss']
})
export class CreateLFAnalysisComponent implements OnInit, OnDestroy
{
	subQueryParams: Subscription | null = null;
	title: string = "";
	mon_id = 0;
	det_id = 0;
	rec_id = 0;
	nuc_id = 0;
	person_id = 0;
	

	detector_name: string = "";
	nuclide_name: string = "";
	technique: string = "";

	is_CFM: boolean = false;
	is_personal_details_opened = false;
	is_monitoring_details_opened = false;
	is_LF_details_opened = true;
	is_calculating = false;
	is_submitting = false;
	is_BDL: boolean = false;

	
	input_sample_collection_duration: string = "0";
	input_specific_activity: string = "0";
	input_sample_volume: string = "0";
	input_analysis_volume: string = "0";
	input_total_volume: string = "0";
	input_analysis_name: string = "";
	input_recovery_percent: string = "0";
	input_previous_activity: string = "0";
	input_previous_activity_error: string = "0";
	input_analysis_date: string = moment().format('YYYY-MM-DD HH:mm:ss');
	input_comments: string = "";


	tmp_X: string = "";
	tmp_Y: string = "";
	arrReadings: { x: number, y: number }[] = [];

	monRecord: any = null;
	h10_Record: any = null;
	calcRecord: Calculations | null = null;
	calculated_activity: number = 0;
	calculated_activity_error: number = 0;

	constructor(private route: ActivatedRoute,
				private _location: Location,
				private calcService: CalculationService,
				private monService: MonitoringService,
				private h10Service: H10Service,
				private nuclideService: NuclideService,
				private detectorService: DetectorService,
				private lfService: LFCalculationService) { }

	ngOnInit()
	{
		this.subQueryParams = this.route.queryParams.subscribe(async (params) => 
		{
			this.mon_id = +params['mon-id'];
			this.technique = params['tech'];
			this.is_CFM = this.technique == "LF CFM";

			await this._load_monitoring_details();

			//
			//	Create new record
			//
			this.title = `New ${this.technique} analysis`;
			this.det_id = +params['det-id'];
			this.nuc_id = +params['nuc-id'];
			await this._load_defaults();
			bulmaCalendar.attach('#dtAnalysis', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), timeFormat: 'HH:mm', validateLabel: 'Done', type: 'datetime' })[0].on('select', dt => 
			{
				let v = <string><any>dt.data.value();
				if(v.length > 0 && v.length == 16)
					this.input_analysis_date = v + ":00";
			});

			//
			//	Load name for ids
			//
			await this._load_id_to_name();
		});
	}

	add_reading()
	{
		if(!this.isValidXY())
			return;
		this.arrReadings.push({ x: +this.tmp_X, y: +this.tmp_Y });
		this.tmp_X = "";
		this.tmp_Y = "";
	}

	remove_reading(r: { x: number, y: number })
	{
		if(this.arrReadings.includes(r))
			this.arrReadings = this.arrReadings.filter((x)=> x != r);
	}

	calculate_result()
	{
		if(!this.IsFormOkay())
			return;
		
		this.calculated_activity = 0;
		this.calculated_activity_error = 0;
		this.lfService.save_calculate_LF_result(this.mon_id, 
												this.nuc_id, 
												this.det_id,
												this.input_analysis_name,
												this.input_comments,
												this.is_CFM,
												+this.input_analysis_volume,
												+this.input_sample_volume,
												+this.input_specific_activity,
												+this.input_recovery_percent,
												+this.input_total_volume,
												this.input_analysis_date,
												this.is_CFM ? this.arrReadings.map((x)=> x.x) : [+this.tmp_X],
												this.is_CFM ? this.arrReadings.map((x)=> x.y) : [+this.tmp_Y],
												+this.input_sample_collection_duration,
												this.is_BDL,
												+this.input_previous_activity,
												+this.input_previous_activity_error,
												false).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				if(res.activity)
					this.calculated_activity = res.activity
				if(res.activity_error)
					this.calculated_activity_error = res.activity_error;
			}
		}).catch((e)=> console.log(e));
	}

	submit_result()
	{
		if(!this.IsFormOkay())
			return;
		this.calculated_activity = 0;
		this.calculated_activity_error = 0;
		this.lfService.save_calculate_LF_result(this.mon_id, 
												this.nuc_id, 
												this.det_id,
												this.input_analysis_name,
												this.input_comments,
												this.is_CFM,
												+this.input_analysis_volume,
												+this.input_sample_volume,
												+this.input_specific_activity,
												+this.input_recovery_percent,
												+this.input_total_volume,
												this.input_analysis_date,
												this.is_CFM ? this.arrReadings.map((x)=> x.x) : [+this.tmp_X],
												this.is_CFM ? this.arrReadings.map((x)=> x.y) : [+this.tmp_Y],
												+this.input_sample_collection_duration,
												this.is_BDL,
												+this.input_previous_activity,
												+this.input_previous_activity_error,
												true).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", `${this.technique} analysis created successfully`, false).then(()=> this._location.back());
			}
		}).catch((e)=> console.log(e));
	}

	private isValidXY()
	{
		//
		//	Absolute value
		//
		if(this.tmp_X == null || this.tmp_X == "")
		{
			Message.show_message("Error", "Please specify detector reading absolute value", true);
			return false;
		}
		if(isNaN(+this.tmp_X) || +this.tmp_X < 0)
		{
			Message.show_message("Error", "Please specify proper detector reading absolute value", true);
			return false;
		}

		//
		//	Standard deviation
		//
		if(this.tmp_Y == null || this.tmp_Y == "")
		{
			Message.show_message("Error", "Please specify detector reading standard deviation value", true);
			return false;
		}
		if(isNaN(+this.tmp_Y) || +this.tmp_Y < 0)
		{
			Message.show_message("Error", "Please specify proper detector reading standard deviation value", true);
			return false;
		}
		return true;
	}

	private IsFormOkay()
	{
		//
		//	Specific activity
		//
		if(this.input_specific_activity == null || this.input_specific_activity == "")
		{
			Message.show_message("Error", "Please specify specific activity", true);
			return false;
		}
		if(isNaN(+this.input_specific_activity) || +this.input_specific_activity <= 0)
		{
			Message.show_message("Error", "Please specify proper specific activity value", true);
			return false;
		}

		//
		//	Sample volume
		//
		if(this.input_sample_volume == null || this.input_sample_volume == "")
		{
			Message.show_message("Error", "Please specify sample volume", true);
			return false;
		}
		if(isNaN(+this.input_sample_volume) || +this.input_sample_volume < 0)
		{
			Message.show_message("Error", "Please specify proper sample volume value", true);
			return false;
		}


		//
		//	Analysis volume
		//
		if(this.input_analysis_volume == null || this.input_analysis_volume == "")
		{
			Message.show_message("Error", "Please specify analysis volume", true);
			return false;
		}
		if(isNaN(+this.input_analysis_volume) || +this.input_analysis_volume < 0)
		{
			Message.show_message("Error", "Please specify proper analysis volume value", true);
			return false;
		}

		if(!this.is_CFM)
		{
			//
			//	Total volume
			//
			if(this.input_total_volume == null || this.input_total_volume == "")
			{
				Message.show_message("Error", "Please specify total volume", true);
				return false;
			}
			if(isNaN(+this.input_total_volume) || +this.input_total_volume < 0)
			{
				Message.show_message("Error", "Please specify proper total volume value", true);
				return false;
			}


			let retVal = this.isValidXY();
			if(retVal == false)
				return false;
		}
		else
		{
			if(this.arrReadings.length == 0)
			{
				Message.show_message("Error", "Please specify at-least one detector reading value", true);
				return false;
			}
		}

		//
		//	Name
		//
		if(this.input_analysis_name == null || this.input_analysis_name.length == 0)
		{
			Message.show_message("Error", "Please specify analysis name", true);
			return false;
		}

		//
		//	Sample collecton duration
		//
		if(this.input_sample_collection_duration == null || this.input_sample_collection_duration == "")
		{
			Message.show_message("Error", "Please specify sample collection duration", true);
			return false;
		}
		if(isNaN(+this.input_sample_collection_duration) || +this.input_sample_collection_duration < 0)
		{
			Message.show_message("Error", "Please specify proper sample collection duration value", true);
			return false;
		}


		//
		//	Recovery percent
		//
		if(this.input_recovery_percent == null || this.input_recovery_percent == "")
		{
			Message.show_message("Error", "Please specify recovery percent", true);
			return false;
		}
		if(isNaN(+this.input_recovery_percent) || +this.input_recovery_percent <= 0)
		{
			Message.show_message("Error", "Please specify proper recovery percent value", true);
			return false;
		}

		return true;
	}

	private async _load_monitoring_details()
	{
		try
		{
			this.monRecord = (await this.monService.get_monitorings(0, 0, 0, 0, this.mon_id))[0];
			this.person_id = this.monRecord.person_id;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async _load_id_to_name()
	{
		try
		{
			//
			//	Get nuclide name
			//
			let arrNuc = await this.nuclideService.get_nuclides();
			this.nuclide_name = arrNuc.filter((n)=> n.id == this.nuc_id)[0].name;

			//
			//	Get detector name
			//
			let arrDet = await this.detectorService.get_detectors(0);
			this.detector_name = arrDet.filter((d)=> d.id == this.det_id)[0].name;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async _load_existing_record()
	{
		try
		{
			let arrCalc = await this.calcService.get_calculations(this.mon_id);
			this.calcRecord = arrCalc.filter((c)=> c.id == this.rec_id)[0];
			this.det_id = <number>this.calcRecord!.detector_id;
			this.nuc_id = <number>this.calcRecord!.nuclide_id;
			this.input_sample_collection_duration = (<number>this.calcRecord!.contents.sample_collection_duration).toString();
			this.input_specific_activity = (<number>this.calcRecord!.contents.specific_activity).toString();
			this.input_sample_volume = (<number>this.calcRecord!.contents.sample_vol).toString();
			this.input_analysis_volume = (<number>this.calcRecord!.contents.analysis_vol).toString();
			this.input_total_volume = (<number>this.calcRecord!.contents.total_vol).toString();
			this.input_analysis_name = this.calcRecord!.name;
			this.input_recovery_percent = (<number>this.calcRecord!.contents.recovery_percent).toString();
			this.input_previous_activity = (<number>this.calcRecord!.contents.previous_activity).toString();
			this.input_previous_activity_error = (<number>this.calcRecord!.contents.previous_activity_error).toString();
			this.input_analysis_date = this.calcRecord!.analysis_date;
			this.input_comments = this.calcRecord!.comments;
			this.calculated_activity = this.calcRecord!.activity;
			this.calculated_activity_error = this.calcRecord!.activity_error;
			this.arrReadings = [];
			for(let i = 0 ; i < this.calcRecord!.contents.arrReadingAbs.length; ++i)
			{
				this.arrReadings.push({ x: this.calcRecord!.contents.arrReadingAbs[i], y: this.calcRecord!.contents.arrReadingSD[i] });
			}
			this.is_BDL = this.calcRecord!.is_BDL;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async _load_defaults()
	{
		try
		{
			//
			//	Load 10H form
			//
			if(this.monRecord == null)
				await this._load_monitoring_details();
			this.h10_Record = await this.h10Service.get_specific_10H_form(this.monRecord.form_id);

			//
			//	Extract sample volume
			//
			if(this.monRecord.sample_vol && this.monRecord.sample_vol > 0)
			{
				this.input_sample_volume = this.monRecord.sample_vol.toString();
			}

			//
			//	Extract sample collection duration
			//
			this.input_sample_collection_duration = "12";
			if(this.h10_Record.collectionDuration)
			{
				if(this.h10_Record.collectionDuration == "Overnight")
					this.input_sample_collection_duration = "12";
				else if(this.h10_Record.collectionDuration == "24 hours")
					this.input_sample_collection_duration = "24";
				else if(this.h10_Record.collectionDuration == "48 hours")
					this.input_sample_collection_duration = "48";
				else if(this.h10_Record.collectionDuration == "72 hours")
					this.input_sample_collection_duration = "72";
				else
				{
					if(!isNaN(+this.h10_Record.collectionDurationOther) && +this.h10_Record.collectionDurationOther > 0)
						this.input_sample_collection_duration = (+this.h10_Record.collectionDurationOther).toString();
				}
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	ngOnDestroy()
	{
		if(this.subQueryParams != null)
			this.subQueryParams.unsubscribe();
	}

	failed_to_load_worker_details(x: any)
	{
		Message.show_message("Error", "Failed to load personal details of the person", true).then(()=> this._location.back());
	}
}

