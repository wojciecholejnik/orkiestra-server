import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InstrumentsSectionView } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {

  sectionIsOpen: BehaviorSubject<InstrumentsSectionView> = new BehaviorSubject({
    brass: false,
    woodwinds: false,
    percussions: false,
    others: false
  } as InstrumentsSectionView);

  constructor() { }
}
