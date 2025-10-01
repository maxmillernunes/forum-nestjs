import { right, type Either } from '@/core/either'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { Answer } from '../../enterprise/entities/answer'

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

export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsAnswersRequest): Promise<FetchQuestionsAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({
      answers,
    })
  }
}
