export interface NavOption {
    name: string,
    isActive: boolean
}

export interface MembersTabs {
    currentMembers: boolean,
    exMembers: boolean,
    students: boolean,
    mainStaff: boolean,
    [key: string]: boolean
}

export interface ResourcesTabs {
    instruments: boolean,
    uniforms: boolean,
    sections: boolean,
    [key: string]: boolean
}


export interface InstrumentsSectionView {
    brass: boolean,
    woodwinds: boolean,
    percussions: boolean,
    others: boolean,
    [key: string]: boolean
}

export interface Member {
    _id: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    phone: number | null,
    email: string,
    address1: string,
    address2: string,
    instrument: Instrument,
    isChild: boolean,
    parentPhone: number | null,
    parentName: string,
    joiningDate: Date,
    birthDate: Date,
    isStudent: boolean,
    [key: string]: any
}

export interface Instrument {
    _id: string,
    name: string,
    section: Section
}

export interface newSectionDTO {
    name: string,
    instructor: string,
}

export interface Section {
    _id: string,
    name: string,
    instructor: {
        firstName: string,
        lastName: string,
        _id: string
    },
    instruments: Instrument[]
}


export interface InstrumentDetails {
    type: Instrument,
    brand: string,
    model: string,
    serialNumber: string,
    user: string,
    condition: string,
    description: string
}

export interface newMemberDTO {
    firstName: string,
    lastName: string,
    isActive: boolean,
    phone: number | null,
    email: string,
    address1: string,
    address2: string,
    instrument: string,
    isChild: boolean,
    parentPhone: number | null,
    parentName: string,
    joiningDate: Date,
    birthDate: Date,
    isStudent: boolean
}

export interface newResourceDTO {
    type: string,
    brand: string, 
    model: string, 
    serialNumber: string, 
    condition: string,
    description: string,
    user: string,
}

export interface UniformPart {
    _id: string;
    name: string;
    group: string;
    usingMembers: any[]; 
}

export interface UniformGroupAndPart {
    _id: string;
    name: string;
    parts: UniformPart[];
}

export interface UserDTO {
    id: string
    login: string,
    name: string,
    password: string;
    password1: string,
    password2: string,
    role?: string
}

export interface User {
    _id: string
    login: string,
    name: string,
    role: string
}

export interface DiaryTabs {
    performances: boolean,
    orchestraLessons: boolean,
    [key: string]: boolean
}

export interface LessonDTO {
    date: Date | string,
    type: 'normal-lesson' | 'other',
    members: {_id: string, status: 'present' | 'absent' | 'late' | ''}[]
}

export interface Lesson extends LessonDTO {
    _id: string
}

export enum Roles {
    bandDirecotr = '0',
    instructor = '1',
    inspector = '2',
    member = '3'
}


export type Sorting = 'asc' | 'desc' | '';
export type ConfirmationModalType = 
'restoreMember' 
| 'removeMember' 
| 'removeInstrument' 
| 'removeUniformGroup' 
| 'removeUniformPart' 
| 'removeSection' 
| 'removeInstrumentFromSection'
| '';
