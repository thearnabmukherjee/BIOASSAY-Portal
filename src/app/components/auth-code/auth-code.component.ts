import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/Classes/AppSettings';

@Component({
	selector: 'app-auth-code',
	templateUrl: './auth-code.component.html',
	styleUrls: ['./auth-code.component.scss']
})
export class AuthCodeComponent implements OnInit, OnDestroy
{
	private subParams : any = null;
	private code: string = "";
	private state: string = "";
	is_working = false;

	constructor(private route: ActivatedRoute,
				private authService: AuthService,
				private router: Router) { }

	ngOnInit()
	{
		this.subParams = this.route.queryParams.subscribe((params)=> 
		{
			this.code = params.code;
			this.state = params.state;
			this.is_working = true;
			this.authService.submit_auth_code(this.code, this.state).then((_)=> 
			{
				this.authService.check_if_logged_in().then((_)=> 
				{
					this.is_working = false;
					this.authService.fetch_user_info().then((info)=> 
					{
						//
						//	Show submitted 10H page to technician
						//
						if(info.roles.includes("tech"))
						{
							this.router.navigate(['/list-10h'], { queryParams: { 'type': AppSettings.VALID_FORM_STATES[0] } });
						}

						//
						//	Show reports page to division head, report viewer, OIC1 and OIC2
						//
						else if(info.roles.includes("division_head") || 
								info.roles.includes("report_viewer") ||
								info.roles.includes("oic1") ||
								info.roles.includes("oic2"))
						{
							this.router.navigateByUrl("list-reports");
						}

						//
						//	Show accepted 10H forms to Normal user and Admin
						//
						else if(info.roles.includes("normaluser") || info.roles.includes("admin"))
						{
							this.router.navigate(['/list-10h'], { queryParams: { 'type': AppSettings.VALID_FORM_STATES[1] } });
						}

						//
						//	Show list of workers to HP
						//
						else if(info.roles.includes("hp"))
						{
							this.router.navigateByUrl("list-10h-workers");
						}
						this.is_working = false;
					}).catch((e)=> this._handle_error(e));
				}).catch((e)=> this._handle_error(e));
			}).catch((e)=> this._handle_error(e));
		});
	}

	private _handle_error(e: any)
	{
		console.log(e); 
		this.is_working = false;
		this.router.navigateByUrl("home-page");
	}

	ngOnDestroy()
	{
		if(this.subParams != null)
			this.subParams.unsubscribe();
	}
}
