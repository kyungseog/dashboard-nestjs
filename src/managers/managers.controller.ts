import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { Managers } from '../entities/managers.entity';
import { CreateManagerDto } from './dto/create-manager.dto';

@Controller('manager')
export class ManagersController {
  constructor(private managersService: ManagersService) {}

  @Get()
  getAllManager(): Promise<Managers[]> {
    return this.managersService.getAllManagers();
  }

  @Post()
  createManager(@Body() createManagerDto: CreateManagerDto): Promise<Managers> {
    return this.managersService.createManager(createManagerDto);
  }

  @Get('/:id')
  getManagerByid(@Param('id') id: string): Promise<Managers> {
    return this.managersService.getManagerById(id);
  }

  @Patch('/:id/introduction')
  updateManagerById(
    @Param('id') id: string,
    @Body('introduction') introduction: string,
  ): Promise<Managers> {
    return this.managersService.updateManagerById(id, introduction);
  }
}
