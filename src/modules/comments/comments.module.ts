import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { RequestContextService } from '../common/services/request-context/request-context.service'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, RequestContextService],
})
export class CommentsModule {}
