import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateManagerDto } from './dto/create-manager.dto';
import { Managers } from '../entities/managers.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Managers)
    private managerRepository: Repository<Managers>,
  ) {}

  getAllManagers(): Promise<Managers[]> {
    return this.managerRepository.find();
  }

  async createManager(createManagerDto: CreateManagerDto) {
    const { id, password, partname, position, name, introduction } =
      createManagerDto;
    const manager = this.managerRepository.create({
      id,
      password,
      partname,
      position,
      name,
      introduction,
    });
    await this.managerRepository.save(manager);
    return manager;
  }

  async getManagerById(id: string): Promise<Managers> {
    const found = await this.managerRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`can't find Manager with id ${id}`);
    }
    return found;
  }

  async updateManagerById(id: string, introduction: string): Promise<Managers> {
    const member = await this.getManagerById(id);
    member.introduction = introduction;
    return member;
  }
}
