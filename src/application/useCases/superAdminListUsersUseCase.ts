import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";

export class SuperAdminListUsersUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async execute(role?: UserRole): Promise<User[]> {
    if (role) {
      const allUsersByRole = await this.userRepository.findAllUsersByRole(role);
      return allUsersByRole;
    }
    const allUsers = await this.userRepository.findAllUsers();
    return allUsers;
  }
}
