import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResourcesTabs } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  public activeTab: BehaviorSubject<ResourcesTabs> = new BehaviorSubject({
    uniforms: true,
    instruments: false,
    sections: false,
    instructors: false,
    others: false
  } as ResourcesTabs);

  constructor() { }
}
