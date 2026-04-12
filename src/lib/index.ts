import axios, { type AxiosInstance } from "axios";

export function createDefaultClient(): AxiosInstance {
    return axios.create({ timeout: 3000 });
}
