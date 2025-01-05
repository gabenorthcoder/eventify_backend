import { UserLoginInput } from "../../domain/loginUser";
import { AuthService } from "../../infrastructure/authService";
import { UserLoginSuccess } from "../../infrastructure/authService";

export class LoginUserUseCase {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async execute(userData: UserLoginInput): Promise<Partial<UserLoginSuccess>> {
    const loginSuccess = await this.authService.login(
      userData.email,
      userData.password,
      userData.role
    );
    return loginSuccess;
  }
}
