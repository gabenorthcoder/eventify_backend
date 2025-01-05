import {
  AuthService,
  UserLoginSuccess,
} from "../../infrastructure/authService";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import {
  User,
  UserRole,
  UserAuthType,
} from "../../infrastructure/repository/entities/user";

interface GoogleProfile {
  email: string;
  firstName: string;
  lastName: string;
}

export class GoogleAuthUseCase {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor() {
    this.userRepository = new UserRepository();
    this.authService = new AuthService();
  }

  async authenticateUser(
    profile: GoogleProfile
  ): Promise<Partial<UserLoginSuccess>> {
    const { email, firstName, lastName } = profile;


    let user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      const googleUser = new User();
      googleUser.email = email;
      googleUser.firstName = firstName;
      googleUser.lastName = lastName
      googleUser.role = UserRole.USER;
      googleUser.authType = UserAuthType.GOOGLE;


      user = (await this.userRepository.createUser(googleUser)) as User;
    }


    return await this.authService.generateTokenForUser(user);
  }
}
