import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { ILogin } from "../interfaces/auth.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signIn(
        dto: ILogin,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        const user = await userService.getByEmail(dto.email);
        if (!user) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );

        if (!user.isActive) {
            throw new ApiError(
                "Account is not active",
                StatusCodesEnum.FORBIDDEN,
            );
        }
        if (user.isBanned) {
            throw new ApiError("Account is banned", StatusCodesEnum.FORBIDDEN);
        }

        if (!isValidPassword) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    }
}
export const authService = new AuthService();
