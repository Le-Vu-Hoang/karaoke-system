import {useMutation} from '@tanstack/react-query';
import {userRepository} from "@/infrastructure/repositories/user.repository";
import {UserDto} from "@/infrastructure/dtos/auth.dto";

export const useUpdateProfileMutation = () => {
    return useMutation({
        mutationFn: (data: Partial<Omit<UserDto, 'id' | 'role'>>) => userRepository.updateProfile(data),
    });
};
