import * as yup from 'yup';

export const createVisitorSchema = yup.object({
    name: yup.string().required('Nome é obrigatório').min(2).max(100),
    email: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório'),
    birthDate: yup.date().optional(),
    password: yup.string().required('Senha é obrigatória').min(8),
    confirmPassword: yup.string().required('Confirmação de senha é obrigatória').oneOf([yup.ref('password')])
});
