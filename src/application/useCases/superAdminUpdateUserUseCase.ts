import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import _ from "lodash";
import logger from "../../utils/logger";
import bcrypt from "bcryptjs";

export class SuperAdminUpdateUserUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async execute(
    userId: number,
    data: Partial<User>,
    superAdmin: User
  ): Promise<User> {

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      logger.warn(`User Update: User with id ${userId} not found`);
      throw new Error("User not found");
    }
    if (data.role) {
      const usersByEmail = await this.userRepository.findUsersByEmail(
        user.email
      );
      if (usersByEmail.length > 1) {
        if (usersByEmail.some((user) => user.role === data.role)) {
          throw new Error(`User already exists as ${UserRole[data.role]}`);
        }
      }
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
    data.updatedBy = superAdmin;

    _.merge(user, data);

    return await this.userRepository.updateUser(user);
  }
}
