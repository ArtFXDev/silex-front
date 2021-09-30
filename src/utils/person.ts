import { Person } from "types";
import { getColorFromString } from "./color";

export function firstTwoLetters(person: Person): string {
  return person.full_name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");
}

export const getPersonColor = (person: Person): string =>
  getColorFromString(person.full_name);
