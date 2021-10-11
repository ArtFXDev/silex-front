import { Person } from "types/entities";

import { getColorFromString } from "./color";

/**
 * Returns the first two letters of a person in upper case
 * @param person
 */
export function firstTwoLetters(person: Person): string {
  return person.full_name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");
}

/**
 * Returns a unique color from a person's first and last name
 * @param person
 */
export const getPersonColor = (person: Person): string =>
  getColorFromString(person.full_name);
