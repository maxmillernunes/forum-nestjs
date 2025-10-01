import type { MockInstance } from 'vitest'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '../use-case/send-notification'
import { OnCommentOnQuestion } from './on-comment-on-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    data: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Comment On Question', () => {
  beforeEach(() => {
    // Comment Question Repository
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    // Questions Repository
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    // Notification repository and Send Notification UseCase
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    // Spy when the method execute is called
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // My Subscriber need initialized
    new OnCommentOnQuestion(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({
      questionId: question.id,
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
