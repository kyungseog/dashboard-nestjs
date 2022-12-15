import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  getAllMembers(): Promise<Member[]> {
    return this.memberRepository.find();
  }

  async createMember(createMemberDto: CreateMemberDto) {
    const { id, partname, position, name, introduction } = createMemberDto;
    const member = this.memberRepository.create({
      id,
      partname,
      position,
      name,
      introduction,
    });
    await this.memberRepository.save(member);
    return member;
  }

  async getMemberById(id: string): Promise<Member> {
    const found = await this.memberRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`can't find Member with id ${id}`);
    }
    return found;
  }

  async updateMemberById(id: string, introduction: string): Promise<Member> {
    const member = await this.getMemberById(id);
    member.introduction = introduction;
    return member;
  }
}
