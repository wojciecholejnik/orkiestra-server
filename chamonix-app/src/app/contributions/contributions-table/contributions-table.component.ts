import { Component, Input, OnInit } from '@angular/core';
import { ContributionsList } from 'src/app/shared/models';

@Component({
  selector: 'app-contributions-table',
  templateUrl: './contributions-table.component.html',
  styleUrls: ['./contributions-table.component.scss']
})
export class ContributionsTableComponent implements OnInit {
  @Input() list!: ContributionsList;

  constructor() { }

  ngOnInit(): void {
  }
  

}
