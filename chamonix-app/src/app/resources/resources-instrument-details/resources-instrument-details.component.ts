import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InstrumentDetails } from 'src/app/shared/models';

@Component({
    selector: 'app-resources-instrument-details',
    templateUrl: './resources-instrument-details.component.html',
    styleUrls: ['./resources-instrument-details.component.scss']
})
export class ResourcesInstrumentDetailsComponent implements OnInit {
    @Input() instrument!: InstrumentDetails;
    @Output() onEdit:EventEmitter<InstrumentDetails> = new EventEmitter();
    @Output() onRemove:EventEmitter<InstrumentDetails> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    editInstrument(): void {
        this.onEdit.next(this.instrument);
    }

    removeInstrument(): void {
        this.onRemove.next(this.instrument)
    }

}
