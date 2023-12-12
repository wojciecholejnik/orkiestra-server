export interface NavOption {
    name: string,
    isActive: boolean
}

export interface MembersTabs {
    currentMembers: boolean,
    exMembers: boolean,
    students: boolean,
    mainStaff: boolean,
    spectators: boolean,
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

export interface Member extends User {
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

export interface UserToManage {
    _id: string,
    firstName: string,
    lastName: string,
    login: string,
    role: string,
    editing?: boolean,
    isActive?: boolean,
}

export interface UserToManageDTO {
    _id: string,
    login?: string,
    role?: string,
    password?: string,
}

export interface User {
    _id: string
    login: string,
    firstName: string,
    lastName: string,
    role: Roles
}

export interface Privileges {
    addNewRoleStaff: boolean,
    editPresence: boolean,
    addNewMember: boolean,
    editResourcesInstrument: boolean,
    editResourcesUniforms: boolean,
    editContributions: boolean,
    editDiary: boolean,
    editCalendar: boolean
    [key: string]: boolean
}

export enum DeviceType {
    phone = 'phone',
    tablet = 'tablet',
    laptop = 'laptop'
}

export type PrivilegesTypes = "addNewRoleStaff" | "editPresence" | "addNewMember" | "editResourcesInstrument" | "editResourcesUniforms";

export enum Roles {
    bandDirector = '0',
    instructor = '1',
    inspector = '2',
    member = '3',
    paymaster = '4',
    spectator = '5'
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

export interface ContributionListMember {
    member: {
        _id: string,
        firstName: string,
        lastName: string,
        contributionsAccount: number
    },
    months: {
            monthNumber: number,
            paid: boolean
        }[]

}

export interface ContributionsList {
    _id: string,
    year: number,
    isClosed: boolean,
    members: ContributionListMember[]
}

export interface EditContributionsList {
    listId: string,
    memberId: string,
    memberContributionsAccount: number,
    months: {monthNumber: number, paid: boolean}[]
}

export type MemberOnTheList = {firstName: string, lastName: string, _id: string, onTheList: boolean}
export type MemberToSend = {
  member: string
  months: {
        monthNumber: number,
        paid: boolean
    }[]
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
| 'deletePresence'
| 'removeContributionList'
| 'removeEvent'
| 'addNewBudget'
| '';

export enum NavOptions {
    dashboard = 'dashboard',
    members = 'members',
    diary = 'diary',
    calendar = 'calendar',
    resources = 'resources',
    contrbutions = 'contrbutions',
    accounting = 'accounting',
}

export interface ActiveModule {
    name: string, 
    isActive: boolean, 
    href: NavOptions
}

export interface AccountingList {
    _id: string,
    year: number,
    isClosed: boolean,
    balance: number,
    history: AccountingHistoryItem[]
}

export interface AccountingHistoryItem {
    author: string,
    date: string,
    value: number,
    description: string
}
