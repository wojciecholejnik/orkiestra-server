import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instrument, Member, newResourceDTO, newSectionDTO, ResourcesTabs, Section } from '../shared/models';

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
        sections: false
    } as ResourcesTabs);

    public addResourceInstrumentIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public addResourceUniformsIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public addResourceSectionIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public shouldGetResourcesInstruments: Subject<any> = new Subject();
    public shuldGetResourcesUniforms: Subject<any> = new Subject();
    public shuldGetResourcesSections: Subject<any> = new Subject();

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

    removePart(id: string, groupId: string) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/remove-part/${id}`, {groupId});
    }

    editPart(id: string, DTO: {name: string, state: number}) {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms/edit-part/${id}`, DTO);
    }

    getInstructors() {
        return this.http.get<any>(`${this.apiHost}/musicians/instructors`);
    }

    addSection(DTO: newSectionDTO) {
        return this.http.post<any>(`${this.apiHost}/sections`, DTO);
    }

    updateSection(sectionId: string, DTO: newSectionDTO) {
        return this.http.put<any>(`${this.apiHost}/section/${sectionId}`, DTO);
    }

    removeSection(id: string) {
        return this.http.post<any>(`${this.apiHost}/section/delete/${id}`, null)
    }

    addInstrumentToSection(instrument: {name: string, section: string}) {
        return this.http.post<any>(`${this.apiHost}/instruments`, instrument)
    }

    updateInstrumentInSection(DTO: {_id: string, name: string, section?: string}) {
        return this.http.put<any>(`${this.apiHost}/instrument/${DTO._id}`, DTO)
    }

    removeInstrumentFromSection(id: string) {
        return this.http.delete<any>(`${this.apiHost}/instrument/delete/${id}`)
    }
}
