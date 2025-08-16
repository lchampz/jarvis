import type { ILogin, IRegisterAdminDTO, IRegisterBody, IRegisterVisitorDTO } from "api/dtos/auth.dto";
import { createAdmin, login } from "api/repositories/auth.repository";
import { createVisitor } from "api/repositories/visitors.repository";
import { Elysia } from "elysia";

export const authRoute = new Elysia()
    .post("/auth/register/admin", async ({ body, set }: IRegisterBody) => {
        const admin = JSON.parse(body) as IRegisterAdminDTO;
        return await createAdmin({
            email: admin.email,
            password: admin.password,
            name: admin.name
        });
    })

    .post("/auth/register/visitor", async ({ body, set }: IRegisterBody) => {
        const visitor = JSON.parse(body) as IRegisterVisitorDTO;
        if (!visitor.email) {
            set.status = 400;
            return ({ message: "O campo 'email' é obrigatório.", status: 400 });
        }
        const response = await createVisitor({
            ...visitor,
            email: visitor.email
        });
        if (response) {
            set.status = 200;
            return ({ message: "Visitor created successfully", status: 200 });
        } else {
            set.status = 400;
            return ({ message: "Error creating visitor", status: 400 });
        }
    })
    .post("/auth/login/visitor", async ({ body, set }) => {
        try {
            const loginBody = JSON.parse(body) as ILogin;
            const data = await login(loginBody.email!, loginBody.password);
            set.status = 200;
            return ({ message: "Login successful", data, status: 200 });
        } catch (error) {
            set.status = 401;
            return ({ message: "Invalid credentials", status: 401 });
        }
    })
    .post("/auth/login/admin", async ({ body, set }) => {
        try {
            const loginBody = JSON.parse(body) as ILogin;
            const data = await login(loginBody.email!, loginBody.password);
            set.status = 200;
            return ({ message: "Login successful", data, status: 200 });
        } catch (error) {
            set.status = 401;
            return ({ message: "Invalid credentials", status: 401 });
        }
    })

