import { Injectable } from '@nestjs/common'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentsMapper } from '../mappers/prisma-question-comment-mapper'
import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentsWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { DomainEvents } from '@/core/events/domain-events'

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
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map((comment) =>
      PrismaQuestionCommentsMapper.toDomain(comment),
    )
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map((comment) =>
      PrismaCommentsWithAuthorMapper.toDomain(comment),
    )
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toPrisma(questionComment)

    await this.prisma.comment.create({ data })

    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toPrisma(questionComment)

    await this.prisma.comment.delete({ where: { id: data.id } })
  }
}
