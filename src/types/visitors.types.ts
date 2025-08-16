import type { IRoom } from "./rooms.types";

export interface IVisitor {
    id: string;
    name: string;
    email?: string;
    cpf?: string;
    birthDate?: Date;

    isAdmin: boolean;

    room?: IRoom;

    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateVisitor {
    name: string;
    email?: string;
    cpf?: string;
    password: string;
    confirmPassword: string;
}

export interface IUpdateVisitor {
    name?: string;
    email?: string;
    cpf?: string;
    birthDate?: Date;
}

export interface IVisitorStoreState {
    visitors: IVisitor[];
}

export interface IVisitorStoreActions {
    setVisitors: (visitors: IVisitor[]) => void;
    addVisitor: (visitor: IVisitor) => void;
    updateVisitor: (visitor: IVisitor) => void;
}

export type IVisitorStore = IVisitorStoreState & IVisitorStoreActions;