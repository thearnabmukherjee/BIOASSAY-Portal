export class DetectorEfficiency
{
    id: number = 0;
    detector_id: number = 0;
    source_id: number = 0;
    counting_time: number = 0;
    measured_counts: number = 0;
    technique: string = "";
    efficiency: number = 0;
    comments: string = "";

    created_on: string = "";
    created_by: number = 0;
    created_by_name?: string = "";
    is_active?: boolean = false;

    detector_name?: string = "";
    instrument_name?: string = "";
    source_name?: string = "";
}