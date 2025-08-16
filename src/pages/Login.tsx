import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "../index.css";
import { useForm } from "react-hook-form";
import type { ILoginAdmin, ILoginGeneric, ILoginVisitor } from "../types/auth.types";
import { login } from "../requests/auth.request";
import { loginSchema } from "../validators/auth.validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Eye, EyeOff, User, Lock, Building2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { UserType } from "../types/userType.enum";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../stores/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const { login: loginAction } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>(UserType.VISITOR);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: ILoginGeneric) => {
    setIsLoading(true);

    const loadingToast = toast.loading('Verificando credenciais...', {
      description: 'Aguarde um momento...'
    });

    try {
      const loginData: ILoginAdmin | ILoginVisitor = {
        email: data.username,
        password: data.password,
      }
      const response = await login(loginData, userType);

      if (response.status !== 200) {
        throw new Error(response.message ?? 'Falha no login');
      }

      const { token, id, isAdmin } = response.data;
      console.log(token, id, isAdmin);

      if (token) {
        loginAction(token, id, isAdmin);
        toast.dismiss(loadingToast);
        toast.success('Login realizado com sucesso!', {
          description: `Bem-vindo, ${isAdmin ? 'admin' : 'visitante'}!`,
          duration: 4000,
        });
        navigate('/dashboard');
      } else {
        toast.dismiss(loadingToast);
        toast.error('Falha no login', {
          description: 'Credenciais inválidas',
          duration: 4000,
        });
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Falha no login', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        duration: 5000,
        action: {
          label: 'Tentar novamente',
          onClick: () => {
            toast.info('Preencha os campos e tente novamente');
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleRegister = () => {
    navigate('/register');
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao J.A.R.V.I.S.</h1>
          <p className="text-gray-600">Faça login para acessar sua conta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => handleUserTypeChange(UserType.VISITOR)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${userType === UserType.VISITOR
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <UserCheck className="w-4 h-4" />
              Visitante
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange(UserType.ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${userType === UserType.ADMIN
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Building2 className="w-4 h-4" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {userType === 'admin' ? 'Email' : 'CPF'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={userType === 'admin' ? 'email' : 'text'}
                  placeholder={userType === 'admin' ? 'seu@email.com' : '000.000.000-00'}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  autoComplete={userType === 'admin' ? 'email' : 'off'}
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Link para registro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto"
                onClick={handleRegister}
              >
                Registre-se
              </Button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 Victor Longchamps. Todos os direitos reservados.
          </p>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;

