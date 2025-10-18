import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async getByEmail(email: string): Promise<IUser> {
        return await userRepository.getByEmail(email);
    }

    public async getById(id: string): Promise<IUser> {
        return await userRepository.getUserById(id);
    }
    public async isEmailUnique(email: string) {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                "Manager with this email already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        }
    }
}
export const userService = new UserService();
