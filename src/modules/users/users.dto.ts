import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDTO {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'User email', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.ADMIN,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.ADMIN
}

export class UpdateUserDTO {
  @ApiProperty({ description: 'User name', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.ADMIN,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role
}

export class UserListItemDTO {
  @ApiProperty({ description: 'User id' })
  id: string

  @ApiProperty({ description: 'User name' })
  name: string

  @ApiProperty({ description: 'User email' })
  email: string

  @ApiProperty({ description: 'User avatar' })
  avatar: string

  @ApiProperty({ description: 'User role' })
  role: Role

  @ApiProperty({ description: 'User created at', format: 'date-time' })
  createdAt: string

  @ApiProperty({ description: 'User updated at', format: 'date-time' })
  updatedAt: string
}

class UserProjectDTO {
  @ApiProperty({ description: 'Project id' })
  id: string

  @ApiProperty({ description: 'Project name' })
  name: string

  @ApiProperty({
    description: 'Project description',
    nullable: true,
    required: false,
  })
  description: string
}

export class UserFullDTO extends UserListItemDTO {
  @ApiProperty({ description: 'User projects', type: [UserProjectDTO] })
  createdProjects: UserProjectDTO[]
}
