import {useMutation} from '@tanstack/react-query';
import {useAuthStore} from '@/shared/stores/use-auth-store';
import {useRouter} from 'next/navigation';
import {LoginCredentialsDto} from "@/infrastructure/dtos/auth.dto";
import {authRepository} from "@/infrastructure/repositories/auth.repository";
import {toast} from "@/presentation/shared_ui/sonner";

export const useLoginMutation = () => {
        const router = useRouter();
        const login = useAuthStore((state) => state.login);

        return useMutation({
            mutationFn: (credentials: LoginCredentialsDto) => authRepository.login(credentials),
            onSuccess: (response) => {
                const {data} = response.data;
                login(data);
                router.push('/');
                toast.success(`Chào mừng quay trở lại, ${data.fullName}!`);
            },
            onError: (error: Error) => {
                const errorMessage = error.message || "Tên tài khoản hoặc mật khẩu không chính xác.";
                toast.error(`Đăng nhập thất bại: ${errorMessage}`);
            }
        });
    };
