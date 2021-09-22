import axios from "axios";
import { Project, ProjectId, User, Sequence, Shot, SequenceId } from "types";

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

export function pictureThumbnailURL(category: string, id: string) {
  return kitsuAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

export function originalPreviewFileURL(id: string) {
  return kitsuAPIURL(`pictures/originals/preview-files/${id}.png`);
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

export function getProjectSequences(id: ProjectId) {
  return get<Sequence[]>(`data/projects/${id}/sequences`);
}

export function getSequenceShots(id: SequenceId) {
  return get<Shot[]>(`data/sequences/${id}/shots`);
}
