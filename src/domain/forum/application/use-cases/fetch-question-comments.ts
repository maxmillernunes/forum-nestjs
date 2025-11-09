import { right, type Either } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchQuestionCommentsRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      )

    return right({
      comments,
    })
  }
}
