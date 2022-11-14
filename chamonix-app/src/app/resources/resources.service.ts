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
        uniforms: true,
        instruments: false,
        sections: false,
        instructors: false,
        others: false
    } as ResourcesTabs);

    public addResourceInstrumentIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public addResourceUniformsIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public shouldGetResourcesInstruments: Subject<any> = new Subject();
    public shuldGetResourcesUniforms: Subject<any> = new Subject();

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

    getMembersNames(): Observable<{firstName: string, lastName: string, _id: string}[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/name&id`);
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

    getUniformsGroups() {
        return this.http.get<any>(`${this.apiHost}/resources/uniforms-groups`);
    }

    getPartsForUniformsGroup(groupId: string) {
        return this.http.get<any>(`${this.apiHost}/resources/uniforms-group-parts/${groupId}`);
    }

    addUnfirmsGroup(DTO: {name: string}) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/add-group`, DTO);
    }

    removeUniformsGroup(id: string) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/remove-group/${id}`, null);
    }

    editUnfirmsGroup(DTO: {id: string, name: string}) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/edit-group/${DTO.id}`, DTO);
    }

    addUniformParts(DTO: any) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/add-parts`, DTO);
    }

    removePart(id: string) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/remove-part/${id}`, null);
    }
}
