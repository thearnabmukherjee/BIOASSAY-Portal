import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, tap } from 'rxjs/operators';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy
{
	@ViewChild('search') search_element: ElementRef | undefined;
	@Output('searched') search_event: EventEmitter<string> = new EventEmitter<string>();
	search_val: string = "";

	constructor() { }
	
	ngOnInit()
	{
		let k = sessionStorage.getItem("search_val");
		if(k != null && k.length > 0)
		{
			this.search_val = k;
			sessionStorage.removeItem("search_val");
			this.perform_search(k);
		}
	}

	ngAfterViewInit()
	{
		if(this.search_element)
		fromEvent(this.search_element.nativeElement, 'keyup').pipe(
			debounceTime(500), 
			distinctUntilChanged(),
			map((x: any)=> x.target.value)).subscribe((val)=> this.perform_search(<string>val));
	}

	perform_search(val: string)
	{
		this.search_event.emit(val);
	}

	ngOnDestroy()
	{
		if(this.search_val != null && this.search_val.length > 0)
			sessionStorage.setItem("search_val", this.search_val);
	}
}
