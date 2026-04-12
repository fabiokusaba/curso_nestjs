import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CreateUserDTO, UpdateUserDTO, UserFullDTO, UserListItemDTO } from './users.dto'
import { UsersService } from './users.service'

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiResponse({ type: [UserListItemDTO] })
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @ApiResponse({ type: UserFullDTO })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data)
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserDTO) {
    return await this.userService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id)
  }
}
