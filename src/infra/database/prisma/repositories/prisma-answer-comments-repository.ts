import { Injectable } from '@nestjs/common'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentsMapper } from '../mappers/prisma-answer-comment-mapper'
import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentsWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      return null
    }

    return PrismaAnswerCommentsMapper.toDomain(comment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map((comment) =>
      PrismaAnswerCommentsMapper.toDomain(comment),
    )
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
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

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentsMapper.toPrisma(answerComment)

    await this.prisma.comment.create({ data })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentsMapper.toPrisma(answerComment)

    await this.prisma.comment.delete({ where: { id: data.id } })
  }
}
