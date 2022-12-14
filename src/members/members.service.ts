import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './member.model';

@Injectable()
export class MembersService {
  private members: Member[] = [];

  getAllMembers(): Member[] {
    return this.members;
  }

  createMember(createMemberDto: CreateMemberDto) {
    const { id, partname, position, name, introduction } = createMemberDto;
    const member: Member = {
      id,
      partname,
      position,
      name,
      introduction,
    };
    this.members.push(member);
    return this.members;
  }

  getMemberById(id: string): Member {
    return this.members.find((member) => member.id === id);
  }

  updateMemberById(id: string, introduction: string): Member {
    const member = this.getMemberById(id);
    member.introduction = introduction;
    return member;
  }
}
