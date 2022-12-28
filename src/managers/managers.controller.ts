import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { Manager } from '../entities/managers.entity';
import { CreateManagerDto } from './dto/create-user.dto';

@Controller('manager')
export class ManagersController {
  constructor(private managersService: ManagersService) {}

  @Get()
  getAllUser(): Promise<Manager[]> {
    return this.managersService.getAllUsers();
  }

  @Post()
  createUser(@Body() createManagerDto: CreateManagerDto): Promise<Manager> {
    return this.managersService.createUser(createManagerDto);
  }

  @Get('/:id')
  getUserByid(@Param('id') id: string): Promise<Manager> {
    return this.managersService.getUserById(id);
  }

  @Patch('/:id/introduction')
  updateUserById(
    @Param('id') id: string,
    @Body('introduction') introduction: string,
  ): Promise<Manager> {
    return this.managersService.updateUserById(id, introduction);
  }
}
