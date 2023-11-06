/* eslint-disable camelcase */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import {
  Asset,
  Person,
  Project,
  Sequence,
  Shot,
  Task,
  ValidationRecord,
} from "~/types/entities";
import { GameVariant } from "~/types/entities/Game";

type Route<R = unknown, P = never> = { result: R; params: P };

type GetRoutes = {
  "auth/authenticated": Route<{ authenticated: boolean; user: Person }>;
};

/**
 * Replaces route parameters with their respective value
 * Eg: /auth/:id, { id: 4 } => /auth/4
 */
function handleRouteParams(
  route: string,
  params: Record<string, unknown>
): string {
  for (const [key, value] of Object.entries(params)) {
    route = route.replaceAll(`:${key}`, String(value));
  }
  return route;
}

export async function apiGet<R extends keyof GetRoutes>(
  ...args: GetRoutes[R]["params"] extends never
    ? [R]
    : [R, GetRoutes[R]["params"]]
): Promise<GetRoutes[R]["result"]> {
  const [route, params] = args;

  const formatRoute = params
    ? handleRouteParams(route as string, params)
    : (route as string);

  const result = await axios.get(zouAPIURL(formatRoute), {
    withCredentials: true,
  });

  return result.data;
}

/**
 * Type of an axios response that returns a promise
 */
type PromiseResponse<T> = Promise<AxiosResponse<T>>;

/**
 * Returns the zou api url with the given path
 * @param path
 */
export function zouURL(path: string): string {
  return `${import.meta.env.VITE_ZOU_API}/${path}`;
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
  category: "preview-files" | "persons" | "projects",
  id: string,
  extension?: string
): string {
  return zouAPIURL(
    `pictures/thumbnails/${category}/${id}.${extension || "png"}`
  );
}

/**
 * Returns the url of the full resolution image
 * @param id id of that preview
 */
export function originalPreviewFileURL(
  id: string,
  category: "pictures" | "movies",
  extension?: string
): string {
  return zouAPIURL(
    `${category}/originals/preview-files/${id}.${extension || "png"}`
  );
}

export async function isAuthenticated() {
  const socketAuthRoute = `${import.meta.env.VITE_WS_SERVER}/auth/token`;
  await axios.get(socketAuthRoute);

  return await apiGet("auth/authenticated");
}

type LoginInput = { email: string; password: string };
type LoginResponse = PromiseResponse<{
  login: boolean;
  ldap: boolean;
  access_token: string;
  refresh_token: string;
  user: Person;
}>;

export async function verifyCredentials(data: LoginInput): Promise<boolean> {
  try {
    const response = await axios.post(zouAPIURL("auth/login"), data, {
      withCredentials: true,
    });
    if (response.data) return true;
  } catch (e) {
    return false;
  }

  return false;
}

/**
 * Queries the login route to authenticate the client on both zou and ws server
 * @param data the email and password
 */
