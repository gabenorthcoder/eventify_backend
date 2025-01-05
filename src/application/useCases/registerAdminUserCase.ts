import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";
import { UserRegistrationInput } from "../../domain/registerUser";

export class RegisterAdminUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(
    userData: UserRegistrationInput,
    user: User
  ): Promise<Partial<User>> {
    if (user.role === UserRole.STAFF && userData.role !== UserRole.USER) {
      throw new Error(
        "Staff role is not allowed to register Admin or Staff members"
      );
    }
    if (userData.role === UserRole.ADMIN && userData.role === UserRole.ADMIN) {
      throw new Error("Admin role is not allowed to register another admin");
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
    newUser.lastName = userData.lastName || "";
    newUser.role = userData.role;
    return newUser;
  }
}
