import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase

describe('Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    )
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'New comment on answer',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      answerComment: expect.objectContaining({
        content: 'New comment on answer',
      }),
    })
  })
})
