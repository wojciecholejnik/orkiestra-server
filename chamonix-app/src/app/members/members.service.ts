import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instrument, Member, MembersTabs, newMemberDTO, UniformGroupAndPart, User, UserDTO, UserToManage, UserToManageDTO } from '../shared/models';

@Injectable({
    providedIn: 'root'
})
export class MembersService {

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
    };
    private apiHost: string;

    public activeTab: BehaviorSubject<MembersTabs> = new BehaviorSubject({
        currentMembers: true,
        exMembers: false,
        students: false,
        mainStaff: false,
    } as MembersTabs);
    public memberDetailsAreOpen: BehaviorSubject<string> = new BehaviorSubject('');
    public membersTableIsOpen: BehaviorSubject<any> = new BehaviorSubject(true);

    public members: BehaviorSubject<Member[]> = new BehaviorSubject([] as Member[]);
    public addMembersIsOpen: BehaviorSubject<any> = new BehaviorSubject(false);
    public getMembers: Subject<any> = new Subject();

    constructor(private http: HttpClient) { 
        this.apiHost = environment.baseApiUrl;
    }

    getActiveMembers(): Observable<Member[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/active`);
    }

    getExMembers(): Observable<Member[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/ex`);
    }

    getStudentsMembers(): Observable<Member[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/students`);
    }

    getMainStaffMembers(): Observable<Member[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/main-staff`);
    }

    getNamesMembers(): Observable<{firstName: string, lastName: string, _id: string}[]> {
        return this.http.get<any>(`${this.apiHost}/musicians/name&id`);
    }

    getInstruments(): Observable<Instrument[]> {
        return this.http.get<any>(`${this.apiHost}/instruments`);
    }

    addNewMember(member: newMemberDTO): Observable<any> {
        return this.http.post<newMemberDTO>(`${this.apiHost}/musicians`, member)
    }

    moveMemberToExMembers(id: string): Observable<any> {
        return this.http.post<newMemberDTO>(`${this.apiHost}/musician/${id}`, {isActive: false})
    }

    editMemberData(id: string, memberDTO: newMemberDTO): Observable<any> {
        return this.http.post<newMemberDTO>(`${this.apiHost}/musician/${id}`, memberDTO)
    }

    removeMember(id: string): Observable<any> {
        return this.http.post<newMemberDTO>(`${this.apiHost}/musician/delete/${id}`, null)
    }

    restoreMember(id: string): Observable<any> {
        return this.http.post<newMemberDTO>(`${this.apiHost}/musician/${id}`, {isActive: true})
    }

    getMemberDetails(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiHost}/musician/${id}`);
    }

    getUniformsGroupsAndParts(memberId: string): Observable<UniformGroupAndPart[]> {
        return this.http.get<UniformGroupAndPart[]>(`${this.apiHost}/member/details/uniforms/${memberId}`);
    }

    assignUniforms(DTO: {memberId: string, parts: any[]}): Observable<any> {
        return this.http.post<any>(`${this.apiHost}/resources/uniforms-parts/assign`, DTO);
    }

    loginUser(DTO: {login: string, password: string}) {
        return this.http.post<any>(`${this.apiHost}/user/login`, DTO);
    }

    editUser(DTO: UserDTO) {
        return this.http.post<any>(`${this.apiHost}/user/edit`, DTO);  
    }

    getUserToManage() {
        return this.http.get<UserToManage[]>(`${this.apiHost}/usersToManage`);
    }

    editMemberByDirector(DTO: UserToManageDTO) {
        return this.http.post<any>(`${this.apiHost}/manageUser`, DTO);  
    }

}
