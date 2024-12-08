import { NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export class AppSettings
{
    private static _base_server_url = "https://10.15.94.74/bioassay/backend/";
    static _auth_sso_frontend_url = "https://10.15.94.74/sso/static/";
    static OAUTH_AUTHORIZE_URL = "https://10.15.94.74/sso/backend/oauth2/authorize";
    static OAUTH_REDIRECT_URI = "https://10.15.94.74/bioassay/static/auth-code-page";
    static MY_LOGIN_PAGE = "https://10.15.94.74/bioassay/static/login-page";


    static OAUTH_SSO_PROFILE_URL = "profile-page";
    static OAUTH_SSO_CHANGE_PASSWORD_URL = "change-password-page";
    static OAUTH_SSO_REGISTER_URL = "register-page";
    static OAUTH_SSO_FORGOT_PASSWORD_URL = "lost-password-page";
    static OAUTH_CONFIRM_LOGOUT_URI = "confirm-logout-page";

    static SERVER_PING_URL = "ping";
    static SERVER_LOGOUT_URL = "logout";
    static SERVER_REFRESH_TOKEN_URL = "refresh";
    static SERVER_SUBMIT_AUTH_CODE_URL = "submit-auth-code";
    static SERVER_VALID_AUTH_STATE_URL = "valid-state";
    static SERVER_ARE_TOKENS_VALID = "tokens-valid";
    static SERVER_FORWARD_DIVISIONS_URL = "forwarder/divisions";
    static SERVER_FORWARD_PLANTS_URL = "forwarder/plants";
    static SERVER_PERSONAL_DEAILS = "forwarder/personal-details";
    static SERVER_SINGLE_PERSONAL_DEAILS = "forwarder/personal-detail";
    static SERVER_TLDS = "forwarder/tld";

    static SERVER_USER_ACCOUNTS_ROLES = "user/users-and-roles";
    static SERVER_PLANT_HP_BINDING = "user/hp-plant-binding";
    static SERVER_PLANT_RV_BINDING = "user/rv-plant-binding";
    static SERVER_DIVISION_DH_BINDING = "user/dh-division-binding";
    static SERVER_10H_FORMS = "10h/forms";
    static SERVER_10H_FORM = "10h/form";
    static SERVER_LAST_10H_FORM = "10h/last-form";
    static SERVER_WORKER_10H_FORMS = "10h/worker-forms";
    static SERVER_MONITORING = "mon/mon";
    static SERVER_MONITORING_TYPES = "mon/types";
    static SERVER_SAMPLE_NUMBERS = "mon/sample-nos";
    static SERVER_REJECT_10H_FORM = "10h/reject";
    static SERVER_SAMPLE_SPOILED_10H_FORM = "10h/sample-spoiled";
    static SERVER_10H_REPEAT_MONITORING = "10h/repeat-mon-required";
    static SERVER_10H_PRINT = "10h/print";

    static SERVER_MY_INFO = "user/user-info";
    static SERVER_GET_USERS = "user/users";
    static SERVER_NUCLIDE = "user/nuclide";
    static SERVER_ISOTOPE = "user/isotope";
    static SERVER_INSTRUMENT = "user/instrument";
    static SERVER_DETECTOR = "user/detector";
    static SERVER_CLASS = "user/class";
    static SERVER_CHECK_SOURCE = "user/check-source";
    static SERVER_CHECK_SOURCE_ATTACHMENT = "user/check-source-file";
    static SERVER_DETECTOR_EFFICIENCY = "user/efficiency";
    static SERVER_INTAKE_ROUTE = "user/intake-route";
    static SERVER_PLANT_NUCLIDE_BINDING = "user/nuclide-plant-binding";
    static SERVER_TYPE_OF_PROCESS = "user/type-of-process";
    static SERVER_BACKGROUND = "user/background";


    static SERVER_ALPHA_DEFAULTS = "calc/alpha-defaults";
    static SERVER_ALPHA_CALCULATE = "calc/calc-alpha";
    static SERVER_LF_CALCULATE = "calc/calc-lf";
    static SERVER_RECOVERY_PERCENT = "calc/recovery-percent";
    static SERVER_CALC = "calc/calc";
    static SERVER_CALC_BUNCH = "calc/calc-bunch";
    
    static SERVER_LAST_MONITORING_DATE = "10h/last-monitoring-date";
    static SERVER_FOOTNOTES = "footnote/";
    static SERVER_SET = "set/";
    static SERVER_REPORTS = "reports/";

    static SERVER_REPORT_RECORDS = "reports/records";
    static SERVER_REPORT_TEMP = "reports/temp";
    static SERVER_REPORT_SAVE = "reports/save";
    static SERVER_REPORT_AS_HTML = "reports/as-html";
    static SERVER_REPORT_AS_PDF = "reports/as-pdf";


    static SERVER_SEND_FOR_SIGN = "reports/send-for-sign";
    static SERVER_REJECT_REPORT = "reports/reject";
    static SERVER_REPORT_SIGN = "reports/sign";
    static SERVER_REPORTS_FOR_PERSON = "reports/report-for-person";

    static VALID_FORM_STATES = ["10 H submitted", "10 H accepted", 'Sample spoiled', 'Being processed', 'Rejected', 'Completed', 'Repeat'];
    //static VALID_FORM_STATES = ['10 H submitted', '10 H accepted', 'Sample spoiled', 'Being processed', 'Rejected', 'Completed', 'Repeat'];

    static subjectBlockScroll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    static IDS_PORTAL_CLIENT_ID = "7grRmV7t0CDB6knu7oDIrRRroGqUOglBKQYs";
    static RRBA_CLIENT_ID = "WXHsQ2hHOqrwNuzthIj5gBLuQzdmiTWZNF9Y";

    static _initialize()
    {
        //
        //  Construct SSO URLs
        //
        AppSettings.OAUTH_SSO_PROFILE_URL = this._auth_sso_frontend_url + AppSettings.OAUTH_SSO_PROFILE_URL;
        AppSettings.OAUTH_SSO_CHANGE_PASSWORD_URL = this._auth_sso_frontend_url + AppSettings.OAUTH_SSO_CHANGE_PASSWORD_URL;
        AppSettings.OAUTH_SSO_REGISTER_URL = this._auth_sso_frontend_url + AppSettings.OAUTH_SSO_REGISTER_URL;
        AppSettings.OAUTH_SSO_FORGOT_PASSWORD_URL = this._auth_sso_frontend_url + AppSettings.OAUTH_SSO_FORGOT_PASSWORD_URL;
        AppSettings.OAUTH_CONFIRM_LOGOUT_URI = this._auth_sso_frontend_url + AppSettings.OAUTH_CONFIRM_LOGOUT_URI;

        //
        //  Construct Bioassay URLs
        //
        AppSettings.SERVER_PING_URL = this._base_server_url + AppSettings.SERVER_PING_URL;
        AppSettings.SERVER_VALID_AUTH_STATE_URL = this._base_server_url + AppSettings.SERVER_VALID_AUTH_STATE_URL;
        AppSettings.SERVER_LOGOUT_URL = this._base_server_url + AppSettings.SERVER_LOGOUT_URL;
        AppSettings.SERVER_SUBMIT_AUTH_CODE_URL = this._base_server_url + AppSettings.SERVER_SUBMIT_AUTH_CODE_URL;
        AppSettings.SERVER_ARE_TOKENS_VALID = this._base_server_url + AppSettings.SERVER_ARE_TOKENS_VALID;
        AppSettings.SERVER_REFRESH_TOKEN_URL = this._base_server_url + AppSettings.SERVER_REFRESH_TOKEN_URL;
        AppSettings.SERVER_FORWARD_DIVISIONS_URL = this._base_server_url + AppSettings.SERVER_FORWARD_DIVISIONS_URL;
        AppSettings.SERVER_FORWARD_PLANTS_URL = this._base_server_url + AppSettings.SERVER_FORWARD_PLANTS_URL;
        AppSettings.SERVER_USER_ACCOUNTS_ROLES = this._base_server_url + AppSettings.SERVER_USER_ACCOUNTS_ROLES;
        AppSettings.SERVER_PLANT_HP_BINDING = this._base_server_url + AppSettings.SERVER_PLANT_HP_BINDING;
        AppSettings.SERVER_PLANT_RV_BINDING = this._base_server_url + AppSettings.SERVER_PLANT_RV_BINDING;
        AppSettings.SERVER_DIVISION_DH_BINDING = this._base_server_url + AppSettings.SERVER_DIVISION_DH_BINDING;
        AppSettings.SERVER_GET_USERS = this._base_server_url + AppSettings.SERVER_GET_USERS;
        AppSettings.SERVER_TLDS = this._base_server_url + AppSettings.SERVER_TLDS;
        AppSettings.SERVER_NUCLIDE = this._base_server_url + AppSettings.SERVER_NUCLIDE;
        AppSettings.SERVER_CLASS = this._base_server_url + AppSettings.SERVER_CLASS;
        AppSettings.SERVER_INTAKE_ROUTE = this._base_server_url + AppSettings.SERVER_INTAKE_ROUTE;
        AppSettings.SERVER_PERSONAL_DEAILS = this._base_server_url + AppSettings.SERVER_PERSONAL_DEAILS;
        AppSettings.SERVER_SINGLE_PERSONAL_DEAILS = this._base_server_url + AppSettings.SERVER_SINGLE_PERSONAL_DEAILS;
        AppSettings.SERVER_10H_FORMS = this._base_server_url + AppSettings.SERVER_10H_FORMS;
        AppSettings.SERVER_10H_FORM = this._base_server_url + AppSettings.SERVER_10H_FORM;
        AppSettings.SERVER_10H_REPEAT_MONITORING = this._base_server_url + AppSettings.SERVER_10H_REPEAT_MONITORING;
        AppSettings.SERVER_LAST_10H_FORM = this._base_server_url + AppSettings.SERVER_LAST_10H_FORM;
        AppSettings.SERVER_WORKER_10H_FORMS = this._base_server_url + AppSettings.SERVER_WORKER_10H_FORMS;
        AppSettings.SERVER_10H_PRINT = this._base_server_url + AppSettings.SERVER_10H_PRINT;
        AppSettings.SERVER_MY_INFO = this._base_server_url + AppSettings.SERVER_MY_INFO;
        AppSettings.SERVER_PLANT_NUCLIDE_BINDING = this._base_server_url + AppSettings.SERVER_PLANT_NUCLIDE_BINDING;
        AppSettings.SERVER_TYPE_OF_PROCESS = this._base_server_url + AppSettings.SERVER_TYPE_OF_PROCESS;
        AppSettings.SERVER_LAST_MONITORING_DATE = this._base_server_url + AppSettings.SERVER_LAST_MONITORING_DATE;
        AppSettings.SERVER_MONITORING = this._base_server_url + AppSettings.SERVER_MONITORING;
        AppSettings.SERVER_MONITORING_TYPES = this._base_server_url + AppSettings.SERVER_MONITORING_TYPES;
        AppSettings.SERVER_SAMPLE_NUMBERS = this._base_server_url + AppSettings.SERVER_SAMPLE_NUMBERS;
        AppSettings.SERVER_REJECT_10H_FORM = this._base_server_url + AppSettings.SERVER_REJECT_10H_FORM;
        AppSettings.SERVER_SAMPLE_SPOILED_10H_FORM = this._base_server_url + AppSettings.SERVER_SAMPLE_SPOILED_10H_FORM;
        AppSettings.SERVER_ISOTOPE = this._base_server_url + AppSettings.SERVER_ISOTOPE;
        AppSettings.SERVER_DETECTOR = this._base_server_url + AppSettings.SERVER_DETECTOR;
        AppSettings.SERVER_INSTRUMENT = this._base_server_url + AppSettings.SERVER_INSTRUMENT;
        AppSettings.SERVER_ALPHA_DEFAULTS = this._base_server_url + AppSettings.SERVER_ALPHA_DEFAULTS;
        AppSettings.SERVER_ALPHA_CALCULATE = this._base_server_url + AppSettings.SERVER_ALPHA_CALCULATE;
        AppSettings.SERVER_RECOVERY_PERCENT = this._base_server_url + AppSettings.SERVER_RECOVERY_PERCENT;
        AppSettings.SERVER_CHECK_SOURCE = this._base_server_url + AppSettings.SERVER_CHECK_SOURCE;
        AppSettings.SERVER_CHECK_SOURCE_ATTACHMENT = this._base_server_url + AppSettings.SERVER_CHECK_SOURCE_ATTACHMENT;
        AppSettings.SERVER_DETECTOR_EFFICIENCY = this._base_server_url + AppSettings.SERVER_DETECTOR_EFFICIENCY;
        AppSettings.SERVER_BACKGROUND = this._base_server_url + AppSettings.SERVER_BACKGROUND;
        AppSettings.SERVER_CALC = this._base_server_url + AppSettings.SERVER_CALC;
        AppSettings.SERVER_CALC_BUNCH = this._base_server_url + AppSettings.SERVER_CALC_BUNCH;
        AppSettings.SERVER_LF_CALCULATE = this._base_server_url + AppSettings.SERVER_LF_CALCULATE;
        AppSettings.SERVER_FOOTNOTES = this._base_server_url + AppSettings.SERVER_FOOTNOTES;
        AppSettings.SERVER_SET = this._base_server_url + AppSettings.SERVER_SET;
        AppSettings.SERVER_REPORTS = this._base_server_url + AppSettings.SERVER_REPORTS;
        AppSettings.SERVER_SEND_FOR_SIGN = this._base_server_url + AppSettings.SERVER_SEND_FOR_SIGN;
        AppSettings.SERVER_REJECT_REPORT = this._base_server_url + AppSettings.SERVER_REJECT_REPORT;
        AppSettings.SERVER_REPORT_SIGN = this._base_server_url + AppSettings.SERVER_REPORT_SIGN;

        AppSettings.SERVER_REPORT_SAVE = this._base_server_url + AppSettings.SERVER_REPORT_SAVE;
        AppSettings.SERVER_REPORT_RECORDS = this._base_server_url + AppSettings.SERVER_REPORT_RECORDS;
        AppSettings.SERVER_REPORT_TEMP = this._base_server_url + AppSettings.SERVER_REPORT_TEMP;
        AppSettings.SERVER_REPORT_AS_HTML = this._base_server_url + AppSettings.SERVER_REPORT_AS_HTML;
        AppSettings.SERVER_REPORT_AS_PDF = this._base_server_url + AppSettings.SERVER_REPORT_AS_PDF;
        AppSettings.SERVER_REPORTS_FOR_PERSON = this._base_server_url + AppSettings.SERVER_REPORTS_FOR_PERSON;
    }

    static scroll_to_top()
	{
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}

    static run_change_detection(_ngZone: NgZone, func: any)
    {
        _ngZone.run(func);
    }

    static split_nuclide(nuclide: string)
    {
        if(nuclide == null || nuclide.length == 0)
            return ["", nuclide, ""];                   //  Sup, <nuclide>, Sup
        
        //
        //  Number is at start position
        //
        let val = nuclide;
        if(val[0] >= '0' && val[0] <= '9')
        {
            let counter = 0;
            while(counter < val.length)
            {
                if(val[counter] >= '0' && val[counter] <= '9' || val[counter] == '+')
                    ++counter;
                else
                    break;
            }
            let sup = val.substring(0, counter);
            let nuc = val.substring(counter);
            return [sup, nuc, ""];
        }
        //
        //  Number is at end
        //
        else if(val[val.length-1] >= '0' && val[val.length-1] <= '9')
        {
            let counter = val.length;
            while(counter > 0)
            {
                --counter;
                if(val[counter] >= '0' && val[counter] <= '9' || val[counter] == '+')
                {
                    //  Do nothing
                }
                else
                {
                    ++counter;
                    break;
                }
            }
            let sup = val.substring(counter);
            let nuc = val.substring(0, counter)
            return ["", nuc, sup];
        }
        else
        {
            return ["", nuclide, ""];
        }
    }
};
AppSettings._initialize();