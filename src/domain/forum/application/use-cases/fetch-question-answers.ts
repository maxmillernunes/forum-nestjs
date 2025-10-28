import { right, type Either } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import type { Answer } from '../../enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

interface FetchQuestionsAnswersRequest {
  questionId: string
  page: number
}

type FetchQuestionsAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsAnswersRequest): Promise<FetchQuestionsAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    )

    return right({
      answers,
    })
  }
}
