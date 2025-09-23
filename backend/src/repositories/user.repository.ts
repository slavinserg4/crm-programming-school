import { IManagerCreate, IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }
    public createManager(dto: IManagerCreate): Promise<IUser> {
        return User.create(dto);
    }
    public getUserById(id: string): Promise<IUser> {
        return User.findById(id);
    }
}
export const userRepository = new UserRepository();
