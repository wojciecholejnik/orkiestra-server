import { TypeOfExpression } from "typescript"

export interface NavOption {
  name: string,
  isActive: boolean
}

export interface MembersTabs {
  currentMembers: boolean,
  exMembers: boolean,
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
  _id: InstrumentId,
  name: InstrumentTranslation,
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

export enum InstrumentId {
  trumpet = '636240444e6e26c95b316f58',
  tromobone = '636240644e6e26c95b316f59',
  frenchHorn = '636240734e6e26c95b316f5b',
  tuba = '636240824e6e26c95b316f5c',
  altoSax = '636240a74e6e26c95b316f5d',
  tenorSax = '636240d14e6e26c95b316f5e',
  clarinet = '636240e24e6e26c95b316f5f',
  flute = '636240ee4e6e26c95b316f60',
  percussion = '636240fd4e6e26c95b316f61',
  guitarBass = '63626808ffe43f545e9fb07d',
}

export enum InstrumentTranslation {
  'trumpet' = 'trąbka',
  'tromobone' = 'puzon',
  'frenchHorn' = 'waltornia',
  'tuba' = 'tuba',
  'altoSax' = 'saksofon altowy',
  'tenorSax' = 'saksofon tenorowy',
  'clarinet' = 'klarnet',
  'flute' = 'flet',
  'percussion' = 'perkusja',
  'guitarBass' = 'gitara basowa',
}