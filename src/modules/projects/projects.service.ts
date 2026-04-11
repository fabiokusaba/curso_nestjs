import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany()
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: {
        id,
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

  create(data: ProjectRequestDTO) {
    return this.prisma.project.create({
      data,
    })
  }

  update(id: string, data: ProjectRequestDTO) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    })
  }

  async remove(id: string) {
    // Exclusão relacionamento 1-N -> primeiro excluímos os elementos filhos para depois excluirmos o elemento pai
    await this.prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    })

    return this.prisma.project.delete({
      where: {
        id,
      },
    })
  }
}
