import { Person } from "types";
import { getColorFromString } from "./color";

export function firstTwoLetters(person: Person): string {
  return person.first_name[0].toUpperCase() + person.last_name[0].toUpperCase();
}

export const getPersonColor = (person: Person): string =>
  getColorFromString(person.full_name);
