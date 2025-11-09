import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able a edit answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-id') },
      new UniqueEntityId('answer-id'),
    )

    await inMemoryAnswersRepository.create(newAnswer)
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-id',
      answerId: 'answer-id',
      content: 'new content',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content',
    })
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ],
    )
  })

  it('should sync new and removed attachment when editing a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-id') },
      new UniqueEntityId('answer-id'),
    )

    await inMemoryAnswersRepository.create(newAnswer)
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-id',
      answerId: 'answer-id',
      content: 'new content',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ]),
    )
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-id') },
      new UniqueEntityId('answer-id'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-id-1',
      answerId: 'answer-id',
      content: 'new content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
