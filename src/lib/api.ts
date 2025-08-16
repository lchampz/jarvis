import type { IResponse } from "src/types/api.types";

const BASE_URL = 'http://localhost:3001';

export const api = (token?: string) => {
    return {
        get: async <T>(url: string, toJson: boolean = true): Promise<IResponse<T>> => {
            const response = await fetch(`${BASE_URL}${url}`, {
                headers: token ? {
                    "Authorization": `${token}`
                } : {},
            });
            return toJson ? await response.json() as Promise<IResponse<T>> : response as unknown as Promise<IResponse<T>>;
        },
        post: async <T>(url: string, body: Object): Promise<IResponse<T>> => {
            const response = await fetch(`${BASE_URL}${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: token ? {
                    "Authorization": ` ${token}`
                } : {},
            });
            return await response.json() as Promise<IResponse<T>>;
        },
        put: async <T>(url: string, body: Object): Promise<IResponse<T>> => {
            const response = await fetch(`${BASE_URL}${url}`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: token ? {
                    "Authorization": `${token}`
                } : {},
            });
            return await response.json() as Promise<IResponse<T>>;
        },
        delete: async <T>(url: string): Promise<IResponse<T>> => {
            const response = await fetch(`${BASE_URL}${url}`, {
                method: "DELETE",
                headers: token ? {
                    "Authorization": `${token}`
                } : {},
            });
            return await response.json() as Promise<IResponse<T>>;
        }
    }
}
