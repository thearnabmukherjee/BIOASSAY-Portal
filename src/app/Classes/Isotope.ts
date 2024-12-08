export class Isotope
{
    id: number = 0;
    name: string = "";
    nuclide_id: number = 0;
    is_tracer: boolean = false;
    half_life: number = 0;
    specific_activity: number = 0;
    created_on: string = "";
    is_active: boolean = false;
    created_by: number = 0;
    created_by_name: string = "";

    ui_name?: string = "";
    is_checked?: boolean = false;
}