"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { register as registerVisitor } from "@/requests/auth.request";
import { registerVisitorSchema } from "@/validators/auth.validator";
import type { ICreateVisitor } from "@/types/visitors.types";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


function calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    return strength;
}

function getPasswordStrengthText(strength: number): string {
    switch (strength) {
        case 0:
            return "Muito fraca";
        case 1:
            return "Fraca";
        case 2:
            return "Média";
        case 3:
            return "Forte";
        case 4:
            return "Muito forte";
        case 5:
            return "Excelente";
        default:
            return "";
    }
}

function getPasswordStrengthColor(strength: number): string {
    switch (strength) {
        case 0:
            return "bg-gray-300";
        case 1:
            return "bg-red-500";
        case 2:
            return "bg-orange-500";
        case 3:
            return "bg-yellow-500";
        case 4:
            return "bg-green-500";
        case 5:
            return "bg-emerald-600";
        default:
            return "bg-gray-300";
    }
}

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(registerVisitorSchema),
    });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const watchedPassword = watch("password");

    useEffect(() => {
        if (watchedPassword) {
            setPasswordStrength(calculatePasswordStrength(watchedPassword));
        } else {
            setPasswordStrength(0);
        }
    }, [watchedPassword]);

    const onSubmit = async (data: ICreateVisitor) => {
        const { confirmPassword, ...rest } = data;
        const onlyCpfNumbers = rest.cpf?.replace(/\D/g, '');

        const response = await registerVisitor({ ...rest, cpf: onlyCpfNumbers });
        if (response.status === 200) {
            toast.success("Conta criada com sucesso!");
            navigate("/login")
        } else {
            toast.error("Erro ao criar conta");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <Link to="/login" className="absolute left-4 top-4">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <Card className="w-full max-w-md shadow-xl rounded-2xl border-0 bg-white">
                <CardContent className="p-8">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-8 text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Criar Conta
                    </motion.h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Nome *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Digite seu nome"
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm">
                                    {typeof errors.name?.message === "string"
                                        ? errors.name.message
                                        : "Erro no nome"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                E-mail *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {typeof errors.email?.message === "string"
                                        ? errors.email.message
                                        : "Erro no e-mail"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                CPF *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="123.456.789-00"
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    {...register("cpf")}
                                />
                            </div>
                            {errors.cpf && (
                                <p className="text-red-500 text-sm">
                                    {typeof errors.cpf?.message === "string"
                                        ? errors.cpf.message
                                        : "Erro no CPF"}
                                </p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Senha *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {watchedPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                                                    passwordStrength
                                                )}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            />
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {getPasswordStrengthText(passwordStrength)}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {typeof errors.password?.message === "string"
                                        ? errors.password.message
                                        : "Erro na senha"}
                                </p>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirmar Senha *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="password"
                                        placeholder="Confirme sua senha"
                                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {typeof errors.confirmPassword?.message === "string"
                                            ? errors.confirmPassword.message
                                            : "Erro na confirmação de senha"}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"

                                disabled={isSubmitting}
                                className="w-full h-12 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 text-white mt-4"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Criar Conta"
                                )}
                            </Button>
                        </div>
                    </form>

                    {isSubmitSuccessful && (
                        <motion.div
                            className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Conta criada com sucesso!
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
