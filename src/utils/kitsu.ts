import axios from "axios";
import { Project } from "types";
import { User } from "types";

export function kitsuURL(path: string) {
  return `${process.env.REACT_APP_KITSU_URL}/${path}`;
}

export function kitsuAPIURL(path: string) {
  return kitsuURL(`api/${path}`);
}

export function get<T>(url: string) {
  return axios.get<T>(kitsuAPIURL(url), {
    withCredentials: true,
  });
}

export function pictureThumbnailURL(category: "persons", id: string) {
  return kitsuAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

export function isAuthenticated() {
  return get<{ user: User }>("auth/authenticated");
}

export function login(data: { email: string; password: string }) {
  return axios.post<{ user: User }>(kitsuAPIURL("auth/login"), data, {
    withCredentials: true,
  });
}

export function logout() {
  return get("auth/logout");
}

export function getUserProjects() {
  return get<Project[]>("data/user/projects/open");
}
