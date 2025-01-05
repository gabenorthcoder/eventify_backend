import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import { ConnectionPoolClosedEvent } from "typeorm";

export class AdminListUsersUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async execute(loggedUser: User, role?: UserRole): Promise<User[]> {

    if (loggedUser.role === UserRole.STAFF && !role) {
      const allNormalUsers = await this.userRepository.findAllUsersByRole(
        UserRole.USER
      );
      return allNormalUsers;
    }

    if (role !== undefined && role !== null) {
      if (loggedUser.role === UserRole.STAFF && role === UserRole.STAFF) {
        throw new Error(
          "Staff role is not allowed to list other staff members"
        );
      }

      const allUsersByRole = await this.userRepository.findAllUsersByRole(role);
      return allUsersByRole;
    }
    const allUsers = await this.userRepository.findAllUsers();
    return allUsers;
  }
}
