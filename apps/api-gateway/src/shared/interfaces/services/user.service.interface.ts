import { User } from '../../entities/User.entity';

export interface UserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, updateUser: User): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
