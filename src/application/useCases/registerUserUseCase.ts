import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";
import { UserRegistrationInput } from "../../domain/registerUser";

export class RegisterUserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData: UserRegistrationInput): Promise<Partial<User>> {
    if (userData.role === UserRole.ADMIN || userData.role === UserRole.STAFF) {
      throw new Error("Admin and staff roles are not allowed to register");
    }
    const existingUser = await this.userRepository.userExists(
      userData.email,
      userData.role
    );
    if (existingUser) {
      throw new Error(`User with ${userData.email} already exists`);
    }


    const newUser = await this.buildUser(userData);
    const createdUser = await this.userRepository.createUser(newUser);

    return createdUser;
  }

  private async buildUser(userData: UserRegistrationInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User();
    newUser.email = userData.email;
    newUser.password = hashedPassword;
    newUser.firstName = userData.firstName;
    newUser.lastName = userData.lastName|| "";
    newUser.role = userData.role;
    return newUser;
  }
}
