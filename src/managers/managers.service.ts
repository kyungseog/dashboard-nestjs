import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateManagerDto } from './dto/create-user.dto';
import { Manager } from './manager.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private userRepository: Repository<Manager>,
  ) {}

  getAllUsers(): Promise<Manager[]> {
    return this.userRepository.find();
  }

  async createUser(createManagerDto: CreateManagerDto) {
    const { id, partname, position, name, introduction } = createManagerDto;
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

  async getUserById(id: string): Promise<Manager> {
    const found = await this.userRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`can't find User with id ${id}`);
    }
    return found;
  }

  async updateUserById(id: string, introduction: string): Promise<Manager> {
    const member = await this.getUserById(id);
    member.introduction = introduction;
    return member;
  }
}
