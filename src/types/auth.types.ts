import type { UserType } from "./userType.enum";

interface ILogin {
    password: string;
}

export interface ILoginVisitor extends ILogin {
    cpf: string;
}

export interface ILoginAdmin extends ILogin {
    email: string;
}

export interface ILoginGeneric extends ILogin {
    username: string;
}

export interface IUser {
    token: string | undefined;
    id: string;
    name: string;
    email?: string;
    cpf?: string;
    type: UserType;
}

export interface IAuthStoreState {
    token: string | undefined;
    isAuthenticated: boolean;
    id: string | undefined;
    isAdmin: boolean;
}

export interface IAuthStoreActions {
    login: (token: string, id: string, isAdmin: boolean) => void;
    logout: () => void;
}

export type IAuthStore = IAuthStoreState & IAuthStoreActions;