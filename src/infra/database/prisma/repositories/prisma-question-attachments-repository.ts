import { Injectable } from '@nestjs/common'
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentsMapper } from '../mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return attachments.map((attachment) =>
      PrismaQuestionAttachmentsMapper.toDomain(attachment)
    )
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.comment.deleteMany({ where: { questionId } })
  }
}
