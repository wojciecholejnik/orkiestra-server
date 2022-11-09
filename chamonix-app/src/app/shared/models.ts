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
    birthDate: Date,
    isStudent: boolean,
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

export type Sorting = 'asc' | 'desc' | '';
export type ConfirmationModalType = 'restoreMember' | 'removeMember' | '';
