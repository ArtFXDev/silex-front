import axios from "axios";
import { kitsuAPIURL } from "utils/kitsu";
import { Sequence, Shot, Task } from "types";

/**
 * The type of possible entity in the tree
 */
export type TreeEntity = Sequence | Shot | Task;

/**
 * Used to fetch the data with SWR
 */
export const fetcher = <T>(url: string) =>
  axios
    .get<T>(kitsuAPIURL(url), { withCredentials: true })
    .then((res) => res.data);

export const fetchMultiple = (url: string) => fetcher<TreeEntity[]>(url);
export const fetchSingle = (url: string) => fetcher<TreeEntity>(url);
