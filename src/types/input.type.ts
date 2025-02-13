export interface UserDTO {
  email?: string;
  password?: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ThemeDTO {
  light: string;
  dark: string;
}

export interface UserAuthDTO {
  email: string;
}

export interface PeopleDataDTO {
  id?: string;
  email?: string;
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
}

export interface NewAccountDTO {
  id?: string;
  email?: string;
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
}

export interface NewAccountErrorDTO {
  email?: string;
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
  password?: string;
}

export interface TError {
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
}

export interface PresentationDTO {
  presentation?: string;
  topic?: string;
  category: string;
  fileName?: string;
  url?: string;
  time?: string;
  email?: string;
  description?: string;
  id?: string;
  competitionData:CompetitionDTO;
  roundData: RoundsDataDTO;
}

export interface PresentationErrorDTO {
  id?: string;
  presentation?: string;
  topic?: string;
  category: string;
  fileName?: string;
  url?: string;
  time?: string;
  email?: string;
  description?: string;
  competitionName: string;
}
export interface OptionDTO {
  id: string;
  value: string;
  point?: number;
}

export interface FieldValueDTO {
  Description: string;
  Options: { value: string }[];
}
export interface ActiveFormDTO {
  formData: FieldValueDTO;
}
export interface ActiveRoundDTO {
  id: string;
  label: string;
}
export interface ActiveParticipantDTO {
  id?: string;
  email?: string;
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
}
export interface SelectedParticipantDTO {
  id?: string;
  email?: string;
  uname?: string;
  contact?: string;
  profile?: string;
  address?: string;
}

export interface CompetitionDTO {
  id?: string | undefined;
  cname?: string;
  cid?: string;
  rounds?: RoundsDataDTO[];
}
export interface RoundsDataDTO {
  id: string;
  label: string;
}
export interface selctedParticipant {
  selectedParticipant: ActiveFormDTO;
  activeRound: ActiveRoundDTO;
  activeParticipant: ActiveParticipantDTO;
  selectedCompetition: CompetitionDTO;
}
export interface AllActiveFeedbackDTO {
  id: string;
  selectedParticipant: ActiveFormDTO;
  activeRound: ActiveRoundDTO;
  activeParticipant: ActiveParticipantDTO;
  selectedCompetition: CompetitionDTO;
}
