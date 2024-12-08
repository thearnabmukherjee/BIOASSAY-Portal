import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../Classes/AppSettings';
import { Footnote } from '../../../Classes/Footnote';
import { Message } from '../../../Classes/Message';
import { FootnoteService } from '../../../services/footnote.service';

@Component({
	selector: 'app-footnotes',
	templateUrl: './footnotes.component.html',
	styleUrls: ['./footnotes.component.scss']
})
export class FootnotesComponent implements OnInit 
{
	is_loading = false;
	is_creating = false;
	is_create_modal_open = false;
	is_enabling_disabling = false;
	arrRecords: Footnote[] = [];

	is_open_create_modal = false;
	is_view_contents_modal_open = false;
	footnote_name: string = "";
	footnote_contents: string = "";

	constructor(private footnoteService: FootnoteService) { }

	ngOnInit()
	{
		this.load_footnotes();
	}

	private async load_footnotes()
	{
		this.is_loading = true;
		try
		{
			this.arrRecords = await this.footnoteService.get_footnotes();
			this.arrRecords = this.arrRecords.sort((a, b)=> b.id - a.id);
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			this.is_loading = false;
		}
	}

	open_modal()
	{
		this.footnote_name = "";
		this.footnote_contents = "";
		this.is_open_create_modal = true;
		AppSettings.subjectBlockScroll.next(true);
	}

	create_new_footnote()
	{
		if(this.footnote_name == null || this.footnote_name.length == 0)
		{
			Message.show_message("Error", "Please specify name of footnote", true);
			return;
		}
		if(this.footnote_contents == null || this.footnote_contents.length == 0)
		{
			Message.show_message("Error", "Please specify contents of footnote", true);
			return;
		}

		this.is_creating = true;
		this.footnoteService.create_footnote(this.footnote_name, this.footnote_contents, true).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", `Footnote "${this.footnote_name}" created successfully`, false);
				this.load_footnotes();
				this.close_modal();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_creating = false);
	}

	enable_disable_footnote(note_id: number, is_enable: boolean)
	{
		this.is_enabling_disabling = true;
		this.footnoteService.enable_disable_footnote(note_id, is_enable).then((res)=> 
		{
			if(res.isError)
			{
				Message.show_message("Error", res.msg, true);
				return;
			}
			else
			{
				Message.show_message("Success", `Footnote ${is_enable ? "enabled" : "disabled"} successfully`, false);
				this.load_footnotes();
			}
		}).catch((e)=> console.log(e)).finally(()=> this.is_enabling_disabling = false);
	}

	close_modal()
	{
		this.is_open_create_modal = false;
		AppSettings.subjectBlockScroll.next(false);
		this.is_view_contents_modal_open = false;
	}

	shorten_contents(data: string, max_length: number)
	{
		if(data.length > max_length)
		{
			return data.substring(0, max_length-3) + "...";
		}
		else
			return data;
	}

	open_contents_modal(data: string)
	{
		this.footnote_contents = data;
		this.is_view_contents_modal_open = true;
		AppSettings.subjectBlockScroll.next(true);
	}
}
