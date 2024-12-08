import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import bulmaCalendar from 'bulma-calendar';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/Classes/AppSettings';
import { Calculations } from 'src/app/Classes/Calculation';
import { Message } from 'src/app/Classes/Message';
import { AlphaSpecService } from 'src/app/services/alpha-spec.service';
import { CalculationService } from 'src/app/services/calculation.service';
import { DetectorService } from 'src/app/services/detector.service';
import { IsotopeService } from 'src/app/services/isotope.service';
import { MonitoringService } from 'src/app/services/monitoring.service';
import { NuclideService } from 'src/app/services/nuclide.service';

@Component({
	selector: 'app-create-alpha-analysis',
	templateUrl: './create-alpha-analysis.component.html',
	styleUrls: ['./create-alpha-analysis.component.scss']
})
export class CreateAlphaAnalysisComponent implements OnInit, OnDestroy
{
	title: string = "";
	mon_id = 0;
	nuc_id = 0;
	iso_id = 0;
	det_id = 0;
	inst_id = 0;
	rec_id = 0;
	tracer_id = 0;
	person_id = 0;
	is_BDL: boolean = false;

	nuclide_name: string = "";
	isotope_name: string = "";
	detector_name: string = "";
	
	tracer_name: string = "";
	gross_tracer_counts: string = "0";
	tracer_bkg_counting_time: number = 0;
	tracer_bkg_id: number = 0;
	
	bkg_id: number = 0;
	bkg_counts: number = 0;
	background_counting_time: number = 0;
	
	gross_sample_counts: string = "0";
	sample_counting_time: string = "0";
	sample_collection_time: string = "0";

	tracer_activity_spiked: string = "0";
	analysis_date: string = moment().format('YYYY-MM-DD HH:mm:ss');

	name: string = "";
	previous_activity: string = "0";
	previous_activity_error: string = "0";
	
	comments: string = "";
	det_eff: string = "0";
	recovery_percent: number = 0;

	is_personal_details_opened = false;
	is_monitoring_details_opened = false;
	is_alpha_spec_details_opened = true;
	is_calculating = false;
	is_submitting = false;

	monRecord: any = null;
	calcRecord: Calculations | null = null;
	subQueryParams: Subscription | null = null;
	calculated_activity: number = 0;
	calculated_activity_error: number = 0;
	tracer_background_counts: number = 0;

	constructor(private route: ActivatedRoute,
				private _location: Location,
				private monService: MonitoringService,
				private nuclideService: NuclideService,
				private isotopeService: IsotopeService,
				private detectorService: DetectorService,
				private alphaSpecService: AlphaSpecService,
				private calcService: CalculationService,
				private _ngZone: NgZone) { }
	

	ngOnInit()
	{
		this.subQueryParams = this.route.queryParams.subscribe(params => 
		{
			//
			//	New analysis
			//
			this.title = "New Alpha spectrometry details";
			let requiredFields = ['mon-id', 'nuc-id', 'iso-id', 'det-id', 'tracer-id', 'inst-id'];
			for(let i = 0 ; i < requiredFields.length; ++i)
				if(isNaN(+params[requiredFields[i]]))
				{
					this._location.back();
					return;
				}
			this.mon_id = +params['mon-id'];
			this.nuc_id = +params['nuc-id'];
			this.iso_id = +params['iso-id'];
			this.det_id = +params['det-id'];
			this.tracer_id = +params['tracer-id'];
			this.inst_id = +params['inst-id'];
			this._load_data().then(()=> 
			{
				//
				//	Instantiate the calender
				//
				bulmaCalendar.attach('#dtAnalysis', { dateFormat: 'yyyy-MM-dd', maxDate: new Date(), timeFormat: 'HH:mm', validateLabel: 'Done', type: 'datetime' })[0].on('select', dt => 
				{
					let v = <string><any>dt.data.value();
					if(v.length > 0 && v.length == 16)
						this.analysis_date = v + ":00";
				});
			});
		});
	}

	ngOnDestroy()
	{
		if(this.subQueryParams != null)
			this.subQueryParams.unsubscribe();
	}

