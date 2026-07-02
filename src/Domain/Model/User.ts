import { UserRole } from '../Model/Enum/UserRole';

export class User {
  constructor(
    public userId: number,
    public userRole: UserRole,
  ) {}
}
