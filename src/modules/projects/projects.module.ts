import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { RequestContextService } from '../common/services/request-context/request-context.service'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, RequestContextService],
})
export class ProjectsModule {}
