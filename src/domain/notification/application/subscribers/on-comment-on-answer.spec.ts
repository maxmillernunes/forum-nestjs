import type { MockInstance } from 'vitest'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '../use-case/send-notification'
import { OnCommentOnAnswer } from './on-comment-on-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    data: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    // Comment Answer Repository
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )

    // Questions Repository
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    // Notification repository and Send Notification UseCase
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    // Spy when the method execute is called
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // My Subscriber need initialized
    new OnCommentOnAnswer(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should  send a notification when an comment on answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const answerComment = makeAnswerComment({
      answerId: answer.id,
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
