export interface OrchEvent {
    _id: string,
    dateFrom: string,
    dateTo: string | undefined,
    title: string,
    description: string,
    members: EventMember[],
    membersAbsent: EventMember[],
    externalMembers: EventExternalMember[],
    address: string,
    closed: boolean,
    year: number,
    playlist: string,
    uniforms: string,
  }

export interface OrchEventDTO {
  dateFrom: string,
  dateTo: string | undefined,
  title: string,
  description: string,
  members: string[],
  membersAbsent: string[],
  externalMembers: EventExternalMember[],
  address: string,
  closed: boolean,
  year: number,
  playlist: string,
  uniforms: string,
}
  
export type EventMember = {
    _id: string,
    firstName: string,
    lastName: string
  }
  
export type EventExternalMember = {
    name: string,
    instrument: string,
    phone: string
  }