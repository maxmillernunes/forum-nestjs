import { Injectable } from '@nestjs/common'
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentsMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    })

    return answerAttachments.map((answerAttachment) =>
      PrismaAnswerAttachmentsMapper.toDomain(answerAttachment)
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { answerId } })
  }
}
