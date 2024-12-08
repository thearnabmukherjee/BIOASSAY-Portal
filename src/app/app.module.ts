import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AuthCodeComponent } from './components/auth-code/auth-code.component';
import { ListWorkersComponent } from './components/H10/list-workers/list-workers.component';
import { DivisionsComponent } from './components/list/divisions/divisions.component';
import { PlantsComponent } from './components/list/plants/plants.component';
import { UsersComponent } from './components/list/users/users.component';
import { PlantHPBindingComponent } from './components/list/plant-hpbinding/plant-hpbinding.component';
import { Create10HComponent } from './components/H10/create10-h/create10-h.component';
import { TldComponent } from './components/list/tld/tld.component';
import { NuclideComponent } from './components/list/nuclide/nuclide.component';
import { ClassComponent } from './components/list/class/class.component';
import { IntakeRouteComponent } from './components/list/intake-route/intake-route.component';
import { ListH10Component } from './components/list/list-h10/list-h10.component';
import { ProcessTypeComponent } from './components/list/process-type/process-type.component';
import { Edit10HComponent } from './components/H10/edit10-h/edit10-h.component';
import { View10HComponent } from './components/H10/view10-h/view10-h.component';
import { Worker10HComponent } from './components/H10/worker10-h/worker10-h.component';
import { AcceptMonitoringDetailsComponent } from './components/process/accept-monitoring-details/accept-monitoring-details.component';
import { H10ListComponent } from './components/H10/h10-list/h10-list.component';
import { ListMonitoringsComponent } from './components/list/list-monitorings/list-monitorings.component';
import { SubListMonitoringsComponent } from './components/process/sub-list-monitorings/sub-list-monitorings.component';
import { SubWorkerDetailsComponent } from './components/process/sub-worker-details/sub-worker-details.component';
import { MonDetailsComponent } from './components/process/mon-details/mon-details.component';
import { ViewAnalysisComponent } from './components/analysis/view-analysis/view-analysis.component';
import { CreateAnalysisComponent } from './components/analysis/create-analysis/create-analysis.component';
import { CreateBunchComponent } from './components/analysis/create-bunch/create-bunch.component';
import { ViewMonitoringDetailsComponent } from './components/process/view-monitoring-details/view-monitoring-details.component';
import { IsotopesComponent } from './components/manage/isotopes/isotopes.component';
import { InstrumentsComponent } from './components/manage/instruments/instruments.component';
import { DetectorsComponent } from './components/manage/detectors/detectors.component';
import { CheckSourceComponent } from './components/manage/check-source/check-source.component';
import { DetectorEfficiencyComponent } from './components/manage/detector-efficiency/detector-efficiency.component';
import { BackgroundComponent } from './components/manage/background/background.component';
import { MomentModule } from 'ngx-moment';
import { MyHTTPInterceptor } from './Classes/MyHTTPInterceptor';
import { FootnotesComponent } from './components/manage/footnotes/footnotes.component';
import { ListReportsComponent } from './components/reports/list-reports/list-reports.component';
import { ViewReportComponent } from './components/reports/view-report/view-report.component';
import { ClientHomeComponent } from './components/manage/client-home/client-home.component';
import { SearchComponent } from './components/manage/client-home/search/search.component';
import { WorkersListComponent } from './components/manage/client-home/workers-list/workers-list.component';
import { MonListComponent } from './components/manage/client-home/mon-list/mon-list.component';
import { WorkerRegistrationComponent } from './components/manage/worker-registration/worker-registration.component';
import { CapturePhotoComponent } from './components/manage/capture-photo/capture-photo.component';
import {WebcamModule} from 'ngx-webcam';
import { PlantReportViewerBindingComponent } from './components/list/plant-report-viewer-binding/plant-report-viewer-binding.component';
import { DivisionDivisionHeadBindingComponent } from './components/list/division-division-head-binding/division-division-head-binding.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ViewAlphaAnalysisComponent } from './components/analysis/Alpha/view-alpha-analysis/view-alpha-analysis.component';
import { ViewLFAnalysisComponent } from './components/analysis/LF/view-lfanalysis/view-lfanalysis.component';
import { ViewSAMAnalysisComponent } from './components/analysis/LF/view-samanalysis/view-samanalysis.component';
import { ViewCFMAnalysisComponent } from './components/analysis/LF/view-cfmanalysis/view-cfmanalysis.component';
import { CreateAlphaAnalysisComponent } from './components/analysis/Alpha/create-alpha-analysis/create-alpha-analysis.component';
import { CreateLFAnalysisComponent } from './components/analysis/LF/create-lfanalysis/create-lfanalysis.component';
import { SetChooserComponent } from './components/reports/set-chooser/set-chooser.component';
import { NewReportComponent } from './components/reports/new-report/new-report.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		AuthCodeComponent,
  		ListWorkersComponent,
		DivisionsComponent,
		PlantsComponent,
		UsersComponent,
		PlantHPBindingComponent,
		Create10HComponent,
		TldComponent,
		NuclideComponent,
		ClassComponent,
		IntakeRouteComponent,
		ListH10Component,
		ProcessTypeComponent,
		Edit10HComponent,
		View10HComponent,
		Worker10HComponent,
		AcceptMonitoringDetailsComponent,
		H10ListComponent,
		ListMonitoringsComponent,
		SubListMonitoringsComponent,
		SubWorkerDetailsComponent,
		MonDetailsComponent,
		ViewAnalysisComponent,
		CreateAnalysisComponent,
		CreateBunchComponent,
		ViewMonitoringDetailsComponent,
		IsotopesComponent,
		InstrumentsComponent,
		DetectorsComponent,
		CheckSourceComponent,
		DetectorEfficiencyComponent,
		BackgroundComponent,
  		FootnotesComponent,
    	ListReportsComponent,
		ViewReportComponent,
		ClientHomeComponent,
		SearchComponent,
		WorkersListComponent,
		MonListComponent,
		WorkerRegistrationComponent,
		CapturePhotoComponent,
		PlantReportViewerBindingComponent,
		DivisionDivisionHeadBindingComponent,
		LogoutComponent,
		ViewAlphaAnalysisComponent,
		ViewLFAnalysisComponent,
		ViewSAMAnalysisComponent,
		ViewCFMAnalysisComponent,
		CreateAlphaAnalysisComponent,
		CreateLFAnalysisComponent,
		  SetChooserComponent,
    NewReportComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		MomentModule.forRoot(
		{
			relativeTimeThresholdOptions: 
			{
				'm': 59
			}
		}),
		WebcamModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: MyHTTPInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }