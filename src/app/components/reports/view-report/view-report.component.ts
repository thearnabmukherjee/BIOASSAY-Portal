import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from '../../../Classes/Message';
import { Report } from '../../../Classes/Reports';
import { ReportService } from '../../../services/report.service';
import { ListReportsComponent } from '../list-reports/list-reports.component';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit, OnDestroy
{
	private subQuery: Subscription | null = null;
	report_id: number = 0;
	is_loading = true;
	report_contents: SafeHtml = "";
	report_raw_contents: string = "";
	report_pdf_contents: any = null;
	report: Report | null =  null;
	status = "";
	is_generating_report: boolean = false;

	constructor(private route: ActivatedRoute,
				private _location: Location,
				private reportService: ReportService,
				private sanitizer: DomSanitizer) { }
	
	ngOnInit()
	{
		this.subQuery = this.route.queryParams.subscribe((params)=> 
		{
			this.report_id = +params['report-id'];
			if(this.report_id > 0)
				this._get_report_details(this.report_id);
			else
			{
				this.is_loading = false;
				this.status = "Not yet saved";
				this.report_raw_contents = <string>ListReportsComponent.REPORT_HTML;
				this.report_contents = this.sanitizer.bypassSecurityTrustHtml(this.report_raw_contents);
				this.report_pdf_contents = null;
			}
		});
	}

	private async _get_report_details(report_id: number)
	{
		this.is_loading = true;
		try
		{
			//
			//	Report details
			//
			let res_reports = await this.reportService.get_reports("sdfs", "", 0, report_id);
			this.report = res_reports[0];
			if(!this.report.is_active)
				this.status = "De-activated";
			else
			{
				if(!this.report.is_sent_for_sign)
					this.status = "Not sent";
				else
				{
					if(this.report.is_rejected)
						this.status = "Rejected";
					else
					{
						if(!this.report.approved_by1)
							this.status = "Not yet approved";
						else
						{
							if(!this.report.approved_by2)
								this.status = "Partially approved";
							else
								this.status = "Approved";
						}
					}
				}
			}
			//
			//	Report contents
			//
			let res = await this.reportService.get_report_as_HTML(this.report_id);
			if(res.isError)
			{
				Message.show_message("Error", <string>res.msg, true);
				this._location.back();
			}
			else
			{
				this.report_raw_contents = <string>res.msg;
				this.report_contents = this.sanitizer.bypassSecurityTrustHtml(this.report_raw_contents);
				//this.report_pdf_contents = atob(<string>res.encoded_pdf);
			}
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

	ngOnDestroy()
	{
		this.subQuery!.unsubscribe();
		ListReportsComponent.REPORT_BAGGAGE = "";
		ListReportsComponent.REPORT_HTML = "";
		ListReportsComponent.REPORT_TOKEN = "";
	}

	go_back()
	{
		this._location.back();
	}

	private _sanitize_name(data: string)
	{
		let ret = '';
		for(let i = 0 ; i < data.length; ++i)
			if( (data[i] >= '0' && data[i] <= '9') || (data[i] >= 'a' && data[i] <= 'z') || (data[i] >= 'A' && data[i] <= 'Z') || ['-'].includes(data[i]))
				ret += data[i];
		return ret;
	}

	download_pdf()
	{
		if(this.report == null || this.report_raw_contents == null || this.report_raw_contents.length == 0)
			return;

		//
		//	Generate report name and footer line
		//
		let div_name = this._sanitize_name(this.report.division_name);
		let report_type = this._sanitize_name(this.report.rtype);
		let report_name: string = `${this.report.id}_${div_name}_${report_type}.pdf`;
		this.is_generating_report = true;
		this.reportService.get_report_as_PDF(this.report_id).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			this.report_pdf_contents = res.msg;
			try
			{
				this._download_file(this._bytes_toArray_buffer(), report_name);
			}
			catch(e)
			{
				console.log(e);
			}
			finally
			{
				this.is_generating_report = false;
			}
		}).finally(()=> this.is_generating_report = false);
	}

	private _bytes_toArray_buffer()
	{
		let raw_contents = atob(this.report_pdf_contents);
		let binaryLen = raw_contents.length;
		let bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) 
		{
			var ascii = raw_contents.charCodeAt(i);
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
		document.body.appendChild(link);
    	link.click();
		document.body.removeChild(link);
	}

	save_report()
	{
		this.is_loading = true;
		this.reportService.save_report(ListReportsComponent.REPORT_HTML, ListReportsComponent.REPORT_TOKEN, ListReportsComponent.REPORT_BAGGAGE).then((res)=> 
		{
			if(res.isError)
				Message.show_message("Error", res.msg, true);
			else
			{
				Message.show_message("Success", "Report saved successfully", false);
				this.report_id = res.id!;
				this._get_report_details(res.id!);
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_loading = false);
	}
}
