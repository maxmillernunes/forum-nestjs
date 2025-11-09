import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          author: expect.objectContaining({
            name: 'John Doe',
          }),
        }),
        expect.objectContaining({
          commentId: comment2.id,
          author: expect.objectContaining({
            name: 'John Doe',
          }),
        }),
        expect.objectContaining({
          commentId: comment3.id,
          author: expect.objectContaining({
            name: 'John Doe',
          }),
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-id-paginated'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-id-paginated',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
