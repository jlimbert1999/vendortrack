import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './dtos';
import { PaginationParamsDto } from '../common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(@Query() params: PaginationParamsDto) {
    return this.userService.findAll(params);
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.userService.update(id, userDto);
  }
}
