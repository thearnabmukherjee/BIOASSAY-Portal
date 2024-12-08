import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from '../../../Classes/Message';

@Component({
	selector: 'app-capture-photo',
	templateUrl: './capture-photo.component.html',
	styleUrls: ['./capture-photo.component.scss']
})
export class CapturePhotoComponent implements OnInit 
{
	is_photo_captured: boolean = false;
	encoded_image: string = "";
	secure_image: string = "";
	private trigger: Subject<void> = new Subject<void>();
	@Output('closed') close_emitter: EventEmitter<{ secure: string, encoded: string }> = new EventEmitter<{ secure: string, encoded: string }>();

	constructor(private domSanitizer: DomSanitizer) { }

	ngOnInit()
	{

		this.trigger.next();
	}

	camera_init_error(error: WebcamInitError)
	{
		if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") 
		{
			Message.show_message("Error", "Camera access was not allowed by user!", true).then((_)=> this.close());
		}
		else
		{
			Message.show_message("Error", "Camera access is blocked by your browser", true).then((_)=> this.close());
		}
	}

	capture_photo()
	{
		this.trigger.next();
	}

	photo_captured(webcamImage: WebcamImage)
	{
		this.secure_image = this.domSanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + webcamImage.imageAsBase64) as string;
		this.encoded_image = webcamImage.imageAsBase64;
	}

	save_snapshot()
	{
		if(this.encoded_image != "")
		{
			console.log("Emitting image: ", this.encoded_image.length);
			this.close_emitter.emit({ secure: this.secure_image, encoded: this.encoded_image });
		}
	}

	close()
	{
		this.close_emitter.emit({ secure: "", encoded: "" });
	}

	public get triggerObservable(): Observable<void> 
	{
		return this.trigger.asObservable();
	}
}
