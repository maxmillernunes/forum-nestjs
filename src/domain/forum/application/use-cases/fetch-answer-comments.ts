import { right, type Either } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    return right({
      comments,
    })
  }
}
