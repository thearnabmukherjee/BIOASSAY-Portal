import { BackgroundComponent } from './components/manage/background/background.component';
import { DetectorEfficiency } from './Classes/DetectorEfficiency';
import { DetectorsComponent } from './components/manage/detectors/detectors.component';
import { InstrumentsComponent } from './components/manage/instruments/instruments.component';
import { IsotopesComponent } from './components/manage/isotopes/isotopes.component';
import { CreateBunchComponent } from './components/analysis/create-bunch/create-bunch.component';
import { CreateAnalysisComponent } from './components/analysis/create-analysis/create-analysis.component';
import { ListMonitoringsComponent } from './components/list/list-monitorings/list-monitorings.component';
import { Worker10HComponent } from './components/H10/worker10-h/worker10-h.component';
import { View10HComponent } from './components/H10/view10-h/view10-h.component';
import { Edit10HComponent } from './components/H10/edit10-h/edit10-h.component';
import { ProcessTypeComponent } from './components/list/process-type/process-type.component';
import { ListH10Component } from './components/list/list-h10/list-h10.component';
import { IntakeRouteComponent } from './components/list/intake-route/intake-route.component';
import { ClassComponent } from './components/list/class/class.component';
import { NuclideComponent } from './components/list/nuclide/nuclide.component';
import { TldComponent } from './components/list/tld/tld.component';
import { Create10HComponent } from './components/H10/create10-h/create10-h.component';
import { PlantHPBindingComponent } from './components/list/plant-hpbinding/plant-hpbinding.component';
import { PlantReportViewerBindingComponent } from './components/list/plant-report-viewer-binding/plant-report-viewer-binding.component';
import { DivisionDivisionHeadBindingComponent } from './components/list/division-division-head-binding/division-division-head-binding.component';

import { UsersComponent } from './components/list/users/users.component';
import { PlantsComponent } from './components/list/plants/plants.component';
import { DivisionsComponent } from './components/list/divisions/divisions.component';
import { AuthCodeComponent } from './components/auth-code/auth-code.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HomeComponent } from './components/home/home.component';
import { ListWorkersComponent } from './components/H10/list-workers/list-workers.component';
import { AcceptMonitoringDetailsComponent } from './components/process/accept-monitoring-details/accept-monitoring-details.component';
import { MonDetailsComponent } from './components/process/mon-details/mon-details.component';
import { ViewAnalysisComponent } from './components/analysis/view-analysis/view-analysis.component';
import { CheckSourceComponent } from './components/manage/check-source/check-source.component';
import { DetectorEfficiencyComponent } from './components/manage/detector-efficiency/detector-efficiency.component';
import { FootnotesComponent } from './components/manage/footnotes/footnotes.component';
import { ListReportsComponent } from './components/reports/list-reports/list-reports.component';
import { ViewReportComponent } from './components/reports/view-report/view-report.component';
import { ClientHomeComponent } from './components/manage/client-home/client-home.component';
import { WorkerRegistrationComponent } from './components/manage/worker-registration/worker-registration.component';
import { AuthGuard } from './services/auth.guard';
import { CreateLFAnalysisComponent } from './components/analysis/LF/create-lfanalysis/create-lfanalysis.component';
import { CreateAlphaAnalysisComponent } from './components/analysis/Alpha/create-alpha-analysis/create-alpha-analysis.component';
import { SetChooserComponent } from './components/reports/set-chooser/set-chooser.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login-page', component: LoginComponent },
	{ path: 'logout-page', component: LogoutComponent },
	{ path: 'home-page', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'auth-code-page', component: AuthCodeComponent },
	{ path: 'list-10h-workers', component: ListWorkersComponent, canActivate: [AuthGuard] },
	{ path: 'list-divisions', component: DivisionsComponent, canActivate: [AuthGuard] },
	{ path: 'list-plants', component: PlantsComponent, canActivate: [AuthGuard] },
	{ path: 'list-users', component: UsersComponent, canActivate: [AuthGuard] },

	{ path: 'list-hp-plant-assignments', component: PlantHPBindingComponent, canActivate: [AuthGuard] },
	{ path: 'list-rv-plant-assignments', component: PlantReportViewerBindingComponent, canActivate: [AuthGuard] },
	{ path: 'list-dh-division-assignments', component: DivisionDivisionHeadBindingComponent, canActivate: [AuthGuard] },

	{ path: 'list-tlds', component: TldComponent, canActivate: [AuthGuard] },
	{ path: 'create-10h', component: Create10HComponent, canActivate: [AuthGuard] },
	{ path: 'edit-10h', component: Edit10HComponent, canActivate: [AuthGuard] },
	{ path: 'view-10h', component: View10HComponent, canActivate: [AuthGuard] },
	{ path: 'list-nuclides', component: NuclideComponent, canActivate: [AuthGuard] },
	{ path: 'list-classes', component: ClassComponent, canActivate: [AuthGuard] },
	{ path: 'list-routes', component: IntakeRouteComponent, canActivate: [AuthGuard] },
	{ path: 'list-10h', component: ListH10Component, canActivate: [AuthGuard] },
	{ path: 'list-worker-10h', component: Worker10HComponent, canActivate: [AuthGuard] },
	{ path: 'list-process-type', component: ProcessTypeComponent, canActivate: [AuthGuard] },
	{ path: 'list-mon', component: ListMonitoringsComponent, canActivate: [AuthGuard] },
	{ path: 'view-mon', component: MonDetailsComponent, canActivate: [AuthGuard] },
	{ path: 'accept-10h', component: AcceptMonitoringDetailsComponent, canActivate: [AuthGuard] },

	{ path: 'view-analysis', component: ViewAnalysisComponent, canActivate: [AuthGuard] },
	{ path: 'create-analysis', component: CreateAnalysisComponent, canActivate: [AuthGuard] },
	{ path: 'create-bunch', component: CreateBunchComponent, canActivate: [AuthGuard] },
	{ path: 'create-alpha-analysis', component: CreateAlphaAnalysisComponent, canActivate: [AuthGuard] },
	{ path: 'create-lf-analysis', component: CreateLFAnalysisComponent, canActivate: [AuthGuard] },

	{ path: 'isotope', component: IsotopesComponent, canActivate: [AuthGuard] },
	{ path: 'instruments', component: InstrumentsComponent, canActivate: [AuthGuard] },
	{ path: 'detectors', component: DetectorsComponent, canActivate: [AuthGuard] },
	{ path: 'check-source', component: CheckSourceComponent, canActivate: [AuthGuard] },
	{ path: 'detector-efficiency', component: DetectorEfficiencyComponent, canActivate: [AuthGuard] },
	{ path: 'backgrounds', component: BackgroundComponent, canActivate: [AuthGuard] },
	{ path: 'footnote', component: FootnotesComponent, canActivate: [AuthGuard] },
	{ path: 'list-reports', component: ListReportsComponent, canActivate: [AuthGuard] },
	{ path: 'view-report', component: ViewReportComponent, canActivate: [AuthGuard] },
	{ path: 'client-home', component: ClientHomeComponent, canActivate: [AuthGuard] },
	{ path: 'new-worker-registration', component: WorkerRegistrationComponent, canActivate: [AuthGuard] },
	{ path: 'set-chooser', component: SetChooserComponent, canActivate: [AuthGuard] },
	{ path: '**', component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class AppRoutingModule { }

