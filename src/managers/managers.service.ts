import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateManagerDto } from './dto/create-user.dto';
import { Managers } from '../entities/managers.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Managers)
    private userRepository: Repository<Managers>,
  ) {}

  getAllUsers(): Promise<Managers[]> {
    return this.userRepository.find();
  }

  async createUser(createManagerDto: CreateManagerDto) {
    const { id, password, partname, position, name, introduction } =
      createManagerDto;
    const user = this.userRepository.create({
      id,
      password,
      partname,
      position,
      name,
      introduction,
    });
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<Managers> {
    const found = await this.userRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`can't find User with id ${id}`);
    }
    return found;
  }

  async updateUserById(id: string, introduction: string): Promise<Managers> {
    const member = await this.getUserById(id);
    member.introduction = introduction;
    return member;
  }
}
