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

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaQuestionAttachmentsMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return attachments.map((attachment) =>
      PrismaQuestionAttachmentsMapper.toDomain(attachment),
    )
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.comment.deleteMany({ where: { questionId } })
  }
}
