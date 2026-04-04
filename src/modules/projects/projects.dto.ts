import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ProjectRequestDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  description: string
}

export class ProjectListItemDTO {
  @ApiProperty({ description: 'Project ID' })
  id: string

  @ApiProperty({ description: 'Project name' })
  name: string

  @ApiProperty({ description: 'Project description' })
  description: string

  @ApiProperty({ description: 'Project created at', format: 'date-time' })
  createdAt: string

  @ApiProperty({ description: 'Project updated at', format: 'date-time' })
  updatedAt: string
}
