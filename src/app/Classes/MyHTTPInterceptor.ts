import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { Message } from './Message';
import { Router } from '@angular/router';

@Injectable()
export class MyHTTPInterceptor implements HttpInterceptor
{
    private _refreshSubject: Subject<any> = new Subject<any>();
    private is_refresh_in_progress: boolean = false;
    
    constructor(private authService: AuthService,
                private router: Router) {}

    private _logout() 
    {
        this.authService.logout();
        this.router.navigate(["login-page"]);
    }

    private _refresh_token(): Observable<any>
    {
        if(this.is_refresh_in_progress)
        {
            //
            //  Wait for subject to emit something
            //
            return new Observable(observer => 
            {
                this._refreshSubject.asObservable().subscribe((_)=> 
                {
                    observer.next();
                    observer.complete();
                }, 
                (err)=> 
                {
                    observer.error(err);
                });
            });
        }
        else
        {
            this.is_refresh_in_progress = true;
            return from(this.authService.refresh_tokens()).pipe(tap(()=> 
            {
                //
                //  Token refreshed successfully
                //
                this.is_refresh_in_progress = false;
                this._refreshSubject.next();            //  TODO: Update user info
            }), catchError((error, _)=> 
            {
                //
                //  Couldn't refresh token. Raise error for all the waiting requests
                //
                this.is_refresh_in_progress = false;
                this._logout();
                this._refreshSubject.error(error);
                this._refreshSubject = new Subject<any>();      //  Refresh the subject for new requests
                return throwError(error);
            }));
        }
    }

    private _handleResponseError(error, request?, next?) : Observable<any>
    {
        //
        //  Invalid or expired token
        //
        if (error.status === 401)
        {
            return this._refresh_token().pipe(
                switchMap(()=> 
                {
                    //
                    //  Token refreshed/ already refreshed
                    //
                    return next.handle(request);
                }),
                catchError((err, _)=> 
                {
                    if(err.status != 401)
                    {
                        return this._handleResponseError(err);
                    }
                    else
                    {
                        this._logout();
                        return throwError(err);
                    }
                }));
        }
        return throwError(error);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {
        //
        //  Let logout and refresh requests pass
        //
        if(req.url.endsWith("/logout") || req.url.endsWith("/refresh"))
        {
            return next.handle(req);
        }

        //
        //  Intercept other requests
        //
        return next.handle(req).pipe(catchError((error, caught)=> 
        {
            return this._handleResponseError(error, req, next);
        }));
    }
}