import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import logger from "../../utils/logger";

export class AdminDeleteUsersUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async execute(userId: number, loggedUser: User): Promise<void> {

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      logger.warn(`User Deletion: User with id ${userId} not found`);
      throw new Error("User not found");
    }
    if (loggedUser.role === UserRole.STAFF && user.role !== UserRole.USER) {
      throw new Error(
        "Staff role is not allowed to delete Admin or Staff members"
      );
    }
    if (loggedUser.role === UserRole.ADMIN && user.role === UserRole.ADMIN) {
      throw new Error("Admin role is not allowed to delete another admin");
    }

    await this.userRepository.deleteUser(userId);
  }
}
