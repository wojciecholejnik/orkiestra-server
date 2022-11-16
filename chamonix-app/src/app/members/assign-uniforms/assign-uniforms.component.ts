import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Member, UniformGroupAndPart, UniformPart } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
    selector: 'app-assign-uniforms',
    templateUrl: './assign-uniforms.component.html',
    styleUrls: ['./assign-uniforms.component.scss']
})
export class AssignUniformsComponent implements OnInit, OnChanges {

    @Input() uniforms!: UniformGroupAndPart[];
    uniformsToDisplay: any;
    @Input() member!: Member;
    @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
    form: any;

    constructor(private fb: FormBuilder, private membersService: MembersService) { }

    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.uniformsToDisplay = this.uniforms.map(group => {
            return {
                name: group.name,
                _id: group._id,
                parts: group.parts.map(part => {
                    return {
                        name: part.name,
                        _id: part._id,
                        assigned: this.isUsserAssigned(part.usingMembers)

                    }
                })
            }
        });
        this.form = this.fb.group({
            groups: this.fb.array(this.uniformsToDisplay.map((group: any) => this.fb.group({
                name: group.name,
                parts: this.fb.array(group.parts.map((part: any) => this.fb.group(
                    {
                        name: part.name,
                        assigned: part.assigned,
                        id: part._id
                    }
                )
                ))
            })))
        });
        let i = 0;
        // this.groupsFieldAsFormArray.controls.forEach(groupcontrol => {
        //     console.log(groupcontrol.value.name);
        //     this.partsFieldsAsFormArray(i).controls.forEach(part => {
        //         console.log(part)
        //     });
        //     i++
        // })
    }

    get groupsFieldAsFormArray(): FormArray {
        return this.form.get('groups') as FormArray;
    }

    partsFieldsAsFormArray(index: number): FormArray {
        return this.groupsFieldAsFormArray.controls[index].get('parts') as FormArray
    }


    isUsserAssigned(usingMembers: string[]) {
        const index = usingMembers.indexOf(this.member._id);
        return index >= 0;
    }   

    closeModal() {
        this.onCloseModal.emit(true);
    }

    save(){
        const parts: string[] = [];
        let i = 0;
        this.groupsFieldAsFormArray.controls.forEach(groupcontrol => {
            this.partsFieldsAsFormArray(i).controls.forEach(part => {
                if (part.touched) {
                    parts.push({
                        ...part.value 
                     })
                }
            });
            i++
        });
        this.membersService.assignUniforms({memberId: this.member._id, parts: parts}).subscribe({
            next: () => this.onCloseModal.emit(true),
            error: (err) => {
                console.log(err)
            }
        })
    }

}
