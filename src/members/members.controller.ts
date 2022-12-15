import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  getAllMember(): Promise<Member[]> {
    return this.membersService.getAllMembers();
  }

  @Post()
  createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.createMember(createMemberDto);
  }

  @Get('/:id')
  getMemberByid(@Param('id') id: string): Promise<Member> {
    return this.membersService.getMemberById(id);
  }

  @Patch('/:id/introduction')
  updateMemberById(
    @Param('id') id: string,
    @Body('introduction') introduction: string,
  ): Promise<Member> {
    return this.membersService.updateMemberById(id, introduction);
  }
}
