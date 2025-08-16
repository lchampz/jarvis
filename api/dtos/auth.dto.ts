import type { Context } from "elysia";

export interface IRegisterAdminDTO {
    email: string;
    password: string;

    name: string;
}

export interface IRegisterVisitorDTO {
    name: string;
    cpf: string;
    password: string;
    email?: string;
}

export interface ILogin {
    email?: string;
    cpf?: string;
    password: string;
}

export interface IRegisterBody {
    body: string;
    set: Context["set"];
}