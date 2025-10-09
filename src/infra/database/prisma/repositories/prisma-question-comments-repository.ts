import { Injectable } from '@nestjs/common'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentsMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      return null
    }

    return PrismaQuestionCommentsMapper.toDomain(comment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map((comment) =>
      PrismaQuestionCommentsMapper.toDomain(comment)
    )
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toPrisma(questionComment)

    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toPrisma(questionComment)

    await this.prisma.comment.delete({ where: { id: data.id } })
  }
}