export function login(data: LoginInput): LoginResponse {
  return new Promise((resolve, reject) => {
    // Login to the WS server first
    axios
      .post(`${import.meta.env.VITE_WS_SERVER}/auth/login`, data)
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
  axios.post(`${import.meta.env.VITE_WS_SERVER}/auth/logout`);
  return getWithCredentials("auth/logout");
}

/**
 * Returns current user's projects
 * @returns a list of projects
 */
export function getUserProjects(): PromiseResponse<Project[]> {
  return getWithCredentials("data/user/projects/open");
}

export function assignUserToTask(
  personId: string,
  taskId: string
): PromiseResponse<Task> {
  return axios.put(
    zouAPIURL(`actions/persons/${personId}/assign`),
    {
      task_ids: [taskId],
    },
    { withCredentials: true }
  );
}

export function clearAssignation(
  personId: string,
  taskId: string
): PromiseResponse<string[]> {
  return axios.put(
    zouAPIURL(`actions/tasks/clear-assignation`),
    { task_ids: [taskId] },
    { withCredentials: true }
  );
}

export function createAsset(
  projectId: string,
  assetTypeId: string,
  data: {
    data: unknown;
    description: string;
    episode_id: string | null;
    name: string;
  }
): PromiseResponse<Asset> {
  return axios.post(
    zouAPIURL(
      `data/projects/${projectId}/asset-types/${assetTypeId}/assets/new`
    ),
    data,
    { withCredentials: true }
  );
}

export function createShot(
  projectId: string,
  sequenceId: string,
  name: string
): PromiseResponse<Shot> {
  return axios.post(
    zouAPIURL(`data/projects/${projectId}/shots`),
    { name, sequence_id: sequenceId },
    { withCredentials: true }
  );
}

export function createSequence(
  projectId: string,
  episodeId: string | null,
  name: string
): PromiseResponse<Sequence> {
  return axios.post(
    zouAPIURL(`data/projects/${projectId}/sequences`),
    { name, episode_id: episodeId },
    { withCredentials: true }
  );
}

export function createTask(
  projectId: string,
  taskTypeId: string,
  category: (Shot | Asset | Sequence)["type"],
  entityId: string,
  name = "main"
): PromiseResponse<Task> {
  return axios.post(
    zouAPIURL(
      `actions/projects/${projectId}/task-types/${taskTypeId}/${category.toLowerCase()}s/create-task`
    ),
    { shot: entityId, name },
    { withCredentials: true }
  );
}

export function deleteEntity(
  category: (Shot | Task | Asset | Sequence)["type"],
  entityId: string,
  force: boolean
): Promise<Record<string, never>> {
  return axios.delete(
    zouAPIURL(
      `data/${category.toLowerCase()}s/${entityId}?force=${force.toString()}`
    ),
    { withCredentials: true }
  );
}

export function buildWorkingFilePath(
  taskId: string
): PromiseResponse<{ path: string; name: string }> {
  return axios.post(
    zouAPIURL(`data/tasks/${taskId}/working-file-path`),
    {
      mode: "working",
      name: "name",
      revision: 0,
    },
    { withCredentials: true }
  );
}

export function buildPublishFilePath(
  taskId: string
): PromiseResponse<{ path: string; name: string }> {
  return axios.post(
    zouAPIURL(`data/tasks/${taskId}/working-file-path`),
    {
      mode: "output_ui",
      name: "main",
      revision: 0,
    },
    { withCredentials: true }
  );
}

export function setAsMainPreview(
  previewFileId: string
): PromiseResponse<Shot | Asset> {
  return axios.put(
    zouAPIURL(`actions/preview-files/${previewFileId}/set-main-preview`),
    {},
    { withCredentials: true }
  );
}

export function updateEntity<T>(
  entityId: string,
  data: Partial<T>
): Promise<Record<string, never>> {
  return axios.put(zouAPIURL(`data/entities/${entityId}`), data, {
    withCredentials: true,
  });
}

export function updateProject(
  projectId: string,
  data: Partial<Project>
): PromiseResponse<Project> {
  return axios.put(zouAPIURL(`data/projects/${projectId}`), data, {
    withCredentials: true,
  });
}

export function validateShotFrameSet(
  shotId: string,
  frameSet: string
): PromiseResponse<ValidationRecord> {
  return axios.post(
    zouAPIURL(`data/shots/${shotId}/validation`),
    { frame_set: frameSet },
    { withCredentials: true }
  );
}

export function unvalidateShotFrameSet(
  shotId: string,
  frameSet: string
): PromiseResponse<ValidationRecord> {
  return axios.delete(
    zouAPIURL(`data/shots/${shotId}/validation?frame_set=${frameSet}`),
    { withCredentials: true }
  );
}

export function changePersonSilexCoins(
  personId: string,
  newAmount: number
): PromiseResponse<Person> {
  return axios.put(
    zouAPIURL(`data/persons/${personId}`),
    { coins: newAmount },
    { withCredentials: true }
  );
}

export function addSilexCoinsTo(
  personId: string,
  amount: number
): PromiseResponse<Person> {
  return axios
    .get<Person>(zouAPIURL(`data/persons/${personId}`), {
      withCredentials: true,
    })
    .then((response) =>
      changePersonSilexCoins(personId, (response.data.coins || 0) + amount)
    );
}

export function unlockGameVariant(
  gameVariantId: string
): PromiseResponse<GameVariant> {
  return axios.post(
    zouAPIURL(`data/game_variants/${gameVariantId}`),
    {},
    { withCredentials: true }
  );
}

export function saveScore(gameId: string, score: number): Promise<void> {
  return axios.post(
    zouAPIURL(`/data/games/${gameId}/game_scores`),
    { points: score },
    { withCredentials: true }
  );
}
