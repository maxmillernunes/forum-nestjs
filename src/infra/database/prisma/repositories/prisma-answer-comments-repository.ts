import { Injectable } from '@nestjs/common'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  async findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }

  async create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
