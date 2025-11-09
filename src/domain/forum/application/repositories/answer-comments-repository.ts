import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>

  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
