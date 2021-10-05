import axios, { AxiosResponse } from "axios";
import { Person, Project } from "types";

type PromiseResponse<T> = Promise<AxiosResponse<T>>;

export function zouURL(path: string): string {
  return `${process.env.REACT_APP_ZOU_API}/${path}`;
}

export function zouAPIURL(path: string): string {
  return zouURL(`api/${path}`);
}

export function get<T>(url: string): PromiseResponse<T> {
  return axios.get(zouAPIURL(url), {
    withCredentials: true,
  });
}

export function pictureThumbnailURL(category: string, id: string): string {
  return zouAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

export function originalPreviewFileURL(id: string): string {
  return zouAPIURL(`pictures/originals/preview-files/${id}.png`);
}

type UserResponse = PromiseResponse<{ user: Person }>;

export function isAuthenticated(): UserResponse {
  return get("auth/authenticated");
}

type LoginInput = { email: string; password: string };

export function login(data: LoginInput): UserResponse {
  return axios.post(zouAPIURL("auth/login"), data, {
    withCredentials: true,
  });
}

export function logout(): PromiseResponse<{ logout: boolean }> {
  return get("auth/logout");
}

export function getUserProjects(): PromiseResponse<Project[]> {
  return get("data/user/projects/open");
}
