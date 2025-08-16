import { api as apiInstance } from "@/lib/api";
import type { ICreateVisitor } from "@/types/visitors.types";
import type { ILoginAdmin, ILoginVisitor } from "@/types/auth.types";
import { UserType } from "@/types/userType.enum";
import type { IResponse } from "@/types/api.types";

const api = apiInstance();

interface ILoginResponse {
    token: string;
    id: string;
    isAdmin: boolean;

    status: number;
    message?: string;
}

export const register = async (body: Omit<ICreateVisitor, "confirmPassword">) => {
    const response = await api.post("/auth/register/visitor", body);
    return response;
}

export const login = async (body: ILoginVisitor | ILoginAdmin, userType: UserType): Promise<IResponse<ILoginResponse>> => {
    const response = await api.post<ILoginResponse>(userType === UserType.ADMIN ? "/auth/login/admin" : "/auth/login/visitor", body);
    console.log(response);
    return response;
}