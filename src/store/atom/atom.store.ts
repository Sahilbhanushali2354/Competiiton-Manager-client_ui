import { Theme } from "../../theme/Theme";
import {
  AllActiveFeedbackDTO,
  PeopleDataDTO,
  PresentationDTO,
  UserDTO,
} from "../../types/input.type";
import { atom } from "recoil";

export const FieldsAtom = atom<UserDTO>({
  key: "FieldsAtom",
  default: {} as UserDTO,
});

export const AtomTheme = atom({
  key: "AtomTheme",
  default: Theme.dark,
});

export const AtomPeopleData = atom<PeopleDataDTO[]>({
  key: "AtomPeopleData",
  default: [] as PeopleDataDTO[],
});

export const AtomLangauge = atom({
  key: "AtomLangauge",
  default: localStorage.getItem("langauge") || "hiIN",
});

export const AtomAllPresentations = atom<PresentationDTO[]>({
  key: "AtomAllPresentations",
  default: [] as PresentationDTO[],
});

export const AtomSelectedParticipants = atom<PresentationDTO>({
  key: "AtomSelectedParticipants",
  default: {} as PresentationDTO,
});

export const AtomCurrentPresentation = atom<PresentationDTO>({
  key: "AtomCurrentPresentation",
  default: {} as PresentationDTO,
});

export const CurrentActiveFeedbackAtom = atom<AllActiveFeedbackDTO>({
  key: "CurrentActiveFeedbackAtom",
  default: {} as AllActiveFeedbackDTO,
});