	private async _load_calculation_data()
	{
		try
		{
			await this._load_data();
			let arrCal = await this.calcService.get_calculations(this.mon_id);
			this.calcRecord = arrCal.filter((c)=> c.id == this.rec_id)[0];

			//
			//	Load nuclide name
			//
			let nucRecords: { id: number, name: string }[] = await this.nuclideService.get_nuclides();
			this.calcRecord!.nuclide_name = nucRecords.filter((n)=> n.id == this.calcRecord!.nuclide_id)[0].name

			//
			//	Isotope name and tracer name
			//
			let arrIsotopes = await this.isotopeService.get_isotopes(<number>this.calcRecord.nuclide_id);
			this.calcRecord!.isotope_name =  arrIsotopes.filter((i)=> i.id == this.calcRecord!.isotope_id)[0].name;
			this.calcRecord!.tracer_name = arrIsotopes.filter((i)=> i.id == this.calcRecord!.tracer_id)[0].name;

			//
			//	Detector name
			//
			let arrDetectors = await this.detectorService.get_detectors(0);
			this.calcRecord!.detector_name = arrDetectors.filter((d)=> d.id == this.calcRecord!.detector_id)[0].name;

			//
			//	Analysis date
			//
			this.analysis_date = this.calcRecord!.analysis_date;
			this.is_BDL = this.calcRecord!.is_BDL;
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			AppSettings.run_change_detection(this._ngZone, ()=> 
			{
				let x = this.calcRecord;
				this.calcRecord = null;
				this.calcRecord = x;
			});
		}
	}

