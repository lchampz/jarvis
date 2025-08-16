import * as yup from "yup";

export const loginSchema = yup.object().shape({
    username: yup.string().required("Usuário é obrigatório"),
    password: yup.string().min(8, "Senha deve ter no mínimo 8 caracteres").required("Senha é obrigatória"),
});

export const registerVisitorSchema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    cpf: yup.string().required("CPF é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    birthDate: yup.date().nullable().optional(),
    password: yup.string().min(8, "Senha deve ter no mínimo 8 caracteres").required("Senha é obrigatória"),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "As senhas não coincidem").required("Confirmação de senha é obrigatória"),
});