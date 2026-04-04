import { Injectable } from '@nestjs/common'
import { ProjectRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  findAll() {}

  findById(id: string) {}

  create(data: ProjectRequestDTO) {}

  update(id: string, data: ProjectRequestDTO) {}

  remove(id: string) {}
}
