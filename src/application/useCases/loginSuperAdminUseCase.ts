import { SuperAdminLoginInput } from "../../domain/loginSuperAdmin";
import { AuthService } from "../../infrastructure/authService";
import { SuperAdminLoginSuccess } from "../../infrastructure/authService";

export class SuperLoginAdminUseCase {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async execute(
    userData: SuperAdminLoginInput
  ): Promise<SuperAdminLoginSuccess> {
    const loginSuccess = await this.authService.superAdminLogin(
      userData.email,
      userData.password
    );
    return loginSuccess;
  }
}
