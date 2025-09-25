import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async getByEmail(email: string): Promise<IUser> {
        return await userRepository.getByEmail(email);
    }
    public async getById(id: string): Promise<IUser> {
        return await userRepository.getUserById(id);
    }
}
export const userService = new UserService();
