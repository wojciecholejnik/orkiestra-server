export interface NavOption {
    name: string,
    isActive: boolean
}

export interface MembersTabs {
    currentMembers: boolean,
    exMembers: boolean,
    [key: string]: boolean
}

export interface ResourcesTabs {
    instruments: boolean,
    uniforms: boolean,
    instructors: boolean,
    sections: boolean,
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
    birthDate: Date
    [key: string]: any
}

export interface Instrument {
    _id: string,
    name: string,
    section: Section
}

export interface Section {
    _id: string,
    name: string,
    instructor: string
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
    birthDate: Date
}

export type Sorting = 'asc' | 'desc' | '';
export type ConfirmationModalType = 'restoreMember' | 'removeMember' | '';
