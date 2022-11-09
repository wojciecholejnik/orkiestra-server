import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instrument, Member, newResourceDTO, ResourcesTabs, Section } from '../shared/models';

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
    };
    private apiHost: string;

    public activeTab: BehaviorSubject<ResourcesTabs> = new BehaviorSubject({
        uniforms: false,
        instruments: true,
        sections: false,
        instructors: false,
        others: false
    } as ResourcesTabs);

    public addReourceIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public shouldGetResourcesInstruments: Subject<any> = new Subject();

    constructor(private http: HttpClient) { 
        this.apiHost = environment.baseApiUrl;
    }

    getAllResourcess(): Observable<any[]> {
        return this.http.get<any>(`${this.apiHost}/resources`);
    }

    getAllResourcesInstruments(): Observable<any[]> {
        return this.http.get<any>(`${this.apiHost}/resources/instruments`);
    }

    getSections(): Observable<Section[]> {
        return this.http.get<any>(`${this.apiHost}/sections`);
    }

    getInstrumentsBySection(sectionId: string): Observable<Instrument[]> {
        return this.http.get<any>(`${this.apiHost}/instrumentsBySection/${sectionId}`);
    }

    getActiveMembers(): Observable<Member[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/active`);
    }

    deleteResource(resourceId: string): Observable<any> {
        return this.http.post<any>(`${this.apiHost}/resource/delete/${resourceId}`, null);
    }

    addResource(DTO: newResourceDTO) {
        return this.http.post<any>(`${this.apiHost}/resources`, DTO);
    }

    updateResource(id: string, DTO: any) {
        return this.http.post<any>(`${this.apiHost}/resource/update/${id}`, DTO);
    }
}
