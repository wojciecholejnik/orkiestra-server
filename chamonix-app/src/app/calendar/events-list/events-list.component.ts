import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  providers: [DatePipe]
})
export class EventsListComponent implements OnInit {

  constructor() { }

  @Input() list: any[] = [];

  ngOnInit(): void {
  }

}
