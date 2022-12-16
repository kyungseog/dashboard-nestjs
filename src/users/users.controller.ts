import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUser(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  getUserByid(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id/introduction')
  updateUserById(
    @Param('id') id: string,
    @Body('introduction') introduction: string,
  ): Promise<User> {
    return this.usersService.updateUserById(id, introduction);
  }
}
