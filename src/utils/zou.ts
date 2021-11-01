/* eslint-disable camelcase */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Person, Project } from "types/entities";

/**
 * Type of an axios response that returns a promise
 */
type PromiseResponse<T> = Promise<AxiosResponse<T>>;

/**
 * Returns the zou api url with the given path
 * @param path
 */
export function zouURL(path: string): string {
  return `${process.env.REACT_APP_ZOU_API}/${path}`;
}

/**
 * Returns a new url with the /api root
 * @param path
 */
export function zouAPIURL(path: string): string {
  return zouURL(`api/${path}`);
}

/**
 * Wrapper of axios get with credentials
 * @param url query url
 * @param config aditionnal config to pass to axios
 */
export function getWithCredentials<T>(
  url: string,
  config?: AxiosRequestConfig
): PromiseResponse<T> {
  return axios.get(zouAPIURL(url), {
    withCredentials: true,
    ...config,
  });
}

/**
 * Returns the url of a thumbnail hosted on zou
 * @param category the category of thumbnails
 * @param id id of that preview
 */
export function pictureThumbnailURL(
  category: "preview-files" | "persons",
  id: string
): string {
  return zouAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

/**
 * Returns the url of the full resolution image
 * @param id id of that preview
 */
export function originalPreviewFileURL(id: string): string {
  return zouAPIURL(`pictures/originals/preview-files/${id}.png`);
}

/**
 * Checks if the user is authenticated with the backend and the WS server
 * @returns the authenticated user if successfull
 */
export function isAuthenticated(): PromiseResponse<{
  user: Person;
}> {
  return new Promise((resolve, reject) => {
    // Check if the token is on the socket server side
    axios
      .get(`${process.env.REACT_APP_WS_SERVER}/auth/token`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_token) => {
        // Check if authenticated on the zou side
        getWithCredentials<{ user: Person }>("auth/authenticated", {
          timeout: 1500,
        })
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

type LoginInput = { email: string; password: string };
type LoginResponse = PromiseResponse<{
  login: boolean;
  ldap: boolean;
  access_token: string;
  refresh_token: string;
  user: Person;
}>;

/**
 * Queries the login route to authenticate the client on both zou and ws server
 * @param data the email and password
 */
export function login(data: LoginInput): LoginResponse {
  return new Promise((resolve, reject) => {
    // Login to the WS server first
    axios
      .post(`${process.env.REACT_APP_WS_SERVER}/auth/login`, data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_response) => {
        // Login directly to Zou for cookies
        axios
          .post(zouAPIURL("auth/login"), data, { withCredentials: true })
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

/**
 * Logout the user and set cookies to be empty
 * @returns logout if successfull
 */
export function logout(): PromiseResponse<{ logout: boolean }> {
  axios.post(`${process.env.REACT_APP_WS_SERVER}/auth/logout`);
  return getWithCredentials("auth/logout");
}

/**
 * Returns current user's projects
 * @returns a list of projects
 */
export function getUserProjects(): PromiseResponse<Project[]> {
  return getWithCredentials("data/user/projects/open");
}
