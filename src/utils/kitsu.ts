import axios from "axios";
import { User } from "context/User";

export function kitsuURL(path: string) {
  return `${process.env.REACT_APP_KITSU_URL}/${path}`;
}

export function kitsuAPIURL(path: string) {
  return kitsuURL(`api/${path}`);
}

export function pictureThumbnailURL(category: "persons", id: string) {
  return kitsuAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}

export function isAuthenticated() {
  return axios.get(kitsuAPIURL("auth/authenticated"), {
    withCredentials: true,
  });
}

export function login(data: { email: string; password: string }) {
  return axios.post<{ user: User }>(kitsuAPIURL("auth/login"), data, {
    withCredentials: true,
  });
}

export function logout() {
  return axios.get(kitsuAPIURL("auth/logout"), { withCredentials: true });
}
