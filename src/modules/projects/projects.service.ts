import { Injectable } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { RequestContextService } from '../common/services/request-context/request-context.service'
import { ProjectRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  findAll() {
    const userId = this.requestContext.getUserId()

    return this.prisma.project.findMany({
      where: {
        createdById: userId,
      },
    })
  }

  findById(id: string) {
    const userId = this.requestContext.getUserId()

    return this.prisma.project.findFirst({
      where: {
        id,
        createdById: userId,
      },
      // Especificar os campos que vão ser retornados
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        // Quando abrimos um objeto para um modelo de relacionamento o prisma nos oferece
        // as mesmas propriedades que temos em project
        tasks: {
          // Dentro do select especifico quais os campos do modelo de tasks que eu gostaria
          // de trazer
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
  }

  async create(data: ProjectRequestDTO) {
    const userId = this.requestContext.getUserId()

    const project = await this.prisma.project.create({
      data: {
        ...data,
        createdById: userId,
      },
    })

    // Adicionar o usuário como dono do projeto criado
    await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  update(id: string, data: ProjectRequestDTO) {
    const userId = this.requestContext.getUserId()

    return this.prisma.project.update({
      where: {
        id,
        createdById: userId,
      },
      data,
    })
  }

  async remove(id: string) {
    const userId = this.requestContext.getUserId()

    // Exclusão relacionamento 1-N -> primeiro excluímos os elementos filhos para depois excluirmos o elemento pai
    await this.prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    })

    return this.prisma.project.delete({
      where: {
        id,
        createdById: userId,
      },
    })
  }
}
