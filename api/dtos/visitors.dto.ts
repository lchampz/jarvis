export interface AddVisitorDTO {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export interface UpdateVisitorDTO {
    name?: string;
    cpf?: string;
    password?: string;
    email?: string;
}

export interface LoginVisitorDTO {
    cpf: string;
    password: string;
}