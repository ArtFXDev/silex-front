import axios, { AxiosResponse } from "axios";
import { Project, Person } from "types";

type PromiseResponse<T> = Promise<AxiosResponse<T>>;

export function kitsuURL(path: string): string {
  return `${process.env.REACT_APP_KITSU_URL}/${path}`;
}

export function kitsuAPIURL(path: string): string {
  return kitsuURL(`api/${path}`);
}

export function get<T>(url: string): PromiseResponse<T> {
  return axios.get(kitsuAPIURL(url), {
    withCredentials: true,
  });
}

export function pictureThumbnailURL(category: string, id: string): string {
  return kitsuAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

export function originalPreviewFileURL(id: string): string {
  return kitsuAPIURL(`pictures/originals/preview-files/${id}.png`);
}

type UserResponse = PromiseResponse<{ user: Person }>;

export function isAuthenticated(): UserResponse {
  return get("auth/authenticated");
}

type LoginInput = { email: string; password: string };

export function login(data: LoginInput): UserResponse {
  return axios.post(kitsuAPIURL("auth/login"), data, {
    withCredentials: true,
  });
}

export function logout(): PromiseResponse<{ logout: boolean }> {
  return get("auth/logout");
}

export function getUserProjects(): PromiseResponse<Project[]> {
  return get("data/user/projects/open");
}
