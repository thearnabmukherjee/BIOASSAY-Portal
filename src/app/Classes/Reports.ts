export class Report
{
    id: number = 0;
    name: string = "";
    rtype: string = "";
    start_date: string = "";
    end_date: string = "";
    division_id: number = 0;
    division_name: string = "";
    footnote_id: number = 0;
    arrSend_to: string[] = [];
    approved_by1?: number | null = 0;
    approved_by2?: number | null = 0;
    approved_on1?: string = "";
    approved_on2?: string = "";
    is_active: boolean = false;
    created_on: string = "";
    approved_by1_name: string = "";
    approved_by2_name: string = "";
    created_by: number = 0;
    created_by_name: string = "";
    is_sent_for_sign: boolean = false;
    is_rejected: boolean = false;
    rejected_by?: number | null = 0;
    rejected_by_name?: string = "";
    rejection_reason: string = "";
    sent_on: string = "";
    rejected_on: string = "";
    comments: string = "";
}