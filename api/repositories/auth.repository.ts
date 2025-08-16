import type { Admin, Visitor } from "api/generated/prisma";
import prisma from "../database/prisma";
import type { IRegisterAdminDTO } from "api/dtos/auth.dto";

export const createAdmin = async (admin: IRegisterAdminDTO) => {
    return prisma.admin.create({
        data: {
            ...admin,
            password: await Bun.password.hash(admin.password)
        }
    });
}

export const login = async (username: string, password: string): Promise<{ token: string, id: string, isAdmin: boolean }> => {
    const admin = await prisma.admin.findUnique({
        where: { email: username }
    });

    const user = await prisma.visitor.findUnique({
        where: { cpf: username.replace(/\D/g, '') }
    });

    if (admin) {
        return { token: await Bun.password.hash(admin.password), id: admin.id, isAdmin: true };
    }

    if (user) {
        const isPasswordValid = await Bun.password.verify(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        return { token: await Bun.password.hash(user.password), id: user.id, isAdmin: false };
    }

    throw new Error("User not found");
}