	private async _load_data()
	{
		try
		{
			this.monRecord = (await this.monService.get_monitorings(0, 0, 0, 0, this.mon_id))[0];
			this.person_id = this.monRecord.person_id;
			await this.load_default_values();
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private async load_default_values()
	{
		try
		{
			//
			//	Load nuclide name
			//
			let nucRecords: { id: number, name: string }[] = await this.nuclideService.get_nuclides();
			nucRecords.forEach((n)=> { if(n.id == this.nuc_id) this.nuclide_name = n.name });

			//
			//	Isotope name and tracer name
			//
			let arrIsotopes = await this.isotopeService.get_isotopes(this.nuc_id);
			arrIsotopes.forEach((i)=> { if(i.id == this.iso_id) this.isotope_name = i.name; });
			arrIsotopes.forEach((i)=> { if(i.id == this.tracer_id) this.tracer_name = i.name; });

			//
			//	Detector name
			//
			let arrDetectors = await this.detectorService.get_detectors(this.inst_id);
			arrDetectors.forEach((d)=> { if(d.id == this.det_id) this.detector_name = d.name });

			//
			//	Get default values
			//
			let res = await this.alphaSpecService.get_alpha_spec_values(this.iso_id, this.det_id, this.tracer_id, this.monRecord.form_id);
			if(res.isError)
			{
				if(res.msg)
					Message.show_message("Error", res.msg, true).then((_)=> this._location.back());
				return;
			}
			else
			{
				if(res.tracer_bkg_couting_time)
					this.tracer_bkg_counting_time = res.tracer_bkg_couting_time;

				if(res.bkg_id)
					this.bkg_id = res.bkg_id;

				if(res.sample_bkg_counts)
					this.bkg_counts = res.sample_bkg_counts;

				if(res.bkg_counting_time)
					this.background_counting_time = res.bkg_counting_time;
				
				if(res.sample_collection_duration)
					this.sample_collection_time = res.sample_collection_duration.toString();
				
				if(res.tracer_bkg_id)
					this.tracer_bkg_id = res.tracer_bkg_id;
				
				if(res.det_eff)
				{
					this.det_eff = res.det_eff.toString();
				}

				if(res.tracer_bkg_counts)
				{
					this.tracer_background_counts = res.tracer_bkg_counts;
				}
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

	private IsFormOkay()
	{
		//
		//	Gross tracer counts
		//
		if(this.gross_tracer_counts == "")
		{
			Message.show_message("Error", "Please specify gross tracer counts", true);
			return false;
		}
		if(isNaN(+this.gross_tracer_counts) || (+this.gross_tracer_counts < 0))
		{
			Message.show_message("Error", "Please specify proper gross tracer counts", true);
			return false;
		}

		//
		//	Gross sample counts
		//
		if(this.gross_sample_counts == "")
		{
			Message.show_message("Error", "Please specify gross sample counts", true);
			return false;
		}
		if(isNaN(+this.gross_sample_counts) || (+this.gross_sample_counts < 0))
		{
			Message.show_message("Error", "Please specify proper gross sample counts", true);
			return false;
		}

		//
		//	Sample counting time
		//
		if(this.sample_counting_time == "")
		{
			Message.show_message("Error", "Please specify sample counting time", true);
			return false;
		}
		if(isNaN(+this.sample_counting_time) || (+this.sample_counting_time <= 0))
		{
			Message.show_message("Error", "Please specify proper sample counting time", true);
			return false;
		}

		//
		//	Sample collection duration
		//
		if(this.sample_collection_time == "")
		{
			Message.show_message("Error", "Please specify sample collection duration", true);
			return false;
		}
		if(isNaN(+this.sample_collection_time) || (+this.sample_collection_time <= 0))
		{
			Message.show_message("Error", "Please specify proper sample collection duration", true);
			return false;
		}

		//
		//	Tracer activity spiked
		//
		if(this.tracer_activity_spiked == "")
		{
			Message.show_message("Error", "Please specify spiked tracer activity", true);
			return false;
		}
		if(isNaN(+this.tracer_activity_spiked) || (+this.tracer_activity_spiked <= 0))
		{
			Message.show_message("Error", "Please specify proper spiked tracer activity", true);
			return false;
		}

		//
		//	Detector efficiency
		//
		if(this.det_eff == "")
		{
			Message.show_message("Error", "Please specify detector efficiency", true);
			return false;
		}
		if(isNaN(+this.det_eff) || (+this.det_eff <= 0))
		{
			Message.show_message("Error", "Please specify proper detector efficiency", true);
			return false;
		}

		//
		//	Previous activity
		//
		if(this.previous_activity != "")
			if(isNaN(+this.previous_activity) || (+this.previous_activity < 0))
			{
				Message.show_message("Error", "Please specify proper previous activity", true);
				return false;
			}
		
		//
		//	Previous activity error
		//
		if(this.previous_activity_error != "")
			if(isNaN(+this.previous_activity_error) || (+this.previous_activity_error < 0))
			{
				Message.show_message("Error", "Please specify proper previous activity error", true);
				return false;
			}
		
		//
		//	Name
		//
		if(this.name == "")
		{
			Message.show_message("Error", "Please specify name for this analysis", true);
			return false;
		}

		return true;
	}

	async calculate_result()
	{
		if(!this.IsFormOkay())
			return;
		try
		{
			this.calculated_activity = 0;
			this.calculated_activity_error = 0;
			this.is_calculating = true;

			//
			//	Calculate recovery percent
			//
			let res1 = await this.alphaSpecService.get_recovery_percent(parseInt(this.gross_tracer_counts),
																		this.tracer_background_counts,
																		parseInt(this.sample_counting_time),
																		parseFloat(this.tracer_activity_spiked),
																		parseFloat(this.det_eff == "" ? "0" : this.det_eff));
			this.recovery_percent = res1;
			if(this.recovery_percent < 0 || this.recovery_percent > 100)
			{
				Message.show_message("Error", "Recovery percent must be between 0 and 100 both inclusive", true);
				return;
			}

			//
			//	Calculate activity
			//
			let res = await this.alphaSpecService.save_calculate_alpha_result(  this.mon_id, 
																				this.nuc_id, 
																				this.iso_id, 
																				this.det_id, 
																				this.tracer_id,
																				this.name,
																				this.comments,
																				parseFloat(this.det_eff),
																				parseInt(this.gross_sample_counts),
																				parseInt(this.gross_tracer_counts),
																				parseFloat(this.tracer_activity_spiked),
																				parseInt(this.sample_counting_time),
																				parseInt(this.sample_collection_time),
																				this.analysis_date,
																				parseFloat(this.previous_activity == "" ? "0" : this.previous_activity),
																				parseFloat(this.previous_activity_error == "" ? "0" : this.previous_activity_error),
																				this.bkg_id,
																				this.tracer_bkg_id,
																				+this.recovery_percent,
																				this.is_BDL,
																				false);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				if(res.activity)
					this.calculated_activity = res.activity;
				if(res.activity_error)
					this.calculated_activity_error = res.activity_error;
			}
		}
		catch(e)
		{
			console.log(e);
			Message.show_message("Error", "An error occurred. "+ e, true);
		}
		finally
		{
			this.is_calculating = false;
		}
	}

	async submit_result()
	{
		if(!this.IsFormOkay())
			return;
		try
		{
			this.is_submitting = true;
			let res = await this.alphaSpecService.save_calculate_alpha_result(  this.mon_id, 
																				this.nuc_id, 
																				this.iso_id, 
																				this.det_id, 
																				this.tracer_id,
																				this.name,
																				this.comments,
																				parseFloat(this.det_eff),
																				parseInt(this.gross_sample_counts),
																				parseInt(this.gross_tracer_counts),
																				parseFloat(this.tracer_activity_spiked),
																				parseInt(this.sample_counting_time),
																				parseInt(this.sample_collection_time),
																				this.analysis_date,
																				parseFloat(this.previous_activity == "" ? "0" : this.previous_activity),
																				parseFloat(this.previous_activity_error == "" ? "0" : this.previous_activity_error),
																				this.bkg_id,
																				this.tracer_bkg_id,
																				+this.recovery_percent,
																				this.is_BDL,
																				true);
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", "Alpha spectrometry analysis created successfully", false).then(()=> this._location.back());
			}
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_submitting = false;
		}
	}

	failed_to_load_worker_details(x: any)
	{
		Message.show_message("Error", "Failed to load personal details of the person", true).then(()=> this._location.back());
	}
}

