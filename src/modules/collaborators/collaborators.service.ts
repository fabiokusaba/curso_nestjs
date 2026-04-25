import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { AddCollaboratorDTO, UpdateCollaboratorDTO } from './collaborators.dto'

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByProject(projectId: string) {
    return this.prisma.projectCollaborator.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async create(projectId: string, data: AddCollaboratorDTO) {
    // Validar se o usuário que estou passando dentro do objeto 'data' é válido e se é um usuário existente
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    })

    if (!user) {
      throw new NotFoundException('User specified not found')
    }

    return this.prisma.projectCollaborator.create({
      data: {
        userId: data.userId,
        role: data.role,
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async update(projectId: string, userId: string, data: UpdateCollaboratorDTO) {
    // Identificar que esse usuário já é colaborador do projeto
    // Um detalhe importante, por se tratar de um relacionamento muitos para muitos (N-N) a cláusula where vai ser
    // especificada de forma diferente através da chave composta
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    })

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found in this project')
    }

    return this.prisma.projectCollaborator.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        role: data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async remove(projectId: string, userId: string) {
    // Validando que o colaborador existe para aquele projeto
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    })

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found in this project')
    }

    // Validando que o projeto precisa ter pelo menos um colaborador (OWNER), não podemos excluir todos
    // os colaboradores e deixar o projeto sem ninguém
    if (collaborator.role === CollaboratorRole.OWNER) {
      throw new BadRequestException('The project owner can not be removed')
    }

    await this.prisma.projectCollaborator.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    })
  }
}
