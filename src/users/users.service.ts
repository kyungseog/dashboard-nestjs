import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { id, partname, position, name, introduction } = createUserDto;
    const user = this.userRepository.create({
      id,
      partname,
      position,
      name,
      introduction,
    });
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const found = await this.userRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`can't find User with id ${id}`);
    }
    return found;
  }

  async updateUserById(id: string, introduction: string): Promise<User> {
    const member = await this.getUserById(id);
    member.introduction = introduction;
    return member;
  }
}
