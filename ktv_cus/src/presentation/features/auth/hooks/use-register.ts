import {authRepository} from "@/infrastructure/repositories/auth.repository";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {RegisterCredentialsDto} from "@/infrastructure/dtos/auth.dto";
import {toast} from "@/presentation/shared_ui/sonner";

export const useRegisterMutation = () => {
    const router = useRouter();
    const register = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: (credentials: RegisterCredentialsDto) => authRepository.register(credentials),
        onSuccess: (response) => {
            const {data} = response.data;
            register(data);
            router.push("/");
            toast.success(`Đăng ký thành công! Chào mừng ${data.fullName} đến với hệ thống!`);
        },
        onError: (error: any) => {
            const errorMessage = error.message || "Đăng ký thất bại";
            toast.error(errorMessage);
        }
    });
}