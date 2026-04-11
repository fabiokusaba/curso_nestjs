import { ApiProperty } from '@nestjs/swagger'
import { TaskPriority, TaskStatus } from '@prisma/client'
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

export class ProjectTaskDTO {
  @ApiProperty({ description: 'Task ID' })
  id: string

  @ApiProperty({ description: 'Task title' })
  title: string

  @ApiProperty({ description: 'Task description', nullable: true, required: false })
  description?: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: string

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: string

  @ApiProperty({
    description: 'Task due date',
    nullable: true,
    required: false,
    format: 'date-time',
  })
  dueDate?: string

  @ApiProperty({ description: 'Task created at', format: 'date-time' })
  createdAt: string

  @ApiProperty({ description: 'Task updated at', format: 'date-time' })
  updatedAt: string
}

// Aplicando o conceito de herança para que essa nossa classe possa herdar todos os atributos e métodos
// da classe ProjectListItemDTO
export class ProjectFullDTO extends ProjectListItemDTO {
  @ApiProperty({ description: 'Project tasks', type: [ProjectTaskDTO] })
  tasks: ProjectTaskDTO[]
}
