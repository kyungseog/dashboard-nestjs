import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { Managers } from '../entities/managers.entity';
import { CreateManagerDto } from './dto/create-user.dto';

@Controller('manager')
export class ManagersController {
  constructor(private managersService: ManagersService) {}

  @Get()
  getAllUser(): Promise<Managers[]> {
    return this.managersService.getAllUsers();
  }

  @Post()
  createUser(@Body() createManagerDto: CreateManagerDto): Promise<Managers> {
    return this.managersService.createUser(createManagerDto);
  }

  @Get('/:id')
  getUserByid(@Param('id') id: string): Promise<Managers> {
    return this.managersService.getUserById(id);
  }

  @Patch('/:id/introduction')
  updateUserById(
    @Param('id') id: string,
    @Body('introduction') introduction: string,
  ): Promise<Managers> {
    return this.managersService.updateUserById(id, introduction);
  }
}
