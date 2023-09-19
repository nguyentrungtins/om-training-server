import { User } from '../../entities/User.entity';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, updateUser: User): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
