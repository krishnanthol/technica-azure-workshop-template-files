import axios from "axios";

const API_URL = "http://localhost:3000"; // TODO: change this to be actual backend URL once deployed

// example: define the interface for the payload
// export interface TaskPayload {
//   taskName: string;
//   steps: string[];
// }

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function getJSON<T>(url: string) {
  const { data } = await api.get<T>(url);
  return data;
}

export async function postJSON<TRes, TBody = unknown>(
  url: string,
  body?: TBody
) {
  const { data } = await api.post<TRes>(url, body);
  return data;
}

export async function delJSON<TRes = { id: string }>(url: string) {
  const { data } = await api.delete<TRes>(url);
  return data;
}

export async function putJSON<TRes, TBody = unknown>(
  url: string,
  body?: TBody
) {
  const { data } = await api.put<TRes>(url, body);
  return data;
}

// example of how you use the payload interface you defined
// export async function createTask(payload: TaskPayload): Promise<Task> {
//   return postJSON<Task, TaskPayload>("/api/tasks", payload);
// }
