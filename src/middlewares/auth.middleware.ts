import { useAuth } from "@/stores/auth.store";
import { UserType } from "@/types/userType.enum";

export const authMiddleware = (token: string) => {
    const { login } = useAuth.getState();
    login({
        token,
        id: '',
        name: '',
        type: UserType.ADMIN
    });
}

