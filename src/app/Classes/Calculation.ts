export class Calculations
{
    id: number = 0;
    name: string = "";
    nuclide_id: number | null = 0;
    isotope_id: number | null = 0;
    tracer_id: number | null = 0;
    detector_id: number | null = 0;
    technique: string = "";
    contents: any = "";
    activity: number = 0;
    activity_error: number = 0;
    analysis_date: string = "";
    mon_id: number = 0;
    comments: string = "";
    arrCalculations: number[] | null = [];
    is_bunched: boolean = false;
    created_on: string = "";
    created_by: number = 0;
    created_by_name?: string = "";
    is_BDL: boolean = false;
    
    ui_name?: string = "";
    is_checked?: boolean = false;
    nuclide_name?: string = "";
    isotope_name?: string = "";
    tracer_name?: string = "";
    instrument_id?: number = 0;
    instrument_name?: string = "";
    detector_name?: string = "";
}