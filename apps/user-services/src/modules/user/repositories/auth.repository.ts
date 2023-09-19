import { Not, Repository } from 'typeorm';
import { User } from '../../../shared/entities/User.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({
        email: email,
        password: password,
      });
      const roleList = user.roles.map((role) => {
        return role.name;
      });
      const userFilterd = {
        email: user.email,
        role: roleList,
        name: user.name,
        id: user.id,
      };
      return userFilterd;
    } catch (error) {
      throw new NotFoundException("Couldn't find user with this credential");
    }
  }

  // Add other methods for interacting with the User entity
}
