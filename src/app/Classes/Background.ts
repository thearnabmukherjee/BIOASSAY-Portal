export class Background
{
    id: number = 0;
    name: string = "";
    detector_id: number = 0;
    isotope_id: number = 0;
    technique: string = "";
    counting_time: number = 0;
    counts: number = 0;

    is_active: boolean = false;
    created_on: string = "";
    created_by: number = 0;
    created_by_name: string = "";

    detector_name?: string = "";
    instrument_name?: string = "";
    isotope_name?: string = "";
}